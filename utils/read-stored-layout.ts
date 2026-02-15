import { type Layout } from "react-resizable-panels";

export function readStoredLayout(id: string): Layout | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const stored = localStorage.getItem(`react-resizable-panels:${id}`);
  if (!stored) {
    return undefined;
  }

  try {
    return JSON.parse(stored) as Layout;
  } catch {
    return undefined;
  }
}
