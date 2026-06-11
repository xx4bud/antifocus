"use client";

import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
import { type ComponentProps, createContext, useContext } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/ui";
import { Button } from "./button";

interface ComboboxContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setValue?: (value: string | string[]) => void;
  value?: string | string[];
}

const ComboboxContext = createContext<ComboboxContextProps | null>(null);

function useCombobox() {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error("useCombobox must be used within a <Combobox />");
  }
  return context;
}

function Combobox({
  children,
  open,
  onOpenChange,
  value,
  onValueChange,
  ...props
}: ComponentProps<typeof Popover> & {
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}) {
  return (
    <ComboboxContext.Provider
      value={{
        open: open ?? false,
        setOpen:
          onOpenChange ??
          ((_open: boolean) => {
            // No-op
          }),
        value,
        setValue: onValueChange,
      }}
    >
      <Popover onOpenChange={onOpenChange} open={open} {...props}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof PopoverTrigger>) {
  return (
    <PopoverTrigger
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>span]:line-clamp-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="combobox-trigger"
      {...props}
    >
      {children}
      <IconChevronDown className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
    </PopoverTrigger>
  );
}

function ComboboxValue({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const { value } = useCombobox();

  return (
    <span
      className={cn(
        "flex-1 text-start",
        !value && "text-muted-foreground",
        className
      )}
    >
      {value || placeholder}
    </span>
  );
}

function ComboboxContent({
  className,
  children,
  align = "start",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      align={align}
      className={cn("w-(--radix-popover-trigger-width) p-0", className)}
      data-slot="combobox-content"
      sideOffset={sideOffset}
      {...props}
    >
      <Command className="size-full">{children}</Command>
    </PopoverContent>
  );
}

function ComboboxInput(props: ComponentProps<typeof CommandInput>) {
  return <CommandInput {...props} />;
}

function ComboboxList(props: ComponentProps<typeof CommandList>) {
  return <CommandList {...props} />;
}

function ComboboxEmpty(props: ComponentProps<typeof CommandEmpty>) {
  return <CommandEmpty {...props} />;
}

function ComboboxGroup(props: ComponentProps<typeof CommandGroup>) {
  return <CommandGroup {...props} />;
}

function ComboboxItem({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof CommandItem> & { checked?: boolean }) {
  return (
    <CommandItem
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden data-disabled:pointer-events-none data-selected:bg-accent data-selected:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="combobox-item"
      {...props}
    >
      {children}
      {checked && (
        <span className="pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center">
          <IconCheck className="pointer-events-none" />
        </span>
      )}
    </CommandItem>
  );
}

function ComboboxSeparator(props: ComponentProps<typeof CommandSeparator>) {
  return <CommandSeparator {...props} />;
}

function ComboboxClear({ className, ...props }: ComponentProps<typeof Button>) {
  const { setValue } = useCombobox();
  return (
    <Button
      className={cn("h-4 w-4", className)}
      onClick={(e) => {
        e.stopPropagation();
        setValue?.("");
      }}
      size="icon-xs"
      variant="ghost"
      {...props}
    >
      <IconX className="size-3" />
    </Button>
  );
}

function ComboboxChips({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      data-slot="combobox-chips"
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  onRemove,
  ...props
}: ComponentProps<"div"> & {
  onRemove?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex h-5 w-fit items-center justify-center gap-1 whitespace-nowrap rounded-sm bg-muted px-1.5 font-medium text-foreground text-xs",
        className
      )}
      data-slot="combobox-chip"
      {...props}
    >
      {children}
      {onRemove && (
        <Button
          className="-me-1 h-4 w-4"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          size="icon-xs"
          variant="ghost"
        >
          <IconX className="size-3" />
        </Button>
      )}
    </div>
  );
}

function ComboboxChipsInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn("min-w-16 flex-1 bg-transparent outline-none", className)}
      data-slot="combobox-chip-input"
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  PopoverAnchor as ComboboxAnchor,
};
