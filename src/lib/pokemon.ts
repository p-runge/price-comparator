/**
 *
 * @param short - short identifier like "ng9"
 * @returns object with set and name or null if invalid
 */
export function getCardDataFromShort(short: string) {
  return POKEMON_MAP[short.toLowerCase()] ?? null;
}

export const POKEMON_MAP: Record<string, { set: string; name: string }> = {
  // ng9: { set: "Neo Genesis", name: "Lugia" },
};

const res = await fetch("/cards.json");
const cards = (await res.json()) as Array<{
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
