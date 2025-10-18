/**
 *
 * @param short - short identifier like "ng9"
 * @returns object with set and name or null if invalid
 */
export function getCardDataFromShort(short: string) {
  return POKEMON_MAP[short.toLowerCase()] ?? null;
}

// A map containing short, set and name of all pokemon cards
export const POKEMON_MAP: Record<string, { set: string; name: string }> = {};
const res =
  typeof window !== "undefined" && (await fetch("/cards_vintage.json"));
const cards = (res ? await res.json() : []) as Array<{
  short: string;
  setName: string;
  cardName: string;
}>;
for (const card of cards) {
  POKEMON_MAP[card.short.toLowerCase()] = {
    set: card.setName,
    name: card.cardName,
  };
}
