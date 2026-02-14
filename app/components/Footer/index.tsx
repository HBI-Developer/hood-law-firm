import { useTranslation } from "react-i18next";
import { Icon as Iconify } from "@iconify/react";
import { LEGAL_LINKS, MAP_LINK, NAV_LINKS, PHONE_NUMBER } from "~/constants";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import NavLink from "../NavLink";

interface SocialIconProps {
  Icon: string;
  href: string;
  label: string;
}

function SocialIcon({ Icon, href, label }: SocialIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-side-2 hover:text-secondary hover:border-side-2 transition-all duration-300"
    >
      <Iconify fontSize={20} icon={Icon} />
    </a>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { locale } = useSelector((state: RootState) => state.language);

  return (
    <footer
      className="bg-secondary text-primary pt-20 pb-10 border-t border-side-2/10"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* قسم التواصل */}
          <div className="space-y-6">
            <h3 className="text-2xl font-primary font-bold text-side-2">
              {t("footer.contact_title")}
            </h3>
            <ul className="space-y-4 font-secondary opacity-90">
              <li className="flex items-start gap-3">
                <Iconify
                  fontSize={22}
                  icon="lucide:mail"
                  className="text-side-2 mt-1 shrink-0"
                />
                <a
                  href="mailto:info@qmaslaw.com"
                  className="hover:text-side-2 transition-colors break-all"
                >
                  info@hoodadellaw.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Iconify
                  icon="lucide:phone"
                  fontSize={22}
                  className="text-side-2 mt-1 shrink-0"
                />
                <div className="flex flex-col gap-1" dir="ltr">
                  <a
                    className="hover:text-side-2 transition-colors"
                    href={`tel:+${PHONE_NUMBER}`}
                  >
                    +{PHONE_NUMBER}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Iconify
                  icon="lucide:map-pin"
                  fontSize={22}
                  className="text-side-2 mt-1 shrink-0"
                />
                <a
                  className="hover:text-side-2 transition-colors"
                  href={MAP_LINK}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("footer.address_text")}
                </a>
              </li>
            </ul>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-6">
            <h3 className="text-xl font-primary font-bold">
              {t("footer.quick_links")}
            </h3>
            <ul className="flex flex-col gap-3 font-secondary opacity-80">
              {NAV_LINKS.map((link, index) => (
                <li key={index}>
                  <NavLink
                    end={link.path === "/"}
                    to={`/${locale}${link.path === "/" ? "" : link.path}`}
                    className="hover:text-side-2 hover:translate-x-2 rtl:hover:-translate-x-2 transition-all inline-block"
                  >
                    {t(link.name)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط قانونية */}
          <div className="space-y-6">
            <h3 className="text-xl font-primary font-bold">
              {t("footer.legal")}
            </h3>
            <ul className="flex flex-col gap-3 font-secondary opacity-80">
              {LEGAL_LINKS.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={`/${locale}${item.path}`}
                    className="hover:text-side-2 transition-colors"
                  >
                    {t(`${item.name}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* وسائل التواصل الاجتماعي */}
          <div className="space-y-6">
            <h3 className="text-xl font-primary font-bold text-center md:text-start">
              {t("footer.follow_us")}
            </h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <SocialIcon
                Icon="ri:linkedin-fill"
                href="https://linkedin.com/"
                label="LinkedIn"
              />
              <SocialIcon
                Icon="ri:facebook-fill"
                href="https://facebook.com/"
                label="Facebook"
              />
              <SocialIcon
                Icon="ri:instagram-line"
                href="https://instagram.com/"
                label="Instagram"
              />
              <SocialIcon
                Icon="ri:twitter-x-fill"
                href="https://x.com/"
                label="X"
              />
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="pt-8 border-t border-white/5 text-center opacity-60 font-secondary text-sm">
          <p>{t("footer.rights", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
