/**
 * Utility for robust Arabic search normalization
 * Solves the critical issue where searching "حصر الارث" failed to match "حصر الإرث"
 */

export function normalizeArabic(text: string): string {
  if (!text) return '';

  return (
    text
      .toLowerCase()
      // Remove Arabic diacritics / tashkeel
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      // Remove Tatweel (Kashida)
      .replace(/\u0640/g, '')
      // Normalize different shapes of Alef to bare Alef
      .replace(/[إأآٱ]/g, 'ا')
      // Normalize Taa Marbouta to Haa
      .replace(/ة/g, 'ه')
      // Normalize Alef Maksoura and Hamza on Yaa to Yaa
      .replace(/[ىئ]/g, 'ي')
      // Normalize Hamza on Waw
      .replace(/ؤ/g, 'و')
      // Remove extra spaces
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Checks whether targetText contains query, with support for multi-word queries
 */
export function arabicMatches(targetText: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!targetText) return false;

  const normTarget = normalizeArabic(targetText);
  const normQuery = normalizeArabic(query);

  // Direct substring check
  if (normTarget.includes(normQuery)) return true;

  // Split query into individual keywords: all non-trivial words must match
  const words = normQuery.split(' ').filter((w) => w.length > 1);
  if (words.length === 0) return normTarget.includes(normQuery);

  return words.every((word) => normTarget.includes(word));
}

/**
 * Searches across multiple fields of an object
 */
export function arabicMatchesAny(fields: (string | undefined | null)[], query: string): boolean {
  if (!query || !query.trim()) return true;
  const combined = fields.filter(Boolean).join(' ');
  return arabicMatches(combined, query);
}
