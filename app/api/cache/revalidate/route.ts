import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateTag("lastSynced", "days");
  console.info("Cache revalidated for tag 'lastSynced' with profile 'days'");
  return NextResponse.json({ revalidated: true });
}
