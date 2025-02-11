"use server";

import { signIn } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  SignInSchema,
  SignInValues,
  SignUpSchema,
  SignUpValues,
} from "@/lib/validation";
import { compare, hash } from "bcryptjs";

export async function getUserFromDatabase({
  identifier,
  password,
}: SignInValues) {
  try {
    const validated = SignInSchema.safeParse({
      identifier,
      password,
    });

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.message,
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
        message:
          "Account already exists on another provider",
      };
    }

    const isValidPassword = await compare(
      password,
      existedUser.passwordHash
    );

    if (!isValidPassword) {
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
      where: {
        slug: userSlug,
      },
    });

    if (existedSlug) {
      userSlug = `${userSlug}${Math.floor(Math.random() * 100)}`;
    }

    const existedUser = await getUserFromDatabase({
      identifier: email,
      password,
    });

    if (existedUser.data) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const hashedPassword = await hash(password, 10);

    if (!hashedPassword) {
      return {
        success: false,
        message: "Failed to hash password",
      };
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        slug: userSlug,
      },
    });

    return {
      success: true,
      data: newUser,
      message: "User created successfully",
    };
  } catch (error: any) {
    console.log(error);
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
      redirect: false,
      password,
      identifier,
    });

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function signInWithGoogle() {
  return signIn("google");
}
