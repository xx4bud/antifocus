import type { ComponentProps } from "react";
import { PasswordInput } from "../ui/password-input";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

export function FormPassword({
  label,
  labelRight,
  description,
  ...props
}: FormControlProps &
  Omit<ComponentProps<"input">, "type" | "value" | "onChange" | "onBlur">) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase description={description} label={label} labelRight={labelRight}>
      <PasswordInput
        {...props}
        aria-invalid={isInvalid}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value ?? ""}
      />
    </FormBase>
  );
}
