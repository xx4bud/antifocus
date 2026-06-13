import { getOrderById } from "@/features/order/lib/queries";
import { createProductionOrderService } from "@/features/production/lib/services";
import { inngest } from "../index";

export const handleOrderConfirmed = inngest.createFunction(
  {
    id: "create-production-order",
    name: "Create Production Order on Confirm",
    triggers: [{ event: "antifocus/order/confirmed" }],
    retries: 4,
  },
  async ({ event, step }) => {
    const { orderId, organizationId } = event.data as {
      orderId: string;
      organizationId: string;
    };

    // Get order details
    const orderData = await step.run("fetch-order", async () => {
      const order = await getOrderById(organizationId, orderId);
      if (!order.ok) {
        throw new Error("Order not found");
      }
      return order.value;
    });

    // Create production order
    await step.run("create-production-order", async () => {
      // Map order items to production items
      const items = orderData.items.map(
        (item: {
          variantId: string;
          id: string;
          quantity: number;
          unitPrice: number | null;
          metadata: Record<string, unknown> | null;
        }) => ({
          variantId: item.variantId,
          orderItemId: item.id,
          quantity: item.quantity,
          unitCost: item.unitPrice ?? 0,
          metadata: item.metadata,
        })
      );

      if (items.length > 0) {
        await createProductionOrderService(organizationId, "system", "System", {
          branchId: orderData.branchId,
          orderId: orderData.id,
          status: "pending",
          priority: "normal",
          items,
        });
      }
    });

    await step.sendEvent("notify-staff", {
      name: "antifocus/production/order-created",
      data: { orderId, organizationId },
    });
  }
);
