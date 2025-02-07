"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function padNumber(num: number): string {
  return num.toString().padStart(2, "0");
}

export function Countdown({
  targetDate,
  onEnd,
}: {
  targetDate: Date;
  name: string;
  onEnd: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(intervalId);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onEnd();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, onEnd]);

  return (
    <motion.div
      className="grid grid-cols-4 gap-4 text-center h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-secondary p-4 rounded-lg flex flex-col justify-center items-center h-full">
      <div className="text-7xl font-bold mb-2">{padNumber(value)}</div>
      <div className="text-xl text-muted-foreground">{label}</div>
    </div>
  );
}
