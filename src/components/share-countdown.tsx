import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ShareCountdownProps {
  targetDate: Date;
  name: string;
  endMessage: string;
}

export function ShareCountdown({
  targetDate,
  name,
  endMessage,
}: ShareCountdownProps) {
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    try {
      setIsLoading(true);

      // Generate a random share ID
      const shareId = Math.random().toString(36).substr(2, 9);

      // Insert the countdown data into Supabase
      const { error } = await supabase
        .from("countdowns")
        .insert([
          {
            share_id: shareId,
            name,
            target_date: targetDate.toISOString(),
            end_message: endMessage,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Create the share link
      const newShareLink = `${window.location.origin}/shared/${shareId}`;
      setShareLink(newShareLink);
    } catch (error) {
      console.error("Error sharing countdown:", error);
      alert("Failed to create share link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this countdown</DialogTitle>
          <DialogDescription>
            Copy the link below to share this countdown with others.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input value={shareLink} readOnly />
          <Button onClick={handleCopyLink} disabled={isLoading}>
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
