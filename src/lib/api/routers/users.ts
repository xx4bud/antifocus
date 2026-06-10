import { z } from "zod";
import { getUserById, listUsers } from "@/lib/db/queries/users";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(
    async ({ ctx }) => await getUserById(ctx.user.id)
  ),
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => await listUsers(input?.limit ?? 50)),
});
