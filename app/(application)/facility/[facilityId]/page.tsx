import { getFacilityById } from "@/utils/facilityById";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

import facilitiesJSON from "@/data/facilities.json";
import { FacilityData } from "@/Types";
import { cacheLife } from "next/cache";

const facilities = facilitiesJSON as FacilityData[];

type Props = {
  params: Promise<{ facilityId: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  "use cache";
  cacheLife("max");
  const { facilityId } = await props.params;
  const facility = getFacilityById(facilityId);

  return {
    title: [facility?.name, "Dragonwilds Crafting Calculator"]
      .filter((s) => s !== null && s !== undefined)
      .join(" | "),
    description:
      "Calculate the materials needed to craft items in Runescape: Dragonwilds",
  };
}

export function generateStaticParams() {
  return facilities.map((facility) => ({
    facilityId: facility.id,
  }));
}

export default async function FacilityPage(props: Props) {
  "use cache";
  cacheLife("max");
  const { facilityId } = await props.params;

  const facility = getFacilityById(facilityId);

  if (facility === undefined) {
    notFound();
  }

  return (
    <main className="h-full flex flex-col">
      <h1>{facility.name}</h1>
    </main>
  );
}
