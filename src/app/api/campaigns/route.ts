import { prisma } from "@/lib/prisma";
import { campaignDataInclude } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const campaignsList = await prisma.campaign.findMany({
      include: campaignDataInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(campaignsList);
  } catch (error) {
    console.log("GET /api/campaigns", error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
