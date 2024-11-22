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
      authorization: { params: { scope: "offline_access openid" } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name,
          email: profile.emails ? profile.emails[0] : null,
          given_name: profile.given_name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
  session: {
    strategy: "jwt" as const,
  },
}
