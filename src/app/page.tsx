import TradeComparison from "~/components/trade-comparison";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="px-4 py-16">
        <h1 className="mb-4 text-center text-2xl font-extrabold">
          TCG Trade Price Comparator
        </h1>
        <TradeComparison />
      </div>
    </main>
  );
}
