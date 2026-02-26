"use client";

import { useTransition } from "react";
import { useAppForm } from "~/components/forms/form-hooks";
import { FieldGroup } from "~/components/ui/field";
import { LoadingButton } from "~/components/ui/loading-button";
import { toast } from "~/components/ui/sonner";
import {
  createOrganization,
  updateOrganization,
} from "~/features/admin/tenants/actions/organization-mutations";
import {
  type OrganizationData,
  organizationInput,
} from "~/features/admin/tenants/validators/organization-schema";

interface OrganizationFormProps {
  initialData?: OrganizationData & { id: string };
  onSuccess?: () => void;
}

export function OrganizationForm({
  initialData,
  onSuccess,
}: OrganizationFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useAppForm({
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : ({
          name: "",
          slug: "",
          logo: "",
          status: "pending",
        } satisfies OrganizationData as OrganizationData),

    validators: {
      onChange: organizationInput,
    },

    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = initialData
          ? await updateOrganization(initialData.id, value)
          : await createOrganization(value);

        if (result.success) {
          toast.success(
            initialData
              ? "Organization updated successfully"
              : "Organization created successfully"
          );
          onSuccess?.();
          return;
        }

        toast.error(result.error?.message ?? "An error occurred");
      });
    },
  });

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {(field) => (
            <field.input
              autoComplete="off"
              label="Organization Name"
              placeholder="Enter organization name"
              type="text"
            />
          )}
        </form.AppField>

        <form.AppField name="slug">
          {(field) => (
            <field.input
              autoComplete="off"
              description="URL-friendly string. Only lowercase letters, numbers, and dashes."
              label="Slug"
              placeholder="e.g. my-organization"
              type="text"
            />
          )}
        </form.AppField>

        <form.AppField name="logo">
          {(field) => (
            <field.input
              autoComplete="off"
              description="A valid URL for the organization's logo."
              label="Logo URL (Optional)"
              placeholder="https://..."
              type="url"
            />
          )}
        </form.AppField>

        <form.AppField name="status">
          {(field) => (
            <field.select
              label="Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Pending", value: "pending" },
                { label: "Inactive", value: "inactive" },
                { label: "Banned", value: "banned" },
              ]}
              placeholder="Select a status"
            />
          )}
        </form.AppField>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <LoadingButton
              className="mt-2 w-full"
              disabled={!canSubmit}
              loading={isPending || isSubmitting}
              type="submit"
            >
              {initialData ? "Update Organization" : "Create Organization"}
            </LoadingButton>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
