import { useState, useEffect } from "react";
import { getFixedT } from "~/i18n/server";
import {
  data,
  type LoaderFunctionArgs,
  useLoaderData,
  redirect,
  useParams,
  useFetcher,
  useRouteError,
  isRouteErrorResponse,
  useRevalidator,
} from "react-router";
import { useTranslation } from "react-i18next";
import { EmptyState, JobDetailsDialog, JobPanel } from "./components";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { NavLink } from "~/components";
import { CAREERS_IN_PAGE } from "~/constants";
import { isHiddenOverflow, isVisibleOverflow } from "~/store/slices/loading";
import { hooddb } from "~/constants.server";
export { action } from "./actions/sendApplication";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request),
    locale = (params.lang || "en") as Locale,
    url = new URL(request.url);

  let page = parseInt(params.page || "1");
  if (isNaN(page) || page < 1) {
    return redirect(`${url.origin}/${locale}/careers`);
  }

  const totalCountResult = await hooddb.getCareersCount(locale),
    totalCount = totalCountResult || 0,
    totalPages = Math.ceil(totalCount / CAREERS_IN_PAGE);

  if (totalPages > 0 && page > totalPages) {
    url.searchParams.set("page", totalPages.toString());
    return redirect(url.toString());
  }

  const jobs = await hooddb.getCareers(
    locale,
    CAREERS_IN_PAGE,
    (page - 1) * CAREERS_IN_PAGE,
  );

  return data({
    jobs: jobs as Job[],
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
    },
    metaTags: {
      title: t("title", { title: t("link.careers") }),
      description: t("careers.description") || "Join our team",
    },
  });
};

// @ts-expect-error TypeScript Analyzer is wrong
export function meta({ data }: typeof loader) {
  if (!data) return [{ title: "Law Firm" }];

  const { title, description } = data.metaTags;

  return [{ title }, { name: "description", content: description }];
}

export default function Careers() {
  const { t } = useTranslation(),
    { jobs, pagination } = useLoaderData<typeof loader>(),
    [selectedJob, setSelectedJob] = useState<Job | null>(null),
    [isLoading, setIsLoading] = useState(false),
    fetcher = useFetcher(),
    direction = useSelector((state: RootState) => state.language.direction),
    dispatch = useDispatch(),
    { page } = useParams();

  useEffect(() => {
    setIsLoading(false);
  }, [jobs]);

  useEffect(() => {
    if (!!selectedJob) {
      dispatch(isHiddenOverflow());
    } else {
      dispatch(isVisibleOverflow());
    }

    return () => {
      dispatch(isVisibleOverflow());
    };
  }, [selectedJob]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setIsLoading(false);
    }
  }, [fetcher.data, fetcher.state]);

  const handleRefresh = () => {
      setIsLoading(true);
      const url = new URL(window.location.href);
      fetcher.load(url.pathname + url.search);
    },
    createPageUrl = (pageNumber: number) => {
      const params = useParams();
      return `/${params.lang}/careers/${pageNumber}`;
    };

  return (
    <div className="w-full relative min-h-[60vh]">
      <div className="px-4 py-8 md:py-12 rtl:text-right">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-right md:rtl:text-right md:ltr:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4 font-primary">
              {t("careers.heading") || "انضم إلى فريقنا"}
            </h1>
            <p className="text-lg text-secondary/80 max-w-2xl font-secondary">
              {t("careers.describe") ||
                "نبحث دائماً عن الموهوبين والشغوفين في المجال القانوني ليصنعوا معنا الفرق."}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-sm
              bg-side-2 text-secondary font-bold
              shadow-md hover:shadow-lg hover:bg-white
              transition-all duration-300
              ${isLoading ? "opacity-70 cursor-wait" : ""}
            `}
          >
            <Icon
              icon="heroicons:arrow-path"
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="font-secondary tracking-wide text-lg">
              {isLoading
                ? t("careers.refreshing") || "جاري التحديث..."
                : t("careers.refresh") || "تحديث البيانات"}
            </span>
          </button>
        </div>

        <div className="relative min-h-50">
          {isLoading && (
            <div
              className={`absolute inset-0 z-10 bg-primary/60 backdrop-blur-[2px] flex items-start justify-center pt-20 transition-all duration-500 rounded-sm`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-side-2 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-secondary font-bold text-lg font-secondary">
                  {t("careers.loading") || "جاري التحميل..."}
                </p>
              </div>
            </div>
          )}

          <div
            className={`space-y-6 transition-opacity duration-500 ${isLoading ? "opacity-40" : "opacity-100"}`}
          >
            {jobs.length > 0 ? (
              <>
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <JobPanel key={job.id} job={job} onApply={setSelectedJob} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pb-8">
                    {pagination.currentPage > 1 ? (
                      <NavLink
                        to={createPageUrl(pagination.currentPage - 1)}
                        className="p-2 rounded-sm border border-secondary/10 hover:bg-secondary/5 transition-colors"
                      >
                        <Icon
                          icon={
                            direction === "rtl"
                              ? "heroicons:chevron-right"
                              : "heroicons:chevron-left"
                          }
                          className="w-6 h-6 text-secondary"
                        />
                      </NavLink>
                    ) : (
                      <button
                        disabled
                        className="p-2 rounded-sm border border-secondary/10 opacity-30 cursor-not-allowed"
                      >
                        <Icon
                          icon={
                            direction === "rtl"
                              ? "heroicons:chevron-right"
                              : "heroicons:chevron-left"
                          }
                          className="w-6 h-6 text-secondary"
                        />
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1,
                      ).map((p) => {
                        if (pagination.totalPages > 7) {
                          if (
                            p === 1 ||
                            p === pagination.totalPages ||
                            Math.abs(p - pagination.currentPage) <= 1
                          ) {
                            return (
                              <NavLink
                                key={p}
                                to={createPageUrl(p)}
                                className={({ isActive }) =>
                                  `w-10 h-10 rounded-sm font-bold transition-all flex items-center justify-center ${
                                    isActive || (!page && p === 1)
                                      ? "bg-secondary text-white"
                                      : "hover:bg-secondary/5 text-secondary"
                                  }`
                                }
                              >
                                {p}
                              </NavLink>
                            );
                          }
                          if (p === 2 || p === pagination.totalPages - 1) {
                            return (
                              <span key={p} className="text-secondary/30">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <NavLink
                            key={p}
                            to={createPageUrl(p)}
                            className={({ isActive }) =>
                              `w-10 h-10 rounded-sm font-bold transition-all flex items-center justify-center ${
                                isActive || (!page && p === 1)
                                  ? "bg-secondary text-white"
                                  : "hover:bg-secondary/5 text-secondary"
                              }`
                            }
                          >
                            {p}
                          </NavLink>
                        );
                      })}
                    </div>

                    {pagination.currentPage < pagination.totalPages ? (
                      <NavLink
                        to={createPageUrl(pagination.currentPage + 1)}
                        className="p-2 rounded-sm border border-secondary/10 hover:bg-secondary/5 transition-colors"
                      >
                        <Icon
                          icon={
                            direction === "rtl"
                              ? "heroicons:chevron-left"
                              : "heroicons:chevron-right"
                          }
                          className="w-6 h-6 text-secondary"
                        />
                      </NavLink>
                    ) : (
                      <button
                        disabled
                        className="p-2 rounded-sm border border-secondary/10 opacity-30 cursor-not-allowed"
                      >
                        <Icon
                          icon={
                            direction === "rtl"
                              ? "heroicons:chevron-left"
                              : "heroicons:chevron-right"
                          }
                          className="w-6 h-6 text-secondary"
                        />
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <JobDetailsDialog
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError(),
    { t } = useTranslation(),
    revalidator = useRevalidator();

  let errorTitle = t("errors.error_fetching_data");

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} - ${error.statusText}`;
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-secondary/10 max-w-lg w-full">
        <div className="text-secondary mb-6 flex justify-center">
          <Icon
            icon="heroicons:exclamation-triangle"
            className="w-20 h-20 opacity-80"
          />
        </div>
        <h2 className="text-3xl font-bold text-secondary mb-3 font-primary">
          {errorTitle}
        </h2>
        <button
          onClick={() => revalidator.revalidate()}
          className="
            flex items-center justify-center gap-2 px-8 py-3 rounded-sm mx-auto
            bg-side-2 text-secondary font-bold text-lg
            shadow-md hover:shadow-lg hover:bg-opacity-90
            transition-all duration-300 transform hover:-translate-y-1
          "
        >
          <Icon icon="heroicons:arrow-path" className="w-6 h-6" />
          <span className="font-secondary tracking-wide">
            {t("errors.retry_fetch") || "Retry"}
          </span>
        </button>
      </div>
    </div>
  );
}
