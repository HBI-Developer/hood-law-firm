import { useTranslation } from "react-i18next";
import { EMBED_MAP_LINK } from "~/constants";

export default function MapSection() {
  const { t, i18n } = useTranslation();

  // رابط الخريطة (يمكنك استبداله برابط موقع المكتب الفعلي من Google Maps)
  // استخدمت هنا إحداثيات عامة لمركز مالي، قم بتغيير 'q' إلى عنوان مكتبكم

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* الجانب النصي: معلومات العنوان */}
          <div
            className={`lg:w-1/3 flex flex-col justify-center ${i18n.language === "ar" ? "text-right" : "text-left"}`}
          >
            <h2 className="text-3xl md:text-5xl font-primary font-bold text-primary mb-6">
              {t("map.title") ||
                (i18n.language === "ar" ? "مقرنا الرئيسي" : "Our Office")}
            </h2>
            <div className="w-20 h-1 bg-side-2 mb-8" />

            <div className="space-y-8">
              <div className="group">
                <h4 className="text-side-2 font-bold mb-2 uppercase tracking-widest text-sm">
                  {t("map.address_label") ||
                    (i18n.language === "ar" ? "العنوان" : "Address")}
                </h4>
                <p className="text-primary/80 font-secondary text-lg leading-relaxed group-hover:text-primary transition-colors">
                  {t("footer.address_text") ||
                    (i18n.language === "ar"
                      ? "برج المركز المالي، الطابق 24، دبي، الإمارات العربية المتحدة"
                      : "Financial Center Tower, 24th Floor, Dubai, UAE")}
                </p>
              </div>

              <div className="group">
                <h4 className="text-side-2 font-bold mb-2 uppercase tracking-widest text-sm">
                  {t("map.working_hours_label") ||
                    (i18n.language === "ar" ? "ساعات العمل" : "Working Hours")}
                </h4>
                <p className="text-primary/80 font-secondary text-lg leading-relaxed">
                  {i18n.language === "ar"
                    ? "الأحد - الخميس: 9:00 ص - 6:00 م"
                    : "Sun - Thu: 9:00 AM - 6:00 PM"}
                </p>
              </div>
            </div>
          </div>

          {/* الخريطة: Google Maps Iframe */}
          <div className="lg:w-2/3 relative h-112.5 md:h-auto min-h-100 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            {/* Overlay خفيف لجعل الخريطة تندمج مع ألوان الموقع حتى يمرر المستخدم الفأرة فوقها */}
            <div className="absolute inset-0 bg-secondary/10 pointer-events-none group-hover:bg-transparent transition-all duration-500 z-10" />

            <iframe
              src={EMBED_MAP_LINK}
              className="w-full h-full border-0 grayscale-[0.3] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Law Firm Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
