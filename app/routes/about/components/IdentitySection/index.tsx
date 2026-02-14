import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function IdentitySection() {
  const { t } = useTranslation();

  const identityData = [
    {
      id: "vision",
      icon: <Icon icon={"lucide:eye"} />,
      title: t("about.identity.vision.title") || "Our Vision",
      content:
        t("about.identity.vision.text") ||
        "To be the leading legal benchmark in the region, setting standards for excellence and integrity.",
    },
    {
      id: "mission",
      icon: <Icon icon={"lucide:target"} />,
      title: t("about.identity.mission.title") || "Our Mission",
      content:
        t("about.identity.mission.text") ||
        "Protecting our clients' interests through innovative legal strategies and unwavering commitment to justice.",
    },
    {
      id: "values",
      icon: <Icon icon={"lucide:shield-check"} />,
      title: t("about.identity.values.title") || "Our Values",
      content:
        t("about.identity.values.text") ||
        "Integrity, Transparency, and Excellence are the cornerstones of every case we handle.",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* لمسة خلفية فنية: شعار المكتب أو شكل هندسي باهت جداً */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-side-2/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {identityData.map((item) => (
            <div
              key={item.id}
              className={`group p-10 rounded-4xl bg-white border border-secondary/5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-side-2/20`}
            >
              {/* الأيقونة مع حلقة خلفية */}
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-side-2/10 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-secondary/5">
                  {item.icon}
                </div>
              </div>

              {/* المحتوى النصي */}
              <h3 className="text-secondary text-2xl font-primary font-bold mb-4 select-none">
                {item.title}
              </h3>

              <div className="w-12 h-1 bg-side-2 mb-6 rounded-full group-hover:w-24 transition-all duration-500" />

              <p className="text-secondary/70 font-secondary leading-relaxed text-justify">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
