"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState("");
  const [endMessage, setEndMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date.getTime() <= Date.now()) {
      toast({
        title: "Great Scott!",
        description:
          "You can't set a countdown to the past! Are you trying to cause a temporal paradox?",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("countdownTarget", date.toISOString());
    localStorage.setItem("countdownName", name);
    localStorage.setItem(
      "countdownEndMessage",
      endMessage || `Woohoo! Countdown to ${name} has ended!`
    );
    router.push("/countdown");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b flex justify-between items-center">
        <div className="text-xl font-bold">
          <span className="group inline-block">
            <Link
              href="https://a2ys.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              a2ys
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"></span>
            </Link>
          </span>
          <span className="text-muted-foreground"> / Timer</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Countdown Timer</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Countdown Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your countdown"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="datetime">Target Date and Time</Label>
            <DateTimePicker date={date} setDate={setDate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endMessage">Custom End Message (optional)</Label>
            <Input
              id="endMessage"
              value={endMessage}
              onChange={(e) => setEndMessage(e.target.value)}
              placeholder="Enter a custom message for when the countdown ends"
            />
          </div>
          <Button type="submit" className="w-full">
            Start Countdown
          </Button>
        </form>
      </main>

      <footer className="p-4 border-t text-center">
        Made with ❤️ by{" "}
        <span className="font-bold group inline-block">
          <Link
            href="https://a2ys.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            a2ys
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"></span>
          </Link>
        </span>
      </footer>
    </div>
  );
}
