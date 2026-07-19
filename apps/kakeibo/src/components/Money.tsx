const formatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

export function formatCents(cents: number): string {
  return formatter.format(cents / 100);
}

export function Money({ cents, signed }: { cents: number; signed?: boolean }) {
  const negative = cents < 0;
  return (
    <span
      className={
        signed
          ? negative
            ? "text-rose-400 tabular-nums"
            : "text-emerald-400 tabular-nums"
          : "tabular-nums"
      }
    >
      {formatCents(cents)}
    </span>
  );
}

/** Parse a user-typed euro amount ("12,50" / "12.50" / "12") into cents. */
export function parseEuros(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * 100);
}
