interface Props {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: Props) {
  return <div>{children}</div>;
}
