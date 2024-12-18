import { getSession } from "@/lib/session";
import React from "react";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="max-w-2xl overflow-hidden">
      <h1>home</h1>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    </div>
  );
}
