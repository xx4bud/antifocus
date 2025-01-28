"use client";

import { CampaignData } from "@/types";
import * as React from "react";

interface CampaignsClientProps {
  campaigns: CampaignData[];
}

export function CampaignsClient({
  campaigns,
}: CampaignsClientProps) {
  return (
    <div className="container flex flex-1 flex-col">
      {campaigns.map((campaign) => (
        <div key={campaign.id}>
          <div>{campaign.name}</div>
          {campaign.products.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
