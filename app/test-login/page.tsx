'use client'

import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (session) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to access the Customer Onboarding Portal
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Button 
                className="w-full max-w-sm flex items-center justify-center gap-2"
                size="lg"
                onClick={() => signIn("azure-ad-b2c", { callbackUrl: "/" })}
              >
                <LogIn className="w-5 h-5" />
                Sign in with Azure AD
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help? Contact{" "}
            <a 
              href="mailto:support@vcyberiz.com" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              support@vcyberiz.com
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}