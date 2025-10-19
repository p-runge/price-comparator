import { createContext, useContext, useState, type ReactNode } from "react";
import {
  CONDITIONS,
  LANGUAGES,
  VARIANTS,
  type Condition,
  type Language,
  type Variant,
} from "~/hooks/trade-provider";

export type DefaultSettings = {
  variant: Variant;
  language: Language;
  condition: Condition;
};

const DefaultSettingsContext = createContext<{
  defaultSettings: DefaultSettings;
  setDefaultSettings: (settings: DefaultSettings) => void;
} | null>(null);

export const DefaultSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [defaultSettings, setDefaultSettings] = useState<DefaultSettings>({
    variant: VARIANTS[0],
    language: LANGUAGES[0],
    condition: CONDITIONS[1],
  });

  return (
    <DefaultSettingsContext.Provider
      value={{ defaultSettings, setDefaultSettings }}
    >
      {children}
    </DefaultSettingsContext.Provider>
  );
};

export const useDefaultSettings = () => {
  const context = useContext(DefaultSettingsContext);
  if (!context) {
    throw new Error(
      "useDefaultSettings must be used within a DefaultSettingsProvider",
    );
  }
  return context;
};
