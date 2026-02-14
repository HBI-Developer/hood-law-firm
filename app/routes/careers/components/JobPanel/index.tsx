import type { Job } from "~/data/jobs";
import { JOB_TYPES } from "~/data/jobs";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import getOpportunities from "../../functions/getOpportunities";

interface JobPanelProps {
  job: Job;
  onApply: (job: Job) => void;
}

export default function JobPanel({ job, onApply }: JobPanelProps) {
  const { t } = useTranslation();
  const language = useSelector((state: RootState) => state.language.locale);

  const typeKey = JOB_TYPES[job.type as keyof typeof JOB_TYPES] || "full_time";
  const typeLabel = t(`careers.${typeKey}`);

  return (
    <div className="bg-white rounded-sm shadow-sm border border-secondary/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md hover:border-side-2 transition-all duration-300 group">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-secondary mb-2 font-primary group-hover:text-side-2 transition-colors">
          {job.title}
        </h3>
        <p className="text-secondary/70 line-clamp-2 font-secondary text-lg">
          {job.overview}
        </p>
        <div className="flex items-center gap-6 mt-3 text-secondary/60 font-secondary">
          <span className="flex items-center gap-2">
            <Icon icon="heroicons:briefcase" className="w-5 h-5 text-side-2" />
            {typeLabel}
          </span>
          <span className="flex items-center gap-2">
            <Icon icon="heroicons:user-group" className="w-5 h-5 text-side-2" />
            {getOpportunities(job.opportunities, language)}
          </span>
        </div>
      </div>
      <button
        onClick={() => onApply(job)}
        className="px-8 py-2.5 bg-secondary text-white font-medium rounded-sm hover:bg-side-2 transition-colors duration-200 shrink-0 min-w-35 font-secondary text-lg"
      >
        {t("careers.apply") || "تقدم"}
      </button>
    </div>
  );
}
