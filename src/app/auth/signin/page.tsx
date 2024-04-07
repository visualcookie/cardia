import Image from 'next/image'
import SignInForm from './signin-form'

const SignInPage = () => {
  return (
    <div className="w-full h-svh lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to your account.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://static.vecteezy.com/system/resources/previews/013/707/891/original/measuring-blood-pressure-and-healthcare-concept-human-hand-wearing-tonometer-examining-checking-blood-pressure-and-heartbeat-illustration-vector.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default SignInPage
