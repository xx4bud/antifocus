import type { ComponentProps, ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./form-hooks";

interface Option {
  label: string;
  value: string;
}

export function FormSelect({
  children,
  label,
  labelRight,
  description,
  options,
  placeholder,
  ...props
}: FormControlProps & {
  children?: ReactNode;
  options?: Option[];
  placeholder?: string;
} & Omit<ComponentProps<typeof Select>, "value" | "onValueChange">) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase description={description} label={label} labelRight={labelRight}>
      <Select
        {...props}
        onValueChange={(e) => field.handleChange(e)}
        value={field.state.value ?? undefined}
      >
        <SelectTrigger
          aria-invalid={isInvalid}
          id={field.name}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options
            ? options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            : children}
        </SelectContent>
      </Select>
    </FormBase>
  );
}
