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

export const LANGUAGES = ["1", "2", "3", "4", "5"] as const;
export type Language = (typeof LANGUAGES)[number];
export const LanguageLabelMap: Record<Language, string> = {
  1: "EN",
  2: "FR",
  3: "DE",
  4: "ES",
  5: "IT",
};

export const CONDITIONS = ["1", "2", "3", "4", "5", "6", "7"] as const;
export type Condition = (typeof CONDITIONS)[number];
export const ConditionLabelMap: Record<Condition, string> = {
  1: "Mint",
  2: "Near Mint",
  3: "Excellent",
  4: "Good",
  5: "Lightly Played",
  6: "Played",
  7: "Poor",
};

export type TradeCard = {
  id: string;
  variant: Variant;
  language: Language;
  condition: Condition;
};

type TradeContextType = {
  trade: Trade;
  setTrade: (trade: Trade) => void;
  addCard: (who: "you" | "partner", card: TradeCard) => void;
  updateCard: (who: "you" | "partner", index: number, card: TradeCard) => void;
};

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider = ({ children }: { children: ReactNode }) => {
  const [trade, setTrade] = useState<Trade>({
    yourCards: [],
    partnerCards: [],
  });

  const addCard = (who: "you" | "partner", card: TradeCard) => {
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

  const updateCard = (
    who: "you" | "partner",
    index: number,
    card: TradeCard,
  ) => {
    setTrade((prev) => {
      const yourCards: TradeCard[] = prev?.yourCards ?? [];
      const partnerCards: TradeCard[] = prev?.partnerCards ?? [];

      if (who === "you") {
        yourCards[index] = card;
      } else {
        partnerCards[index] = card;
      }

      return { yourCards, partnerCards };
    });
  };

  return (
    <TradeContext.Provider value={{ trade, setTrade, addCard, updateCard }}>
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
