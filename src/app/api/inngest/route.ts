import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { handleOrderConfirmed } from "@/lib/inngest/functions/handle-order-confirmed";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [handleOrderConfirmed],
});
