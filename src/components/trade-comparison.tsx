"use client";

import { Calculator, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import {
  CONDITIONS,
  LANGUAGES,
  TradeProvider,
  useTrade,
  VARIANTS,
  type TradeCard,
} from "~/hooks/trade-provider";
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
            updateCard(party, index, { ...card, id: e.target.value });
          }}
        />
      </TableCell>
      <TableCell>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={card.variant} />
          </SelectTrigger>
          <SelectContent>
            {VARIANTS.map((variant) => (
              <SelectItem
                key={variant}
                value={variant}
                onClick={() => {
                  updateCard(party, index, { ...card, variant });
                }}
              >
                {variant}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={card.language} />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((language) => (
              <SelectItem
                key={language}
                value={language}
                onClick={() => {
                  updateCard(party, index, { ...card, language });
                }}
              >
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={card.condition} />
          </SelectTrigger>
          <SelectContent>
            {CONDITIONS.map((condition) => (
              <SelectItem
                key={condition}
                value={condition}
                onClick={() => {
                  updateCard(party, index, { ...card, condition });
                }}
              >
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {card.id ? (
          <a
            href={`https://www.cardmarket.com/en/Pokemon/Products/Singles/${card.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Link
          </a>
        ) : (
          "--"
        )}
      </TableCell>
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
