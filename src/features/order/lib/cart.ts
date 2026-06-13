import { redis } from "@/lib/redis";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type { CartInput, CartItemInput } from "./validators";

const CART_PREFIX = "cart:";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const getCartKey = (id: string) => `${CART_PREFIX}${id}`;

export const getCart = async (id: string): Promise<AppResult<CartInput>> =>
  tryCatchAsync(async () => {
    const data = await redis.get<CartInput>(getCartKey(id));
    if (!data) {
      return { id, items: [], updatedAt: Date.now() };
    }
    return data;
  }, parseError);

export const setCart = async (
  id: string,
  cart: CartInput
): Promise<AppResult<CartInput>> =>
  tryCatchAsync(async () => {
    await redis.set(getCartKey(id), cart, { ex: TTL_SECONDS });
    return cart;
  }, parseError);

export const addToCart = async (
  cartId: string,
  item: CartItemInput
): Promise<AppResult<CartInput>> =>
  tryCatchAsync(async () => {
    const cartRes = await getCart(cartId);
    if (!cartRes.ok) {
      throw cartRes.error;
    }
    const cart = cartRes.value;

    const existingIndex = cart.items.findIndex((i) => i.id === item.id);
    const existingItem = existingIndex >= 0 ? cart.items[existingIndex] : null;

    if (existingIndex >= 0 && existingItem) {
      existingItem.quantity += item.quantity;
      if (item.metadata) {
        existingItem.metadata = {
          ...existingItem.metadata,
          ...item.metadata,
        };
      }
      cart.items[existingIndex] = existingItem;
    } else {
      cart.items.push(item);
    }
    cart.updatedAt = Date.now();

    const saveRes = await setCart(cartId, cart);
    if (!saveRes.ok) {
      throw saveRes.error;
    }

    return saveRes.value;
  }, parseError);

export const updateCartItem = async (
  cartId: string,
  itemId: string,
  updates: Partial<CartItemInput>
): Promise<AppResult<CartInput>> =>
  tryCatchAsync(async () => {
    const cartRes = await getCart(cartId);
    if (!cartRes.ok) {
      throw cartRes.error;
    }
    const cart = cartRes.value;

    const existingIndex = cart.items.findIndex((i) => i.id === itemId);
    const existingItem = existingIndex >= 0 ? cart.items[existingIndex] : null;

    if (existingIndex < 0 || !existingItem) {
      throw createError("NOT_FOUND", "Item not found in cart", 404);
    }

    cart.items[existingIndex] = {
      id: updates.id ?? existingItem.id,
      variantId: updates.variantId ?? existingItem.variantId,
      quantity: updates.quantity ?? existingItem.quantity,
      metadata:
        updates.metadata === undefined
          ? existingItem.metadata
          : updates.metadata,
    };

    cart.updatedAt = Date.now();

    const saveRes = await setCart(cartId, cart);
    if (!saveRes.ok) {
      throw saveRes.error;
    }

    return saveRes.value;
  }, parseError);

export const removeCartItem = async (
  cartId: string,
  itemId: string
): Promise<AppResult<CartInput>> =>
  tryCatchAsync(async () => {
    const cartRes = await getCart(cartId);
    if (!cartRes.ok) {
      throw cartRes.error;
    }
    const cart = cartRes.value;

    cart.items = cart.items.filter((i) => i.id !== itemId);
    cart.updatedAt = Date.now();

    const saveRes = await setCart(cartId, cart);
    if (!saveRes.ok) {
      throw saveRes.error;
    }

    return saveRes.value;
  }, parseError);

export const clearCart = async (cartId: string): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    await redis.del(getCartKey(cartId));
    return true;
  }, parseError);
