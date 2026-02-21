export function normalizeString(v: unknown): string {
  if (typeof v !== "string") {
    return "";
  }

  let s = (v as string).normalize?.("NFC") ?? v;

  try {
    s = (s as string).replace(/\p{Cf}/gu, "");
  } catch {
    s = (s as string).replace(/\u200B|\u200C|\u200D|\uFEFF|\u2060/g, "");
  }

  return (s as string).trim();
}
