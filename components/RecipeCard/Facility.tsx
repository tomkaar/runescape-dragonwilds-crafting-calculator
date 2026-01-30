import { type FacilityType } from "@/data/facilityTypes";
import getFacilityIcon from "@/utils/getFacilityIcon";

type Props = {
  facility: FacilityType;
};

export default function Facility(props: Props) {
  const { facility } = props;

  const icon = getFacilityIcon(facility, 24);

  return (
    <div className="flex flex-row gap-2 items-center py-1 px-2 bg-neutral-800 rounded-lg">
      {icon !== null ? <div className="">{icon}</div> : null}
      <span className="">{facility}</span>
    </div>
  );
}
