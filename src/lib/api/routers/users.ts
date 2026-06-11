import { getUserById, listUsers } from "@/lib/db/queries/users";
import { paginationSchema } from "@/lib/db/validations/pagination";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(
    async ({ ctx }) => await getUserById(ctx.user.id)
  ),
  list: protectedProcedure.input(paginationSchema).query(async ({ input }) => {
    const offset = (input.page - 1) * input.limit;
    return await listUsers(input.limit, offset);
  }),
});
