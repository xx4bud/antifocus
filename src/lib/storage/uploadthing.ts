import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { env } from "@/env";
import { requireAuthSession } from "../auth/services";
import { createError } from "../utils/error";
import { type AppResult, tryCatchAsync } from "../utils/result";

let _utapi: UTApi | null = null;

export const getUTApi = (): UTApi => {
  if (!_utapi) {
    _utapi = new UTApi({
      token: env.UPLOADTHING_TOKEN,
    });
  }
  return _utapi;
};

export const utapi = new Proxy({} as UTApi, {
  get: (_, prop) => getUTApi()[prop as keyof UTApi],
});

export const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const sessionResult = await requireAuthSession();

      if (!sessionResult.ok) {
        throw new Error("Unauthorized. Please login to upload files.");
      }

      return { userId: sessionResult.value.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UploadThing] File uploaded by user ${metadata.userId}`);
      console.log(`[UploadThing] File URL: ${file.ufsUrl}`); // <- sudah menggunakan ufsUrl

      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof uploadRouter;

export const deleteFile = (
  fileKey: string
): Promise<AppResult<{ success: boolean }>> =>
  tryCatchAsync(
    async () => {
      await utapi.deleteFiles(fileKey);
      return { success: true };
    },
    (error) =>
      createError(
        "INTERNAL_ERROR",
        error instanceof Error ? error.message : "Failed to delete file",
        500,
        { fileKey }
      )
  );
