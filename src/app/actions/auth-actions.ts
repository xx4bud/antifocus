import {
  SignInSchema,
  SignInValues,
} from "@/lib/validation";
import { signIn } from "next-auth/react";

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
