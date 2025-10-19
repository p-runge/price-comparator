import type { TradeCard } from "~/hooks/trade-provider";
import { POKEMON_MAP } from "~/lib/pokemon";

export default function CardmarketLink({ card }: { card: TradeCard }) {
  const productId = POKEMON_MAP[card.id]?.productId;

  const url = new URL(
    `https://www.cardmarket.com/en/Pokemon/Products?idProduct=${productId}`,
  );
  url.searchParams.append("language", card.language);
  if (card.condition !== "7") {
    url.searchParams.append("minCondition", card.condition);
  }
  if (card.variant === "1st Edition") {
    url.searchParams.append("isFirstEd", "Y");
  } else if (card.variant === "Reverse Holo") {
    url.searchParams.append("isReverseHolo", "Y");
  } else if (card.variant === "Unlimited") {
    url.searchParams.append("isFirstEd", "N");
    url.searchParams.append("isReverseHolo", "Y");
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
