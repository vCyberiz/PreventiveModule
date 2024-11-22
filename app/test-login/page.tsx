'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const handleForgotPassword = () => {
    console.log({
      domain: process.env.NEXT_PUBLIC_AZURE_AD_B2C_AUTHORITY_DOMAIN,
      tenant: process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME,
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID,
      url: process.env.NEXT_PUBLIC_NEXTAUTH_URL
    });

    const resetPasswordUrl = 
      `https://vcyberizb2c.b2clogin.com/vcyberizb2c.onmicrosoft.com/oauth2/v2.0/authorize` +
      `?p=B2C_1_password_reset` +
      `&client_id=aba7d3d7-eaaa-4ed6-b1d5-f81e29967565` +
      `&nonce=${Math.random().toString(36)}` +
      `&redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/callback/azure-ad-b2c')}` +
      `&scope=openid` +
      `&response_type=id_token` +
      `&prompt=login`;

    window.location.href = resetPasswordUrl;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign in</CardTitle>
          <CardDescription className="text-center">
            Sign in with your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => signIn("azure-ad-b2c", { callbackUrl: "/" })}
            >
              Sign in with Azure AD B2C
            </Button>
            
            <div className="text-center">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}