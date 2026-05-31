export function formatProbability(p: number): string {
  if (typeof p !== 'number' || isNaN(p)) return "0.0%";
  const clamped = Math.min(Math.max(p, 0), 1);
  return (clamped * 100).toFixed(1) + "%";
}
