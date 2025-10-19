// file: mapCardmarketEnhanced.ts
import fs from "fs/promises";
import path from "path";

type Card = { short: string; setName: string; cardName: string };
type Product = {
  idProduct: number;
  name: string;
  idCategory: number;
  categoryName: string;
  idExpansion: number;
  idMetacard: number;
  dateAdded: string;
};
type ProductCatalog = {
  version: number;
  createdAt: string;
  products: Product[];
};
type ResultCard = Card & { productId?: number };
type MappingIssue = { card: Card; reason: string; candidates?: string[] };

const setMap: Record<string, number> = {
  ["Base Set"]: 1523,
  ["Jungle"]: 1525,
  ["Wizards Black Star Promos"]: 1607,
  ["Fossil"]: 1526,
  ["Base Set 2"]: 1527,
  ["Team Rocket"]: 1528,
  ["Gym Heroes"]: 1529,
  ["Gym Challenge"]: 1530,
  ["Neo Genesis"]: 1531,
  ["Neo Discovery"]: 1532,
  ["Southern Islands"]: 1633,
  ["Neo Revelation"]: 1533,
  ["Neo Destiny"]: 1534,
  ["Legendary Collection"]: 1535,
  ["Expedition Base Set"]: 1536,
  ["Best of Game"]: 1605,
  ["Aquapolis"]: 1537,
  ["Skyridge"]: 1538,
};

async function main() {
  const myCardsPath = path.resolve("public/cards_vintage.json");
  const cardmarketPath = path.resolve(".tmp/cardmarket_products.json");

  const myCardsRaw = await fs.readFile(myCardsPath, "utf-8");
  const cardmarketRaw = await fs.readFile(cardmarketPath, "utf-8");

  const myCards = JSON.parse(myCardsRaw) as Card[];
  const catalog = JSON.parse(cardmarketRaw) as ProductCatalog;

  const updatedCards: ResultCard[] = [];
  const mappingIssues: MappingIssue[] = [];

  let count = 0;
  for (const card of myCards) {
    count++;
    console.log(
      `Processing card: ${count}/${myCards.length} ${card.cardName} [${card.setName}]`,
    );
    console.log("-------------------------");
    console.log("card", card);

    const idExpansion = setMap[card.setName]; // e.g. 1523 for "Base Set"
    if (!idExpansion) {
      mappingIssues.push({ card, reason: "unknown set name" });
      updatedCards.push({ ...card });
      continue;
    }
    console.log("exp", card.setName, "->", idExpansion);

    const candidates = catalog.products.filter(
      (p) =>
        p.idExpansion === idExpansion &&
        (p.name.toLowerCase() === card.cardName.toLowerCase() ||
          p.name.toLowerCase().startsWith(`${card.cardName.toLowerCase()} [`)),
    );
    console.log("found candidates:", candidates.length);

    if (candidates.length === 0) {
      mappingIssues.push({ card, reason: "card name not found" });
      // updatedCards.push({ ...card });
      continue;
    }
    console.log(
      "candidates:",
      candidates.map((x) => x.idProduct),
    );

    if (candidates.length > 1) {
      // mappingIssues.push({
      //   card,
      //   reason: "multiple candidates found",
      // });

      // TODO: this might not always be the correct way of handling multiple candidates
      updatedCards.push({ ...card, productId: candidates[0]?.idProduct });

      // remove candidate from further processing
      catalog.products = catalog.products.filter(
        (p) => p.idProduct !== candidates[0]?.idProduct,
      );
      continue;
    }

    const candidate = candidates[0]!;
    updatedCards.push({
      ...card,
      productId: candidate.idProduct,
    });
  }

  await fs.writeFile(
    path.resolve("public/cards_with_product_id.json"),
    JSON.stringify(updatedCards, null, 2),
    "utf-8",
  );
  await fs.writeFile(
    path.resolve(".tmp/mappingIssues.json"),
    JSON.stringify(mappingIssues, null, 2),
    "utf-8",
  );

  console.log(
    `Done! ${updatedCards.length} cards processed. ${mappingIssues.length} issues logged.`,
  );
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
