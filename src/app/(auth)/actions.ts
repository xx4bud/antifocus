'use server'

import { signIn, signOut } from "next-auth/react";
import {prisma} from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { SignInSchema, SignUpSchema } from "@/lib/schemas";

export async function getUserFromDatabase(
  identifier: string,
  password: string
) {
  try {
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
        message: "Password is required",
      };
    }

    const isPasswordMatches = await bcryptjs.compare(
      password,
      existedUser.passwordHash
    );

    if (!isPasswordMatches) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    return {
      success: true,
      data: existedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function signUpCredentials({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    SignUpSchema.parse({
      name,
      email,
      password,
      confirmPassword,
    });

    let slug = email.split("@")[0];

    const existedSlug = await prisma.user.findFirst({
      where: { slug },
    });

    if (existedSlug) {
      slug = `${slug}${Math.floor(Math.random() * 100)}`;
    }

    const existedUser = await prisma.user.findFirst({
      where: {
        OR: [{ slug }, { email }],
      },
    });

    if (existedUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const insertedUser = await prisma.user.create({
      data: {
        name,
        email,
        slug,
        passwordHash: hashedPassword,
      },
    });

    return {
      success: true,
      data: insertedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function signInCredentials({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) {
  try {
    SignInSchema.parse({
      identifier,
      password,
    });

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
    return {
      success: false,
      message: error.message,
    };
  }
}
