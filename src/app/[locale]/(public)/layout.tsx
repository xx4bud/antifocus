export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="container flex min-h-svh flex-1 flex-col">{children}</div>
    </div>
  );
}
