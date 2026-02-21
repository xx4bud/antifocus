import { getServerSession } from "~/features/auth/actions/get-session";

export async function HomePage() {
  const session = await getServerSession();
  return (
    <main>
      <h1>Home Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </main>
  );
}
