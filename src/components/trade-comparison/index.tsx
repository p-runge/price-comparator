"use client";

import { DefaultSettingsProvider } from "~/hooks/default-settings-provider";
import { TradeProvider, useTrade } from "~/hooks/trade-provider";
import { SettingsPanel } from "../settings-panel";
import TradeParty from "./trade-party";

export default function TradeComparison() {
  return (
    <TradeProvider>
      <DefaultSettingsProvider>
        <div className="mb-3">
          <SettingsPanel />
        </div>
        <TradeComparisonContent />
      </DefaultSettingsProvider>
    </TradeProvider>
  );
}

export function TradeComparisonContent() {
  const { trade } = useTrade();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TradeParty party="you" cards={trade.yourCards} />
      <TradeParty party="partner" cards={trade.partnerCards} />
    </div>
  );
}
