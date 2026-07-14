"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SquareSelectOption {
  label: string;
  value: string;
}

interface SquareSelectProps {
  value: string;
  options: SquareSelectOption[];
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
  pageSize?: number;
  className?: string;
  contentClassName?: string;
}

const GRID_COLUMNS: Record<NonNullable<SquareSelectProps["columns"]>, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export function SquareSelect({
  value,
  options,
  onChange,
  label,
  placeholder = "Chọn",
  columns = 3,
  pageSize = 12,
  className,
  contentClassName,
}: SquareSelectProps) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selectedPage = Math.floor(selectedIndex / pageSize);
  const [page, setPage] = React.useState(selectedPage);
  const [open, setOpen] = React.useState(false);
  const pageCount = Math.max(1, Math.ceil(options.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visibleOptions = options.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize
  );
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setPage(selectedPage);
  };

  const handleChange = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("h-8 justify-between gap-2 px-2.5", className)}
          />
        }
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-64 gap-2 p-2", contentClassName)}
      >
        <div className="flex h-7 items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={safePage === 0}
            aria-label="Trang trước"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <div className="min-w-0 text-center">
            {label && (
              <div className="truncate text-xs font-medium text-muted-foreground">
                {label}
              </div>
            )}
            {pageCount > 1 && (
              <div className="text-[11px] text-muted-foreground">
                {safePage + 1}/{pageCount}
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() =>
              setPage((current) => Math.min(pageCount - 1, current + 1))
            }
            disabled={safePage >= pageCount - 1}
            aria-label="Trang sau"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>

        <div className={cn("grid gap-1", GRID_COLUMNS[columns])}>
          {visibleOptions.map((option) => {
            const selected = option.value === value;

            return (
              <Button
                key={option.value}
                type="button"
                variant={selected ? "default" : "ghost"}
                size="sm"
                className="relative h-9 px-1 text-xs tabular-nums"
                onClick={() => handleChange(option.value)}
              >
                {option.label}
                {selected && (
                  <Check className="absolute right-1 top-1 size-3 opacity-80" />
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
