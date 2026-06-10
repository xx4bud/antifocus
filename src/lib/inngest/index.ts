import { Inngest } from "inngest";
import { env } from "@/env";
import { APP_NAME } from "@/lib/utils/constants";

let _inngest: Inngest | null = null;

export const getInngest = (): Inngest => {
  if (!_inngest) {
    _inngest = new Inngest({
      id: APP_NAME.toLowerCase(),
      name: APP_NAME,
      eventKey: env.INNGEST_EVENT_KEY,
      signingKey: env.INNGEST_SIGNING_KEY,
    });
  }
  return _inngest;
};

export const inngest = new Proxy({} as Inngest, {
  get: (_, prop) => getInngest()[prop as keyof Inngest],
});
