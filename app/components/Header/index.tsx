import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Icon } from "@iconify/react";
import { LanguageSwitcher, NavLink } from "../";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { LOGO_BY_LANGUAGE, NAV_LINKS } from "~/constants";

export default function Header() {
  const { t } = useTranslation();
  const { locale, direction } = useSelector(
    (state: RootState) => state.language,
  );
  const isRTL = locale === "ar";

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-18 z-50 flex items-center border-b border-white/10 bg-primary/70 backdrop-blur-md shadow-sm`}
    >
      <nav className="container mx-auto px-4 md:px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center h-8">
          <img
            src={`${LOGO_BY_LANGUAGE[locale]}`}
            alt="Hood bin Adel Logo"
            className="h-full w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 items-center">
            {NAV_LINKS.map((link) => {
              const target = `/${locale}${link.path}`.replace(/\/$/, "");

              return (
                <li key={target}>
                  <NavLink
                    to={target}
                    className={({ isActive }) => `
                    relative py-2 text-[12px] lg:text-sm font-secondary transition-all duration-300
                    ${isActive ? "text-side-1 font-bold" : "text-secondary hover:text-side-2"}
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 
                    after:bg-side-2 after:scale-x-0 hover:after:scale-x-100 after:transition-transform
                    ${isActive ? "after:scale-x-100" : ""}
                  `}
                    end={link.path === "/"}
                  >
                    {t(link.name)}
                  </NavLink>
                </li>
              );
            })}
          </ul>
          <div className="h-6 w-px bg-secondary/20" />
          <LanguageSwitcher />
        </div>

        <DialogTrigger>
          <Button aria-label="Open Menu" className="md:hidden p-2 outline-none">
            <Icon icon="lucide:menu" width="28" className="text-secondary" />
          </Button>

          <ModalOverlay
            isDismissable
            isKeyboardDismissDisabled
            className={({ isEntering, isExiting }) => `
              fixed inset-0 z-100 bg-black/25 backdrop-blur-sm
              ${isEntering ? "animate-fade-in" : ""}
              ${isExiting ? "animate-fade-out" : ""}
            `}
          >
            <Modal
              data-panel-direction={isRTL ? "rtl" : "ltr"}
              className={({ isEntering, isExiting }) => `
                fixed top-0 bottom-0 h-full w-70 bg-primary shadow-2xl p-6 outline-none
                end-0 transition duration-300 ease-in-out

                ${
                  isEntering
                    ? `ltr:translate-x-full rtl:-translate-x-full`
                    : `animate-slide-in-${direction}`
                }
                ${isExiting ? "delay-0 ltr:translate-x-full rtl:-translate-x-full" : ""}
              `}
            >
              <Dialog className="flex flex-col h-full focus:outline-none p-6">
                {({ close }) => (
                  <>
                    <div className="flex justify-between items-center mb-10">
                      <span className="font-primary font-bold text-side-1 text-xl">
                        {isRTL ? "القائمة" : "Menu"}
                      </span>
                      <Button
                        onPress={close}
                        className="p-2 text-secondary hover:bg-secondary/10 rounded-full transition-colors outline-none"
                      >
                        <Icon icon="lucide:x" width="24" />
                      </Button>
                    </div>

                    <nav className="flex flex-col gap-4 grow">
                      <ul className="space-y-4">
                        {NAV_LINKS.map((link) => {
                          const target = `/${locale}${link.path}`.replace(
                            /\/$/,
                            "",
                          );

                          return (
                            <li key={target}>
                              <NavLink
                                to={target}
                                onClick={() => close()}
                                className={({ isActive }) => `
                                  relative py-2 text-lg font-secondary transition-all duration-300
                                  ${isActive ? "text-side-1 font-bold" : "text-secondary hover:text-side-2"}
                                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 
                                  after:bg-side-2 after:scale-x-0 hover:after:scale-x-100 after:transition-transform
                                  ${isActive ? "after:scale-x-100" : ""}
                                `}
                                end={link.path === "/"}
                              >
                                {t(link.name)}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>

                    <div className="mt-auto border-t border-secondary/10 pt-6">
                      <LanguageSwitcher fullWidth close={close} />
                    </div>
                  </>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      </nav>
    </header>
  );
}
