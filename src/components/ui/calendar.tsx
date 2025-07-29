import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ptBR } from "date-fns/locale" // Adicione esta linha
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn("p-6 w-full h-[360px]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4 h-full",
        month: "flex flex-col gap-6 w-full h-full",
        caption: "flex justify-between items-center relative w-full h-12 mb-2 px-12",
        caption_label: "text-xl font-bold text-gray-800 text-center flex-1",
        nav: "flex items-center justify-between w-full absolute inset-0",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-9 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100"
        ),
        nav_button_previous: "relative left-0",
        nav_button_next: "relative right-0",
        table: "w-full border-collapse space-x-1 flex flex-col h-full",
        head_row: "flex w-full h-10",
        head_cell:
          "text-muted-foreground rounded-md flex-1 font-medium text-sm h-full flex items-center justify-center",
        row: "flex w-full flex-1",
        cell: cn(
          "relative p-0 text-center flex-1 h-full focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-full h-full p-0 font-medium text-sm aria-selected:opacity-100 min-h-[40px]"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
