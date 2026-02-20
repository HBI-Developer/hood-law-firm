import { getFixedT } from "~/i18n/server";
import { data, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { NavLink } from "~/components";
import { useState } from "react";
import { ErrorView, NotFoundView } from "./components";
import { hooddb } from "~/constants.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request),
    { lang, slug } = params as { lang: Locale; slug: string },
    [service, serviceError] = await hooddb.getService(lang || "en", slug);

  return data({
    service,
    serviceError,
    metaTags: {
      title: t("title", { title: service?.label || "service" }),
      description: service?.overview || t("about.description"),
    },
  });
};

// @ts-expect-error TypeScript Analyzer is wrong
export function meta({ data }: typeof loader) {
  if (!data) return [{ title: "Law Firm" }];

  const { title, description } = data.metaTags;

  return [{ title }, { name: "description", content: description }];
}

type Features = Array<{ icon: string; title: string; description: string }>;
type ProcessSteps = Array<{
  number: number;
  title: string;
  description: string;
}>;
type WhyChooseUs = Array<{ icon: string; title: string; description: string }>;
type FAQs = Array<{ question: string; answer: string }>;

export default function Service() {
  const { service, serviceError } = useLoaderData<typeof loader>(),
    { t } = useTranslation(),
    { lang } = useParams(),
    [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null),
    toggleFaq = (index: number) => {
      setOpenFaqIndex(openFaqIndex === index ? null : index);
    },
    handleRetry = () => {
      window.location.reload();
    };

  if (serviceError) {
    return <ErrorView onRetry={handleRetry} t={t} />;
  }

  if (!service) {
    return <NotFoundView lang={lang || "en"} t={t} />;
  }

  const serviceLabel = service.label,
    serviceIcon = service.icon,
    serviceOverview = service.overview,
    features: Features = JSON.parse(service.features || "[]"),
    processSteps: ProcessSteps = JSON.parse(service.process || "[]"),
    whyChooseUs: WhyChooseUs = JSON.parse(service.reasons || "[]"),
    faqs: FAQs = JSON.parse(service.faq || "[]");

  return (
    <div className="bg-stone-50">
      <section className="relative h-[60vh] min-h-100 w-full flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full animate-slow-zoom">
            <img
              src={service?.image}
              alt={service?.label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-secondary via-secondary/70 to-secondary/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 pb-16">
          <nav className="flex items-center gap-2 text-white/60 text-sm font-secondary mb-6 opacity-0 animate-fade-in-up">
            <NavLink
              to={`/${lang}`}
              className="hover:text-side-2 transition-colors"
            >
              {t("service.breadcrumb_home")}
            </NavLink>
            <Icon
              icon="mdi:chevron-left"
              className="w-4 h-4 rtl:rotate-0 ltr:rotate-180"
            />
            <NavLink
              to={`/${lang}/services`}
              className="hover:text-side-2 transition-colors"
            >
              {t("service.breadcrumb_services")}
            </NavLink>
            <Icon
              icon="mdi:chevron-left"
              className="w-4 h-4 rtl:rotate-0 ltr:rotate-180"
            />
            <span className="text-side-2 font-bold">{serviceLabel}</span>
          </nav>

          <div
            className="flex items-center gap-4 mb-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="bg-side-2/20 backdrop-blur-sm p-3 rounded-full border border-side-2/30">
              <Icon icon={serviceIcon || ""} className="w-8 h-8 text-side-2" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-primary text-white leading-tight">
              {serviceLabel}
            </h1>
          </div>

          <p
            className="text-white/70 font-secondary text-lg md:text-xl max-w-3xl leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            {serviceOverview}
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-side-2 rounded-full" />
                <h2 className="text-3xl md:text-4xl font-bold font-primary text-secondary">
                  {t("service.overview_title")}
                </h2>
              </div>
              {service?.description.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-stone-600 font-secondary text-lg leading-relaxed mb-6 text-justify"
                >
                  {para}
                </p>
              ))}
            </div>
            <div className="lg:w-100 shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={service?.image}
                  alt={service?.label}
                  className="w-full h-87.5 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-secondary/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon={service?.icon || ""}
                      className="w-8 h-8 text-side-2"
                    />
                    <span className="text-white font-bold font-primary text-xl">
                      {service?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-side-2 font-primary tracking-[0.2em] text-xs font-bold uppercase mb-4">
              {t("service.key_features")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-primary text-secondary">
              {t("service.key_features")}
            </h2>
            <div className="w-20 h-1 bg-side-2 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-stone-50 rounded-2xl p-8 border border-stone-100 hover:border-side-2/30 hover:shadow-xl hover:shadow-side-2/5 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="bg-secondary w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-side-2 transition-colors duration-500">
                  <Icon icon={feature.icon} className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold font-primary text-secondary mb-3">
                  {feature.title}
                </h3>
                <p className="text-stone-500 font-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-side-2 font-primary tracking-[0.2em] text-xs font-bold uppercase mb-4">
              {t("service.our_approach")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-primary text-white">
              {t("service.our_approach")}
            </h2>
            <div className="w-20 h-1 bg-side-2 mx-auto mt-4 rounded-full" />
          </div>

          <div className="relative">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/10 hidden lg:block" />

            <div className="space-y-12 lg:space-y-0">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-0 ${
                    index % 2 === 0 ? "" : "lg:flex-row-reverse"
                  } ${index > 0 ? "lg:mt-12" : ""}`}
                >
                  <div
                    className={`flex-1 ${
                      index % 2 === 0
                        ? "lg:text-end lg:pe-16"
                        : "lg:text-start lg:ps-16"
                    }`}
                  >
                    <h3 className="text-2xl font-bold font-primary text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-white/60 font-secondary text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                      {step.description}
                    </p>
                  </div>

                  <div className="relative z-10 shrink-0 order-first lg:order-0">
                    <div className="w-16 h-16 bg-side-2 rounded-full flex items-center justify-center shadow-lg shadow-side-2/30">
                      <span className="text-secondary font-bold font-primary text-2xl">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-side-2 font-primary tracking-[0.2em] text-xs font-bold uppercase mb-4">
              {t("service.why_choose_us")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-primary text-secondary">
              {t("service.why_choose_us")}
            </h2>
            <div className="w-20 h-1 bg-side-2 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 group"
              >
                <div className="bg-side-2/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-side-2 transition-colors duration-500">
                  <Icon
                    icon={item.icon}
                    className="w-10 h-10 text-side-2 group-hover:text-white transition-colors duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold font-primary text-secondary mb-4">
                  {item.title}
                </h3>
                <p className="text-stone-500 font-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-side-2 font-primary tracking-[0.2em] text-xs font-bold uppercase mb-4">
              {t("service.faq_title")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-primary text-secondary">
              {t("service.faq_title")}
            </h2>
            <div className="w-20 h-1 bg-side-2 mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-stone-200 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full flex items-center justify-between p-6 text-start cursor-pointer transition-colors duration-300 ${
                    openFaqIndex === index
                      ? "bg-secondary text-white"
                      : "bg-white hover:bg-stone-50 text-secondary"
                  }`}
                >
                  <span className="font-bold font-primary text-lg pe-4">
                    {faq.question}
                  </span>
                  <Icon
                    icon="mdi:chevron-down"
                    className={`w-6 h-6 shrink-0 transition-transform duration-300 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    } ${
                      openFaqIndex === index ? "text-side-2" : "text-stone-400"
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="p-6 pt-2 text-stone-600 font-secondary text-lg leading-relaxed bg-stone-50 border-t border-stone-100">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-side-2/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-side-2/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Icon
            icon="mdi:gavel"
            className="w-14 h-14 text-side-2 mx-auto mb-6"
          />
          <h2 className="text-3xl md:text-4xl font-bold font-primary text-white mb-6">
            {t("service.cta.title")}
          </h2>
          <p className="text-white/70 font-secondary text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            {t("service.cta.description")}
          </p>
          <NavLink
            to={`/${lang}/contact#contact`}
            className="inline-flex items-center gap-3 bg-side-2 text-secondary px-10 py-4 font-bold rounded-sm hover:bg-white transition-all duration-300 text-lg"
          >
            <Icon icon="mdi:phone-outline" className="w-5 h-5" />
            {t("service.cta.button")}
          </NavLink>
        </div>
      </section>
    </div>
  );
}
