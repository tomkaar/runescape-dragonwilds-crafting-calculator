import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="h-full flex items-center justify-center p-6">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </main>
  );
}
