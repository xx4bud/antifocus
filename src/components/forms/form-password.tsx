import { IconEye, IconEyeOff } from "@tabler/icons-react";
import {
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/ui";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

export function FormPasswordInput({
  label,
  labelRight,
  description,
  icon,
  className,
  ...props
}: FormControlProps & { icon?: ReactNode } & Omit<
    ComponentProps<"input">,
    "value" | "onChange" | "onBlur" | "type"
  >) {
  const [showPassword, setShowPassword] = useState(false);
  const field = useFieldContext<string>();
  const isInvalid =
    (field.state.meta.isTouched || field.state.meta.isDirty) &&
    !field.state.meta.isValid;

  return (
    <FormBase description={description} label={label} labelRight={labelRight}>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/75">
            {icon}
          </span>
        )}
        <Input
          {...props}
          aria-invalid={isInvalid}
          className={cn("pr-10", icon && "pl-10", className)}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            field.handleChange(e.target.value)
          }
          type={showPassword ? "text" : "password"}
          value={field.state.value ?? ""}
        />
        <button
          className="absolute right-3 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          type="button"
        >
          {showPassword ? (
            <IconEyeOff className="h-4 w-4" />
          ) : (
            <IconEye className="h-4 w-4" />
          )}
        </button>
      </div>
    </FormBase>
  );
}
