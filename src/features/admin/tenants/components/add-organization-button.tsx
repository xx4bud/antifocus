"use client";

import { IconPlus } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { FormModal } from "~/features/admin/shared/components/form-modal";
import { OrganizationForm } from "~/features/admin/tenants/components/organization-form";

export function AddOrganizationButton() {
  return (
    <FormModal
      description="Create a new organization for your application."
      title="Add Organization"
      trigger={
        <Button>
          <IconPlus className="mr-2" />
          Add Organization
        </Button>
      }
    >
      {({ onSuccess }) => <OrganizationForm onSuccess={onSuccess} />}
    </FormModal>
  );
}
