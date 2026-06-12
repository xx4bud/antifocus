import { createId } from "@paralleldrive/cuid2";

export interface SeedContext {
  catalog: {
    productId: string;
    variantId: string;
    designAreaId: string;
  };
  files: Record<string, string>; // Unsplash ID -> File ID
  finance: {
    taxRateId: string;
    paymentMethodId: string;
    invoiceId: string;
  };
  marketing: {
    promotionId: string;
  };
  order: {
    orderChannelId: string;
    orderId: string;
  };
  org: {
    orgId: string;
    branchId: string;
    customerId: string;
    supplierId: string;
    memberRecordId: string;
  };
  production: {
    bomId: string;
    productionOrderId: string;
  };
  supply: {
    courierId: string;
    purchaseOrderId: string;
  };
  taxonomy: {
    unitId: string;
    categoryId: string;
    tagId: string;
    attributeId: string;
    attributeOptionId: string;
    collectionId: string;
  };
  users: {
    superadminId: string;
    memberId: string;
    guestUserId: string;
  };
}

export const createSeedContext = (): SeedContext => ({
  users: {
    superadminId: createId(),
    memberId: createId(),
    guestUserId: createId(),
  },
  org: {
    orgId: createId(),
    branchId: createId(),
    customerId: createId(),
    supplierId: createId(),
    memberRecordId: createId(),
  },
  files: {},
  taxonomy: {
    unitId: createId(),
    categoryId: createId(),
    tagId: createId(),
    attributeId: createId(),
    attributeOptionId: createId(),
    collectionId: createId(),
  },
  finance: {
    taxRateId: createId(),
    paymentMethodId: createId(),
    invoiceId: createId(),
  },
  catalog: {
    productId: createId(),
    variantId: createId(),
    designAreaId: createId(),
  },
  supply: {
    courierId: createId(),
    purchaseOrderId: createId(),
  },
  order: {
    orderChannelId: createId(),
    orderId: createId(),
  },
  production: {
    bomId: createId(),
    productionOrderId: createId(),
  },
  marketing: {
    promotionId: createId(),
  },
});
