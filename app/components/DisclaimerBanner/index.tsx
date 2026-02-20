import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function DisclaimerBanner() {
  const { t } = useTranslation(),
    [isVisible, setIsVisible] = useState(true);

  if (!isVisible && sessionStorage.closeDisclaimer === "true") return null;

  return (
    <div className="fixed bottom-6 left-1/2 rounded-2xl -translate-x-1/2 z-50 w-[90%] max-w-lg animate-fade-in-up backdrop-blur-xs bg-secondary/60">
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-side-2/20 text-side-2">
              <Icon icon="mdi:information-variant" className="h-6 w-6" />
            </div>
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-sm font-bold font-primary mb-1 text-center text-side-2">
              {t("disclaimer.title")}
            </h3>
            <p className="text-xs text-white font-secondary leading-relaxed text-justify [text-align-last:center]">
              {t("disclaimer.message")}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              sessionStorage.setItem("closeDisclaimer", "true");
            }}
            className="shrink-0 text-white/50 hover:text-white transition-colors"
          >
            <Icon icon="mdi:close" className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-side-2/20 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-secondary/20 blur-2xl rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
