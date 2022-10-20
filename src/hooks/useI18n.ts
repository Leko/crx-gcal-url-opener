import { useMemo } from "react";
import messages from "../../_locales/en/messages.json";

export function useI18n() {
  const language = useMemo(() => chrome.i18n.getUILanguage(), []);
  const { timeFormatter, t } = useMemo(
    () => ({
      timeFormatter: new Intl.DateTimeFormat(language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      t(key: keyof typeof messages, substitutions?: string | string[]): string {
        return chrome.i18n.getMessage(key, substitutions);
      },
    }),
    [language]
  );

  return {
    language,
    t,
    timeFormatter,
  };
}
