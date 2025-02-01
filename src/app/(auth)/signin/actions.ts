import { getUserFromDatabase } from "@/actions/auth.actions";
import { SignInSchema, SignInValues } from "@/schemas/auth.schemas";
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
      });
  
      return {
        success: true,
        data: res,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  export async function signInGoogle() {
    await signIn("google");
  }