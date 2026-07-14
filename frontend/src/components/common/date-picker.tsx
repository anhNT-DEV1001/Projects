"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, RotateCcw, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SquareSelect } from "@/components/common/square-select";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `Thg ${index + 1}`,
  value: index.toString(),
}));

function buildYearOptions(centerYear: number) {
  return Array.from({ length: 101 }, (_, index) => {
    const year = centerYear - 50 + index;

    return {
      label: year.toString(),
      value: year.toString(),
    };
  });
}

function parseDateInput(input: string) {
  const parsedDate = parse(input.trim(), "dd/MM/yyyy", new Date());

  return isValid(parsedDate) ? parsedDate : undefined;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled,
  className,
}: DatePickerProps) {
  const [calendarMonth, setCalendarMonth] = React.useState(value ?? new Date());
  const [inputValue, setInputValue] = React.useState<string>();
  const yearOptions = React.useMemo(
    () => buildYearOptions(calendarMonth.getFullYear()),
    [calendarMonth]
  );
  const displayValue =
    inputValue ?? (value ? format(value, "dd/MM/yyyy", { locale: vi }) : "");

  const commitInputValue = () => {
    if (inputValue === undefined) return;

    if (!inputValue.trim()) {
      onChange(undefined);
      setInputValue(undefined);
      return;
    }

    const parsedDate = parseDateInput(inputValue);
    if (!parsedDate) {
      setInputValue(undefined);
      return;
    }

    parsedDate.setHours(value?.getHours() ?? 0, value?.getMinutes() ?? 0, 0, 0);
    onChange(parsedDate);
    setCalendarMonth(parsedDate);
    setInputValue(undefined);
  };

  const handleToday = () => {
    const today = new Date();
    today.setHours(value?.getHours() ?? 0, value?.getMinutes() ?? 0, 0, 0);
    onChange(today);
    setCalendarMonth(today);
    setInputValue(undefined);
  };

  const handleDateSelect = (selectedDate?: Date) => {
    onChange(selectedDate);
    if (selectedDate) setCalendarMonth(selectedDate);
    setInputValue(undefined);
  };

  const handleMonthChange = (nextMonth: string) => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), Number(nextMonth), 1)
    );
  };

  const handleYearChange = (nextYear: string) => {
    setCalendarMonth(
      new Date(Number(nextYear), calendarMonth.getMonth(), 1)
    );
  };

  const handleClear = (event: React.MouseEvent | React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(undefined);
    setInputValue(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger
        nativeButton={false}
        render={
          <div
            onClick={() => {
              if (value) setCalendarMonth(value);
            }}
            className={cn(
              "flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
              disabled && "pointer-events-none opacity-50",
              className
            )}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={displayValue}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={commitInputValue}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
        {(value || inputValue) && (
          <button
            type="button"
            aria-label="Xóa ngày"
            onPointerDown={handleClear}
            onClick={handleClear}
            className="flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[300px] gap-0 p-0">
        <div className="flex items-center gap-2 border-b p-2">
          <SquareSelect
            label="Chọn tháng"
            value={calendarMonth.getMonth().toString()}
            options={MONTH_OPTIONS}
            onChange={handleMonthChange}
            columns={3}
            pageSize={6}
            className="w-[132px]"
          />
          <SquareSelect
            label="Chọn năm"
            value={calendarMonth.getFullYear().toString()}
            options={yearOptions}
            onChange={handleYearChange}
            columns={3}
            pageSize={12}
            className="w-[132px]"
          />
        </div>
        <Calendar
          mode="single"
          selected={value}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          onSelect={handleDateSelect}
          locale={vi}
          className="w-full p-3 [--cell-size:--spacing(8)]"
        />
        <div className="flex items-center justify-between border-t px-3 py-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleToday}>
            <RotateCcw className="size-3.5" />
            Hôm nay
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(undefined);
              setInputValue(undefined);
            }}
            disabled={!value}
          >
            <X className="size-3.5" />
            Xóa
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
