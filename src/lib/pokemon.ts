/**
 *
 * @param short - short identifier like "ng9"
 * @returns object with set and name or null if invalid
 */
export function getCardDataFromShort(short: string) {
  return POKEMON_MAP[short.toLowerCase()] ?? null;
}

export const POKEMON_MAP: Record<string, { set: string; name: string }> = {
  ng9: { set: "Neo Genesis", name: "Lugia" },
};
