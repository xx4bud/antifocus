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
  "m-1 ease-in-out delay-150 hover:-translate-y-0 hover:scale-105 duration-300",
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
  onValueChange: (value: { id: string }[]) => void;
  defaultValue: { id: string }[];
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
>(
  (
    {
      categories,
      onValueChange,
      defaultValue = [],
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
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(
        defaultValue.map((item) => item.id)
      );
    const [isPopoverOpen, setIsPopoverOpen] =
      React.useState(false);
    const [isAnimating, setIsAnimating] =
      React.useState(false);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (
        event.key === "Backspace" &&
        !event.currentTarget.value
      ) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(
          newSelectedValues.map((id) => ({ id }))
        );
      }
    };

    const toggleOption = (option: string) => {
      const updatedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(updatedValues);
      onValueChange(updatedValues.map((id) => ({ id })));
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(
        0,
        maxCount
      );
      setSelectedValues(newSelectedValues);
      onValueChange(
        newSelectedValues.map((id) => ({ id }))
      );
    };

    const toggleAll = () => {
      if (selectedValues.length === categories.length) {
        handleClear();
      } else {
        const allValues = categories.map(
          (category) => category.value
        );
        setSelectedValues(allValues);
        onValueChange(allValues.map((id) => ({ id })));
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
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-md border bg-inherit p-1 font-normal shadow-none hover:bg-inherit [&_svg]:pointer-events-auto",
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues
                    .slice(0, maxCount)
                    .map((value) => {
                      const subCategory = categories
                        .flatMap(
                          (cat) => cat.subCategories || []
                        )
                        .find((sub) => sub.value === value);
                      return (
                        <Badge
                          key={value}
                          className={cn(
                            isAnimating
                              ? "animate-bounce"
                              : "",
                            multiSelectVariants({ variant })
                          )}
                          style={{
                            animationDuration: `${animation}s`,
                          }}
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
                      style={{
                        animationDuration: `${animation}s`,
                      }}
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
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          align="start"
          side="top"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          asChild
        >
          <Command className="w-[--radix-popover-trigger-width] p-0">
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {categories.map((category) => (
                  <Accordion
                    key={category.value}
                    type="single"
                    collapsible
                  >
                    <AccordionItem value={category.value}>
                      <AccordionTrigger className="rounded-sm px-1">
                        #{category.label}
                      </AccordionTrigger>

                      {category.subCategories?.map(
                        (subCategory) => (
                          <CommandItem
                            key={subCategory.value}
                            onSelect={() =>
                              toggleOption(
                                subCategory.value
                              )
                            }
                            className="cursor-pointer"
                          >
                            <AccordionContent className="py-0">
                              <div className="flex items-center gap-2 py-2">
                                <Checkbox
                                  checked={selectedValues.includes(
                                    subCategory.value
                                  )}
                                />
                                <span>
                                  {subCategory.label}
                                </span>
                              </div>
                            </AccordionContent>
                          </CommandItem>
                        )
                      )}
                    </AccordionItem>
                  </Accordion>
                ))}
              </CommandGroup>

              <CommandGroup className="pt-0">
                <div className="flex h-8 items-center justify-between gap-1.5">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="h-7 flex-1 cursor-pointer justify-center"
                      >
                        Clear
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex h-7"
                      />
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
      </Popover>
    );
  }
);

SubCategoriesSelect.displayName = "SubCategoriesSelect";
