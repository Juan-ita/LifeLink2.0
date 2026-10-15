
import { Link } from 'react-router-dom'
import { CheckCircle2, Heart } from 'lucide-react'
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function RegistrationSuccess() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-red-50 p-6">
      <Card className="w-full max-w-md border-red-100 shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-800">
            You're In! 
          </CardTitle>

          <CardDescription className="text-base">
            Welcome to the LifeLink community.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-sm leading-6 text-gray-600">
            Your donor account has been created successfully. Thank you for
            taking a step toward helping connect blood donors with hospitals
            and people who need blood.
          </p>

          <div className="rounded-lg bg-red-50 p-4">
            <Heart className="mx-auto mb-2 h-7 w-7 text-red-500" />
            <p className="text-sm font-medium text-red-700">
              Every donation can make a difference.
            </p>
          </div>

          <Button asChild className="w-full bg-red-600 hover:bg-red-700">
            <Link to="/login">
              Continue to Login 
            </Link>
          </Button>

          <p className="text-xs text-gray-500">
            LifeLink | Connecting donors. Supporting hospitals. Saving lives.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

export default RegistrationSuccess
