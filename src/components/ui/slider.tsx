"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import { type ComponentProps, useId, useMemo } from "react";
import { cn } from "@/lib/utils/ui";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  const id = useId();
  const thumbKeys = useMemo(() => {
    let values: number[];

    if (Array.isArray(value)) {
      values = value;
    } else if (Array.isArray(defaultValue)) {
      values = defaultValue;
    } else {
      values = [min, max];
    }

    return values.map((_, i) => `${id}-thumb-${i}`);
  }, [value, defaultValue, min, max, id]);

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1.5 data-vertical:h-full data-horizontal:w-full data-vertical:w-1.5"
        data-slot="slider-track"
      >
        <SliderPrimitive.Range
          className="absolute select-none bg-primary data-horizontal:h-full data-vertical:w-full"
          data-slot="slider-range"
        />
      </SliderPrimitive.Track>
      {thumbKeys.map((key) => (
        <SliderPrimitive.Thumb
          className="block size-4 shrink-0 select-none rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:outline-hidden focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
          data-slot="slider-thumb"
          key={key}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
