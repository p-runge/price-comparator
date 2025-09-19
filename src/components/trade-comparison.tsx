"use client";

import { Calculator, Loader2 } from "lucide-react";
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
      <TradeParty title="Your Cards" cards={trade.yourCards} />
      <TradeParty title="Partner's Cards" cards={trade.partnerCards} />
    </div>
  );
}

function TradeParty({ title, cards }: { title: string; cards: TradeCard[] }) {
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

function CardRow({ card }: { card: TradeCard }) {
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
      <TableCell>{card.name ?? "--"}</TableCell>
      <TableCell>
        <Input
          type="text"
          placeholder="ng9"
          value={card.id}
          onChange={() => {
            // TODO: Update card name in state
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
                  // TODO: Update card variant in state
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
                  // TODO: Update card language in state
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
                  // TODO: Update card condition in state
                }}
              >
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
