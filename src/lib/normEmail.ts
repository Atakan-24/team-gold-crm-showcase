// Email wrapper normalization; used alongside phone normalization during contact ingestion.
// Sanitized excerpt from the private CRM; executable logic retained.
export function normEmail(roh: string | null | undefined): string | null {
  let s = String(roh ?? "").trim();
  if (!s) return null;

  const klammer = /<([^<>]+)>\s*$/.exec(s);
  if (klammer) s = klammer[1].trim();

  let vorher;
  do {
    vorher = s;
    s = s.replace(/^mailto:\s*/i, "").trim();
  } while (s !== vorher);

  const frage = s.indexOf("?");
  if (frage > 0) s = s.slice(0, frage).trim();

  if (s.includes("%")) {
    try { s = decodeURIComponent(s); } catch {  }
  }

  s = s.replace(/[\s,;]+$/, "").trim();
  return s || null;
}

export function brauchtNormalisierung(roh: string | null | undefined): boolean {
  const n = normEmail(roh);
  return n !== null && n !== String(roh ?? "").trim();
}
