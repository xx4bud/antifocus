export interface NavItem {
  /** Optional badge (pending count, status indicator) */
  badge?: number | string;
  title: string;
  url: string;
}

export interface NavSection {
  items: NavItem[];
}

export interface NavGroup {
  /** Domain key for CSS accent */
  domain: string;
  /** Flat items (single-level) */
  items?: NavItem[];
  /** Sub-sections (multi-level) */
  sections?: NavSection[];
  title: string;
  url: string;
}

// ── Orders ───────────────────────────────────────────────────
export const orderGroup: NavGroup = {
  title: "Pesanan",
  url: "/admin/orders", // Unique URL
  domain: "orders",
  sections: [
    {
      items: [
        { title: "Semua Pesanan", url: "/admin/orders" },
        { title: "Pengiriman", url: "/admin/fulfillment" },
        { title: "Pengembalian", url: "/admin/returns" },
        { title: "Saluran", url: "/admin/channels" },
        { title: "Point of Sale", url: "/admin/pos" },
      ],
    },
  ],
};

// ── Catalog ──────────────────────────────────────────────────
export const catalogGroup: NavGroup = {
  title: "Katalog",
  url: "/admin/catalog", // Unique URL
  domain: "catalog",
  sections: [
    {
      items: [
        { title: "Semua Produk", url: "/admin/products" },
        { title: "Desain", url: "/admin/designs" },
        /**
         * #settings
         * categories
         * attributes
         * variants
         * collections
         * tags
         * units
         */
        { title: "Katalog Saya", url: "/admin/catalog" },
      ],
    },
  ],
};

// ── Marketing ────────────────────────────────────────────────
export const marketingGroup: NavGroup = {
  title: "Marketing",
  url: "/admin/marketing", // Unique URL
  domain: "marketing",
  sections: [
    {
      items: [
        { title: "Promosi", url: "/admin/promotions" },
        { title: "Voucher", url: "/admin/vouchers" },
        { title: "Blog", url: "/admin/blogs" },
        { title: "Tiket", url: "/admin/tickets" },
        /**
         * #settings
         * banners
         * reviews
         */
        { title: "Pemasaran Saya", url: "/admin/marketing" },
      ],
    },
  ],
};

// ── Finance ──────────────────────────────────────────────────
export const financeGroup: NavGroup = {
  title: "Keuangan",
  url: "/admin/finance", // Unique URL
  domain: "finance",
  sections: [
    {
      items: [
        { title: "Invoice", url: "/admin/invoices" },
        { title: "Pembayaran", url: "/admin/payments" },
        { title: "Pengeluaran", url: "/admin/expenses" },
        /**
         * #settings
         * tax-rates
         * payment-methods
         */
        { title: "Finansial", url: "/admin/finance" },
      ],
    },
  ],
};

// ── Production ───────────────────────────────────────────────
export const productionGroup: NavGroup = {
  title: "Manufaktur",
  url: "/admin/production", // Unique URL
  domain: "production",
  sections: [
    {
      items: [
        { title: "Semua Tugas", url: "/admin/tasks" },
        /**
         * #settings
         * production-orders
         * bill-of-materials
         * routing-operation
         */
        { title: "Produksi", url: "/admin/production" },
      ],
    },
  ],
};

// ── Supply ───────────────────────────────────────────────────
export const supplyGroup: NavGroup = {
  title: "Supply",
  url: "/admin/supply", // Unique URL
  domain: "supply",
  sections: [
    {
      items: [
        { title: "Semua PO", url: "/admin/purchase-orders" },
        { title: "Persediaan", url: "/admin/inventories" },
        /**
         * #settings
         * couriers
         * transfers
         */
        { title: "Logistik", url: "/admin/supply" },
      ],
    },
  ],
};

// ── Org ───────────────────────────────────────────────────
export const orgGroup: NavGroup = {
  title: "Organisasi",
  url: "/admin/organization", // Unique URL
  domain: "org",
  sections: [
    {
      items: [
        { title: "Organisasi Saya", url: "/admin/org-info" },
        { title: "Member", url: "/admin/org-members" },

        /**
         * #settings
         * couriers
         * transfers
         */
        { title: "Akses", url: "/admin/org-access" },
      ],
    },
  ],
};

// ── Admin ─────────────────────────────────────────────────
export const settingGroup: NavGroup = {
  title: "Setting",
  url: "/admin/settings", // Unique URL
  domain: "settings",
  sections: [
    {
      items: [
        { title: "Umum", url: "/admin/settings" },
        { title: "Media", url: "/admin/media" },
        { title: "Integrasi", url: "/admin/integrations" },
        { title: "Audit Logs", url: "/admin/audit-logs" },
      ],
    },
  ],
};

/** All groups in sidebar order */
export const ALL_GROUPS: NavGroup[] = [
  orderGroup,
  catalogGroup,
  marketingGroup,
  financeGroup,
  productionGroup,
  supplyGroup,
  orgGroup,
  settingGroup,
];
