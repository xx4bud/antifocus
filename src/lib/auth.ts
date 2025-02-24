import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";
import { prisma } from "./prisma";
import { getUserInclude } from "./types";
import { UserRole, UserStatus } from "./constants";

const adapter = PrismaAdapter(prisma) as Adapter;

const authConfig: NextAuthConfig = {
  trustHost: true,
  adapter,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      try {
        if (!session || !user) {
          throw new Error("Invalid session or user data");
        }

        const userData = await prisma.user.findFirst({
          where: { id: user.id },
          include: getUserInclude(),
        });

        if (!userData) {
          throw new Error("User not found");
        }

        session.user = {
          ...session.user,
          id: user.id,
          slug: userData.slug as string,
          role: userData.role as UserRole,
          status: userData.status as UserStatus,
          media: userData.media,
          phone: userData.phone || undefined,
        };

        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return {
          ...session,
          error: "Failed to load user data",
        };
      }
    },
    async signIn({ user }) {
      if (user.email && !user.slug) {
        let userSlug = user.email.split("@")[0];

        const existedSlug = await prisma.user.findFirst({
          where: { slug: userSlug },
        });
        if (existedSlug) {
          userSlug = `${userSlug}${Math.floor(Math.random() * 100)}`;
        }
        user.slug = userSlug;
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.image) {
        const existingMedia = await prisma.media.findFirst({
          where: {
            userId: user.id,
          },
        });
        if (!existingMedia) {
          await prisma.media.create({
            data: {
              url: user.image,
              order: 0,
              user: { connect: { id: user.id } },
            },
          });
        }
      }
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
              Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
            ),
          });
        if (!createdSession) {
          throw new Error("Failed to create session");
        }
        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } =
  NextAuth(authConfig);
