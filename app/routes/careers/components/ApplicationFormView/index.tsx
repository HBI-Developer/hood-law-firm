import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import PhoneInput from "react-phone-number-input";
import {
  CHECK_JOB_APPLICATION_SCHEMA,
  MAXIMUM_PDF_RESUME_SIZE,
} from "~/constants";
import { useFetcher } from "react-router";
import validateFile from "../../functions/validateFile";
import { useGetUserCountry } from "~/hooks/useGetUserCountry";
import "react-phone-number-input/style.css";

type FormData = z.infer<typeof CHECK_JOB_APPLICATION_SCHEMA>;

export default function ApplicationFormView({
  jobTitle,
  onBack,
  onClose,
  t,
}: {
  jobTitle: string;
  onBack: () => void;
  onClose: () => void;
  t: any;
}) {
  const defaultCountry = useGetUserCountry(),
    [isSubmitting, setIsSubmitting] = useState(false),
    [isSubmitted, setIsSubmitted] = useState(false),
    { executeRecaptcha } = useGoogleReCaptcha(),
    fileInputRef = useRef<HTMLInputElement>(null),
    [resumeFile, setResumeFile] = useState<File | null>(null),
    fetcher = useFetcher(),
    [resumeError, setResumeError] = useState<string | null>(null),
    {
      register,
      handleSubmit,
      control,
      reset,
      setError,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(CHECK_JOB_APPLICATION_SCHEMA),
      mode: "onSubmit",
    });

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { status, errors: serverErrors } = fetcher.data;

      if (status === "success") {
        setIsSubmitted(true);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const error = await validateFile(file);
        if (error) {
          setResumeError(error);
          setResumeFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          setResumeError(null);
          setResumeFile(file);
        }
      }
    },
    onSubmit = async (data: FormData) => {
      if (!executeRecaptcha) {
        toast.error(t("toast.recaptcha_not_ready") || "ReCAPTCHA is not ready");
        return;
      }

      setIsSubmitting(true);

      try {
        const token = await executeRecaptcha("job_application"),
          formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        });

        formData.append("job", jobTitle);
        formData.append("recaptchaToken", token);
        if (resumeFile) formData.append("resume", resumeFile);

        fetcher.submit(formData, {
          method: "POST",
          encType: "multipart/form-data",
          action: window.location.pathname,
        });
      } catch (e) {
        setIsSubmitting(false);
        toast.error(t("toast.error_title") || "Error", {
          description: t("toast.error_retry") || "Failed to send application",
        });
      }
    };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 h-full">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <Icon
            icon="heroicons:check-circle"
            className="w-10 h-10 text-green-600"
          />
        </div>
        <h3 className="text-3xl font-bold text-secondary font-primary">
          {t("careers.applicationReceived") || "تم استلام طلبك بنجاح"}
        </h3>
        <p className="text-secondary/70 max-w-md font-secondary text-lg">
          {t("careers.applicationReceivedDesc") ||
            "شكراً لك على اهتمامك بالانضمام إلى فريقنا. سنقوم بمراجعة طلبك والتواصل معك قريباً."}
        </p>
        <button
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-sm transition-colors font-secondary border border-transparent"
        >
          {t("close") || "إغلاق"}
        </button>
      </div>
    );
  }

  const errorClass = "border-red-500 bg-red-50/10 focus:ring-red-500",
    normalClass = "border-secondary/20 focus:ring-side-2";

  return (
    <fetcher.Form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto pb-4 h-full flex flex-col"
    >
      <div className="grow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary font-secondary">
              {t("form.first_name")} *
            </label>
            <input
              {...register("firstName")}
              type="text"
              className={`w-full px-4 py-3 border rounded-sm bg-white text-secondary focus:ring-2 focus:border-transparent outline-none transition-all font-secondary placeholder:text-secondary/30 ${
                errors.firstName ? errorClass : normalClass
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs font-secondary">
                {t(`errors.${errors.firstName.message}`)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary font-secondary">
              {t("form.last_name")} *
            </label>
            <input
              {...register("lastName")}
              type="text"
              className={`w-full px-4 py-3 border rounded-sm bg-white text-secondary focus:ring-2 focus:border-transparent outline-none transition-all font-secondary placeholder:text-secondary/30 ${
                errors.lastName ? errorClass : normalClass
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs font-secondary">
                {t(`errors.${errors.lastName.message}`)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary font-secondary">
              {t("form.email")} *
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-4 py-3 border rounded-sm bg-white text-secondary focus:ring-2 focus:border-transparent outline-none transition-all font-secondary placeholder:text-secondary/30 ${
                errors.email ? errorClass : normalClass
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-secondary">
                {t(`errors.${errors.email.message}`)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary font-secondary">
              {t("form.phone")} *
            </label>
            <div dir="ltr">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry={defaultCountry as any}
                    className={`w-full transition-all flex border rounded-sm px-4 py-1.5 [&_input]:outline-none [&_input]:h-full [&_input]:py-2 ${
                      errors.phone ? errorClass : normalClass
                    }`}
                  />
                )}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs font-secondary">
                {t(`errors.${errors.phone.message}`)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary font-secondary">
            {t("careers.form.resume") || "السيرة الذاتية (PDF)"}
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-sm p-8 flex flex-col items-center justify-center text-center hover:bg-secondary/5 transition-colors cursor-pointer group ${
              resumeError ? "border-red-500" : "border-secondary/20"
            }`}
          >
            <Icon
              icon={
                resumeFile
                  ? "heroicons:document-check"
                  : "heroicons:cloud-arrow-up"
              }
              className={`w-12 h-12 mb-3 transition-colors ${
                resumeFile
                  ? "text-green-500"
                  : "text-secondary/40 group-hover:text-side-2"
              }`}
            />
            <p className="text-sm text-secondary/60 font-secondary">
              {resumeFile
                ? resumeFile.name
                : t("careers.form.uploadResumeDesc", {
                    size: MAXIMUM_PDF_RESUME_SIZE,
                  }) || "اسحب وأفلت الملف هنا أو انقر للاختيار"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {resumeError && (
            <p className="text-red-500 text-xs font-secondary">
              {t(`errors.${resumeError}`)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary font-secondary">
            {t("careers.form.coverLetter") || "خطاب التوصية"}
          </label>
          <textarea
            {...register("coverLetter")}
            rows={4}
            className="w-full px-4 py-3 border border-secondary/20 rounded-sm bg-white text-secondary focus:ring-2 focus:ring-side-2 focus:border-transparent outline-none transition-all font-secondary resize-none placeholder:text-secondary/30"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 pb-5 border-t border-secondary/10 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="text-secondary/60 hover:text-secondary font-medium text-xs md:text-lg font-secondary px-4 py-2"
        >
          {t("back") || "رجوع"}
        </button>
        <div className="bg-gray-200/80 p-2 rounded-md">
          <Icon icon={"logos:recaptcha"} className="text-md md:text-3xl" />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-secondary hover:bg-side-2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-sm shadow-md transition-all duration-200 font-secondary text-xs md:text-lg flex items-center gap-2"
        >
          {isSubmitting && (
            <Icon
              icon="solar:restart-bold-duotone"
              className="animate-spin w-5 h-5"
            />
          )}
          {isSubmitting
            ? t("careers.form.submitting") || "جاري الإرسال..."
            : t("careers.form.submitApplication") || "إرسال الطلب"}
        </button>
      </div>
    </fetcher.Form>
  );
}
