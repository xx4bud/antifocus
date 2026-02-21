import { Button, type ButtonProps } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/utils/styles";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn("flex items-center gap-2", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Spinner />}
      {props.children}
    </Button>
  );
}
