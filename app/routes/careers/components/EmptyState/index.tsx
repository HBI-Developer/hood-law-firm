import { useTranslation } from "react-i18next";

export default function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-24 h-24 bg-secondary/5 rounded-full flex items-center justify-center mb-6 border border-secondary/10">
        <svg
          className="w-12 h-12 text-secondary/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-secondary mb-2 font-primary">
        {t("careers.noJobsAvailable") || "لا توجد وظائف متاحة حاليًا"}
      </h3>
      <p className="text-secondary/60 max-w-md mx-auto font-secondary text-lg">
        {t("careers.noJobsMessage") ||
          "نأسف، ليس لدينا أي شواغر في الوقت الحالي. يرجى التحقق مرة أخرى لاحقًا أو متابعتنا على وسائل التواصل الاجتماعي لمعرفة الفرص الجديدة."}
      </p>
    </div>
  );
}
