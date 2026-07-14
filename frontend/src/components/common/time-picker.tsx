"use client";

import * as React from "react";
import { Clock, RotateCcw, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SquareSelect } from "@/components/common/square-select";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  time?: string;
  setTime?: (time: string) => void;
  placeholder?: string;
  minuteStep?: number;
  disabled?: boolean;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, index) =>
  index.toString().padStart(2, "0")
);
const HOUR_OPTIONS = HOURS.map((hour) => ({ label: hour, value: hour }));

function buildMinutes(step: number) {
  const safeStep = Number.isFinite(step) && step > 0 && step <= 60 ? step : 5;

  return Array.from({ length: Math.ceil(60 / safeStep) }, (_, index) =>
    Math.min(index * safeStep, 59).toString().padStart(2, "0")
  );
}

function parseTime(value?: string) {
  const [hour = "00", minute = "00"] = value?.split(":") ?? [];

  return {
    hour: hour.padStart(2, "0").slice(0, 2),
    minute: minute.padStart(2, "0").slice(0, 2),
  };
}

function isValidTimeInput(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value.trim());
}

export function TimePicker({
  value,
  onChange,
  time,
  setTime,
  placeholder = "Chọn giờ",
  minuteStep = 5,
  disabled,
  className,
}: TimePickerProps) {
  const selectedTime = value ?? time ?? "";
  const [inputValue, setInputValue] = React.useState<string>();
  const emitChange = onChange ?? setTime;
  const minutes = React.useMemo(() => buildMinutes(minuteStep), [minuteStep]);
  const { hour, minute } = parseTime(selectedTime);
  const minuteOptions = React.useMemo(
    () =>
      minutes.includes(minute)
        ? minutes
        : [...minutes, minute].sort((a, b) => Number(a) - Number(b)),
    [minute, minutes]
  );
  const minuteSelectOptions = React.useMemo(
    () => minuteOptions.map((item) => ({ label: item, value: item })),
    [minuteOptions]
  );
  const displayValue = inputValue ?? selectedTime;

  const commitInputValue = () => {
    if (inputValue === undefined) return;

    if (!inputValue.trim()) {
      emitChange?.("");
      setInputValue(undefined);
      return;
    }

    if (isValidTimeInput(inputValue)) {
      emitChange?.(inputValue.trim());
    }

    setInputValue(undefined);
  };

  const updateTime = (nextHour: string, nextMinute: string) => {
    emitChange?.(`${nextHour}:${nextMinute}`);
    setInputValue(undefined);
  };

  const handleNow = () => {
    const now = new Date();
    updateTime(
      now.getHours().toString().padStart(2, "0"),
      now.getMinutes().toString().padStart(2, "0")
    );
  };

  const handleClear = (event: React.MouseEvent | React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    emitChange?.("");
    setInputValue(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger
        nativeButton={false}
        render={
          <div
            className={cn(
              "flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
              disabled && "pointer-events-none opacity-50",
              className
            )}
          />
        }
      >
        <Clock className="size-4 shrink-0 text-muted-foreground" />
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
        {(selectedTime || inputValue) && (
          <button
            type="button"
            aria-label="Xóa giờ"
            onPointerDown={handleClear}
            onClick={handleClear}
            className="flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 gap-3">
        <div className="flex items-center gap-2">
          <SquareSelect
            label="Chọn giờ"
            value={hour}
            options={HOUR_OPTIONS}
            onChange={(nextHour) => updateTime(nextHour, minute)}
            columns={4}
            pageSize={12}
            className="flex-1"
          />
          <span className="text-muted-foreground">:</span>
          <SquareSelect
            label="Chọn phút"
            value={minute}
            options={minuteSelectOptions}
            onChange={(nextMinute) => updateTime(hour, nextMinute)}
            columns={4}
            pageSize={12}
            className="flex-1"
          />
        </div>
        <div className="flex items-center justify-between border-t pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleNow}>
            <RotateCcw className="size-3.5" />
            Bây giờ
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              emitChange?.("");
              setInputValue(undefined);
            }}
            disabled={!selectedTime}
          >
            <X className="size-3.5" />
            Xóa
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
