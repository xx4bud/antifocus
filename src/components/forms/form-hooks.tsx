import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormPhoneNumber } from "~/components/forms/form-phone-number";
import { FormCheckbox } from "./form-checkbox";
import { FormInput } from "./form-input";
import { FormPassword } from "./form-password";
import { FormSelect } from "./form-select";
import { FormTextarea } from "./form-textarea";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    checkbox: FormCheckbox,
    input: FormInput,
    password: FormPassword,
    phoneNumber: FormPhoneNumber,
    select: FormSelect,
    textarea: FormTextarea,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
