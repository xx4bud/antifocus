import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNull,
  lte,
  or,
} from "drizzle-orm";
import { z } from "zod";
import { schema } from "~/lib/db";
import { publicProcedure, router } from "~/lib/trpc/init";

/**
 * Public router — all procedures are unauthenticated.
 * Used by the storefront (homepage, search, slug pages).
 */
export const publicRouter = router({
  // ========================================
  // BANNERS
  // ========================================
  getBanners: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(schema.banners)
      .where(eq(schema.banners.enabled, true))
      .orderBy(asc(schema.banners.position));
  }),

  // ========================================
  // CATEGORIES
  // ========================================
  getCategories: publicProcedure
    .input(
      z
        .object({
          parentId: z.string().nullish(),
          limit: z.number().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(schema.categories.enabled, true)];

      if (input?.parentId) {
        conditions.push(eq(schema.categories.parentId, input.parentId));
      } else if (input?.parentId === null) {
        conditions.push(isNull(schema.categories.parentId));
      }

      return ctx.db
        .select({
          id: schema.categories.id,
          name: schema.categories.name,
          slug: schema.categories.slug,
          image: schema.categories.image,
          parentId: schema.categories.parentId,
          position: schema.categories.position,
        })
        .from(schema.categories)
        .where(and(...conditions))
        .orderBy(asc(schema.categories.position))
        .limit(input?.limit ?? 20);
    }),

  // ========================================
  // FEATURED PRODUCTS
  // ========================================
  getFeaturedProducts: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(12),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 12;

      const prods = await ctx.db
        .select({
          id: schema.products.id,
          name: schema.products.name,
          slug: schema.products.slug,
          description: schema.products.description,
          basePrice: schema.products.basePrice,
          currency: schema.products.currency,
          status: schema.products.status,
          createdAt: schema.products.createdAt,
          organizationId: schema.products.organizationId,
        })
        .from(schema.products)
        .where(
          and(
            eq(schema.products.status, "active"),
            eq(schema.products.enabled, true),
            isNull(schema.products.deletedAt)
          )
        )
        .orderBy(desc(schema.products.createdAt))
        .limit(limit);

      // Fetch main media for each product
      const productIds = prods.map((p) => p.id);
      if (productIds.length === 0) {
        return [];
      }

      const mediaRows = await ctx.db
        .select({
          productId: schema.productMedias.productId,
          url: schema.medias.url,
          name: schema.medias.name,
        })
        .from(schema.productMedias)
        .innerJoin(
          schema.medias,
          eq(schema.productMedias.mediaId, schema.medias.id)
        )
        .where(eq(schema.productMedias.isMain, true));

      const mediaMap = new Map(mediaRows.map((m) => [m.productId, m]));

      return prods.map((p) => ({
        ...p,
        mainImage: mediaMap.get(p.id) ?? null,
      }));
    }),

  // ========================================
  // PRODUCT BY SLUG
  // ========================================
  getProductBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [product] = await ctx.db
        .select()
        .from(schema.products)
        .where(
          and(
            eq(schema.products.slug, input.slug),
            eq(schema.products.enabled, true),
            isNull(schema.products.deletedAt)
          )
        )
        .limit(1);

      if (!product) {
        return null;
      }

      // Fetch variants
      const variants = await ctx.db
        .select()
        .from(schema.productVariants)
        .where(
          and(
            eq(schema.productVariants.productId, product.id),
            eq(schema.productVariants.enabled, true)
          )
        )
        .orderBy(asc(schema.productVariants.position));

      // Fetch medias
      const mediaRows = await ctx.db
        .select({
          id: schema.medias.id,
          url: schema.medias.url,
          name: schema.medias.name,
          isMain: schema.productMedias.isMain,
          position: schema.productMedias.position,
        })
        .from(schema.productMedias)
        .innerJoin(
          schema.medias,
          eq(schema.productMedias.mediaId, schema.medias.id)
        )
        .where(eq(schema.productMedias.productId, product.id))
        .orderBy(asc(schema.productMedias.position));

      // Fetch categories
      const cats = await ctx.db
        .select({
          id: schema.categories.id,
          name: schema.categories.name,
          slug: schema.categories.slug,
        })
        .from(schema.productCategories)
        .innerJoin(
          schema.categories,
          eq(schema.productCategories.categoryId, schema.categories.id)
        )
        .where(eq(schema.productCategories.productId, product.id));

      // Fetch organization
      const [org] = await ctx.db
        .select({
          id: schema.organizations.id,
          name: schema.organizations.name,
          slug: schema.organizations.slug,
          logo: schema.organizations.logo,
        })
        .from(schema.organizations)
        .where(eq(schema.organizations.id, product.organizationId))
        .limit(1);

      return {
        ...product,
        variants,
        medias: mediaRows,
        categories: cats,
        organization: org ?? null,
      };
    }),

  // ========================================
  // CATEGORY BY SLUG
  // ========================================
  getCategoryBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(schema.categories)
        .where(
          and(
            eq(schema.categories.slug, input.slug),
            eq(schema.categories.enabled, true)
          )
        )
        .limit(1);

      if (!category) {
        return null;
      }

      // Fetch children
      const children = await ctx.db
        .select({
          id: schema.categories.id,
          name: schema.categories.name,
          slug: schema.categories.slug,
          image: schema.categories.image,
        })
        .from(schema.categories)
        .where(
          and(
            eq(schema.categories.parentId, category.id),
            eq(schema.categories.enabled, true)
          )
        )
        .orderBy(asc(schema.categories.position));

      // Fetch products in this category
      const products = await ctx.db
        .select({
          id: schema.products.id,
          name: schema.products.name,
          slug: schema.products.slug,
          basePrice: schema.products.basePrice,
          currency: schema.products.currency,
          description: schema.products.description,
        })
        .from(schema.productCategories)
        .innerJoin(
          schema.products,
          and(
            eq(schema.productCategories.productId, schema.products.id),
            eq(schema.products.enabled, true),
            eq(schema.products.status, "active"),
            isNull(schema.products.deletedAt)
          )
        )
        .where(eq(schema.productCategories.categoryId, category.id))
        .orderBy(desc(schema.products.createdAt))
        .limit(50);

      // Fetch main media for products
      const productIds = products.map((p) => p.id);
      let mediaMap = new Map<string, { url: string; name: string }>();
      if (productIds.length > 0) {
        const mediaRows = await ctx.db
          .select({
            productId: schema.productMedias.productId,
            url: schema.medias.url,
            name: schema.medias.name,
          })
          .from(schema.productMedias)
          .innerJoin(
            schema.medias,
            eq(schema.productMedias.mediaId, schema.medias.id)
          )
          .where(eq(schema.productMedias.isMain, true));

        mediaMap = new Map(mediaRows.map((m) => [m.productId, m]));
      }

      return {
        ...category,
        children,
        products: products.map((p) => ({
          ...p,
          mainImage: mediaMap.get(p.id) ?? null,
        })),
      };
    }),

  // ========================================
  // ORGANIZATION BY SLUG
  // ========================================
  getOrganizationBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [org] = await ctx.db
        .select()
        .from(schema.organizations)
        .where(
          and(
            eq(schema.organizations.slug, input.slug),
            eq(schema.organizations.status, "active"),
            isNull(schema.organizations.deletedAt)
          )
        )
        .limit(1);

      if (!org) {
        return null;
      }

      // Fetch products
      const products = await ctx.db
        .select({
          id: schema.products.id,
          name: schema.products.name,
          slug: schema.products.slug,
          basePrice: schema.products.basePrice,
          currency: schema.products.currency,
        })
        .from(schema.products)
        .where(
          and(
            eq(schema.products.organizationId, org.id),
            eq(schema.products.enabled, true),
            eq(schema.products.status, "active"),
            isNull(schema.products.deletedAt)
          )
        )
        .orderBy(desc(schema.products.createdAt))
        .limit(20);

      return { ...org, products };
    }),

  // ========================================
  // USER BY USERNAME
  // ========================================
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          username: schema.users.username,
          displayUsername: schema.users.displayUsername,
          image: schema.users.image,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .where(
          and(
            eq(schema.users.username, input.username),
            eq(schema.users.status, "active"),
            isNull(schema.users.deletedAt)
          )
        )
        .limit(1);

      if (!user) {
        return null;
      }

      // Fetch organizations
      const orgs = await ctx.db
        .select({
          id: schema.organizations.id,
          name: schema.organizations.name,
          slug: schema.organizations.slug,
          logo: schema.organizations.logo,
        })
        .from(schema.members)
        .innerJoin(
          schema.organizations,
          and(
            eq(schema.members.organizationId, schema.organizations.id),
            eq(schema.organizations.status, "active"),
            isNull(schema.organizations.deletedAt)
          )
        )
        .where(
          and(
            eq(schema.members.userId, user.id),
            eq(schema.members.enabled, true)
          )
        );

      return { ...user, organizations: orgs };
    }),

  // ========================================
  // SLUG RESOLVER
  // ========================================
  resolveSlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // 1. Check categories
      const [cat] = await ctx.db
        .select({ id: schema.categories.id })
        .from(schema.categories)
        .where(
          and(
            eq(schema.categories.slug, input.slug),
            eq(schema.categories.enabled, true)
          )
        )
        .limit(1);
      if (cat) {
        return { type: "category" as const, id: cat.id };
      }

      // 2. Check products
      const [prod] = await ctx.db
        .select({ id: schema.products.id })
        .from(schema.products)
        .where(
          and(
            eq(schema.products.slug, input.slug),
            eq(schema.products.enabled, true),
            isNull(schema.products.deletedAt)
          )
        )
        .limit(1);
      if (prod) {
        return { type: "product" as const, id: prod.id };
      }

      // 3. Check organizations
      const [org] = await ctx.db
        .select({ id: schema.organizations.id })
        .from(schema.organizations)
        .where(
          and(
            eq(schema.organizations.slug, input.slug),
            eq(schema.organizations.status, "active"),
            isNull(schema.organizations.deletedAt)
          )
        )
        .limit(1);
      if (org) {
        return { type: "organization" as const, id: org.id };
      }

      // 4. Check users (by username)
      const [user] = await ctx.db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(
          and(
            eq(schema.users.username, input.slug),
            eq(schema.users.status, "active"),
            isNull(schema.users.deletedAt)
          )
        )
        .limit(1);
      if (user) {
        return { type: "user" as const, id: user.id };
      }

      return null;
    }),

  // ========================================
  // SEARCH PRODUCTS
  // ========================================
  searchProducts: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        categorySlug: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z
          .enum(["newest", "oldest", "price_asc", "price_desc", "name"])
          .default("newest"),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(schema.products.enabled, true),
        eq(schema.products.status, "active"),
        isNull(schema.products.deletedAt),
        or(
          ilike(schema.products.name, `%${input.query}%`),
          ilike(schema.products.slug, `%${input.query}%`),
          ilike(schema.products.description, `%${input.query}%`)
        ),
      ];

      if (input.minPrice !== undefined) {
        conditions.push(gte(schema.products.basePrice, String(input.minPrice)));
      }
      if (input.maxPrice !== undefined) {
        conditions.push(lte(schema.products.basePrice, String(input.maxPrice)));
      }

      const orderByMap = {
        newest: desc(schema.products.createdAt),
        oldest: asc(schema.products.createdAt),
        price_asc: asc(schema.products.basePrice),
        price_desc: desc(schema.products.basePrice),
        name: asc(schema.products.name),
      };

      let baseQuery = ctx.db
        .select({
          id: schema.products.id,
          name: schema.products.name,
          slug: schema.products.slug,
          description: schema.products.description,
          basePrice: schema.products.basePrice,
          currency: schema.products.currency,
          createdAt: schema.products.createdAt,
        })
        .from(schema.products);

      // If filtering by category
      if (input.categorySlug) {
        const [cat] = await ctx.db
          .select({ id: schema.categories.id })
          .from(schema.categories)
          .where(eq(schema.categories.slug, input.categorySlug))
          .limit(1);

        if (cat) {
          baseQuery = baseQuery
            .innerJoin(
              schema.productCategories,
              eq(schema.products.id, schema.productCategories.productId)
            )
            .where(
              and(
                ...conditions,
                eq(schema.productCategories.categoryId, cat.id)
              )
            ) as unknown as typeof baseQuery;
        }
      }

      const whereClause = and(...conditions);

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select({
            id: schema.products.id,
            name: schema.products.name,
            slug: schema.products.slug,
            description: schema.products.description,
            basePrice: schema.products.basePrice,
            currency: schema.products.currency,
            createdAt: schema.products.createdAt,
          })
          .from(schema.products)
          .where(whereClause)
          .orderBy(orderByMap[input.sortBy])
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.products)
          .where(whereClause),
      ]);

      // Fetch main media
      const mediaRows = await ctx.db
        .select({
          productId: schema.productMedias.productId,
          url: schema.medias.url,
          name: schema.medias.name,
        })
        .from(schema.productMedias)
        .innerJoin(
          schema.medias,
          eq(schema.productMedias.mediaId, schema.medias.id)
        )
        .where(eq(schema.productMedias.isMain, true));

      const mediaMap = new Map(mediaRows.map((m) => [m.productId, m]));

      return {
        data: data.map((p) => ({
          ...p,
          mainImage: mediaMap.get(p.id) ?? null,
        })),
        total: totalResult[0]?.count ?? 0,
      };
    }),
});
