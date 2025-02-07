"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ShareCountdown } from "@/components/share-countdown";
import { motion, AnimatePresence } from "framer-motion";

export default function CountdownPage() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [name, setName] = useState<string>("");
  const [endMessage, setEndMessage] = useState<string>("");
  const [isEnded, setIsEnded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedDate = localStorage.getItem("countdownTarget");
    const storedName = localStorage.getItem("countdownName");
    const storedEndMessage = localStorage.getItem("countdownEndMessage");

    if (storedDate && storedName) {
      setTargetDate(new Date(storedDate));
      setName(storedName);
      setEndMessage(
        storedEndMessage || `Woohoo! Countdown to ${storedName} has ended!`
      );
    } else {
      router.push("/");
    }
  }, [router]);

  if (!targetDate || !name) {
    return <div>Loading...</div>;
  }

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
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/">Create your own timer</Link>
          </Button>
          <ShareCountdown
            targetDate={targetDate}
            name={name}
            endMessage={endMessage}
          />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-24">
        <AnimatePresence>
          {!isEnded ? (
            <motion.div
              key="countdown"
              className="w-full h-full flex flex-col items-center justify-center"
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <h1 className="text-4xl font-bold mb-8">Countdown to {name}</h1>
              <div className="w-4/5 h-4/5">
                <Countdown
                  targetDate={targetDate}
                  name={name}
                  onEnd={() => setIsEnded(true)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="endMessage"
              className="text-center"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
            >
              <h2 className="text-6xl font-bold mb-8">{endMessage}</h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 500,
                  damping: 10,
                }}
              >
                🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
