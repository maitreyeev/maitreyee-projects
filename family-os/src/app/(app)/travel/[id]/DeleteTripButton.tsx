"use client";

import { useRouter } from "next/navigation";
import SoftDeleteButton from "@/components/SoftDeleteButton";
import { deleteTrip } from "../actions";

export default function DeleteTripButton({ tripId }: { tripId: number }) {
  const router = useRouter();

  return (
    <SoftDeleteButton
      onConfirm={async () => {
        await deleteTrip(tripId);
        router.push("/travel");
      }}
      label="Delete trip"
    />
  );
}
