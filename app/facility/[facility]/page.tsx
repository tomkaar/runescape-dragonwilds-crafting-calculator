import { redirect } from "next/navigation";

export default async function FacilityPage() {
  // Temporary redirect while the page is under construction
  // See @modal/(.)facility/[facility]/Content.tsx for the modal version
  return redirect("/");
}
