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
      client: {
        token_endpoint_auth_method: "client_secret_post",
      }
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
}
