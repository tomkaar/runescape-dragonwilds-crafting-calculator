"use client";

import { useModal } from "@/components/Modal";
import { X } from "lucide-react";

export default function Content({ facility }: { facility: string }) {
  const { dismiss } = useModal();

  return (
    <>
      <div className="flex flex-row justify-between bg-neutral-800 w-full px-8 py-4">
        <h2 className="text-2xl font-bold first-letter:uppercase text-white">
          {facility}
        </h2>
        <button onClick={dismiss} className="text-white">
          <X />
        </button>
      </div>

      <div>Facility popup: {facility}</div>
    </>
  );
}
