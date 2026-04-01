import type { ReactNode } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "./form-hook";

export interface FormControlProps {
  description?: string;
  label?: ReactNode;
  labelRight?: ReactNode;
}

type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

export function FormBase({
  children,
  label,
  labelRight,
  description,
  controlFirst,
  horizontal,
}: FormBaseProps) {
  const field = useFieldContext();
  const isInvalid =
    (field.state.meta.isTouched || field.state.meta.isDirty) &&
    !field.state.meta.isValid;

  const errorElement = isInvalid && (
    <FieldError errors={field.state.meta.errors} />
  );

  const labelElement = (
    <>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {labelRight && (
          <Label className="whitespace-nowrap text-muted-foreground underline-offset-4 hover:underline">
            {labelRight}
          </Label>
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? "horizontal" : undefined}
    >
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {errorElement}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}
          {errorElement}
        </>
      )}
    </Field>
  );
}
