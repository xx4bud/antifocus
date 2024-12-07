import React from 'react';
import { getSession } from '@/lib/utils';

export default async function HomePage() {
  const session = await getSession();
  return (
    <div className="flex flex-col gap-2">
      <h1>HomePage</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
