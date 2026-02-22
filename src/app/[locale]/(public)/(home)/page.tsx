import { getServerSession } from "~/features/auth/actions/get-session";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main>
      <h1>Home</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </main>
  );
}
