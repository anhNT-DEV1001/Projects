"use client";

import * as React from "react";
import { format, isValid, parse, setHours, setMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SquareSelect } from "@/components/common/square-select";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  minuteStep?: number;
  disabled?: boolean;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, index) =>
  index.toString().padStart(2, "0")
);
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

function buildMinutes(step: number) {
  const safeStep = Number.isFinite(step) && step > 0 && step <= 60 ? step : 5;

  return Array.from({ length: Math.ceil(60 / safeStep) }, (_, index) =>
    Math.min(index * safeStep, 59).toString().padStart(2, "0")
  );
}

function withTime(date: Date, hour: string, minute: string) {
  return setMinutes(setHours(date, Number(hour)), Number(minute));
}

function parseDateTimeInput(input: string) {
  const parsedDate = parse(input.trim(), "dd/MM/yyyy HH:mm", new Date());

  return isValid(parsedDate) ? parsedDate : undefined;
}

type TimeField = "hour" | "minute";

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Chọn ngày & giờ",
  minuteStep = 5,
  disabled,
  className,
}: DateTimePickerProps) {
  const [calendarMonth, setCalendarMonth] = React.useState(value ?? new Date());
  const [inputValue, setInputValue] = React.useState<string>();
  const [activeTimeField, setActiveTimeField] =
    React.useState<TimeField>("hour");
  const [timePage, setTimePage] = React.useState(0);
  const currentHour = (value?.getHours() ?? 0).toString().padStart(2, "0");
  const currentMinute = (value?.getMinutes() ?? 0).toString().padStart(2, "0");
  const minutes = React.useMemo(() => buildMinutes(minuteStep), [minuteStep]);
  const minuteOptions = React.useMemo(
    () =>
      minutes.includes(currentMinute)
        ? minutes
        : [...minutes, currentMinute].sort((a, b) => Number(a) - Number(b)),
    [currentMinute, minutes]
  );
  const yearOptions = React.useMemo(
    () => buildYearOptions(calendarMonth.getFullYear()),
    [calendarMonth]
  );
  const activeTimeOptions =
    activeTimeField === "hour" ? HOURS : minuteOptions;
  const activeTimeValue =
    activeTimeField === "hour" ? currentHour : currentMinute;
  const timePageSize = 12;
  const timePageCount = Math.max(
    1,
    Math.ceil(activeTimeOptions.length / timePageSize)
  );
  const safeTimePage = Math.min(timePage, timePageCount - 1);
  const visibleTimeOptions = activeTimeOptions.slice(
    safeTimePage * timePageSize,
    safeTimePage * timePageSize + timePageSize
  );
  const displayValue =
    inputValue ??
    (value ? format(value, "dd/MM/yyyy HH:mm", { locale: vi }) : "");

  const commitInputValue = () => {
    if (inputValue === undefined) return;

    if (!inputValue.trim()) {
      onChange(undefined);
      setInputValue(undefined);
      return;
    }

    const parsedDate = parseDateTimeInput(inputValue);
    if (!parsedDate) {
      setInputValue(undefined);
      return;
    }

    onChange(parsedDate);
    setCalendarMonth(parsedDate);
    setInputValue(undefined);
  };

  const handleDateSelect = (selectedDate?: Date) => {
    if (!selectedDate) {
      onChange(undefined);
      return;
    }

    setCalendarMonth(selectedDate);
    onChange(withTime(selectedDate, currentHour, currentMinute));
    setInputValue(undefined);
  };

  const handleTimeChange = (type: "hour" | "minute", nextValue: string) => {
    const baseDate = value ?? new Date();
    const nextHour = type === "hour" ? nextValue : currentHour;
    const nextMinute = type === "minute" ? nextValue : currentMinute;

    onChange(withTime(baseDate, nextHour, nextMinute));
    setInputValue(undefined);
  };

  const openTimeField = (field: TimeField) => {
    const options = field === "hour" ? HOURS : minuteOptions;
    const selectedValue = field === "hour" ? currentHour : currentMinute;
    const selectedIndex = Math.max(0, options.indexOf(selectedValue));

    setActiveTimeField(field);
    setTimePage(Math.floor(selectedIndex / timePageSize));
  };

  const handleNow = () => {
    const now = new Date();
    onChange(now);
    setCalendarMonth(now);
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
        <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
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
            aria-label="Xóa ngày giờ"
            onPointerDown={handleClear}
            onClick={handleClear}
            className="flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto gap-0 p-0 md:flex-row md:items-stretch"
      >
        <div>
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
        </div>
        <div className="flex w-52 flex-col justify-between border-t bg-muted/25 p-3 md:border-l md:border-t-0">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Thời gian
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={activeTimeField === "hour" ? "secondary" : "outline"}
                className="h-9 flex-1 justify-between px-2.5 tabular-nums"
                onClick={() => openTimeField("hour")}
              >
                {currentHour}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
              <span className="text-muted-foreground">:</span>
              <Button
                type="button"
                variant={activeTimeField === "minute" ? "secondary" : "outline"}
                className="h-9 flex-1 justify-between px-2.5 tabular-nums"
                onClick={() => openTimeField("minute")}
              >
                {currentMinute}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </div>
            <div className="rounded-lg border bg-background p-2">
              <div className="mb-2 flex h-7 items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    setTimePage((current) => Math.max(0, current - 1))
                  }
                  disabled={safeTimePage === 0}
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <div className="text-xs font-medium text-muted-foreground">
                  {activeTimeField === "hour" ? "Chọn giờ" : "Chọn phút"}
                  {timePageCount > 1 && (
                    <span className="ml-1 font-normal">
                      {safeTimePage + 1}/{timePageCount}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    setTimePage((current) =>
                      Math.min(timePageCount - 1, current + 1)
                    )
                  }
                  disabled={safeTimePage >= timePageCount - 1}
                  aria-label="Trang sau"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {visibleTimeOptions.map((option) => {
                  const selected = option === activeTimeValue;

                  return (
                    <Button
                      key={option}
                      type="button"
                      variant={selected ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-0 tabular-nums"
                      onClick={() => handleTimeChange(activeTimeField, option)}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleNow}>
              <RotateCcw className="size-3.5" />
              Bây giờ
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
