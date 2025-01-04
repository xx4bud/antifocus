import { cloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    paramsToSign: Record<string, string>;
  };
  const { paramsToSign } = body;

  const signature = cloudinary.v2.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return Response.json({ signature });
}

export async function DELETE(
  req: Request
): Promise<NextResponse<{ message: string }>> {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json(
        { message: "Public ID is required" },
        { status: 400 }
      );
    }

    await cloudinary.v2.uploader.destroy(publicId);

    return NextResponse.json(
      { message: "Photo deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
