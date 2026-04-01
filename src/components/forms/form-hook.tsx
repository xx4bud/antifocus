import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormCheckbox } from "./form-checkbox";
import { FormInput } from "./form-input";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    input: FormInput,
    checkbox: FormCheckbox,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
