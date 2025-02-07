"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Countdown } from "@/components/countdown";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownData {
  share_id: string;
  name: string;
  target_date: string;
  end_message: string;
  expires_at: string;
}

export default function SharedCountdownPage() {
  const params = useParams();
  const shareId = params?.shareId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdownData, setCountdownData] = useState<CountdownData | null>(
    null
  );
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const loadSharedCountdown = async () => {
      if (!supabase) {
        setError("Supabase client is not initialized");
        setIsLoading(false);
        return;
      }

      if (!shareId) {
        setError("No share ID provided");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching countdown with share_id:", shareId);

        const { data, error: supabaseError } = await supabase
          .from("countdowns")
          .select("share_id, name, target_date, end_message, expires_at")
          .eq("share_id", shareId)
          .single();

        if (supabaseError) {
          console.error("Supabase error:", supabaseError);
          throw new Error(supabaseError.message);
        }

        if (!data) {
          setError("Countdown not found");
          setIsLoading(false);
          return;
        }

        console.log("Retrieved countdown data:", data);

        // Ensure the data matches our interface
        const typedData: CountdownData = {
          share_id: data.share_id as string,
          name: data.name as string,
          target_date: data.target_date as string,
          end_message: data.end_message as string,
          expires_at: data.expires_at as string,
        };

        // Check if countdown has expired
        if (new Date(typedData.expires_at) < new Date()) {
          setError("This countdown has expired");
          setIsLoading(false);
          return;
        }

        setCountdownData(typedData);
      } catch (err) {
        console.error("Detailed error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load countdown data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedCountdown();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading shared countdown...</div>
      </div>
    );
  }

  if (error || !countdownData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <div className="text-xl text-red-500">
          {error || "Invalid countdown data"}
        </div>
        <Button asChild variant="outline">
          <Link href="/">Create a new countdown</Link>
        </Button>
      </div>
    );
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
              <h1 className="text-4xl font-bold mb-8">
                Countdown to {countdownData.name}
              </h1>
              <div className="w-4/5 h-4/5">
                <Countdown
                  targetDate={new Date(countdownData.target_date)}
                  name={countdownData.name}
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
              <h2 className="text-6xl font-bold mb-8">
                {countdownData.end_message ||
                  `Woohoo! Countdown to ${countdownData.name} has ended!`}
              </h2>
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
