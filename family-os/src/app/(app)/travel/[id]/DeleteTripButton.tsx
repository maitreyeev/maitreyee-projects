"use client";

import { useRouter } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import { deleteTrip } from "../actions";

export default function DeleteTripButton({ tripId }: { tripId: number }) {
  const router = useRouter();

  return (
    <DeleteButton
      onConfirm={async () => {
        await deleteTrip(tripId);
        router.push("/travel");
      }}
      label="Delete trip"
    />
  );
}
