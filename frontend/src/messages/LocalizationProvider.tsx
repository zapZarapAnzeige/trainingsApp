import { Fragment, cloneElement, ReactElement } from "react";
import { IntlProvider, createIntl } from "react-intl";
import messagesEN from "./messages/en.json";
import messagesDE from "./messages/de.json";

interface LocalizationProviderProps {
  locale: string;
  children: React.ReactNode;
}

const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
  locale,
}) => {
  let messages = messagesEN;

  if (locale === "de") {
    messages = messagesDE;
  }

  const intl = createIntl({
    locale,
    messages,
  });

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      defaultLocale="en"
      textComponent={Fragment}
    >
      {cloneElement(children as ReactElement, { intl })}
    </IntlProvider>
  );
};

export default LocalizationProvider;
