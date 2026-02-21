"use client";

import { IconCheck, IconChevronsDown } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import countries from "~/lib/data/countries.json";
import states from "~/lib/data/states.json";
import { cn } from "~/utils/styles";

interface Timezone {
  abbreviation: string;
  gmtOffset: number;
  gmtOffsetName: string;
  tzName: string;
  zoneName: string;
}

interface CountryProps {
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  emoji: string;
  emojiU: string;
  id: number;
  iso2: string;
  iso3: string;
  latitude: string;
  longitude: string;
  name: string;
  nationality: string;
  native: string;
  numeric_code: string;
  phone_code: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  timezones: Timezone[];
  tld: string;
  translations: Record<string, string>;
}

interface StateProps {
  country_code: string;
  country_id: number;
  country_name: string;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  state_code: string;
  type: string | null;
}

interface LocationSelectorProps {
  disabled?: boolean;
  onCountryChange?: (country: CountryProps | null) => void;
  onStateChange?: (state: StateProps | null) => void;
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
}: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(
    null
  );
  const [selectedState, setSelectedState] = useState<StateProps | null>(null);
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  // Cast imported JSON data to their respective types
  const countriesData = countries as CountryProps[];
  const statesData = states as StateProps[];

  // Filter states for selected country
  const availableStates = statesData.filter(
    (state) => state.country_id === selectedCountry?.id
  );

  const handleCountrySelect = (country: CountryProps | null) => {
    setSelectedCountry(country);
    setSelectedState(null); // Reset state when country changes
    onCountryChange?.(country);
    onStateChange?.(null);
  };

  const handleStateSelect = (state: StateProps | null) => {
    setSelectedState(state);
    onStateChange?.(state);
  };

  return (
    <div className="flex gap-4">
      {/* Country Selector */}
      <Popover onOpenChange={setOpenCountryDropdown} open={openCountryDropdown}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={openCountryDropdown}
            className="w-full justify-between"
            disabled={disabled}
            role="combobox"
            variant="outline"
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <span>{selectedCountry.emoji}</span>
                <span>{selectedCountry.name}</span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
            <IconChevronsDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {countriesData.map((country) => (
                    <CommandItem
                      className="flex cursor-pointer items-center justify-between text-sm"
                      key={country.id}
                      onSelect={() => {
                        handleCountrySelect(country);
                        setOpenCountryDropdown(false);
                      }}
                      value={country.name}
                    >
                      <div className="flex items-center gap-2">
                        <span>{country.emoji}</span>
                        <span>{country.name}</span>
                      </div>
                      <IconCheck
                        className={cn(
                          "h-4 w-4",
                          selectedCountry?.id === country.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* State Selector - Only shown if selected country has states */}
      {availableStates.length > 0 && (
        <Popover onOpenChange={setOpenStateDropdown} open={openStateDropdown}>
          <PopoverTrigger asChild>
            <Button
              aria-expanded={openStateDropdown}
              className="w-full justify-between"
              disabled={!selectedCountry}
              role="combobox"
              variant="outline"
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : (
                <span>Select State...</span>
              )}
              <IconChevronsDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search state..." />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {availableStates.map((state) => (
                      <CommandItem
                        className="flex cursor-pointer items-center justify-between text-sm"
                        key={state.id}
                        onSelect={() => {
                          handleStateSelect(state);
                          setOpenStateDropdown(false);
                        }}
                        value={state.name}
                      >
                        <span>{state.name}</span>
                        <IconCheck
                          className={cn(
                            "h-4 w-4",
                            selectedState?.id === state.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LocationSelector;
