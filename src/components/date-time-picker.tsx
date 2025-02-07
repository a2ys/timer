"use client";

import * as React from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export function DateTimePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );

  React.useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate, setDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      newDate.setHours(selectedDate?.getHours() || 0);
      newDate.setMinutes(selectedDate?.getMinutes() || 0);
      setSelectedDate(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(selectedDate || date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setSelectedDate(newDate);
  };

  return (
    <div className="flex flex-col space-y-2">
      <Input
        type="date"
        value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
        onChange={handleDateChange}
      />
      <Input
        type="time"
        value={selectedDate ? format(selectedDate, "HH:mm") : ""}
        onChange={handleTimeChange}
      />
    </div>
  );
}
