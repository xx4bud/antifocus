"use server";

import prisma from "@/lib/prisma";
import {
  SignInSchema,
  SignInValues,
  SignUpSchema,
  SignUpValues,
} from "@/lib/validation";
import bcryptjs from "bcryptjs";

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

    if (!identifier) {
      return {
        success: false,
        message: "Email or username is required",
      };
    }

    if (!password) {
      return {
        success: false,
        message: "Password is required",
      };
    }

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
        message: "Password not found",
      };
    }

    const isValidPassword = await bcryptjs.compare(
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
    console.error("Error signing in credentials:", error);
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

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    if (!password) {
      return {
        success: false,
        message: "Password is required",
      };
    }

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

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(
      password,
      salt
    );

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