interface HeadingProps {
  title?: string;
  amount?: number;
  description?: string;
  button?: React.ReactNode;
}

export function Heading({
  title,
  amount,
  description,
  button,
}: HeadingProps) {
  return (
    <div className="flex w-full justify-between gap-2 sm:flex-row sm:items-center">
      <div className="flex flex-col">
        <h1 className="flex items-center gap-1 text-lg font-semibold">
          {title}
          {amount !== undefined && amount !== 0 && (
            <span>({amount})</span>
          )}
        </h1>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {button && <div className="flex">{button}</div>}
    </div>
  );
}
