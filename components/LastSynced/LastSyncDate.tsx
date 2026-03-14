import { lastSynced } from "@/utils/lastSynced";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

type Props = {
  format: "short" | "long";
};

const formatShort = Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const formatLong = Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const LastSyncedDate = cache(async function LastSyncDate(props: Props) {
  "use cache";
  cacheLife("days");
  cacheTag("lastSynced");
  const updatedAt = await lastSynced();
  if (!updatedAt) {
    return "Unknown";
  }

  const formatted =
    props.format === "short"
      ? formatShort.format(new Date(updatedAt))
      : formatLong.format(new Date(updatedAt));
  return formatted;
});

export default LastSyncedDate;
