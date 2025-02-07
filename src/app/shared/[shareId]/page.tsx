"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CountdownPage from "@/app/countdown/page";

export default function SharedCountdownPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSharedCountdown = async () => {
      try {
        const { data, error } = await supabase
          .from("countdowns")
          .select("*")
          .eq("share_id", params.shareId)
          .single();

        if (error) throw error;

        // Store the data in localStorage to be used by the CountdownPage
        localStorage.setItem("countdownTarget", data.target_date);
        localStorage.setItem("countdownName", data.name);
        localStorage.setItem("countdownEndMessage", data.end_message);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading shared countdown:", error);
        alert("Failed to load the shared countdown.");
      }
    };

    loadSharedCountdown();
  }, [params.shareId]);

  if (isLoading) {
    return <div>Loading shared countdown...</div>;
  }

  return <CountdownPage />;
}
