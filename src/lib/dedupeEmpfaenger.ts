// Stable recipient deduplication; pure helper for outreach candidate lists.
// Sanitized excerpt from the private CRM; executable logic retained.
export function empfaengerSchluessel(email: string | null | undefined): string {
  return String(email ?? "").trim().toLowerCase();
}

export function dedupeNachEmpfaenger<T>(
  liste: T[],
  emailVon: (eintrag: T) => string | null | undefined
): { behalten: T[]; verworfen: T[] } {
  const gesehen = new Set<string>();
  const behalten: T[] = [];
  const verworfen: T[] = [];
  for (const eintrag of liste) {
    const k = empfaengerSchluessel(emailVon(eintrag));
    if (!k) { behalten.push(eintrag); continue; }
    if (gesehen.has(k)) { verworfen.push(eintrag); continue; }
    gesehen.add(k);
    behalten.push(eintrag);
  }
  return { behalten, verworfen };
}
