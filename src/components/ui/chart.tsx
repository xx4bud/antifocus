"use client";

import {
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import {
  type DefaultLegendContentProps,
  type DefaultTooltipContentProps,
  Legend,
  type LegendPayload,
  ResponsiveContainer,
  Tooltip,
  type TooltipPayloadEntry,
  type TooltipValueType,
} from "recharts";
import { cn } from "@/lib/utils/ui";

type TooltipNameType = number | string;

const THEMES = { light: "", dark: ".dark" } as const;

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

export type ChartConfig = Record<
  string,
  {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = createContext<ChartContextProps | null>(null);

function useChart() {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: ComponentProps<"div"> & {
  config: ChartConfig;
  children: ComponentProps<typeof ResponsiveContainer>["children"];
  initialDimension?: {
    width: number;
    height: number;
  };
}) {
  const uniqueId = useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className
        )}
        data-chart={chartId}
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <ResponsiveContainer initialDimension={initialDimension}>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style>
      {Object.entries(THEMES)
        .map(([theme, prefix]) => {
          const variables = colorConfig
            .map(([key, itemConfig]) => {
              const color =
                itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
                itemConfig.color;
              return color ? `  --color-${key}: ${color};` : null;
            })
            .filter(Boolean)
            .join("\n");

          return `${prefix} [data-chart=${id}] {\n${variables}\n}`;
        })
        .join("\n")}
    </style>
  );
};

const ChartTooltip = Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ComponentProps<typeof Tooltip> &
  ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  } & Omit<
    DefaultTooltipContentProps<TooltipValueType, TooltipNameType>,
    "accessibilityLayer"
  >) {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!(active && payload?.length)) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div className="grid gap-1.5">
        {payload
          ?.filter(
            (
              item
            ): item is TooltipPayloadEntry<TooltipValueType, TooltipNameType> =>
              item.type !== "none"
          )
          .map((item, index) => (
            <ChartTooltipRow
              color={color}
              config={config}
              formatter={formatter}
              hideIndicator={hideIndicator}
              index={index}
              indicator={indicator}
              item={item}
              key={
                typeof item.dataKey === "string" ||
                typeof item.dataKey === "number"
                  ? item.dataKey
                  : (item.name ?? index)
              }
              nameKey={nameKey}
              nestLabel={nestLabel}
              tooltipLabel={tooltipLabel}
            />
          ))}
      </div>
    </div>
  );
}

function ChartTooltipRow({
  item,
  index,
  config,
  indicator,
  hideIndicator,
  formatter,
  color,
  nameKey,
  nestLabel,
  tooltipLabel,
}: {
  item: TooltipPayloadEntry<TooltipValueType, TooltipNameType>;
  index: number;
  config: ChartConfig;
  indicator: "line" | "dot" | "dashed";
  hideIndicator: boolean;
  formatter?: (
    value: TooltipValueType,
    name: TooltipNameType,
    item: TooltipPayloadEntry<TooltipValueType, TooltipNameType>,
    index: number,
    payload: TooltipPayloadEntry<TooltipValueType, TooltipNameType>[]
  ) => ReactNode;
  color?: string;
  nameKey?: string;
  nestLabel: boolean;
  tooltipLabel: ReactNode;
}) {
  const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const indicatorColor = color ?? item.payload?.fill ?? item.color;

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center"
      )}
    >
      {formatter && item?.value !== undefined && item.name ? (
        formatter(item.value, item.name, item, index, item.payload)
      ) : (
        <>
          {itemConfig?.icon ? (
            <itemConfig.icon />
          ) : (
            !hideIndicator && (
              <div
                className={cn(
                  "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                  {
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1": indicator === "line",
                    "w-0 border-[1.5px] border-dashed bg-transparent":
                      indicator === "dashed",
                    "my-0.5": nestLabel && indicator === "dashed",
                  }
                )}
                style={
                  {
                    "--color-bg": indicatorColor,
                    "--color-border": indicatorColor,
                  } as CSSProperties
                }
              />
            )
          )}
          <div
            className={cn(
              "flex flex-1 justify-between leading-none",
              nestLabel ? "items-end" : "items-center"
            )}
          >
            <div className="grid gap-1.5">
              {nestLabel ? tooltipLabel : null}
              <span className="text-muted-foreground">
                {itemConfig?.label ?? item.name}
              </span>
            </div>
            {item.value != null && (
              <span className="font-medium font-mono text-foreground tabular-nums">
                {typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : String(item.value)}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const ChartLegend = Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
} & DefaultLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item: LegendPayload, index: number) => (
          <ChartLegendItem
            config={config}
            hideIcon={hideIcon}
            item={item}
            key={
              typeof item.dataKey === "string" ||
              typeof item.dataKey === "number"
                ? item.dataKey
                : index
            }
            nameKey={nameKey}
          />
        ))}
    </div>
  );
}

function ChartLegendItem({
  item,
  config,
  hideIcon,
  nameKey,
}: {
  item: LegendPayload;
  config: ChartConfig;
  hideIcon?: boolean;
  nameKey?: string;
}) {
  const key = `${nameKey ?? item.dataKey ?? "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
      )}
    >
      {itemConfig?.icon && !hideIcon ? (
        <itemConfig.icon />
      ) : (
        <div
          className="h-2 w-2 shrink-0 rounded-[2px]"
          style={{
            backgroundColor: item.color,
          }}
        />
      )}
      {itemConfig?.label}
    </div>
  );
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
