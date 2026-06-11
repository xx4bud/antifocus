import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormCheckbox } from "./form-checkbox";
import { FormInput } from "./form-input";
import { FormPasswordInput } from "./form-password";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    input: FormInput,
    checkbox: FormCheckbox,
    password: FormPasswordInput,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
