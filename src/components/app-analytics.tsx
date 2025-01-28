"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights as VercelSpeedInsight } from "@vercel/speed-insights/next";

export function AppAnalytics() {
  return (
    <>
      <VercelSpeedInsight />
      <VercelAnalytics />
    </>
  );
}
