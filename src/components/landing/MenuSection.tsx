import Image from "next/image"
import { SectionContainer } from "@/components/landing/SectionContainer"
import { SectionDivider } from "@/components/landing/SectionDivider"
import { cn } from "@/lib/utils"

const FEATURED_IMAGE =
  "https://images.unsplash.com/photo-1598103442097-8b743d2ebd21?auto=format&fit=crop&w=1200&q=80"

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

function GoldCorner() {
  return (
    <div
      className="pointer-events-none absolute top-0 right-0 z-10 size-0 border-t-[36px] border-l-[36px] border-t-gold border-l-transparent sm:border-t-[42px] sm:border-l-[42px]"
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
        "group flex flex-col overflow-hidden rounded-2xl bg-parchment shadow-md ring-1 ring-earth/10 transition hover:-translate-y-0.5 hover:shadow-lg",
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
        <GoldCorner />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-5 text-right sm:px-5 sm:pt-5">
        <h3 className="font-heading text-lg font-bold text-olive sm:text-xl">
          {name}
        </h3>
        <p className="text-sm leading-relaxed text-earth/85 sm:text-base">
          {description}
        </p>
        <div className="mx-auto mt-auto h-px w-12 bg-gold/90 pt-3 sm:w-14" />
      </div>
    </article>
  )
}

export function MenuSection() {
  return (
    <section
      id="menu"
      className="scroll-mt-20 bg-cream py-16 sm:py-20 md:py-24"
    >
      <SectionContainer>
        <SectionDivider />
        <header className="mx-auto mt-4 max-w-3xl text-center sm:mt-6">
          <h2 className="font-heading text-2xl font-extrabold text-olive sm:text-3xl md:text-4xl lg:text-[2.5rem]">
            أطباق مهرجان المسخن
          </h2>
          <p className="mt-3 text-sm text-earth/90 sm:text-base md:text-lg">
            تذوق أصالة المطبخ الفلسطيني
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-5xl animate-in fade-in slide-in-from-bottom-3 duration-700 md:mt-14">
          <div className="overflow-hidden rounded-3xl bg-earth shadow-xl ring-1 ring-gold/30">
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[320px] lg:w-1/2">
                <Image
                  src={FEATURED_IMAGE}
                  alt="مسخن قدسي"
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute top-4 right-4 rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-white shadow-md sm:text-sm">
                  العرض المميز
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-4 px-5 py-8 sm:px-8 sm:py-10 lg:max-w-none">
                <div>
                  <h3 className="font-heading text-2xl font-extrabold text-gold sm:text-3xl">
                    مسخن قدسي
                  </h3>
                  <p className="mt-1 text-sm text-cream/90 sm:text-base">
                    أيقونة المهرجان — لشخصين
                  </p>
                </div>
                <ul className="flex flex-col gap-3 text-right text-cream">
                  {[
                    "نص دجاجة مسخن",
                    "2 رول مسخن",
                    "فتة مسخن",
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-3 text-sm sm:text-base"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold text-earth">
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
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-bold text-earth shadow-md transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none sm:min-h-12 sm:text-base"
                >
                  اطلب الكومبو
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {MENU_ITEMS.map((item, i) => (
            <MenuCard
              key={item.name}
              {...item}
              className={cn(
                "animate-in fade-in duration-500",
                i === 0 && "delay-75",
                i === 1 && "delay-100",
                i === 2 && "delay-150",
                i === 3 && "delay-200",
                i === 4 && "delay-300",
                i === 5 && "delay-500"
              )}
            />
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
