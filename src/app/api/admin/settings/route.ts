import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyAdminJwt } from "@/lib/auth";
import {
  DEFAULT_EVENT_MAX_GUESTS,
  getEventMaxGuests,
} from "@/lib/booking-capacity";
import { createServerSupabaseAdmin } from "@/lib/supabase-admin";
import { isSupabaseConfigured } from "@/lib/supabase";

const MIN_CAP = 1;
const MAX_CAP = 10_000;

async function requireAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminJwt(token);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase غير مُعدّ" }, { status: 503 });
  }

  try {
    const supabase = createServerSupabaseAdmin();
    const maxGuests = await getEventMaxGuests(supabase);
    return NextResponse.json({
      maxGuests,
      defaultFallback: DEFAULT_EVENT_MAX_GUESTS,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "فشل قراءة الإعدادات" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase غير مُعدّ" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "جسم الطلب غير صالح" }, { status: 400 });
  }

  const raw =
    typeof body === "object" &&
    body !== null &&
    "maxGuests" in body &&
    typeof (body as { maxGuests: unknown }).maxGuests === "number"
      ? (body as { maxGuests: number }).maxGuests
      : NaN;

  const maxGuests = Math.floor(raw);
  if (!Number.isFinite(maxGuests) || maxGuests < MIN_CAP || maxGuests > MAX_CAP) {
    return NextResponse.json(
      { error: `السعة يجب أن تكون بين ${MIN_CAP} و ${MAX_CAP}` },
      { status: 400 },
    );
  }

  try {
    const supabase = createServerSupabaseAdmin();
    const { error } = await supabase.from("event_settings").upsert(
      { id: 1, max_guests: maxGuests },
      { onConflict: "id" },
    );

    if (error) {
      if (
        error.message.includes("event_settings") ||
        error.code === "42P01"
      ) {
        return NextResponse.json(
          {
            error:
              "جدول event_settings غير موجود. نفّذ SQL من README ثم أعد المحاولة.",
          },
          { status: 503 },
        );
      }
      console.error(error);
      return NextResponse.json({ error: "فشل حفظ السعة" }, { status: 500 });
    }

    const applied = await getEventMaxGuests(supabase);
    return NextResponse.json({ ok: true, maxGuests: applied });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الاتصال" }, { status: 500 });
  }
}
