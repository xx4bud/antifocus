import {
  getOrganizationById,
  getOrganizationInvitations,
  getOrganizationMembers,
} from "@/lib/db/queries/orgs";
import {
  createTRPCRouter,
  orgAdminProcedure,
  orgMemberProcedure,
} from "../trpc";

export const orgsRouter = createTRPCRouter({
  me: orgMemberProcedure.query(
    async ({ ctx }) => await getOrganizationById(ctx.activeOrganizationId)
  ),

  members: orgMemberProcedure.query(
    async ({ ctx }) => await getOrganizationMembers(ctx.activeOrganizationId)
  ),

  invitations: orgAdminProcedure.query(
    async ({ ctx }) =>
      await getOrganizationInvitations(ctx.activeOrganizationId)
  ),
});
