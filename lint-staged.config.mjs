export default {
  "*.{ts,tsx,js,jsx,json,css}": ["ultracite fix --unsafe"],
  "*.{ts,tsx,js,jsx}": () => "pnpm check:types",
};
