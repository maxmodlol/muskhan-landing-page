"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { SectionContainer } from "@/components/landing/SectionContainer"
import { SectionDivider } from "@/components/landing/SectionDivider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const PEOPLE_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8+"] as const

export function BookingSection() {
  const [people, setPeople] = React.useState<string>("")
  const [peopleError, setPeopleError] = React.useState(false)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!people) {
      setPeopleError(true)
      return
    }
    setPeopleError(false)
    setSubmitted(true)
  }

  return (
    <section
      id="booking"
      className="scroll-mt-20 bg-[linear-gradient(#f5f5dc_0,#f5f5dc_100%),repeating-linear-gradient(0deg,transparent,transparent_11px,rgba(107,66,38,0.06)_11px,rgba(107,66,38,0.06)_12px)] py-16 sm:py-20 md:py-24"
    >
      <SectionContainer>
        <SectionDivider />
        <header className="mx-auto mt-4 max-w-2xl text-center sm:mt-6">
          <h2 className="font-heading text-2xl font-extrabold text-olive sm:text-3xl md:text-4xl">
            احجز الآن
          </h2>
          <p className="mt-3 text-sm text-earth/90 sm:text-base md:text-lg">
            انضم إلينا في رحلة الطعم الأصيل
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-lg animate-in fade-in slide-in-from-bottom-3 duration-700 md:mt-14 md:max-w-xl">
          <div className="overflow-hidden rounded-3xl border-2 border-gold/50 bg-parchment shadow-xl">
            <div className="bg-linear-to-l from-earth to-olive px-4 py-4 text-center sm:px-6 sm:py-5">
              <p className="font-heading text-lg font-bold text-white sm:text-xl">
                نموذج الحجز
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8"
            >
              {submitted ? (
                <p
                  className="rounded-xl border border-gold/40 bg-cream px-4 py-6 text-center text-base font-medium text-olive"
                  role="status"
                >
                  تم استلام طلبك. سنتواصل معك قريبًا لتأكيد الحجز.
                </p>
              ) : null}

              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-earth">
                  الاسم
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="أدخل اسمك الكامل..."
                  className="h-11 rounded-xl border-earth/20 bg-cream px-4 text-base text-earth placeholder:text-earth/45"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-earth">
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  dir="ltr"
                  className="h-11 rounded-xl border-earth/20 bg-cream px-4 text-left text-base text-earth placeholder:text-earth/45"
                  placeholder="05X-XXXXXXX"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="people" className="text-earth">
                  عدد الأشخاص
                </Label>
                <Select
                  value={people || undefined}
                  onValueChange={(v) => {
                    setPeople(v ?? "")
                    setPeopleError(false)
                  }}
                >
                  <SelectTrigger
                    id="people"
                    aria-invalid={peopleError}
                    className={cn(
                      "h-11 w-full min-w-0 rounded-xl border-earth/20 bg-cream px-4 text-right text-base text-earth data-placeholder:text-earth/45",
                      peopleError && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="اختر العدد" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {PEOPLE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={n} className="text-base">
                        {n === "8+" ? "8+ أشخاص" : `${n} ${n === "1" ? "شخص" : "أشخاص"}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {peopleError ? (
                  <p className="text-sm text-destructive">يرجى اختيار عدد الأشخاص</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="note" className="text-earth">
                  ملاحظة (اختياري)
                </Label>
                <Textarea
                  id="note"
                  name="note"
                  rows={4}
                  placeholder="أي ملاحظات أو طلبات خاصة..."
                  className="min-h-28 rounded-xl border-earth/20 bg-cream px-4 py-3 text-base text-earth placeholder:text-earth/45"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-earth">
                  إثبات الدفع
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="payment"
                  accept="image/png,image/jpeg"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    setFileName(f ? f.name : null)
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold bg-cream/80 px-4 py-6 text-center transition hover:border-earth hover:bg-cream focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none sm:min-h-[160px]"
                  )}
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-gold text-white shadow-md">
                    <Upload className="size-6" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold text-earth sm:text-base">
                    اضغط لرفع صورة إثبات الدفع
                  </span>
                  <span className="text-xs text-earth/60 sm:text-sm">
                    PNG, JPG حتى 10MB
                  </span>
                  {fileName ? (
                    <span className="mt-1 max-w-full truncate text-xs text-olive">
                      {fileName}
                    </span>
                  ) : null}
                </button>
              </div>

              <Button
                type="submit"
                disabled={submitted}
                className="h-12 w-full rounded-full border-0 bg-linear-to-l from-earth to-olive text-base font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-60 sm:h-14 sm:text-lg"
              >
                تأكيد الحجز
              </Button>
            </form>
          </div>

          <div className="mt-8 rounded-2xl bg-olive/15 px-4 py-5 text-center text-earth ring-1 ring-olive/20 sm:mt-10 sm:px-6 sm:py-6">
            <p className="text-sm font-semibold text-olive sm:text-base">
              للاستفسارات والمحجوزات
            </p>
            <p className="mt-2 text-base font-medium sm:text-lg" dir="ltr">
              050-XXXX-XXX
            </p>
            <p className="mt-2 text-sm text-earth/90 sm:text-base">
              عين القدس، المدينة القديمة
            </p>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
