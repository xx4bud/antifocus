import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/sonner";

export async function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={false}>
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster />
    </>
  );
}
