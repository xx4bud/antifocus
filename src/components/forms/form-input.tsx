import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/ui";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

export function FormInput({
  label,
  labelRight,
  description,
  icon,
  className,
  ...props
}: FormControlProps & { icon?: ReactNode } & Omit<
    ComponentProps<"input">,
    "value" | "onChange" | "onBlur"
  >) {
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
          className={cn(icon && "pl-10", className)}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            field.handleChange(e.target.value)
          }
          value={field.state.value ?? ""}
        />
      </div>
    </FormBase>
  );
}
