import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import PhoneInput from "react-phone-number-input";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import "react-phone-number-input/style.css";
import { CHECK_CONTACT_FIELDS_SCHEMA } from "~/constants";
import { useFetcher, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { useGetUserCountry } from "~/hooks/useGetUserCountry";
import type { InferSelectModel } from "drizzle-orm";
import { services } from "~/databases/schema";
import { Switch } from "~/components";

type FormData = z.infer<typeof CHECK_CONTACT_FIELDS_SCHEMA>;

export default function ConsultationForm() {
  const { t } = useTranslation(),
    { executeRecaptcha } = useGoogleReCaptcha(),
    fetcher = useFetcher(),
    [isSubmitting, setIsSubmitting] = useState(false),
    { services: servicesCollection, servicesError } = useLoaderData<{
      services: Array<InferSelectModel<typeof services>>;
      servicesError: boolean;
    }>(),
    {
      register,
      handleSubmit,
      control,
      reset,
      setError,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(CHECK_CONTACT_FIELDS_SCHEMA),
      mode: "onSubmit",
    });

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { status, errors: serverErrors } = fetcher.data;

      if (status === "success") {
        toast.success(t("toast.success_title"), {
          description: t("contact.toast.success_message"),
          icon: (
            <Icon
              icon="solar:check-circle-bold-duotone"
              className="text-green-500 w-6 h-6"
            />
          ),
        });
        reset();
      } else if (status === "validation_failed" && serverErrors) {
        Object.entries(serverErrors).forEach(([key, messages]) => {
          setError(key as any, {
            type: "server",
            message: (messages as string[])[0],
          });
        });
      } else {
        toast.error(t("toast.error_title"), {
          description: t("toast.error_retry"),
          icon: (
            <Icon
              icon="solar:danger-bold-duotone"
              className="text-red-500 w-6 h-6"
            />
          ),
        });
      }

      setIsSubmitting(false);
    }
  }, [fetcher.data, fetcher.state, reset, setError, t]);

  const onSubmit = async (data: FormData) => {
    if (!executeRecaptcha) {
      toast.error(t("toast.recaptcha_not_ready"));
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await executeRecaptcha("contact_form"),
        formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formData.append("recaptchaToken", token);

      fetcher.submit(formData, {
        method: "POST",
        action: window.location.pathname,
      });
    } catch (e) {
      toast.error(t("toast.error_title"), {
        description: t("toast.error_retry"),
        icon: (
          <Icon
            icon="solar:danger-bold-duotone"
            className="text-red-500 w-6 h-6"
          />
        ),
      });
    }
  };

  const errorClass = "border-red-500 bg-red-50/30 focus:border-red-600",
    normalClass =
      "border-secondary/10 bg-secondary/5 focus:border-side-2 focus:bg-white",
    defaultCountry = useGetUserCountry();

  return (
    <>
      <section className="py-24 bg-[#FDFDFD]" id="contact">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-white rounded-[3rem] border border-secondary/5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] p-8 md:p-16">
            <div className="mb-12 text-center">
              <h2 className="text-secondary text-3xl md:text-5xl font-primary font-bold mb-4">
                {t("contact.form.title") || "Request a Legal Consultation"}
              </h2>
              <div className="w-24 h-1.5 bg-side-2 mx-auto rounded-full" />
            </div>

            <fetcher.Form
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-2">
                <label className="text-secondary/60 text-xs font-primary font-bold uppercase tracking-wider px-2">
                  {t("form.first_name")}
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  className={`w-full p-4 rounded-2xl outline-hidden transition-all border ${
                    errors.firstName ? errorClass : normalClass
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs px-2 animate-fade-in">
                    {t(`errors.${errors.firstName.message}`)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-secondary/60 text-xs font-primary font-bold uppercase tracking-wider px-2">
                  {t("form.last_name")}
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  className={`w-full p-4 rounded-2xl outline-hidden transition-all border ${
                    errors.lastName ? errorClass : normalClass
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs px-2 animate-fade-in">
                    {t(`errors.${errors.lastName.message}`)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-secondary/60 text-xs font-primary font-bold uppercase tracking-wider px-2">
                  {t("form.email")}
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full p-4 rounded-2xl outline-hidden transition-all border ${
                    errors.email ? errorClass : normalClass
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs px-2 animate-fade-in">
                    {t(`errors.${errors.email.message}`)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-secondary/60 text-xs font-primary font-bold uppercase tracking-wider px-2">
                  {t("form.phone")}
                </label>
                <div className="phone-input-container" dir="ltr">
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry={defaultCountry as any}
                        className={`w-full p-4 rounded-2xl transition-all flex border ${
                          errors.phone ? errorClass : normalClass
                        }`}
                      />
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs px-2 animate-fade-in">
                    {t(`errors.${errors.phone.message}`)}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-secondary/60 text-xs font-primary font-bold uppercase tracking-wider px-2">
                  {t("contact.form.subject")}
                </label>
                <div className="relative">
                  <select
                    {...register("subject")}
                    className={`w-full p-4 rounded-2xl outline-hidden transition-all appearance-none cursor-pointer font-secondary text-secondary/80 border ${
                      errors.subject ? errorClass : normalClass
                    }`}
                  >
                    <Switch.Root>
                      <Switch.Case condition={!servicesError}>
                        {servicesCollection.map((service) => (
                          <option value={service.slug} key={service.id}>
                            {service.label}
                          </option>
                        ))}
                      </Switch.Case>
                      <Switch.Default>
                        <option value="general-legal">
                          {t("services.items.general.title")}
                        </option>
                      </Switch.Default>
                    </Switch.Root>
                  </select>
                  <Icon
                    icon="solar:alt-arrow-down-bold-duotone"
                    className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-side-2 pointer-events-none w-6 h-6"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-secondary/60 text-xs font-primary font-bold uppercase tracking-wider px-2">
                  {t("contact.form.message")}
                </label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className={`w-full p-5 rounded-3xl outline-hidden transition-all resize-none font-secondary border ${
                    errors.message ? errorClass : normalClass
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs px-2 animate-fade-in">
                    {t(`errors.${errors.message.message}`)}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-5 bg-secondary text-side-2 font-primary font-bold rounded-2xl hover:bg-side-2 hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-xl flex items-center justify-center gap-4 group cursor-pointer overflow-hidden relative"
                >
                  {isSubmitting ? (
                    <Icon
                      icon="solar:restart-bold-duotone"
                      className="w-6 h-6 animate-spin"
                    />
                  ) : (
                    <Icon
                      icon="solar:letter-opened-bold-duotone"
                      className="w-6 h-6 transition-transform group-hover:scale-125"
                    />
                  )}
                  <span className="uppercase tracking-widest text-sm">
                    {isSubmitting
                      ? t("contact.form.sending")
                      : t("contact.form.submit")}
                  </span>
                </button>
              </div>
            </fetcher.Form>
          </div>
        </div>
      </section>
      <Toaster position="top-center" expand={true} richColors />
    </>
  );
}
