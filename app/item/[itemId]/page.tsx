import { redirect } from "next/navigation";

export default async function ItemPage() {
  // Temporary redirect while the page is under construction
  // See @modal/(.)item/[item-id]/Content.tsx for the modal version
  return redirect("/");
}
