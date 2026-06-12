import { IconCheck, IconSelector } from "@tabler/icons-react";
import {
  type ComponentRef,
  type InputHTMLAttributes,
  type RefObject,
  useCallback,
} from "react";
import RPNInput, {
  type Country,
  type FlagProps,
  getCountryCallingCode,
  type Props as RPNInputProps,
  type Value,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input, type InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils/ui";
import { ScrollArea } from "./scroll-area";

type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInputProps<typeof RPNInput>, "onChange"> & {
    onChange?: (value: Value) => void;
  };

const PhoneInput = ({
  className,
  onChange,
  ref,
  ...props
}: PhoneInputProps & {
  ref?: RefObject<ComponentRef<typeof RPNInput> | null>;
}) => {
  return (
    <RPNInput
      className={cn("flex", className)}
      countrySelectComponent={CountrySelect}
      flagComponent={FlagComponent}
      inputComponent={InputComponent}
      /**
       * Handles the onChange event.
       *
       * react-phone-number-input might trigger the onChange event as undefined
       * when a valid phone number is not entered. To prevent this,
       * the value is coerced to an empty string.
       *
       * @param {Value | undefined} value - The entered value
       */
      onChange={(value) => {
        if (value) {
          onChange?.(value);
        }
      }}
      ref={ref}
      smartCaret={false}
      {...props}
    />
  );
};
PhoneInput.displayName = "PhoneInput";

const InputComponent = ({
  className,
  ref,
  ...props
}: InputProps & { ref?: RefObject<HTMLInputElement | null> }) => (
  <Input
    className={cn("rounded-s-none rounded-e-lg", className)}
    {...props}
    ref={ref}
  />
);
InputComponent.displayName = "InputComponent";

interface CountrySelectOption {
  label: string;
  value: Country;
}

interface CountrySelectProps {
  disabled?: boolean;
  onChange: (value: Country) => void;
  options: CountrySelectOption[];
  value: Country;
}

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = useCallback(
    (country: Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex gap-1 rounded-s-lg rounded-e-none border-r-0 px-3 focus:z-10"
          disabled={disabled}
          type="button"
          variant={"outline"}
        >
          <FlagComponent country={value} countryName={value} />
          <IconSelector
            className={cn(
              "-mr-2 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">
                          {`+${getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <IconCheck
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
