import NextAuth, {
  User,
  type NextAuthConfig,
} from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "@/lib/validation";
import { getUserFromDatabase } from "@/actions/auth";

const adapter = PrismaAdapter(prisma) as Adapter;

const authConfig: NextAuthConfig = {
  adapter,
  trustHost: true,
  pages: {
    signIn: "/signin",
    newUser: "/signup",
    signOut: "/",
  },
  providers: [
    Google({
      name: "google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        identifier: {},
        password: {},
      },
      async authorize(credentials) {
        const validated =
          SignInSchema.safeParse(credentials);

        if (validated.success) {
          const { identifier, password } = validated.data;

          const user = await getUserFromDatabase({
            identifier,
            password,
          });

          if (!user.success) {
            return null;
          }

          return user.data as User;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;

      return session;
    },
    async signIn({ user }) {
      if (user.email && !user.slug) {
        let slug = user.email.split("@")[0];

        const existedSlug = await prisma.user.findFirst({
          where: { slug },
        });

        if (existedSlug) {
          slug = `${slug}${Math.floor(Math.random() * 100)}`;
        }

        user.slug = slug;
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession =
          await adapter?.createSession?.({
            sessionToken: sessionToken,
            userId: params.token.sub,
            expires: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ), // 30 days
          });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  secret: process.env.AUTH_SECRET!,
};

export const { handlers, signIn, signOut, auth } =
  NextAuth(authConfig);
