/**
 * Convert text to a URL-safe slug.
 * "Hello World!" → "hello-world"
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes

/**
 * Truncate text with ellipsis.
 * truncate("Hello World", 5) → "Hello…"
 */
export const truncate = (text: string, maxLength: number): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength)}…`;

/**
 * Capitalize the first letter.
 * "hello" → "Hello"
 */
export const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Title case every word.
 * "hello world" → "Hello World"
 */
export const titleCase = (text: string): string =>
  text
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? capitalize(word) : ""))
    .join(" ");

/**
 * Extract initials from a name.
 * initials("John Doe") → "JD"
 * initials("John Doe Smith", 2) → "JS"
 */
const WHITESPACE_RE = /\s+/;
export const initials = (name: string, maxChars = 2): string =>
  name
    .split(WHITESPACE_RE)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, maxChars)
    .join("");

/**
 * Mask an email address.
 * "john.doe@gmail.com" → "j******e@gmail.com"
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!(local && domain)) {
    return email;
  }
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}${"*".repeat(local.length - 2)}${local.at(-1)}@${domain}`;
};

/**
 * Mask a phone number.
 * "+628123456789" → "+6281****6789"
 */
export const maskPhone = (phone: string): string => {
  if (phone.length <= 6) {
    return phone;
  }
  const visibleStart = 4;
  const visibleEnd = 4;
  const masked = phone.length - visibleStart - visibleEnd;
  return `${phone.slice(0, visibleStart)}${"*".repeat(Math.max(masked, 0))}${phone.slice(-visibleEnd)}`;
};
