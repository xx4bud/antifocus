import { checkArcjet } from "@antifocus/auth/arcjet";
import { createAuthNextJsHandler } from "@antifocus/auth/nextjs";
import { auth } from "~/features/auth/lib/server";

const authHandlers = createAuthNextJsHandler(auth);
export const { GET } = authHandlers;

export async function POST(request: Request) {
  const clonedRequest = request.clone();
  const decision = await checkArcjet(request, auth);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    }
    if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid.";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Email domain is not valid.";
      } else {
        message = "Invalid email.";
      }

      return Response.json({ message }, { status: 400 });
    }
    return new Response(null, { status: 403 });
  }

  return authHandlers.POST(clonedRequest);
}
