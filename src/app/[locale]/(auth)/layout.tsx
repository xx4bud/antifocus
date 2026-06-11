interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4 md:p-8">
      {/* Background radial highlights */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[300px] w-[300px] rounded-full bg-primary/10 opacity-30 blur-3xl dark:bg-primary/5" />
        <div className="absolute h-[400px] w-[400px] translate-x-20 -translate-y-20 rounded-full bg-violet-500/10 opacity-20 blur-3xl dark:bg-violet-500/5" />
      </div>
      <div className="z-10 flex w-full justify-center">{children}</div>
    </div>
  );
}
