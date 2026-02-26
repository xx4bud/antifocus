"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "~/lib/db";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";
import { organizationInput } from "../validators/organization-schema";

export async function createOrganization(
  formData: unknown
): Promise<AppResponse<void>> {
  try {
    const data = organizationInput.parse(formData);

    // Check if slug exists
    const existing = await db.query.organizations.findFirst({
      where: eq(schema.organizations.slug, data.slug),
    });

    if (existing) {
      return {
        success: false,
        error: { message: "Organization slug already exists" },
      };
    }

    await db.insert(schema.organizations).values({
      name: data.name,
      slug: data.slug,
      logo: data.logo ?? null,
      status: data.status,
    });

    revalidatePath("/admin/organizations");
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

export async function updateOrganization(
  id: string,
  formData: unknown
): Promise<AppResponse<void>> {
  try {
    const data = organizationInput.parse(formData);

    // Ensure we don't duplicate slug if changed
    const existing = await db.query.organizations.findFirst({
      where: eq(schema.organizations.slug, data.slug),
    });

    if (existing && existing.id !== id) {
      return {
        success: false,
        error: { message: "Organization slug already exists" },
      };
    }

    await db
      .update(schema.organizations)
      .set({
        name: data.name,
        slug: data.slug,
        logo: data.logo ?? null,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(schema.organizations.id, id));

    revalidatePath("/admin/organizations");
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

export async function softDeleteOrganization(
  id: string
): Promise<AppResponse<void>> {
  try {
    await db
      .update(schema.organizations)
      .set({ deletedAt: new Date(), status: "inactive" })
      .where(eq(schema.organizations.id, id));

    revalidatePath("/admin/organizations");
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

export async function deleteOrganization(
  id: string
): Promise<AppResponse<void>> {
  try {
    await db
      .delete(schema.organizations)
      .where(eq(schema.organizations.id, id));
    revalidatePath("/admin/organizations");
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}
