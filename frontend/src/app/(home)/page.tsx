"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays, Clock, CalendarClock } from "lucide-react";

import { DatePicker } from "@/components/common/date-picker";
import { DateTimePicker } from "@/components/common/date-time-picker";
import { TimePicker } from "@/components/common/time-picker";

function formatDate(value?: Date) {
  return value ? format(value, "dd/MM/yyyy") : "Chưa chọn";
}

function formatDateTime(value?: Date) {
  return value ? format(value, "dd/MM/yyyy HH:mm") : "Chưa chọn";
}

export default function Home() {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState("");
  const [dateTime, setDateTime] = React.useState<Date>();

  return (
    <div className="flex w-full flex-col gap-8 text-foreground">
      <header className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground">
          Common components
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Bộ picker ngày giờ
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Demo nhanh cho DatePicker, TimePicker và DateTimePicker trong thư
            mục common.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="size-4 text-muted-foreground" />
            DatePicker
          </div>
          <DatePicker value={date} onChange={setDate} />
          <div className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
            {formatDate(date)}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Clock className="size-4 text-muted-foreground" />
            TimePicker
          </div>
          <TimePicker value={time} onChange={setTime} />
          <div className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
            {time || "Chưa chọn"}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="size-4 text-muted-foreground" />
            DateTimePicker
          </div>
          <DateTimePicker value={dateTime} onChange={setDateTime} />
          <div className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
            {formatDateTime(dateTime)}
          </div>
        </div>
      </section>
    </div>
  );
}
