"use server";

import { compare, genSalt, hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  SignInSchema,
  SignInValues,
  SignUpSchema,
  SignUpValues,
} from "@/schemas/auth.schemas";
import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getUserFromDatabase(
  data: SignInValues
) {
  try {
    const validated = SignInSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.message,
      };
    }
    const { identifier, password } = validated.data;

    const existedUser = await prisma.user.findFirst({
      where: {
        OR: [{ slug: identifier }, { email: identifier }],
      },
    });
    if (!existedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }
    if (!existedUser.passwordHash) {
      return {
        success: false,
        message: "Account already exists on another provider",
      };
    }

    const isValidPassword = await compare(
      password,
      existedUser.passwordHash
    );

    if (!isValidPassword) {
      return {
        success: false,
        message: "Password is invalid",
      };
    }

    return {
      success: true,
      data: existedUser,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function signUpCredentials(
  data: SignUpValues
) {
  try {
    const validated = SignUpSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.message,
      };
    }

    const { name, email, password } = validated.data;

    let userSlug = email.split("@")[0];

    const existedSlug = await prisma.user.findUnique({
      where: { slug: userSlug },
    });

    if (existedSlug) {
      userSlug = `${userSlug}${Math.floor(Math.random() * 100)}`;
    }

    const existedUser = await prisma.user.findFirst({
      where: {
        OR: [{ slug: userSlug }, { email }],
      },
    });

    if (existedUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    if (!hashedPassword) {
      return {
        success: false,
        message: "Failed to hash password",
      };
    }

    const insertedUser = await prisma.user.create({
      data: {
        name,
        email,
        slug: userSlug,
        passwordHash: hashedPassword,
      },
    });

    return {
      success: true,
      data: insertedUser,
    };
  } catch (error: any) {
    console.error("Error signing up credentials:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function signInCredentials(
  data: SignInValues
) {
  try {
    const validated = SignInSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.message,
      };
    }

    const { identifier, password } = validated.data;

    const existedUser = await getUserFromDatabase({
      identifier,
      password,
    });

    if (!existedUser.success) {
      return {
        success: false,
        message: existedUser.message,
      };
    }

    const formData = new FormData();

    formData.append("identifier", identifier);
    formData.append("password", password);

    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    console.error("Error signing in credentials:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function signInGoogle() {
  await signIn("google", {
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL!,
  });
}

export async function signOutUser() {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
}
