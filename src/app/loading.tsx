import { IconLoader2 } from "@tabler/icons-react";

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center opacity-50">
      <div className="flex flex-col items-center">
        <IconLoader2 className="size-6 animate-spin" />
      </div>
    </div>
  );
}
