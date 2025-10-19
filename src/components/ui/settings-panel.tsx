"use client";

import { useDefaultSettings } from "~/hooks/default-settings-provider";
import {
  ConditionLabelMap,
  CONDITIONS,
  LanguageLabelMap,
  LANGUAGES,
  VARIANTS,
} from "~/hooks/trade-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export function SettingsPanel() {
  const { defaultSettings, setDefaultSettings } = useDefaultSettings();

  return (
    <div>
      <h2 className="text-lg font-semibold">Default Settings</h2>
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-semibold">Variant</label>
          <Select
            value={defaultSettings.variant}
            onValueChange={(value) =>
              setDefaultSettings({
                ...defaultSettings,
                variant: value as (typeof VARIANTS)[number],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a variant" />
            </SelectTrigger>
            <SelectContent>
              {VARIANTS.map((variant) => (
                <SelectItem key={variant} value={variant}>
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold">Language</label>
          <Select
            value={defaultSettings.language}
            onValueChange={(value) =>
              setDefaultSettings({
                ...defaultSettings,
                language: value as (typeof LANGUAGES)[number],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language} value={language}>
                  {LanguageLabelMap[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold">Condition</label>
          <Select
            value={defaultSettings.condition}
            onValueChange={(value) =>
              setDefaultSettings({
                ...defaultSettings,
                condition: value as (typeof CONDITIONS)[number],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITIONS.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {ConditionLabelMap[condition]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
