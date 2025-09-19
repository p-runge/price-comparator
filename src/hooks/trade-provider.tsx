import { createContext, type ReactNode, useContext, useState } from "react";

export type Trade = {
  yourCards: TradeCard[];
  partnerCards: TradeCard[];
};

export const VARIANTS = [
  "Unlimited",
  "1st Edition",
  "Limited Edition",
  "Shadowless",
  "Holo",
  "Reverse Holo",
  "Promo",
  "Full Art",
  "Secret Rare",
  "Gold Rare",
] as const;
export type Variant = (typeof VARIANTS)[number];

export const LANGUAGES = [
  "EN",
  "DE",
  "FR",
  "IT",
  "ES",
  "JP",
  "KR",
  "CN",
  "PT",
] as const;
export type Language = (typeof LANGUAGES)[number];

export const CONDITIONS = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Good",
  "Lightly Played",
  "Played",
  "Poor",
] as const;
export type Condition = (typeof CONDITIONS)[number];

export type TradeCard = {
  name?: string;
  id: string;
  variant: Variant;
  language: Language;
  condition: Condition;
};

type TradeContextType = {
  trade: Trade;
  setTrade: (trade: Trade) => void;
  addCardTo: (who: "you" | "partner", card: TradeCard) => void;
};

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider = ({ children }: { children: ReactNode }) => {
  const [trade, setTrade] = useState<Trade>({
    yourCards: [],
    partnerCards: [],
  });

  const addCardTo = (who: "you" | "partner", card: TradeCard) => {
    setTrade((prev) => {
      let yourCards: TradeCard[] = prev?.yourCards ?? [];
      let partnerCards: TradeCard[] = prev?.partnerCards ?? [];

      if (who === "you") {
        yourCards = [...yourCards, card];
      } else {
        partnerCards = [...partnerCards, card];
      }

      return { yourCards, partnerCards };
    });
  };

  return (
    <TradeContext.Provider value={{ trade, setTrade, addCardTo }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error("useTrade must be used within a TradeProvider");
  }
  return context;
};
