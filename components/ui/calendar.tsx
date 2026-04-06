"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CaptionMinimal({ displayMonth }: { displayMonth: Date }) {
  const monthNum = format(displayMonth, "MM")
  const monthName = format(displayMonth, "LLLL").toUpperCase()
  const year = format(displayMonth, "yyyy")
  return (
    <div className="flex items-center justify-between px-2 py-3 border-b border-gray-300">
      <div className="text-3xl font-semibold text-gray-700 tracking-wide">{monthNum}</div>
      <div className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-widest">{monthName}</div>
      <div className="text-3xl font-semibold text-gray-700 tracking-wide">{year}</div>
    </div>
  )
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 bg-white rounded-xl border border-gray-300 overflow-hidden", className)}
      classNames={{
        months: "flex flex-col",
        month: "",
        caption: "m-0",
        caption_label: "hidden",
        nav: "hidden",
        table: "w-[320px] table-fixed border-collapse mx-auto",
        head_row: "",
        head_cell: "py-2 text-gray-500 font-semibold uppercase tracking-wider text-center",
        row: "",
        cell: "h-10 text-center align-middle border border-gray-200",
        day: "w-full h-full flex items-center justify-center text-sm md:text-base",
        day_selected: "bg-gray-900 text-white",
        day_today: "ring-2 ring-gray-700",
        day_outside: "text-gray-400",
        day_disabled: "opacity-40",
        ...classNames,
      }}
      components={{ Caption: CaptionMinimal }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
