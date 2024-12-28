import React from "react"
import { Button } from "./button"
import { Plus } from "lucide-react"

interface HeadingProps {
  title?: string
  amount?: number
  description?: string
  button?: React.ReactNode
}

export function Heading({
  title,
  amount,
  description,
  button,
}: HeadingProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-bold">
          {title}{" "}
          <span>
            {amount !== 0 &&
              amount !== undefined &&
              `(${amount})`}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex items-center">{button}</div>
    </div>
  )
}
