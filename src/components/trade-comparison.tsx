"use client";

import { Calculator, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Trade = {
  yourCards: Card[];
  partnerCards: Card[];
};

type Variant =
  | "Unlimited"
  | "1st Edition"
  | "Limited Edition"
  | "Shadowless"
  | "Holo"
  | "Reverse Holo"
  | "Promo"
  | "Full Art"
  | "Secret Rare"
  | "Gold Rare";
type Language = "EN" | "DE" | "FR" | "IT" | "ES" | "JP" | "KR" | "CN" | "PT";
type Condition =
  | "Mint"
  | "Near Mint"
  | "Excellent"
  | "Good"
  | "Lightly Played"
  | "Played"
  | "Poor";

type Card = {
  name?: string; // e.g. "Clefable (Jungle)" or "Lugia (Neo Genesis)"
  id: string; // e.g. "ju1" for "Clefable" from "Jungle" or "ng9" for "Lugia" from "Neo Genesis"
  variant: Variant;
  language: Language;
  condition: Condition;
};

const trade: Trade = {
  yourCards: [
    {
      id: "ju54",
      variant: "Holo",
      language: "EN",
      condition: "Near Mint",
    },
  ],
  partnerCards: [
    {
      id: "ng9",
      variant: "Reverse Holo",
      language: "DE",
      condition: "Lightly Played",
    },
  ],
};

export default function TradeComparison() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TradeParty title="Your Cards" cards={trade.yourCards} />
      <TradeParty title="Partner's Cards" cards={trade.partnerCards} />
    </div>
  );
}

function TradeParty({ title, cards }: { title: string; cards: Card[] }) {
  return (
    <Card className="px-2">
      <CardTitle>{title}</CardTitle>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card Name</TableHead>
              <TableHead>Card ID</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Calculate</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card, index) => (
              <CardRow key={index} card={card} />
            ))}
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

function CardRow({ card }: { card: Card }) {
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

  return (
    <TableRow>
      <TableCell>{card.name}</TableCell>
      <TableCell>{card.id}</TableCell>
      <TableCell>{card.variant}</TableCell>
      <TableCell>{card.language}</TableCell>
      <TableCell>{card.condition}</TableCell>
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
