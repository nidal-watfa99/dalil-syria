export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  capitalAr: string;
  lat: number;
  lng: number;
  zoom: number;
  districts: string[];
  descriptionAr: string;
  populationEst?: string;
}

export interface Category {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  descriptionAr: string;
  order: number;
}

export interface Authority {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryId: string;
  governorateId: string;
  district: string;
  address: string;
  phone: string;
  workingHours: string;
  lat: number;
  lng: number;
  isVerified: boolean;
  verificationSource: string;
  verificationDate: string;
  website?: string;
  notes?: string;
}

export interface RequiredDocument {
  id: string;
  nameAr: string;
  isOriginal: boolean;
  copiesCount: number;
  needsAttestation: boolean;
  attestationEntity?: string;
  notes?: string;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  description: string;
  locationName?: string;
}

export interface OfficialFee {
  item: string;
  amount: number;
  currency: 'SYP' | 'USD';
  legalReference: string;
  paymentMethod: string;
  effectiveDate: string;
}

export interface Transaction {
  id: string;
  titleAr: string;
  titleEn: string;
  commonNames: string[];
  synonyms: string[];
  categoryId: string;
  responsibleAuthority: string;
  summaryAr: string;
  eligibility: string;
  requiredDocuments: RequiredDocument[];
  steps: ProcedureStep[];
  officialFees: OfficialFee[];
  processingTimeOfficial: string;
  processingTimeEstimated: string;
  personalAttendanceRequired: boolean;
  powerOfAttorneyAllowed: boolean;
  appointmentRequired: boolean;
  formsAvailable: Array<{ title: string; formCode?: string; downloadUrl?: string }>;
  submittingEntity: string;
  issuingEntity: string;
  commonRejectionReasons: string[];
  officialPortalUrl?: string;
  verificationStatus: 'verified' | 'under_review' | 'deprecated';
  sourceName: string;
  sourceUrl?: string;
  legalBasisNumber: string;
  lastVerifiedDate: string;
  nextReviewDate: string;
  relatedAuthorityIds: string[];
  governorateNotes?: Record<string, string>;
}

export interface VisaGuide {
  id: string;
  countryCode: string;
  countryNameAr: string;
  countryNameEn: string;
  visaType: string;
  purposeAr: string;
  officialRequirements: string[];
  requiredDocuments: string[];
  fees: {
    amount: string;
    currency: string;
    paymentMethod: string;
    legalReference: string;
  };
  processingLocationForSyrians: string;
  doesProcessSyrianCitizensCurrently: boolean;
  officialEmbassyUrl: string;
  officialAppointmentPortalUrl: string;
  antiFraudWarning: string;
  lastVerifiedDate: string;
  source: string;
}

export interface TransportFare {
  id: string;
  fromGovernorate: string;
  toGovernorate: string;
  routeNameAr: string;
  distanceKm: number;
  estimatedDurationHours: number;
  departureStation: string;
  arrivalStation: string;
  officialTariffSyp: number;
  serviceClass: 'بولمان رجال أعمال (VIP)' | 'بولمان عادي' | 'ميكروباص / فان';
  licensedOperators: string[];
  legalDecree: string;
  tariffEffectiveDate: string;
  lastVerifiedDate: string;
  source: string;
  luggageAllowanceKg: number;
}

export interface InaccuracyReport {
  id: string;
  targetType: 'transaction' | 'authority' | 'transport' | 'visa' | 'general';
  targetId: string;
  targetName: string;
  reporterName?: string;
  reporterContact?: string;
  issueCategory: 'fees' | 'documents' | 'address_hours' | 'broken_link' | 'status_changed' | 'other';
  description: string;
  proposedCorrection?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  user: string;
  details: string;
}

export interface DiagnosticLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  context: string;
  message: string;
  meta?: unknown;
}
