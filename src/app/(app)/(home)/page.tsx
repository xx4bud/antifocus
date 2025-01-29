import { getSession } from "@/lib/utils";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex flex-col">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
