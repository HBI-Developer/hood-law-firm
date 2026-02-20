import InfoItem from "../InfoItem";
import { Icon } from "@iconify/react";
import getOpportunities from "../../functions/getOpportunities";
import { JOB_TYPES } from "~/constants";

export default function JobDetailsView({
  job,
  t,
  i18n,
}: {
  job: Job;
  t: any;
  i18n: any;
}) {
  const parseJSON = (str: string) => {
      try {
        return JSON.parse(str);
      } catch {
        return [];
      }
    },
    requirements = parseJSON(job.requirements),
    duties = parseJSON(job.duties),
    expectations = parseJSON(job.expectations),
    notes = job.notes ? parseJSON(job.notes) : null,
    typeKey = JOB_TYPES[job.type as keyof typeof JOB_TYPES] || "full_time",
    typeLabel = t(`careers.${typeKey}`),
    formattedDeadline = new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(job.deadline));

  return (
    <div className="space-y-8 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right">
        <InfoItem
          label={t("careers.opportunities") || "الفرص المتوفرة"}
          value={getOpportunities(job.opportunities, i18n.language)}
          icon={<Icon icon="heroicons:user-group" className="w-5 h-5" />}
        />
        <InfoItem
          label={t("careers.jobType") || "نوع الوظيفة"}
          value={typeLabel}
          icon={<Icon icon="heroicons:briefcase" className="w-5 h-5" />}
        />
        <InfoItem
          label={t("careers.experience") || "الخبرة"}
          value={job.experience}
          icon={<Icon icon="heroicons:clock" className="w-5 h-5" />}
        />
        <InfoItem
          label={t("careers.deadline") || "آخر موعد للتقديم"}
          value={formattedDeadline}
          icon={<Icon icon="heroicons:calendar" className="w-5 h-5" />}
        />
      </div>

      <section>
        <h3 className="text-xl font-bold text-side-2 mb-4 border-b border-secondary/10 pb-2 font-primary">
          {t("careers.jobDescription") || "الوصف الوظيفي"}
        </h3>
        <p className="text-secondary/80 leading-relaxed whitespace-pre-line font-secondary text-lg">
          {job.description}
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-side-2 mb-4 border-b border-secondary/10 pb-2 font-primary">
          {t("careers.duties") || "المهام والمسؤوليات"}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-secondary/80 font-secondary text-lg">
          {duties.map((duty: string, idx: number) => (
            <li key={idx}>{duty}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-side-2 mb-4 border-b border-secondary/10 pb-2 font-primary">
          {t("careers.requirements") || "المتطلبات"}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-secondary/80 font-secondary text-lg">
          {requirements.map((req: string, idx: number) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-side-2 mb-4 border-b border-secondary/10 pb-2 font-primary">
          {t("careers.expectations") || "التوقعات"}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-secondary/80 font-secondary text-lg">
          {expectations.map((exp: string, idx: number) => (
            <li key={idx}>{exp}</li>
          ))}
        </ul>
      </section>
      {notes ? (
        <section>
          <h3 className="text-xl font-bold text-side-2 mb-4 border-b border-secondary/10 pb-2 font-primary">
            {t("careers.notes") || "ملاحظات إضافية"}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-secondary/80 font-secondary text-lg">
            {notes.map((note: string, idx: number) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
