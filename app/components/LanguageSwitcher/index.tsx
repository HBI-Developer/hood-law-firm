import { useTranslation } from "react-i18next";
import { Button } from "react-aria-components";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { setLanguage } from "~/store/slices/language";
import { useNavigate } from "react-router";
import { isHiddenOverflow, isLoading } from "~/store/slices/loading";

export default function LanguageSwitcher({
  fullWidth,
  close,
}: {
  fullWidth?: boolean;
  close?: () => void;
}) {
  const { i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.language.locale);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    dispatch(isLoading());
    dispatch(isHiddenOverflow());
    setTimeout(() => {
      const newLang = language === "ar" ? "en" : "ar";
      const newPath = location.pathname.replace(`/${language}`, `/${newLang}`);
      dispatch(setLanguage(newLang));
      i18n.changeLanguage(newLang);
      localStorage.setItem("i18nextLng", newLang);
      navigate(newPath);
      close?.();
    }, 300);
  };

  return (
    <Button
      onPress={toggleLanguage}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 font-secondary rounded-lg
        transition-all duration-300 border border-side-2/30
        hover:bg-side-2 hover:text-secondary hover:shadow-md
        ${fullWidth ? "w-full text-lg py-4 bg-side-2/10" : "text-sm"}
      `}
    >
      <Icon icon="lucide:languages" width="18" />
      {language === "ar" ? "English" : "عربي"}
    </Button>
  );
}
