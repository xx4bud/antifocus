import type {
  AddressLabel,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ProductStatus,
  ShippingCourier,
  ShippingStatus,
  UserRole,
} from "@prisma/client";

// local
export type SortOrder = "asc" | "desc";

// User Data
export type userRole = UserRole;
export function getUserDataInclude() {
  return {
    media: true,
    addresses: true,
    designs: true,
    carts: true,
    orders: true,
    payments: true,
    reviews: true,
    accounts: true,
    sessions: true,
    _count: {
      select: {
        media: true,
        addresses: true,
        designs: true,
        carts: true,
        orders: true,
        payments: true,
        reviews: true,
        accounts: true,
        sessions: true,
      },
    },
  } satisfies Prisma.UserInclude;
}
export type UserData = Prisma.UserGetPayload<{
  include: ReturnType<typeof getUserDataInclude>;
}>;

// Address Data
export type addressLabel = AddressLabel;
export function getAddressDataInclude() {
  return {
    shipping: true,
    user: true,
    _count: {
      select: {
        shipping: true,
      },
    },
  } satisfies Prisma.AddressInclude;
}
export type AddressData = Prisma.AddressGetPayload<{
  include: ReturnType<typeof getAddressDataInclude>;
}>;

// Category Data
export function getCategoryDataInclude() {
  return {
    media: true,
    subCategories: true,
    products: true,
    _count: {
      select: {
        media: true,
        subCategories: true,
        products: true,
      },
    },
  } satisfies Prisma.CategoryInclude;
}
export type CategoryData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoryDataInclude>;
}>;

// SubCategory Data
export function getSubCategoryDataInclude() {
  return {
    media: true,
    products: true,
    category: true,
    _count: {
      select: {
        media: true,
        products: true,
      },
    },
  } satisfies Prisma.SubCategoryInclude;
}
export type SubCategoryData = Prisma.SubCategoryGetPayload<{
  include: ReturnType<typeof getSubCategoryDataInclude>;
}>;

// Product Data
export type productStatus = ProductStatus;
export function getProductDataInclude() {
  return {
    media: true,
    categories: true,
    subCategories: true,
    designs: true,
    specs: true,
    variants: true,
    options: true,
    reviews: true,
    cartItems: true,
    orderItems: true,
    _count: {
      select: {
        media: true,
        categories: true,
        subCategories: true,
        designs: true,
        specs: true,
        variants: true,
        options: true,
        reviews: true,
        cartItems: true,
        orderItems: true,
      },
    },
  } satisfies Prisma.ProductInclude;
}
export type ProductData = Prisma.ProductGetPayload<{
  include: ReturnType<typeof getProductDataInclude>;
}>;

// Spec Data
export function getSpecDataInclude() {
  return {
    product: true,
  } satisfies Prisma.SpecInclude;
}
export type SpecData = Prisma.SpecGetPayload<{
  include: ReturnType<typeof getSpecDataInclude>;
}>;

// Variant Data
export function getVariantDataInclude() {
  return {
    media: true,
    options: true,
    cartItems: true,
    orderItems: true,
    product: true,
    _count: {
      select: {
        media: true,
        options: true,
        cartItems: true,
        orderItems: true,
      },
    },
  } satisfies Prisma.VariantInclude;
}
export type VariantData = Prisma.VariantGetPayload<{
  include: ReturnType<typeof getVariantDataInclude>;
}>;

// Option Data
export function getOptionDataInclude() {
  return {
    cartItems: true,
    orderItems: true,
    product: true,
    variant: true,
    _count: {
      select: {
        cartItems: true,
        orderItems: true,
      },
    },
  } satisfies Prisma.OptionInclude;
}
export type OptionData = Prisma.OptionGetPayload<{
  include: ReturnType<typeof getOptionDataInclude>;
}>;

// Design Data
export function getDesignDataInclude() {
  return {
    media: true,
    orderItems: true,
    user: true,
    product: true,
    _count: {
      select: {
        media: true,
        orderItems: true,
      },
    },
  } satisfies Prisma.DesignInclude;
}
export type DesignData = Prisma.DesignGetPayload<{
  include: ReturnType<typeof getDesignDataInclude>;
}>;

// Cart Data
export function getCartDataInclude() {
  return {
    cartItems: true,
    user: true,
    _count: {
      select: {
        cartItems: true,
      },
    },
  } satisfies Prisma.CartInclude;
}
export type CartData = Prisma.CartGetPayload<{
  include: ReturnType<typeof getCartDataInclude>;
}>;

export function getCartItemDataInclude() {
  return {
    cart: true,
    product: true,
    variant: true,
    option: true,
  } satisfies Prisma.CartItemInclude;
}
export type CartItemData = Prisma.CartItemGetPayload<{
  include: ReturnType<typeof getCartItemDataInclude>;
}>;

// Order Data
export type orderStatus = OrderStatus;
export function getOrderDataInclude() {
  return {
    orderItems: true,
    payments: true,
    shippings: true,
    user: true,
    _count: {
      select: {
        orderItems: true,
        payments: true,
        shippings: true,
      },
    },
  } satisfies Prisma.OrderInclude;
}
export type OrderData = Prisma.OrderGetPayload<{
  include: ReturnType<typeof getOrderDataInclude>;
}>;

export function getOrderItemDataInclude() {
  return {
    order: true,
    design: true,
    product: true,
    variant: true,
    option: true,
  } satisfies Prisma.OrderItemInclude;
}
export type OrderItemData = Prisma.OrderItemGetPayload<{
  include: ReturnType<typeof getOrderItemDataInclude>;
}>;

// Payment Data
export type paymentMethod = PaymentMethod;
export type paymentStatus = PaymentStatus;
export function getPaymentDataInclude() {
  return {
    media: true,
    user: true,
    order: true,
    _count: {
      select: {
        media: true,
      },
    },
  } satisfies Prisma.PaymentInclude;
}
export type PaymentData = Prisma.PaymentGetPayload<{
  include: ReturnType<typeof getPaymentDataInclude>;
}>;

// Shipping Data
export type shippingCourir = ShippingCourier;
export type shippingStatus = ShippingStatus;
export function getShippingDataInclude() {
  return {
    address: true,
    order: true,
  } satisfies Prisma.ShippingInclude;
}
export type ShippingData = Prisma.ShippingGetPayload<{
  include: ReturnType<typeof getShippingDataInclude>;
}>;

// Review Data
export function getReviewDataInclude() {
  return {
    media: true,
    user: true,
    product: true,
    _count: {
      select: {
        media: true,
      },
    },
  } satisfies Prisma.ReviewInclude;
}
export type ReviewData = Prisma.ReviewGetPayload<{
  include: ReturnType<typeof getReviewDataInclude>;
}>;

// Media Data
export function getMediaDataInclude() {
  return {
    user: true,
    design: true,
    payment: true,
    product: true,
    variant: true,
    category: true,
    subCategory: true,
    review: true,
  } satisfies Prisma.MediaInclude;
}
export type MediaData = Prisma.MediaGetPayload<{
  include: ReturnType<typeof getMediaDataInclude>;
}>;
