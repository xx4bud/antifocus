// "use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function CampaignsList() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      photos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {campaigns.map((campaign) => (
          <CarouselItem key={campaign.id}>
            <div className="relative h-40 w-full overflow-hidden rounded-lg md:h-80">
              <Link href={"/"}>
                <Image
                  src={campaign.photos[0].url}
                  alt={campaign.name || campaign.slug}
                  width={1128}
                  height={320}
                  className="h-full w-full object-cover"
                />
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
