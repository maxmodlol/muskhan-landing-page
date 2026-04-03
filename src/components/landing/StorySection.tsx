import { SectionContainer } from "@/components/landing/SectionContainer"

export function StorySection() {
  return (
    <section
      id="story"
      className="scroll-mt-20 bg-[repeating-linear-gradient(135deg,#556b2f_0px,#556b2f_14px,#4a5c28_14px,#4a5c28_16px)] py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <SectionContainer>
        <div className="mx-auto max-w-2xl text-center text-cream animate-in fade-in duration-700">
          <span
            className="mx-auto mb-6 block size-2 rounded-full bg-gold sm:mb-8"
            aria-hidden
          />
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl md:text-5xl">
            حكاية المسخن
          </h2>
          <p className="mt-6 text-base leading-loose sm:mt-8 sm:text-lg md:text-xl">
            وُلِد المسخن في بيوتنا
            <br />
            يوم كان موسم الزيتون يجمع العائلة حول الطابون.
          </p>
          <div className="mx-auto my-8 h-px w-16 bg-gold sm:my-10 sm:w-20" />
          <div className="space-y-1 text-base leading-loose sm:text-lg md:text-xl">
            <p>خبز ساخن،</p>
            <p>زيت زيتون بلدي،</p>
            <p>بصل وسماق...</p>
            <p>ودجاج مطبوخ على مهل.</p>
          </div>
          <div className="mx-auto my-8 h-px w-16 bg-gold sm:my-10 sm:w-20" />
          <div className="space-y-1 text-base leading-loose sm:text-lg md:text-xl">
            <p>لم يكن المسخن مجرد طعام...</p>
            <p>بل رائحة بيت،</p>
            <p>وجمعة أهل،</p>
            <p>وحكاية أرض.</p>
          </div>
          <span
            className="mx-auto mt-8 block size-2 rounded-full bg-gold sm:mt-10"
            aria-hidden
          />
        </div>
      </SectionContainer>
    </section>
  )
}
