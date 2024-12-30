"use client";

export default function Error() {
  return (
    <div className="flex h-screen flex-1 items-center justify-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">500</h1>
        <div className="h-8 w-px bg-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Something went wrong
        </span>
      </div>
    </div>
  );
}
