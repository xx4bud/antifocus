/**
 * Proxy handlers and utilities for middleware functionality.
 *
 * This module exports all proxy handlers and utility functions used in the application's
 * middleware chain, including authentication, internationalization, and handler chaining utilities.
 */

export { authHandler } from "./auth";
export { chain } from "./chain";
export { i18nHandler } from "./i18n";
