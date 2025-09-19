"use client";

import { Calculator, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import {
  ConditionLabelMap,
  CONDITIONS,
  LanguageLabelMap,
  LANGUAGES,
  TradeProvider,
  useTrade,
  VARIANTS,
  type Condition,
  type Language,
  type TradeCard,
  type Variant,
} from "~/hooks/trade-provider";
import { getCardDataFromShort } from "~/lib/pokemon";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function TradeComparison() {
  return (
    <TradeProvider>
      <TradeComparisonContent />
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

function TradeParty({
  party,
  cards,
}: {
  party: "you" | "partner";
  cards: TradeCard[];
}) {
  const { addCard } = useTrade();

  return (
    <Card className="px-2">
      <CardTitle>
        {party === "you" ? "Your Cards" : "Partner's Cards"}
      </CardTitle>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card Name</TableHead>
              <TableHead>Card ID</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>CM Link</TableHead>
              <TableHead>Calculate</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card, index) => (
              <CardRow key={index} party={party} index={index} card={card} />
            ))}
            {/* plus button row */}
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    addCard(party, {
                      name: undefined,
                      id: "",
                      variant: VARIANTS[0],
                      language: LANGUAGES[0],
                      condition: CONDITIONS[0],
                    });
                  }}
                >
                  <Plus /> Add Card
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex gap-4">
                  <div>Total Cards: {cards.length}</div>
                  {/* 
                    // TODO: Add total value calculation 
                  */}
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

function CardRow({
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
      <TableCell>{card.name ?? "--"}</TableCell>
      <TableCell>
        <Input
          type="text"
          placeholder="ng9"
          value={card.id}
          onChange={(e) => {
            const name = getCardDataFromShort(e.target.value)?.name;
            updateCard(party, index, { ...card, id: e.target.value, name });
          }}
        />
      </TableCell>
      <TableCell>
        <Select
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
      <TableCell>{card.name && <CardmarketLink card={card} />}</TableCell>
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

function CardmarketLink({ card }: { card: TradeCard }) {
  const cardData = getCardDataFromShort(card.id);
  if (!cardData) return null;

  const url = new URL("https://www.cardmarket.com/en/Pokemon/Products/Singles");
  url.pathname += `/${cardData.set.replaceAll(" ", "-")}/${cardData.name.replaceAll(
    " ",
    "-",
  )}-${card.id.toUpperCase()}`;
  url.searchParams.append("language", card.language);
  if (card.condition !== "7") {
    url.searchParams.append("minCondition", card.condition);
  }
  if (card.variant === "1st Edition") {
    url.searchParams.append("isFirstEd", "Y");
  } else if (card.variant === "Unlimited") {
    url.searchParams.append("isFirstEd", "N");
  }

  return (
    <a
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      Link
    </a>
  );
}
