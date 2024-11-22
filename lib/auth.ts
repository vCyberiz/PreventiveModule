import { NextAuthOptions } from "next-auth"
import AzureADB2C from "next-auth/providers/azure-ad-b2c"

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADB2C({
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME!,
      primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW!,
      wellKnown: `https://${process.env.AZURE_AD_B2C_AUTHORITY_DOMAIN}/${process.env.AZURE_AD_B2C_TENANT_NAME}/${process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW}/v2.0/.well-known/openid-configuration`,
      authorization: { 
        params: { 
          scope: "offline_access openid profile",
          prompt: "login"
        } 
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.displayName || profile.given_name,
          email: profile.emails?.[0] || profile.email,
          given_name: profile.given_name,
          displayName: profile.displayName || profile.given_name
        }
      },
    }),
  ],
  pages: {
    signIn: '/test-login',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allow B2C password reset flow
      if (url.includes('B2C_1_password_reset')) {
        return url;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
}

