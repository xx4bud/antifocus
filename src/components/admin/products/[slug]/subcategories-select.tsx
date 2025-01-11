import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
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

/**
 * Variants for the multi-select component to handle different styles.
 */
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

/**
 * Props for MultiSelect component
 */
interface SubCategoriesSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  categories: {
    label: string;
    value: string;
    subCategories?: { label: string; value: string }[];
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
}

export const SubCategoriesSelect = React.forwardRef<
  HTMLButtonElement,
  SubCategoriesSelectProps
>(
  (
    {
      categories,
      onValueChange,
      variant,
      defaultValue = [],
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
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    // Handle keyboard interactions (Backspace to remove, Enter to open popover)
    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    // Toggle selection for individual options
    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    // Clear all selections
    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    // Handle popover toggle (open/close)
    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    // Clear extra selected items beyond the max count
    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    // Select all categories
    const toggleAll = () => {
      if (selectedValues.length === categories.length) {
        handleClear();
      } else {
        const allValues = categories.map((category) => category.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            role="combobox"
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-md border bg-inherit p-1 shadow-none hover:bg-inherit [&_svg]:pointer-events-auto",
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues
                    .slice(0, maxCount)
                    .map((value) => {
                      const category = categories.find(
                        (category) =>
                          category.subCategories?.some(
                            (subCategory) =>
                              subCategory.value === value
                          )
                      );
                      const subCategory =
                        category?.subCategories?.find(
                          (subCategory) =>
                            subCategory.value === value
                        );

                      return (
                        <Badge
                          key={value}
                          className={cn(
                            isAnimating ? "animate-bounce" : "",
                            multiSelectVariants({ variant })
                          )}
                          style={{ animationDuration: `${animation}s` }}
                        >
                          {subCategory?.label}
                          <XCircle
                            className="ml-2 h-4 w-4 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleOption(value);
                            }}
                          />
                        </Badge>
                      );
                    })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        "border-foreground/1 bg-transparent text-foreground hover:bg-transparent",
                        isAnimating ? "animate-bounce" : "",
                        multiSelectVariants({ variant })
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues.length - maxCount} more`}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="mx-2 h-4 cursor-pointer text-muted-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator orientation="vertical" className="flex h-full min-h-6" />
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm font-normal text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
          side="top"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          asChild
        >
          <Command>
            <CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <Accordion key={category.value} type="single" collapsible asChild>
                    <AccordionItem value={category.value} className="data-[state=closed]:border-none">
                      <AccordionTrigger className="my-0 overflow-visible pl-1.5 pr-1 data-[state=open]:border-b">
                        #{category.label}
                      </AccordionTrigger>
                      {category.subCategories?.map((subCategory) => {
                        const isSubCategorySelected = selectedValues.includes(subCategory.value);
                        return (
                          <CommandItem
                            key={subCategory.value}
                            onSelect={() => toggleOption(subCategory.value)}
                            className="my-1 cursor-pointer p-1"
                            asChild
                          >
                            <AccordionContent>
                              <Checkbox checked={isSubCategorySelected} />
                              {subCategory.label}
                            </AccordionContent>
                          </CommandItem>
                        );
                      })}
                    </AccordionItem>
                  </Accordion>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex h-auto items-center justify-between gap-1.5">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem onSelect={handleClear} className="h-8 flex-1 cursor-pointer justify-center">
                        Clear
                      </CommandItem>
                      <Separator orientation="vertical" className="h-full flex min-h-6 w-px" />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="h-7 max-w-full flex-1 cursor-pointer justify-center"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn("my-2 h-3 w-3 cursor-pointer bg-background text-foreground", isAnimating ? "" : "text-muted-foreground")}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    );
  }
);

SubCategoriesSelect.displayName = "SubCategoriesSelect";