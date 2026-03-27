export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-stone-200 dark:border-zinc-700 border-t-brand-500 animate-spin" />
        <p className="text-sm text-stone-400 dark:text-zinc-500 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
