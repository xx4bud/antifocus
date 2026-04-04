/** biome-ignore-all lint/suspicious/noDocumentCookie: false */

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const isBrowser = typeof document !== "undefined";

function serializeCookie(name: string, value: string, maxAge: number): string {
  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);
  const safeMaxAge = Math.max(0, Math.floor(maxAge));

  return `${encodedName}=${encodedValue}; path=/; max-age=${safeMaxAge}; sameSite=Lax`;
}

function decodeCookieValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getCookie(name: string): string | undefined {
  if (!isBrowser) {
    return undefined;
  }

  const encodedName = encodeURIComponent(name);
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${encodedName}=`));

  if (!cookie) {
    return undefined;
  }

  const [, rawValue] = cookie.split("=");
  return rawValue ? decodeCookieValue(rawValue) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE
): void {
  if (!isBrowser) {
    return;
  }

  document.cookie = serializeCookie(name, value, maxAge);
}

export function removeCookie(name: string): void {
  if (!isBrowser) {
    return;
  }

  document.cookie = serializeCookie(name, "", 0);
}
