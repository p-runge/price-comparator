"use client";

import { Calculator, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Combobox } from "~/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TableCell, TableRow } from "~/components/ui/table";
import {
  ConditionLabelMap,
  CONDITIONS,
  LanguageLabelMap,
  LANGUAGES,
  useTrade,
  VARIANTS,
  type Condition,
  type Language,
  type TradeCard,
  type Variant,
} from "~/hooks/trade-provider";
import { POKEMON_MAP } from "~/lib/pokemon";
import CardmarketLink from "./cardmarket-link";

// Prepare options for Combobox
const cardOptions = Object.entries(POKEMON_MAP).map(([id, data]) => ({
  value: id,
  label: `[${id.toUpperCase()}] ${data.name} – ${data.set}`,
}));

export default function CardRow({
  party,
  index,
  card,
}: {
  party: "you" | "partner";
  index: number;
  card: TradeCard;
}) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculatePrice = () => {
    setLoading(true);
    // TODO: Implement calculation logic from Cardmarket
    void new Promise<number>((resolve) => {
      setTimeout(() => resolve(42), 1000); // Mock async operation
    })
      .then((calculatedPrice) => {
        setPrice(calculatedPrice);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const { updateCard } = useTrade();

  return (
    <TableRow>
      <TableCell>
        <Combobox
          options={cardOptions}
          onSelect={(value) => {
            updateCard(party, index, {
              ...card,
              id: value,
            });
          }}
        />
      </TableCell>
      <TableCell>
        <Select
          defaultValue={card.variant}
          onValueChange={(value: Variant) => {
            updateCard(party, index, { ...card, variant: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={card.variant} />
          </SelectTrigger>
          <SelectContent>
            {VARIANTS.map((variant) => (
              <SelectItem key={variant} value={variant}>
                {variant}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          defaultValue={card.language}
          onValueChange={(value: Language) => {
            updateCard(party, index, { ...card, language: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={LanguageLabelMap[card.language]} />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((language) => (
              <SelectItem key={language} value={language}>
                {LanguageLabelMap[language]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          defaultValue={card.condition}
          onValueChange={(value: Condition) => {
            updateCard(party, index, { ...card, condition: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={ConditionLabelMap[card.condition]} />
          </SelectTrigger>
          <SelectContent>
            {CONDITIONS.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {ConditionLabelMap[condition]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{card.id && <CardmarketLink card={card} />}</TableCell>
      <TableCell>
        <Button size="sm" onClick={() => calculatePrice()} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Calculator className="h-4 w-4" />
          )}
        </Button>
      </TableCell>
      <TableCell>{price ?? "--"}</TableCell>
    </TableRow>
  );
}
