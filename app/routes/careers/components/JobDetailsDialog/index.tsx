import { useState, useEffect } from "react";
import type { Job } from "~/data/jobs";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import JobDetailsView from "../JobDetailsView";
import ApplicationFormView from "../ApplicationFormView";
import { RecaptchaManager } from "~/components";
import { Toaster } from "sonner";

interface JobDetailsDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailsDialog({
  job,
  isOpen,
  onClose,
}: JobDetailsDialogProps) {
  if (!job) return null;
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<"details" | "form">("details");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setView("details");
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`
          relative w-full max-w-4xl h-[90vh] flex flex-col
          bg-white rounded-sm shadow-2xl overflow-hidden
          transition-all duration-300 ease-out transform
          ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary/10 bg-white sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-secondary font-primary">
              {view === "details"
                ? job.title
                : t("careers.jobApplication") || "نموذج التقديم"}
            </h2>
            {view === "form" && (
              <p className="text-sm text-secondary/60 mt-1 font-secondary">
                {t("careers.applyingFor") || "التقديم لوظيفة"}: {job.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-secondary/50 hover:text-secondary rounded-full hover:bg-secondary/5 transition-colors"
          >
            <span className="sr-only">{t("close") || "إغلاق"}</span>
            <Icon icon="heroicons:x-mark" className="w-8 h-8" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="grow overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-side-2 scrollbar-track-transparent hover:scrollbar-thumb-secondary/50 transition-colors">
          {view === "details" ? (
            <JobDetailsView job={job} t={t} i18n={i18n} />
          ) : (
            <RecaptchaManager>
              <ApplicationFormView
                jobTitle={job.title}
                onBack={() => setView("details")}
                onClose={onClose}
                t={t}
              />
            </RecaptchaManager>
          )}
        </div>

        {/* Footer - Fixed for detail view */}
        {view === "details" && (
          <div className="shrink-0 p-4 border-t border-secondary/10 bg-white flex justify-end">
            <button
              onClick={() => setView("form")}
              className="px-8 py-3 bg-secondary hover:bg-side-2 text-white font-bold rounded-sm shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto font-secondary text-lg"
            >
              {t("careers.apply") || "تقدم الآن"}
            </button>
          </div>
        )}
      </div>
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}
