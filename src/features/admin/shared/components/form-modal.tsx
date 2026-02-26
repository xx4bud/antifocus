"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface FormModalProps {
  children: (props: { onSuccess: () => void }) => React.ReactNode;
  description?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title: string;
  trigger?: React.ReactNode;
}

export function FormModal({
  title,
  description,
  trigger,
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: FormModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? setControlledOpen : setUncontrolledOpen;

  const handleSuccess = () => {
    setOpen?.(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children({ onSuccess: handleSuccess })}</div>
      </DialogContent>
    </Dialog>
  );
}
