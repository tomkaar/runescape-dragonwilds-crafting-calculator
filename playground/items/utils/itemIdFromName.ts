import { createHash } from "crypto";

export function itemIdFromName(name: string): string {
  return createHash("sha256").update(name).digest("hex").substring(0, 12);
}
