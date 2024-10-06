'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'
import { CircleUserRound, UploadCloud } from 'lucide-react'
import { deleteUserAvatar, updateUserAvatar } from '@/actions/settings'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useToast } from './ui/use-toast'

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string
  onAvatarChange: (url: string | null | undefined) => void
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  userId,
  currentAvatarUrl,
  onAvatarChange,
}) => {
  const { toast } = useToast()

  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isCropping, setIsCropping] = useState<boolean>(false)
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleUpload = useCallback(
    async (croppedImage: Blob) => {
      setIsUploading(true)

      const formData = new FormData()
      const fileExtension = croppedImage.type.split('/')[1]
      formData.append('avatar', croppedImage, `avatar.${fileExtension}`)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()
        const newAvatarUrl = data.fileUrl

        const result = await updateUserAvatar(userId, newAvatarUrl)

        if (result.success) {
          onAvatarChange(newAvatarUrl)
          toast({
            title: 'Avatar uploaded',
            description: 'Your new avatar has been successfully uploaded.',
          })
        } else {
          throw new Error(result.error || 'Failed to update avatar in database')
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast({
          title: 'Upload failed',
          description:
            error instanceof Error
              ? error.message
              : 'There was an error uploading your avatar. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsUploading(false)
        setIsCropping(false)
      }
    },
    [onAvatarChange, toast, userId]
  )

  const getCroppedImg = useCallback(
    async (
      imageSrc: string,
      pixelCrop: { width: number; height: number; x: number; y: number }
    ) => {
      const image = new Image()
      image.src = imageSrc
      await new Promise((resolve) => {
        image.onload = resolve
      })

      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      const imageType = imageSrc.split(';')[0].split(':')[1]

      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            throw new Error('Could not create blob')
          }
        }, imageType)
      })
    },
    []
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = () => {
        setImageToCrop(reader.result as string)
        setIsCropping(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif'],
    },
    multiple: false,
  })

  const handleCropSave = useCallback(async () => {
    if (imageToCrop && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels)
      await handleUpload(croppedImage)
    }
  }, [imageToCrop, croppedAreaPixels, getCroppedImg, handleUpload])

  const handleRemove = useCallback(async () => {
    try {
      const result = await deleteUserAvatar(userId)
      if (result.success) {
        onAvatarChange(null)
        toast({
          title: 'Avatar removed',
          description: 'Your avatar has been successfully removed.',
        })
      } else {
        throw new Error(result.error || 'Failed to update avatar in database')
      }
    } catch (error) {
      console.error('Error removing avatar:', error)
      toast({
        title: 'Error removing avatar',
        description:
          error instanceof Error
            ? error.message
            : 'There was an error removing your avatar. Please try again.',
        variant: 'destructive',
      })
    }
  }, [onAvatarChange, toast, userId])

  return (
    <>
      <div className="flex items-center gap-6">
        <div
          {...getRootProps()}
          className={`relative cursor-pointer ${
            isDragActive ? 'ring-2 ring-primary' : ''
          }`}
        >
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentAvatarUrl} alt="User avatar" />
            <AvatarFallback>
              {isUploading ? (
                <UploadCloud className="h-12 w-12 animate-pulse" />
              ) : isDragActive ? (
                <UploadCloud className="h-12 w-12" />
              ) : (
                <CircleUserRound className="h-12 w-12" />
              )}
            </AvatarFallback>
          </Avatar>
          <input {...getInputProps()} />
          {isDragActive && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-full">
              <span className="text-sm text-primary-foreground">Drop here</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => getRootProps().ref.current.click()}
          >
            {isUploading
              ? 'Uploading...'
              : currentAvatarUrl
              ? 'Change avatar'
              : 'Upload avatar'}
          </Button>
          {currentAvatarUrl && (
            <Button type="button" variant="destructive" onClick={handleRemove}>
              Remove avatar
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[300px]">
            {imageToCrop && (
              <Cropper
                zoomWithScroll
                showGrid={false}
                cropShape="round"
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCropping(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropSave}>Set as avatar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AvatarUpload
