"use server"

import bcryptjs from "bcryptjs"
import { SignInSchema, SignUpSchema } from '@/schemas/auth-schema';
import { revalidatePath } from "next/cache"
import { signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma"

export async function getUserFromDb(email: string, password: string) {
  try {
    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existedUser) {
      return {
        success: false,
        message: "User not found.",
      }
    }

    if (!existedUser.email) {
      return {
        success: false,
        message: "Email is required.",
      }
    }

    if (!existedUser.username) {
      return {
        success: false,
        message: "Username is required.",
      }
    }

    if (!existedUser.password) {
      return {
        success: false,
        message: "Password is required.",
      }
    }

    const isPasswordMatches = await bcryptjs.compare(
      password,
      existedUser.password
    )

    if (!isPasswordMatches) {
      return {
        success: false,
        message: "Password is incorrect.",
      }
    }

    return {
      success: true,
      data: existedUser,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function signInCredentials({
  email,
  password,
}: {
  email: string
  password: string
}) {
  try {
    SignInSchema.parse({
      email,
      password,
    })

    const formData = new FormData()

    formData.append("email", email)
    formData.append("password", password)

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    return {
      success: true,
      data: res,
    }
  } catch (error: any) {
    return {
      success: false,
      message: "Email or password is incorrect.",
    }
  }
}

export async function signUpCredentials({
  email,
  password,
  confirmPassword,
}: {
  email: string
  password: string
  confirmPassword: string
}) {
  try {
    SignUpSchema.parse({
      email,
      password,
      confirmPassword,
    })
    // get user from db
    const existedUser = await getUserFromDb(email, password)
    if (existedUser.success) {
      return {
        success: false,
        message: "User already exists.",
      }
    }

    let username = email.split('@')[0];
    const existedUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existedUsername) {
      username = `${username}${Math.floor(Math.random() * 100)}`;
    }

    const hash = await bcryptjs.hash(password, 10)

    const insertedUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hash,
      },
    });

    return {
      success: true,
      data: insertedUser,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function signOutCredentials() {
  try {
    await signOut({
      redirect: false,
    })
    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// export async function updateUser({ name, id }: { name: string; id: string }) {
//   // PUT request to https://66b2046a1ca8ad33d4f62740.mockapi.io/api/v1/users/:id
//   // with the name in the body
//   // return the response

//   const res = await fetch(
//     `https://66b2046a1ca8ad33d4f62740.mockapi.io/api/v1/users/${id}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name }),
//     }
//   )
//   const data = res.json()

//   revalidatePath("/")

//   return data
// }

// export async function deleteUser(id: string) {
//   // DELETE request to https://66b2046a1ca8ad33d4f62740.mockapi.io/api/v1/users/:id
//   // return the response

//   const res = await fetch(
//     `https://66b2046a1ca8ad33d4f62740.mockapi.io/api/v1/users/${id}`,
//     {
//       method: "DELETE",
//     }
//   )
//   const data = res.json()

//   revalidatePath("/")

//   return data
// }