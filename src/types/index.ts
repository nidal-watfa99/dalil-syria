export type TransactionStatus = 'متاحة' | 'متوقفة' | 'غير متحقق منها';

export interface Transaction {
  id: string;
  name: string;
  category: string;
  ministryId: string;
  ministryName: string;
  responsibleEntity: string; // المديرية أو الإدارة المختصة
  conditions: string[]; // الشروط والأهلية
  steps: string[]; // خطوات التقديم
  requiredDocuments: {
    name: string;
    isOriginal: boolean; // أصل أم صورة مصدقة
    notes?: string;
  }[];
  fee: {
    amount: number;
    currency: 'ليرة سورية' | 'دولار أمريكي';
    formattedFee: string;
    effectiveDate: string; // تاريخ سريان الرسم (مثال: 2026)
    source: string; // المرسوم أو القرار الرسمي
    feeType: 'رسم رسمي' | 'طابع ورسم إضافي' | 'قيمة استمارة';
  };
  expectedDuration: string; // المدة المتوقعة
  submissionPlace: string; // مكان تقديم الطلب (مركز خدمة المواطن، فرع الهجرة، إلخ)
  governorateScope: 'كافة المحافظات' | string; // المحافظة المعنية
  district?: string;
  subDistrict?: string;
  branches: {
    name: string;
    address: string;
    phone?: string;
    workingHours?: string;
  }[];
  officialLinks: {
    title: string;
    url: string;
  }[];
  legalReferences: string; // المرجع القانوني أو رقم المرسوم
  lastVerifiedDate: string; // تاريخ آخر تحقق (2026)
  status: TransactionStatus;
  notes?: string;
  keywords?: string[]; // كلمات مفتاحية ومرادفات بحث شائعة (مثل: حصر ارث، قسام شرعي، تركة)
}

export interface Ministry {
  id: string;
  name: string;
  arabicCode: string;
  officialWebsite: string;
  ministerName?: string;
  address: string;
  hotline: string;
  directoratesCount: number;
  transactionsCount: number;
  coverageStatus: 'مكتمل التحقق' | 'تحقق جزئي' | 'قيد الجرد والمراجعة';
  coveragePercentage: number;
  lastCheckedDate: string;
  checkStatus: 'مستقر ومتصل' | 'تعذر الاتصال' | 'بيانات مؤرخة 2026';
  directorates: {
    id: string;
    name: string;
    responsibility: string;
    transactions: string[];
  }[];
}

export interface Governorate {
  id: string;
  name: string;
  center: string; // مركز المحافظة
  districts: {
    name: string;
    subDistricts: string[];
  }[];
  citizenServiceCenters: {
    name: string;
    address: string;
    phone?: string;
    hours: string;
    servicesOffered: string[];
  }[];
  majorTransportHubs: string[];
  verificationStatus: 'بيانات مؤكدة ومحدثة' | 'بيانات جزئية قيد التحديث';
  coordinates: [number, number]; // [lat, lng]
}

export interface PriceItem {
  id: string;
  title: string;
  category: 'رسوم حكومية' | 'تكاسي وسيارات أجرة' | 'نقل بين المحافظات' | 'طيران داخلي ودولي' | 'تأشيرات ومكاتب';
  price: string;
  currency: string;
  rateType: 'تعرفة رسمية ملزمة' | 'سعر مزود الخدمة' | 'تقديري حسب المسافة';
  effectiveDate: string;
  source: string;
  lastVerified: string;
  details: string;
  formulaOrBreakdown?: string;
}

export interface TransportRoute {
  id: string;
  title: string;
  type: 'بولمان بين المحافظات' | 'سرفيس / ميكروباص' | 'سكك حديدية' | 'نقل بحري' | 'سيارات أجرة محددة';
  origin: string;
  destination: string;
  duration: string;
  distanceKm?: number;
  priceFormatted: string;
  operatingCompanies: string[];
  departureStations: string[];
  arrivalStations: string[];
  schedule: string;
  status: 'عامل بانتظام' | 'محدود / حسب الطلب' | 'متوقف مؤقتاً';
  sourceAndDate: string;
}

export interface MapPoint {
  id: string;
  name: string;
  category: 'وزارة' | 'مركز خدمة مواطن' | 'هجرة وجوازات' | 'كراج ونقل' | 'مطار' | 'مرفأ بحري' | 'قضاء ومحكمة';
  governorate: string;
  address: string;
  phone?: string;
  coordinates: [number, number]; // [lat, lng]
  hours?: string;
  notes?: string;
}

export interface VisaItem {
  id: string;
  country: string;
  visaType: string;
  officialRequirements: string[];
  officialFees: string;
  agencyFeesEstimate: string;
  processingTime: string;
  applicationMode: 'إلكتروني' | 'عبر السفارة' | 'عند الوصول' | 'مكاتب وسيطة معتمدة';
  officialPortalUrl?: string;
  verifiedDate: string;
  notes: string;
}

export interface AsylumGuideItem {
  id: string;
  title: string;
  organization: string;
  targetCountryOrScope: string;
  officialProcedures: string[];
  requiredDocumentation: string[];
  warningAgainstFraud: string;
  officialContacts: {
    type: string;
    detail: string;
  }[];
  lastUpdated: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: 'رسوم ومعاملات' | 'مواعيد وخدمات' | 'نقل وطرق' | 'تحديثات التطبيق';
  isRead: boolean;
  relatedTransactionId?: string;
}

export interface DiagnosticItem {
  feature: string;
  status: 'يعمل بكفاءة' | 'يحتاج إذن' | 'غير متاح حالياً' | 'غير مفعل';
  details: string;
  technicalCode: string;
  lastCheckTime: string;
}
