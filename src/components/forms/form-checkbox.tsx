import type { ComponentProps } from "react";
import { Checkbox } from "../ui/checkbox";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

export function FormCheckbox({
  label,
  labelRight,
  description,
  ...props
}: FormControlProps &
  Omit<
    ComponentProps<typeof Checkbox>,
    "checked" | "onCheckedChange" | "name" | "onBlur" | "id"
  >) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase
      controlFirst
      description={description}
      horizontal
      label={label}
      labelRight={labelRight}
    >
      <Checkbox
        {...props}
        aria-invalid={isInvalid}
        checked={field.state.value}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
      />
    </FormBase>
  );
}
