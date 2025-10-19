/**
 *
 * @param short - short identifier like "ng9"
 * @returns object with set and name or null if invalid
 */
export function getCardDataFromShort(short: string) {
  return POKEMON_MAP[short.toLowerCase()] ?? null;
}

// A map containing short, set and name of all pokemon cards
export const POKEMON_MAP: Record<
  string,
  { set: string; name: string; productId: number }
> = {};
const res =
  typeof window !== "undefined" && (await fetch("/cards_with_product_id.json"));
const cards = (res ? await res.json() : []) as Array<{
  short: string;
  setName: string;
  cardName: string;
  productId: number;
}>;
for (const card of cards) {
  POKEMON_MAP[card.short.toLowerCase()] = {
    set: card.setName,
    name: card.cardName,
    productId: card.productId,
  };
}
