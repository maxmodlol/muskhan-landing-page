import { NextResponse } from "next/server";
import { getCapacitySnapshot } from "@/lib/booking-capacity";
import { createServerSupabaseAdmin } from "@/lib/supabase-admin";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false as const,
        error: "خدمة الحجز غير مفعّلة حالياً.",
      },
      { status: 503 },
    );
  }

  try {
    const supabase = createServerSupabaseAdmin();
    const snapshot = await getCapacitySnapshot(supabase);
    return NextResponse.json({ ok: true as const, ...snapshot });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        ok: false as const,
        error: "تعذّر التحقق من السعة. حاول لاحقاً.",
      },
      { status: 500 },
    );
  }
}
