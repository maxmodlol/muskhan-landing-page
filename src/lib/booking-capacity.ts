import type { SupabaseClient } from "@supabase/supabase-js";

/** Default total event capacity if DB + env are unavailable. */
export const DEFAULT_EVENT_MAX_GUESTS = 50;

/** Max guests per single reservation (UI / party size). */
export const MAX_PARTY_GUESTS = 9;

const ABSOLUTE_MAX_CAPACITY = 10_000;

function capacityFromEnv(): number {
  const n = parseInt(process.env.EVENT_MAX_GUESTS ?? "", 10);
  if (Number.isFinite(n) && n >= 1 && n <= ABSOLUTE_MAX_CAPACITY) return n;
  return DEFAULT_EVENT_MAX_GUESTS;
}

/**
 * Reads `event_settings.max_guests` (singleton row `id = 1`).
 * Falls back to `EVENT_MAX_GUESTS` env, then {@link DEFAULT_EVENT_MAX_GUESTS}.
 */
export async function getEventMaxGuests(
  supabase: SupabaseClient,
): Promise<number> {
  const { data, error } = await supabase
    .from("event_settings")
    .select("max_guests")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.warn("[booking-capacity] event_settings read failed:", error.message);
    return capacityFromEnv();
  }

  const raw = data?.max_guests;
  const n = Number(raw);
  if (Number.isFinite(n) && n >= 1 && n <= ABSOLUTE_MAX_CAPACITY) {
    return Math.floor(n);
  }

  return capacityFromEnv();
}

export type CapacitySnapshot = {
  totalCapacity: number;
  bookedSeats: number;
  remaining: number;
  isFull: boolean;
};

/**
 * Sums `guest_count` across reservations and compares to configured event max.
 */
export async function getCapacitySnapshot(
  supabase: SupabaseClient,
): Promise<CapacitySnapshot> {
  const totalCapacity = await getEventMaxGuests(supabase);

  const { data, error } = await supabase.from("reservations").select("guest_count");

  if (error) throw error;

  const bookedSeats = (data ?? []).reduce((sum, row) => {
    const n = Number((row as { guest_count: unknown }).guest_count);
    return sum + (Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);
  }, 0);

  const remaining = Math.max(0, totalCapacity - bookedSeats);

  return {
    totalCapacity,
    bookedSeats,
    remaining,
    isFull: remaining <= 0,
  };
}
