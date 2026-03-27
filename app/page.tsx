import { Suspense } from "react";
import ShopContent from "@/components/ui/ShopContent";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-stone-200 dark:border-zinc-700 border-t-brand-500 animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
