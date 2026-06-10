import { db } from "../index";

export const getOrganizationById = async (id: string) =>
  await db.query.organizations.findFirst({
    where: (orgs, { eq }) => eq(orgs.id, id),
  });

export const getOrganizationBySlug = async (slug: string) =>
  await db.query.organizations.findFirst({
    where: (orgs, { eq }) => eq(orgs.slug, slug),
  });

export const getMemberWithOrganization = async (
  userId: string,
  organizationId: string
) =>
  await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(
        eq(members.userId, userId),
        eq(members.organizationId, organizationId)
      ),
    with: {
      organization: true,
    },
  });

export const getOrganizationMembers = async (organizationId: string) =>
  await db.query.members.findMany({
    where: (members, { eq }) => eq(members.organizationId, organizationId),
    with: {
      user: true,
    },
    orderBy: (members, { desc }) => [desc(members.createdAt)],
  });

export const getOrganizationInvitations = async (organizationId: string) =>
  await db.query.invitations.findMany({
    where: (invitations, { eq }) =>
      eq(invitations.organizationId, organizationId),
    with: {
      inviter: true,
    },
    orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
  });
