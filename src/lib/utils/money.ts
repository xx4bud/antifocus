import { allocate, type Dinero, dinero, toDecimal } from "dinero.js";
import { getAppLocale, type Locale } from "../i18n/locales";
import { roundTo } from "./number";

/**
 * Creates a Dinero object from a raw decimal string or number.
 * Assumes the input is in major units (e.g., 150.50 means 150 dollars/rupiah and 50 cents).
 * createMoney(150.50, "USD") -> Dinero object representing $150.50
 */
export const createMoney = (
  amount: number | string,
  currencyCode = "IDR",
  scale = 2
): Dinero<number> => {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;
  // Convert major units to minor units (cents)
  const minorUnits = Math.round(numericAmount * 10 ** scale);

  return dinero({
    amount: minorUnits,
    currency: {
      code: currencyCode,
      base: 10,
      exponent: scale,
    },
    scale,
  });
};

/**
 * Format a Dinero object as currency based on the app locale.
 * formatMoney(money, "id") → "Rp 150.000"
 */
export const formatMoney = (
  moneyObj: Dinero<number>,
  locale: Locale = "id"
): string => {
  const appLocale = getAppLocale(locale);
  const currencyCode = moneyObj.toJSON().currency.code;

  const decimalString = toDecimal(moneyObj);
  const numericAmount = Number(decimalString);

  return new Intl.NumberFormat(appLocale.iso, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Calculate tax amount.
 * Returns a new Dinero object.
 */
export const calculateTax = (
  moneyObj: Dinero<number>,
  ratePercentage: number
): Dinero<number> => {
  // To avoid floating point issues, use multiply and allocate
  const scaledRate = Math.round(ratePercentage * 100); // 11.5% -> 1150
  const totalScaled = 10_000; // 100% * 100

  const allocated = allocate(moneyObj, [scaledRate, totalScaled - scaledRate]);
  return allocated[0] as Dinero<number>;
};

/**
 * Calculate discount amount.
 * Returns a new Dinero object.
 */
export const calculateDiscount = (
  moneyObj: Dinero<number>,
  discountValue: number,
  type: "percentage" | "fixed"
): Dinero<number> => {
  if (type === "percentage") {
    const scaledRate = Math.round(discountValue * 100);
    const totalScaled = 10_000;
    const allocated = allocate(moneyObj, [
      scaledRate,
      totalScaled - scaledRate,
    ]);
    return allocated[0] as Dinero<number>;
  }

  // Fixed discount: create a Dinero object for the fixed amount
  const currencyCode = moneyObj.toJSON().currency.code;
  const fixedMoney = createMoney(
    discountValue,
    currencyCode,
    moneyObj.toJSON().scale
  );

  // If type is fixed, the discount amount is just the fixed amount.
  // But we might want to ensure the discount doesn't exceed the total amount.
  const isDiscountGreater = toDecimal(fixedMoney) > toDecimal(moneyObj);
  return isDiscountGreater ? moneyObj : fixedMoney;
};

/**
 * Safely sum an array of numbers representing major units.
 * sumAmounts(0.1, 0.2, 0.3) → 0.6
 */
export const sumAmounts = (...amounts: number[]): number =>
  roundTo(
    amounts.reduce((sum, val) => sum + val, 0),
    2
  );

/**
 * Convert Dinero object back to JS number for DB inserts (mode: "number").
 */
export const toDB = (moneyObj: Dinero<number>): number =>
  Number(toDecimal(moneyObj));
