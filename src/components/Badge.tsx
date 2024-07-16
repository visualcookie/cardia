import React from 'react'

interface BadgeProps extends React.PropsWithChildren {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  classNames?: string
}

const Badge: React.FC<BadgeProps> = ({
  color = 'primary',
  classNames = '',
  children,
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'secondary':
        return 'bg-gray-300 text-gray-700'
      case 'success':
        return 'bg-green-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'danger':
        return 'bg-red-500 text-white'
      default:
        return 'bg-blue-500 text-white'
    }
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getColorClass()} ${classNames}`}
    >
      {children}
    </span>
  )
}

export default Badge
