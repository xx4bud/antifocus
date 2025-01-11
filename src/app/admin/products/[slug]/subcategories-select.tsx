import * as React from "react";
import {
  cva,
  type VariantProps,
} from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  WandSparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const multiSelectVariants = cva(
  "m-1 shadow-none ease-in-out delay-150 hover:-translate-y-0 hover:scale-105 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SubCategoriesSelectProps
  extends VariantProps<typeof multiSelectVariants> {
  categories: {
    label: string;
    value: string;
    subCategories?: { label: string; value: string }[];
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  value: { id: string }[]; // Sesuai FormField
  onChange: (value: { id: string }[]) => void; // Sesuai FormField
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const SubCategoriesSelect = React.forwardRef<
  HTMLButtonElement,
  SubCategoriesSelectProps
>((
  {
    categories,
    onChange,
    value = [], // Default value is an empty array for synchronization
    variant,
    placeholder = "Select options",
    animation = 0,
    maxCount = 3,
    modalPopover = false,
    asChild = false,
    className,
    ...props
  },
  ref
) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    value.map((item) => item.id)
  );
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const toggleOption = (option: string) => {
    const updatedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    setSelectedValues(updatedValues);
    onChange(updatedValues.map((id) => ({ id }))); // Make sure data is in { id: string }[] format
  };

  const handleClear = () => {
    setSelectedValues([]);
    onChange([]); // Clear the selected values
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          onClick={() => setIsPopoverOpen((prev) => !prev)}
          className={cn("flex h-9 w-full items-center justify-between rounded-md border bg-inherit p-1", className)}
        >
          {selectedValues.length > 0 ? (
            <div className="flex flex-wrap">
              {selectedValues.slice(0, maxCount).map((value) => {
                const subCategory = categories
                  .flatMap((cat) => cat.subCategories || [])
                  .find((sub) => sub.value === value);
                return (
                  <Badge key={value} className={multiSelectVariants({ variant })}>
                    {subCategory?.label}
                    <XCircle
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(value);
                      }}
                    />
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <Accordion key={category.value} type="single" collapsible>
                  <AccordionItem value={category.value}>
                    <AccordionTrigger>{category.label}</AccordionTrigger>
                    {category.subCategories?.map((subCategory) => (
                      <AccordionContent key={subCategory.value}>
                        <Checkbox
                          checked={selectedValues.includes(subCategory.value)}
                          onCheckedChange={() => toggleOption(subCategory.value)}
                        />
                        {subCategory.label}
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                </Accordion>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

SubCategoriesSelect.displayName = "SubCategoriesSelect";
