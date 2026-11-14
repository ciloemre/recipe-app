import { Menu, UnstyledButton, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDirection } from "@mantine/core";
import {
  AppLocale,
  SUPPORTED_LOCALES,
  applyDocumentDirection,
} from "../../i18n";
import classes from "./HeaderSearch.module.css";

const LABELS: Record<AppLocale, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
};

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const { setDirection } = useDirection();
  const current = (i18n.language?.slice(0, 2) || "tr") as AppLocale;

  const changeLocale = (locale: AppLocale) => {
    void i18n.changeLanguage(locale);
    const dir = applyDocumentDirection(locale);
    setDirection(dir);
  };

  return (
    <Menu shadow="md" width={120} position="bottom-end" withinPortal>
      <Menu.Target>
        <Tooltip label={t("common.language")} position="bottom">
          <UnstyledButton
            className={classes.langButton}
            aria-label={t("common.language")}
          >
            {LABELS[SUPPORTED_LOCALES.includes(current) ? current : "tr"]}
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {SUPPORTED_LOCALES.map((locale) => (
          <Menu.Item
            key={locale}
            onClick={() => changeLocale(locale)}
            data-active={locale === current || undefined}
          >
            {LABELS[locale]}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
