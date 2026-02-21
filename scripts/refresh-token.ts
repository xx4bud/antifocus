import readline from "node:readline";
import { google } from "googleapis";
import { env } from "~/env";

const clientId = env.GOOGLE_CLIENT_ID;
const clientSecret = env.GOOGLE_CLIENT_SECRET;
const redirectUri = `${env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

const scopes: string[] = ["https://mail.google.com/"];

async function run(): Promise<void> {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
  console.log("🔗 Open this URL in your browser:\n", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "\nPaste the full redirect URL (or just the code): ",
    async (answer: string) => {
      try {
        const code = answer.includes("code=")
          ? new URL(answer).searchParams.get("code")
          : answer;

        if (!code) {
          throw new Error("Authorization code not found");
        }

        const { tokens } = await oauth2Client.getToken(code);
        console.log("\n🌐 Tambahkan ke `.env`:");
        console.log(`SMTP_REFRESH_TOKEN=${tokens.refresh_token}`);

        if (!tokens.refresh_token) {
          console.warn(
            "⚠️ Tidak ada refresh token: pastikan belum consent sebelumnya atau revoke dan ulangi."
          );
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("❌ ERROR:", err.message);
        } else {
          console.error("❌ ERROR:", err);
        }
      }
      rl.close();
    }
  );
}

run().catch((err) => {
  console.error("❌ Fatal error:", err);
});
