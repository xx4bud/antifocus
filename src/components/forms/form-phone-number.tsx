import type { ComponentProps } from "react";
import { PhoneNumberInput } from "~/components/ui/phone-number-input";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

export function FormPhoneNumber({
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
      <PhoneNumberInput
        {...props}
        aria-invalid={isInvalid}
        defaultCountry="ID"
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        value={field.state.value}
      />
    </FormBase>
  );
}
