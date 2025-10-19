"use client";

import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useDefaultSettings } from "~/hooks/default-settings-provider";
import { useTrade, type TradeCard } from "~/hooks/trade-provider";
import CardRow from "./card-row";

export default function TradeParty({
  party,
  cards,
}: {
  party: "you" | "partner";
  cards: TradeCard[];
}) {
  const { addCard } = useTrade();
  const { defaultSettings } = useDefaultSettings();

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
                      id: "",
                      variant: defaultSettings.variant,
                      language: defaultSettings.language,
                      condition: defaultSettings.condition,
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
              <TableCell colSpan={7}>
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
