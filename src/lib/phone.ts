// Phone import normalization; pure functions, no network or database access.
// Sanitized excerpt from the private CRM; executable logic retained.
const DIAL: Record<string, string> = {
  US: "1", CA: "1", DE: "49", AT: "43", CH: "41", GB: "44", UK: "44",
  NL: "31", FR: "33", ES: "34", IT: "39", BE: "32", PL: "48", TR: "90",
  EG: "20", AE: "971", SA: "966", MA: "212", TN: "216", DZ: "213",
};

const NAMES: Record<string, string> = {
  usa: "US", "united states": "US", amerika: "US", america: "US",
  kanada: "CA", canada: "CA",
  deutschland: "DE", germany: "DE", brd: "DE",
  österreich: "AT", oesterreich: "AT", austria: "AT",
  schweiz: "CH", switzerland: "CH", suisse: "CH",
  "united kingdom": "GB", grossbritannien: "GB", "großbritannien": "GB",
  england: "GB", britain: "GB",
  niederlande: "NL", netherlands: "NL", holland: "NL",
  frankreich: "FR", france: "FR",
  spanien: "ES", spain: "ES",
  italien: "IT", italy: "IT",
  belgien: "BE", belgium: "BE",
  polen: "PL", poland: "PL",
  türkei: "TR", tuerkei: "TR", turkey: "TR", turkiye: "TR",
  ägypten: "EG", aegypten: "EG", egypt: "EG",
  marokko: "MA", morocco: "MA",
  tunesien: "TN", tunisia: "TN",
  algerien: "DZ", algeria: "DZ",
};

export function resolveCountry(input?: string | null): string | null {
  if (!input) return null;
  const s = fold(String(input));
  if (!s) return null;
  if (FOLDED_NAMES[s]) return FOLDED_NAMES[s];
  const upper = s.toUpperCase();
  if (DIAL[upper]) return upper === "UK" ? "GB" : upper;
  return null;
}

function fold(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const FOLDED_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(NAMES).map(([k, v]) => [fold(k), v])
);

export type PhoneResult =
  | { ok: true; phone: string }
  | { ok: false; reason: string };

export function normalisePhone(
  raw: unknown,
  country?: string | null,
  fallback?: string | null
): PhoneResult {
  let s = String(raw ?? "").trim();
  if (!s) return { ok: false, reason: "no number" };

  if (/e\+/i.test(s) && !Number.isNaN(Number(s))) s = Number(s).toFixed(0);

  const hadPlus = s.startsWith("+");
  let digits = s.replace(/\D/g, "");
  if (!digits) return { ok: false, reason: "no digits" };

  if (hadPlus) return finish(digits);

  if (digits.startsWith("00")) return finish(digits.slice(2));

  const iso = resolveCountry(country) ?? resolveCountry(fallback);
  if (!iso) {
    return {
      ok: false,
      reason: "no country — add a country column or pick a default",
    };
  }

  const cc = DIAL[iso];

  if (cc === "1") {
    if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
    if (digits.length !== 10) {
      return { ok: false, reason: `expected 10 digits for ${iso}, got ${digits.length}` };
    }
    return finish(cc + digits);
  }

  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  if (!digits) return { ok: false, reason: "no digits after country prefix" };

  if (digits.startsWith(cc) && digits.length > cc.length + 4) return finish(digits);

  return finish(cc + digits);
}

function finish(digits: string): PhoneResult {
  if (digits.length < 8) return { ok: false, reason: `too short (${digits.length} digits)` };
  if (digits.length > 15) return { ok: false, reason: `too long (${digits.length} digits)` };
  return { ok: true, phone: "+" + digits };
}
