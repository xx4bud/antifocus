"use client";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-1 items-center justify-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">404</h1>
        <div className="h-8 w-px bg-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {`This page could not be found`}
        </span>
      </div>
    </div>
  );
}
