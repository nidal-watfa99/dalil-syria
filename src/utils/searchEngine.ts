import { Authority, Governorate, Transaction, TransportFare, VisaGuide } from '../types';
import { GOVERNORATES_DATA } from '../data/governoratesData';
import { TRANSACTIONS_DATA } from '../data/transactionsData';
import { AUTHORITIES_DATA } from '../data/authoritiesData';
import { TRANSPORT_FARES_DATA } from '../data/transportFaresData';
import { VISAS_DATA } from '../data/visasData';

/**
 * Normalizes Arabic text for flexible matching
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    // Remove diacritics / Tashkeel
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alif forms
    .replace(/[أإآء]/g, 'ا')
    // Normalize Taa Marbuta and Haa
    .replace(/ة/g, 'ه')
    // Normalize Yaa forms
    .replace(/ى/g, 'ي')
    // Remove non-alphanumeric punctuation
    .replace(/[ـ.,/#!$%\^&\*;:{}=\-_`~()؟?]/g, ' ')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ');
}

export interface NaturalQueryAnalysis {
  detectedGovernorate?: Governorate;
  detectedTransaction?: Transaction;
  detectedCategoryIds: string[];
  intents: {
    wantsFees: boolean;
    wantsDocuments: boolean;
    wantsLocation: boolean;
    wantsSteps: boolean;
  };
  cleanedKeywords: string[];
}

/**
 * Natural Language Query Parser for Arabic queries
 */
export function analyzeNaturalQuery(query: string): NaturalQueryAnalysis {
  const normQuery = normalizeArabicText(query);
  const words = normQuery.split(' ').filter(Boolean);

  // 1. Detect Governorate
  let detectedGovernorate: Governorate | undefined;
  for (const gov of GOVERNORATES_DATA) {
    const normName = normalizeArabicText(gov.nameAr);
    if (normQuery.includes(normName)) {
      detectedGovernorate = gov;
      break;
    }
  }

  // 2. Detect Intents
  const wantsFees =
    normQuery.includes('رسوم') ||
    normQuery.includes('رسم') ||
    normQuery.includes('تكلفه') ||
    normQuery.includes('سعر') ||
    normQuery.includes('بكم') ||
    normQuery.includes('كم يكلف') ||
    normQuery.includes('المصاري');

  const wantsDocuments =
    normQuery.includes('اوراق') ||
    normQuery.includes('وثائق') ||
    normQuery.includes('ثبوتيات') ||
    normQuery.includes('طلب') ||
    normQuery.includes('شروط') ||
    normQuery.includes('ماذا احضر') ||
    normQuery.includes('شو باخذ معي');

  const wantsLocation =
    normQuery.includes('اين') ||
    normQuery.includes('وين') ||
    normQuery.includes('عنوان') ||
    normQuery.includes('مركز') ||
    normQuery.includes('موقع') ||
    normQuery.includes('خريطه') ||
    normQuery.includes('فرع') ||
    normQuery.includes('اذهب');

  const wantsSteps =
    normQuery.includes('خطوات') ||
    normQuery.includes('كيف') ||
    normQuery.includes('طريقه') ||
    normQuery.includes('اجراءات') ||
    normQuery.includes('كيفية');

  // 3. Detect Transaction
  let detectedTransaction: Transaction | undefined;
  let bestTxScore = 0;

  for (const tx of TRANSACTIONS_DATA) {
    let score = 0;
    const candidates = [
      tx.titleAr,
      ...tx.commonNames,
      ...tx.synonyms,
    ].map(normalizeArabicText);

    for (const cand of candidates) {
      if (normQuery.includes(cand)) {
        score += 10;
      }
      for (const word of cand.split(' ')) {
        if (word.length > 2 && normQuery.includes(word)) {
          score += 2;
        }
      }
    }

    if (score > bestTxScore) {
      bestTxScore = score;
      detectedTransaction = tx;
    }
  }

  // 4. Detected categories
  const detectedCategoryIds: string[] = [];
  if (detectedTransaction) {
    detectedCategoryIds.push(detectedTransaction.categoryId);
  }

  return {
    detectedGovernorate,
    detectedTransaction: bestTxScore >= 4 ? detectedTransaction : undefined,
    detectedCategoryIds,
    intents: {
      wantsFees,
      wantsDocuments,
      wantsLocation,
      wantsSteps,
    },
    cleanedKeywords: words,
  };
}

export interface SearchResults {
  query: string;
  analysis: NaturalQueryAnalysis;
  transactions: Transaction[];
  authorities: Authority[];
  transportFares: TransportFare[];
  visas: VisaGuide[];
  totalCount: number;
}

export interface SearchFilters {
  governorateId?: string;
  categoryId?: string;
  verifiedOnly?: boolean;
}

/**
 * Unified Search Execution
 */
export function executeUnifiedSearch(
  query: string,
  filters: SearchFilters = {},
  userLat?: number,
  userLng?: number
): SearchResults {
  const normQuery = normalizeArabicText(query);
  const analysis = analyzeNaturalQuery(query);

  const targetGovId = filters.governorateId || analysis.detectedGovernorate?.id;
  const targetCatId = filters.categoryId;

  // Search Transactions
  let transactions = TRANSACTIONS_DATA.filter((tx) => {
    if (targetCatId && tx.categoryId !== targetCatId) return false;
    if (filters.verifiedOnly && tx.verificationStatus !== 'verified') return false;

    if (!normQuery) return true;

    const searchable = normalizeArabicText(
      `${tx.titleAr} ${tx.titleEn} ${tx.commonNames.join(' ')} ${tx.synonyms.join(' ')} ${tx.summaryAr} ${tx.responsibleAuthority}`
    );

    return searchable.includes(normQuery) ||
      analysis.cleanedKeywords.some((kw) => kw.length > 2 && searchable.includes(kw));
  });

  // Search Authorities
  let authorities = AUTHORITIES_DATA.filter((auth) => {
    if (targetGovId && auth.governorateId !== targetGovId) return false;
    if (targetCatId && auth.categoryId !== targetCatId) return false;
    if (filters.verifiedOnly && !auth.isVerified) return false;

    if (!normQuery) return true;

    const searchable = normalizeArabicText(
      `${auth.nameAr} ${auth.nameEn} ${auth.address} ${auth.district} ${auth.notes || ''}`
    );

    return searchable.includes(normQuery) ||
      analysis.cleanedKeywords.some((kw) => kw.length > 2 && searchable.includes(kw));
  });

  // Search Transport Fares
  let transportFares = TRANSPORT_FARES_DATA.filter((fare) => {
    if (targetGovId && fare.fromGovernorate !== targetGovId && fare.toGovernorate !== targetGovId) {
      return false;
    }
    if (!normQuery) return true;

    const searchable = normalizeArabicText(
      `${fare.routeNameAr} ${fare.departureStation} ${fare.arrivalStation} ${fare.serviceClass} ${fare.licensedOperators.join(' ')}`
    );

    return searchable.includes(normQuery) ||
      analysis.cleanedKeywords.some((kw) => kw.length > 2 && searchable.includes(kw));
  });

  // Search Visas
  let visas = VISAS_DATA.filter((visa) => {
    if (!normQuery) return true;
    const searchable = normalizeArabicText(
      `${visa.countryNameAr} ${visa.countryNameEn} ${visa.visaType} ${visa.purposeAr} ${visa.processingLocationForSyrians}`
    );

    return searchable.includes(normQuery) ||
      analysis.cleanedKeywords.some((kw) => kw.length > 2 && searchable.includes(kw));
  });

  // Rank Transactions: If natural analysis detected an exact transaction, promote it to top
  if (analysis.detectedTransaction) {
    const detectedId = analysis.detectedTransaction.id;
    transactions = [
      analysis.detectedTransaction,
      ...transactions.filter((t) => t.id !== detectedId),
    ];
  }

  return {
    query,
    analysis,
    transactions,
    authorities,
    transportFares,
    visas,
    totalCount: transactions.length + authorities.length + transportFares.length + visas.length,
  };
}
