import facilitiesData from "@/data/facilities.json";
import { FacilityData } from "@/Types";
import { cache } from "react";

const facilities = facilitiesData as FacilityData[];

export const getFacilityById = cache(
  (facilityId: string): FacilityData | undefined => {
    return facilities.find(
      (f) => f.id.toLowerCase() === facilityId.toLowerCase(),
    );
  },
);
