import { orgsRouter } from "./routers/orgs";
import { usersRouter } from "./routers/users";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  orgs: orgsRouter,
});

export type AppRouter = typeof appRouter;
