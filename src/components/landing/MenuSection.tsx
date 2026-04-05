import Image from "next/image"
import { SectionContainer } from "@/components/landing/SectionContainer"
import { SectionDivider } from "@/components/landing/SectionDivider"
import { cn } from "@/lib/utils"

const MENU_ITEMS = [
  {
    name: "فتة المسخن",
    description: "خبز طابون، لبن، دجاج مسخن",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "ستيك المسخن",
    description: "ستيك دجاج على خبزة طابون",
    image:
      "https://images.unsplash.com/photo-1604908177079-3e49f1011858?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "مسخن رول",
    description: "لفائف شراك محشية دجاج",
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "بيتزا المسخن",
    description: "عجينة طازجة مع دجاج مسخن",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "كلزوني المسخن",
    description: "عجينة محشية دجاج",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "سلطة المسخن",
    description: "خضار موسمية مع زيت زيتون وسماق",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
] as const

function EarthCorner() {
  return (
    <div
      className="pointer-events-none absolute top-0 right-0 z-10 size-0 border-t-[36px] border-l-[36px] border-t-earth/85 border-l-transparent sm:border-t-[42px] sm:border-l-[42px]"
      aria-hidden
    />
  )
}

function MenuCard({
  name,
  description,
  image,
  className,
}: {
  name: string
  description: string
  image: string
  className?: string
}) {
  return (
    <article
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-parchment shadow-[0_6px_24px_-8px_rgba(63,42,26,0.12)] ring-1 ring-earth/10 transition hover:shadow-[0_12px_32px_-12px_rgba(63,42,26,0.16)]",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <EarthCorner />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-4 pt-4 pb-6 text-right sm:gap-3 sm:px-5 sm:pt-5 sm:pb-7">
        <h3 className="font-heading text-lg font-bold text-olive sm:text-xl">
          {name}
        </h3>
        <p className="text-sm leading-relaxed text-earth/80 sm:text-base">
          {description}
        </p>
      </div>
    </article>
  )
}

export function MenuSection() {
  return (
    <section
      id="menu"
      className="section-pad scroll-mt-20 overflow-x-hidden bg-cream"
    >
      <SectionContainer className="min-w-0">
        <div className="mx-auto w-full max-w-6xl">
          <SectionDivider />
          <header className="mx-auto mt-3 max-w-3xl text-center sm:mt-5">
            <h2 className="font-heading text-2xl font-extrabold leading-tight text-olive sm:text-3xl md:text-[2rem]">
              أطباق مهرجان المسخن
            </h2>
            <p className="mt-2.5 text-sm text-earth/90 sm:text-base md:text-lg">
              تذوق أصالة المطبخ الفلسطيني
            </p>
          </header>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <div className="overflow-hidden rounded-2xl bg-earth shadow-[0_16px_48px_-20px_rgba(63,42,26,0.25)] ring-1 ring-olive/35 sm:rounded-3xl">
              <div className="flex flex-col lg:flex-row lg:items-stretch">
                <div className="relative aspect-[4/3] w-full min-w-0 lg:aspect-auto lg:min-h-[300px] lg:w-1/2">
                  <Image
                    src="/offer.jpg"
                    alt="مسخن قدسي"
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-4 right-4 rounded-full border border-sumac/30 bg-olive px-3 py-1.5 text-xs font-bold text-cream shadow-md ring-1 ring-sumac/25 sm:text-sm">
                    العرض المميز
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 px-5 py-8 sm:px-8 sm:py-10">
                  <div>
                    <h3 className="font-heading text-2xl font-extrabold leading-tight text-cream sm:text-3xl">
                      مسخن قدسي
                    </h3>
                    <p className="mt-1 text-sm text-cream/90 sm:text-base">
                      أيقونة المهرجان — لشخصين
                    </p>
                  </div>
                  <ul className="flex flex-col gap-3 text-right text-cream">
                    {["نص دجاجة مسخن", "2 رول مسخن", "فتة مسخن"].map((line) => (
                      <li
                        key={line}
                        className="flex items-center gap-3 text-sm sm:text-base"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/90 text-cream">
                          <span className="text-xs font-bold" aria-hidden>
                            ✓
                          </span>
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-relaxed text-cream/85 sm:text-base">
                    نص دجاجة مع بصل وسماق وزيت زيتون — نكهة الطابون كما في بيوت
                    القدس.
                  </p>
                  <a
                    href="#booking"
                    className="inline-flex min-h-11 w-full min-w-0 items-center justify-center rounded-full border border-transparent bg-cream px-6 text-sm font-bold text-earth shadow-md ring-1 ring-sumac/25 transition hover:border-sumac/35 hover:bg-parchment focus-visible:ring-2 focus-visible:ring-sumac/40 focus-visible:outline-none sm:min-h-12 sm:w-auto sm:self-start sm:text-base"
                  >
                    اطلب الكومبو
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:mt-10 lg:grid-cols-3">
            {MENU_ITEMS.map((item) => (
              <MenuCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
