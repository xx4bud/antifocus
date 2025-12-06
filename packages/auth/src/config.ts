import type { UserRoleData } from "@antifocus/config/schemas/auth";
import { uuid } from "@antifocus/db";
import { isProduction } from "@antifocus/env";
import type { BetterAuthOptions } from "better-auth";
import {
  admin,
  multiSession,
  phoneNumber,
  twoFactor,
  username,
} from "better-auth/plugins";
import { hashPassword, verifyPassword } from "./argon2";

export const authConfig = {
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    password: {
      hash: hashPassword,
      verify: ({ password, hash }) => verifyPassword(password, hash),
    },
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60,
    // sendResetPassword: async ({ user, url }) => {
    //   await getNotificationService().send("email", {
    //     to: user.email,
    //     subject: "Reset Your Password",
    //     body: `Hello ${user.name || "User"}, please reset your password using this link: ${url.toString()}`,
    //     html: `<p>Hello ${user.name || "User"}, please reset your password using this link: <a href="${url.toString()}">${url.toString()}</a></p>`,
    //     type: "reset_password",
    //     data: { username: user.name || "User", resetUrl: url.toString() },
    //   });
    // },
  },

  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60,
    autoSignInAfterVerification: true,
    // sendVerificationEmail: async ({ user, url }) => {
    //   const link = new URL(url);
    //   link.searchParams.set("callbackURL", "/verify");

    //   await getNotificationService().send("email", {
    //     to: user.email,
    //     subject: "Verify Your Email",
    //     body: `Hello ${user.name || "User"}, please verify your email using this link: ${link.toString()}`,
    //     html: `<p>Hello ${user.name || "User"}, please verify your email using this link: <a href="${link.toString()}">${link.toString()}</a></p>`,
    //     type: "verify_email",
    //     data: { username: user.name || "User", verifyUrl: link.toString() },
    //   });
  },

  plugins: [
    multiSession(),
    twoFactor(),
    phoneNumber(),
    username({
      minUsernameLength: 3,
      maxUsernameLength: 100,
    }),
    admin(),
  ],

  user: {
    changeEmail: {
      enabled: true,
      // sendChangeEmailVerification: async ({ user, url }) => {
      //   const link = new URL(url);
      //   link.searchParams.set("callbackURL", "/verify");

      //   await getNotificationService().send("email", {
      //     to: user.email,
      //     subject: "Change Email Verification",
      //     body: `Hello ${user.name || "User"}, please verify your new email using this link: ${link.toString()}`,
      //     html: `<p>Hello ${user.name || "User"}, please verify your new email using this link: <a href="${link.toString()}">${link.toString()}</a></p>`,
      //     type: "change_email_verify",
      //     data: { username: user.name || "User", verifyUrl: link.toString() },
      //   });
      // },
    },
    additionalFields: {
      role: {
        type: [
          "user",
          "admin",
          "creator",
          "staff",
          "super_admin",
        ] as UserRoleData[],
        defaultValue: "user",
        required: true,
        input: false,
      },
    },
  },

  // databaseHooks: {
  //   user: {
  //     create: {
  //       before: async (user) => {
  //         if (user.username) {
  //           return { data: user };
  //         }
  //         if (!user.email) {
  //           return { data: user };
  //         }

  //         const res = await generateUsername(user.email);
  //         if (!res.success) {
  //           return { data: user };
  //         }
  //         const exists = await authDB.query.users.findFirst({
  //           where: eq(users.username, res.data as string),
  //           columns: { id: true },
  //         });
  //         if (!exists) {
  //           return {
  //             data: { ...user, username: res.data },
  //           };
  //         }
  //         return { data: user };
  //       },
  //     },
  //   },
  // },

  // hooks: {
  //   after: createAuthMiddleware(async (ctx) => {
  //     if (ctx.path.startsWith("/sign-up")) {
  //       const user = ctx.context.newSession?.user ?? {
  //         name: ctx.body.name,
  //         email: ctx.body.email,
  //       };

  //       if (user != null) {
  //         await getNotificationService().send("email", {
  //           to: user.email,
  //           subject: "Welcome to Antifocus",
  //           body: `Hello ${user.name || "User"}, welcome to Antifocus!`,
  //           html: `<p>Hello ${user.name || "User"}, welcome to Antifocus!</p>`,
  //           type: "welcome",
  //           data: { username: user.name || "User" },
  //         });
  //       }
  //     }
  //   }),
  // },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    freshAge: 60 * 15,
  },

  advanced: {
    database: {
      generateId: () => uuid(),
    },
    ipAddress: {
      ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      disableIpTracking: false,
    },
    cookiePrefix: "antifocus",
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: isProduction,
    disableCSRFCheck: false,
  },

  logger: {
    level: "debug",
    disabled: isProduction,
  },
} satisfies BetterAuthOptions;
