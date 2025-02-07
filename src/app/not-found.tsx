import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">
        Great Scott! We've hit a temporal anomaly!
      </h2>
      <p className="text-xl mb-8">
        It seems you've stumbled into a time vortex. This page doesn't exist...
        yet.
      </p>
      <Button asChild>
        <Link href="/">Travel back to the present</Link>
      </Button>
    </div>
  );
}
