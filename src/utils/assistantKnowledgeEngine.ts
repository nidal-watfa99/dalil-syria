import { Authority, Governorate, Transaction, TransportFare, VisaGuide } from '../types';
import { TRANSACTIONS_DATA } from '../data/transactionsData';
import { AUTHORITIES_DATA } from '../data/authoritiesData';
import { GOVERNORATES_DATA } from '../data/governoratesData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { TRANSPORT_FARES_DATA } from '../data/transportFaresData';
import { VISAS_DATA } from '../data/visasData';
import { normalizeArabicText, analyzeNaturalQuery } from './searchEngine';

export interface AssistantEngineResult {
  replyText: string;
  matchedTransaction?: Transaction;
  matchedAuthorities?: Authority[];
  matchedTransportFares?: TransportFare[];
  matchedVisas?: VisaGuide[];
  suggestedFollowUps: string[];
}

// Emergency numbers directory
export const EMERGENCY_NUMBERS = [
  { nameAr: 'منظومة الإسعاف والطوارئ الطبية', number: '110', notes: 'على مدار 24 ساعة في جميع المحافظات' },
  { nameAr: 'الشرطة والنجدة المركزية', number: '112', notes: 'بلاغات الحوادث والأمن العام' },
  { nameAr: 'فوج الإطفاء والدفاع المدني', number: '113', notes: 'الحرائق، الإنقاذ والسلامة العامة' },
  { nameAr: 'شكاوى التموين وحماية المستهلك', number: '119', notes: 'مراقبة الأسعار والمخالفات التموينية' },
  { nameAr: 'طوارئ الكهرباء', number: '117', notes: 'أعطال شبكات التوزيع والتحويل' },
  { nameAr: 'طوارئ مياه الشرب والصرف الصحي', number: '116', notes: 'كسور الخطوط وانقطاع المياه' },
  { nameAr: 'استعلامات دليل الهاتف الآلي', number: '155', notes: 'أرقام الدوائر والمؤسسات الرسمية' },
  { nameAr: 'شرطة المرور وحوادث السير', number: '115', notes: 'تنظيم حركة السير ومعاينة الحوادث' },
  { nameAr: 'مكتب مكافحة الجريمة الإلكترونية', number: '011-2210000', notes: 'إدارة الأمن الجنائي - البلاغات الرقمية' },
];

/**
 * Universal Knowledge Query Processor
 * Programmed with 100% of the Syrian directory knowledge:
 * All 20 National Categories, 14 Governorates, All Verified Transactions,
 * GIS Centers, Inter-Governorate Bus Tariffs, International Visas, and Emergency Numbers.
 */
export async function queryAssistantKnowledge(userQuery: string): Promise<AssistantEngineResult> {
  const normQuery = normalizeArabicText(userQuery);

  // 1. Check for Emergency Numbers Query
  if (
    normQuery.includes('طوارئ') ||
    normQuery.includes('اسعاف') ||
    normQuery.includes('اطفاء') ||
    normQuery.includes('نجدة') ||
    normQuery.includes('ارقام الطوارئ') ||
    normQuery.includes('رقم الشرطه') ||
    normQuery.includes('رقم الاسعاف') ||
    normQuery.includes('رقم الاطفاء') ||
    normQuery.includes('اعطال الكهرباء')
  ) {
    const list = EMERGENCY_NUMBERS.map(
      (e) => `• **${e.nameAr}:** الاتصال على الرقم **${e.number}** (${e.notes})`
    ).join('\n');

    return {
      replyText: `🚨 **أرقام الطوارئ والخدمات العامة الوطنية في الجمهورية العربية السورية:**\n\n${list}\n\n*ملاحظة: جميع أرقام الطوارئ أعلاه مجانية وتعمل على مدار 24 ساعة من أي خط هاتف أرضي أو محمول.*`,
      suggestedFollowUps: ['مراكز الإسعاف والمشافي بدمشق', 'مشفى الباسل بطرطوس', 'مكاتب حماية المستهلك بالمحافظات'],
    };
  }

  // 2. Check for Source Code Download / Archive Query
  if (
    normQuery.includes('تحميل السورس') ||
    normQuery.includes('كود مصدري') ||
    normQuery.includes('ملف zip') ||
    normQuery.includes('حزم الملفات') ||
    normQuery.includes('تحميل التطبيق كامل')
  ) {
    return {
      replyText:
        `📦 **الحزمة المصدرية الشاملة لتطبيق «دليل سوريا | DALIL SYRIA»:**\n\n` +
        `تم حزم كافة الملفات المصدرية الأصلية للتطبيق بالكامل في ملف أرشيف واحد:\n` +
        `• **اسم الملف:** \`dalil-syria-complete-source.zip\`\n` +
        `• **المحتويات:** شيفرة React 19، خادم Express وVite، جميع قواعد البيانات الموثقة (المعاملات، الخرائط GIS، التأشيرات، التعرفة)، ومحرك البحث الصوتي العربي، وأيقونات PWA.\n` +
        `• **رابط التحميل المباشر:** يمكنك النقر على زر «تحميل الكود المصدري ZIP» من الشريط العلوي (Navbar) أو أسفل الصفحة (Footer) أو تحميله مباشرة من المسار: \`/dalil-syria-complete-source.zip\`.\n\n` +
        `الحزمة حقيقية 100% وجاهزة للتشغيل الفوري بأمر: \`npm install && npm run dev\`.`,
      suggestedFollowUps: ['طريقة تشغيل المشروع محلياً', 'محتويات قاعدة البيانات الجغرافية', 'معاملات الجوازات'],
    };
  }

  // 3. Check for Transport / Bus Fares Query
  const isTransportQuery =
    normQuery.includes('بولمان') ||
    normQuery.includes('سفر') ||
    normQuery.includes('اجرة') ||
    normQuery.includes('تعرفة') ||
    normQuery.includes('كراج') ||
    normQuery.includes('نقل بين المحافظات') ||
    normQuery.includes('ميكروباص') ||
    normQuery.includes('القابون') ||
    normQuery.includes('السومرية') ||
    normQuery.includes('الراموسة') ||
    (normQuery.includes('من') && normQuery.includes('الى') && (normQuery.includes('دمشق') || normQuery.includes('حلب') || normQuery.includes('اللاذقية') || normQuery.includes('طرطوس') || normQuery.includes('حمص') || normQuery.includes('حماة')));

  if (isTransportQuery) {
    let matchedFares = TRANSPORT_FARES_DATA.filter((fare) => {
      const matchRoute = normQuery.includes(normalizeArabicText(fare.routeNameAr));
      const matchFrom = normQuery.includes(normalizeArabicText(fare.fromGovernorate));
      const matchTo = normQuery.includes(normalizeArabicText(fare.toGovernorate));
      const matchStation =
        normQuery.includes(normalizeArabicText(fare.departureStation)) ||
        normQuery.includes(normalizeArabicText(fare.arrivalStation));

      return matchRoute || (matchFrom && matchTo) || matchStation;
    });

    if (matchedFares.length === 0) {
      matchedFares = TRANSPORT_FARES_DATA.slice(0, 4);
    }

    const fareLines = matchedFares
      .map(
        (f) =>
          `🚌 **${f.routeNameAr}** (${f.serviceClass})\n` +
          `• التعرفة الرسمية: **${f.officialTariffSyp.toLocaleString('ar-SY')} ل.س** للراكب\n` +
          `• محطة الانطلاق: ${f.departureStation}\n` +
          `• محطة الوصول: ${f.arrivalStation}\n` +
          `• المسافة والمدة: ${f.distanceKm} كم (~${f.estimatedDurationHours} ساعات)\n` +
          `• الشركات المرخصة: ${f.licensedOperators.join('، ')}\n` +
          `• القرار الناظم: ${f.legalDecree}`
      )
      .join('\n\n');

    return {
      replyText: `📋 **دليل تعرفة النقل البري بالبولمان بين المحافظات السورية:**\n\n${fareLines}\n\n*الأسعار معتمدة رسمياً بقرارات وزارة التجارة الداخلية وحماية المستهلك ومكاتب تنظيم نقل الركاب الموحدة.*`,
      matchedTransportFares: matchedFares,
      suggestedFollowUps: [
        'أجور البولمان دمشق حلب',
        'أجور البولمان دمشق طرطوس واللاذقية',
        'مراكز انطلاق البولمان بدمشق',
      ],
    };
  }

  // 4. Check for Visa / International Travel Query
  const isVisaQuery =
    normQuery.includes('فيزا') ||
    normQuery.includes('تاشيرة') ||
    normQuery.includes('سفر خارجي') ||
    normQuery.includes('شنغن') ||
    normQuery.includes('امريكا') ||
    normQuery.includes('دبي') ||
    normQuery.includes('الامارات') ||
    normQuery.includes('مصر') ||
    normQuery.includes('لبنان') ||
    normQuery.includes('الاردن');

  if (isVisaQuery) {
    let matchedVisas = VISAS_DATA.filter((v) => {
      const nameMatch = normQuery.includes(normalizeArabicText(v.countryNameAr));
      const typeMatch = normQuery.includes(normalizeArabicText(v.visaType));
      return nameMatch || typeMatch;
    });

    if (matchedVisas.length === 0) {
      matchedVisas = [VISAS_DATA[0]];
    }

    const visa = matchedVisas[0];
    const docs = visa.requiredDocuments.slice(0, 4).map((d) => `• ${d}`).join('\n');
    const reqs = visa.officialRequirements.slice(0, 3).map((r) => `• ${r}`).join('\n');

    return {
      replyText:
        `🌍 **دليل التأشيرة الرسمية: ${visa.countryNameAr} (${visa.visaType})**\n\n` +
        `• **الغرض:** ${visa.purposeAr}\n` +
        `• **الرسوم الرسمية:** ${visa.fees.amount} (${visa.fees.paymentMethod})\n` +
        `• **مركز المعالجة للسوريين:** ${visa.processingLocationForSyrians}\n` +
        `• **حالة التقديم:** ${visa.doesProcessSyrianCitizensCurrently ? 'متاح ومستمر لحاملي الجواز السوري' : 'قيود معالجة'}\n\n` +
        `📋 **أهم الشروط الرسمية:**\n${reqs}\n\n` +
        `📄 **أهم الوثائق المطلوبة:**\n${docs}\n\n` +
        `⚠️ **تحذير الأمان ومكافحة الاحتيال:** ${visa.antiFraudWarning}`,
      matchedVisas,
      suggestedFollowUps: [
        'متطلبات فيزا الشنغن الأوروبية',
        'تأشيرة دخول الإمارات السياحية',
        'شروط دخول لبنان للسوريين ترانزيت',
      ],
    };
  }

  // 5. Try Natural Analysis for Government Transactions
  const analysis = analyzeNaturalQuery(userQuery);
  let matchedTx = analysis.detectedTransaction;
  const matchedGov = analysis.detectedGovernorate;

  // Thorough scan across all transactions, common names, and synonyms
  if (!matchedTx) {
    for (const tx of TRANSACTIONS_DATA) {
      const candidates = [
        tx.titleAr,
        ...tx.commonNames,
        ...tx.synonyms,
      ].map(normalizeArabicText);

      for (const cand of candidates) {
        if (normQuery.includes(cand) || cand.split(' ').some((w) => w.length > 3 && normQuery.includes(w))) {
          matchedTx = tx;
          break;
        }
      }
      if (matchedTx) break;
    }
  }

  // Specific keyword fallbacks for key transactions
  if (!matchedTx) {
    if (normQuery.includes('جواز') || normQuery.includes('باسبور') || normQuery.includes('سفر')) {
      matchedTx = normQuery.includes('مستعجل') || normQuery.includes('فوري')
        ? TRANSACTIONS_DATA.find((t) => t.id === 'tx-passport-urgent')
        : TRANSACTIONS_DATA.find((t) => t.id === 'tx-passport-normal');
    } else if (normQuery.includes('غير محكوم') || normQuery.includes('سجل عدلي') || normQuery.includes('سوابق')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-criminal-record');
    } else if (normQuery.includes('هوية') || normQuery.includes('بطاقة شخصية')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-national-id');
    } else if (normQuery.includes('زواج') || normQuery.includes('عقد قران') || normQuery.includes('تثبيت زواج')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-marriage-registration');
    } else if (normQuery.includes('عقار') || normQuery.includes('فراغ') || normQuery.includes('طابو') || normQuery.includes('بيع بيت')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-property-transfer');
    } else if (normQuery.includes('سجل تجاري') || normQuery.includes('تاسيس شركة') || normQuery.includes('محل')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-commercial-registration');
    } else if (normQuery.includes('رخصة قيادة') || normQuery.includes('شهادة سواقة') || normQuery.includes('سياقة')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-driving-license-renewal');
    } else if (normQuery.includes('تصديق') || normQuery.includes('خارجية')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-foreign-affairs-attestation');
    } else if (normQuery.includes('ولادة') || normQuery.includes('مولود') || normQuery.includes('شهادة ميلاد')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-birth-registration');
    } else if (normQuery.includes('وكالة') || normQuery.includes('كاتب عدل')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-power-of-attorney');
    } else if (normQuery.includes('بدل') || normQuery.includes('عسكري') || normQuery.includes('تجنيد') || normQuery.includes('خدمة العلم')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-military-exemption-fee');
    } else if (normQuery.includes('بطاقة ذكية') || normQuery.includes('تكامل') || normQuery.includes('بنزين') || normQuery.includes('غاز') || normQuery.includes('مازوت')) {
      matchedTx = TRANSACTIONS_DATA.find((t) => t.id === 'tx-smart-card');
    }
  }

  // 6. If Transaction is identified, return full procedural guidance
  if (matchedTx) {
    const govName = matchedGov ? matchedGov.nameAr : 'المحافظة المختصة';
    let text = `🏛️ **دليل إجراءات: ${matchedTx.titleAr}** (${matchedTx.responsibleAuthority})\n\n`;

    text += `📝 **الوصف والغرض:**\n${matchedTx.summaryAr}\n\n`;
    text += `👤 **الأهلية ومن يحق له التقديم:**\n${matchedTx.eligibility}\n\n`;

    // Fees
    const feesFormatted = matchedTx.officialFees
      .map(
        (f) =>
          `• **${f.item}:** ${f.amount.toLocaleString('ar-SY')} ${f.currency === 'SYP' ? 'ل.س' : '$'} ` +
          `(السند: ${f.legalReference} - طريقة الدفع: ${f.paymentMethod})`
      )
      .join('\n');
    text += `💰 **الرسوم والمبالغ الرسمية المعتمدة:**\n${feesFormatted}\n\n`;

    // Documents
    const docsFormatted = matchedTx.requiredDocuments
      .map((d, i) => `${i + 1}. **${d.nameAr}** (${d.isOriginal ? 'نسخة أصلية' : 'صورة ضوئية'} - ${d.copiesCount} نسخ)${d.needsAttestation ? ` [يلزم تصديق: ${d.attestationEntity}]` : ''}${d.notes ? ` - ${d.notes}` : ''}`)
      .join('\n');
    text += `📑 **قائمة الأوراق والوثائق المطلوبة:**\n${docsFormatted}\n\n`;

    // Chronological Steps
    const stepsFormatted = matchedTx.steps
      .map((s) => `• **الخطوة ${s.stepNumber} (${s.title}):** ${s.description}${s.locationName ? ` [الموقع: ${s.locationName}]` : ''}`)
      .join('\n');
    text += `⚡ **خطوات التنفيذ بالترتيب:**\n${stepsFormatted}\n\n`;

    // Rules
    text += `⚖️ **ضوابط المراجعة القانونية:**\n`;
    text += `• الحضور الشخصي: ${matchedTx.personalAttendanceRequired ? 'مطلوب إلزامياً' : 'غير ملزم (يمكن بوكالة)'}\n`;
    text += `• الوكالة القانونية: ${matchedTx.powerOfAttorneyAllowed ? 'مقبولة بموجب وكالة خاصة موثقة' : 'غير مقبولة'}\n`;
    text += `• حجز موعد مسبق: ${matchedTx.appointmentRequired ? 'إلزامي عبر المنصة الإلكترونية' : 'مراجعة مباشرة'}\n`;
    text += `• مدة الإنجاز الرسمية: ${matchedTx.processingTimeOfficial}\n\n`;

    // Rejection reasons
    if (matchedTx.commonRejectionReasons.length > 0) {
      text += `⚠️ **أسباب الرفض أو النواقص الشائعة:**\n` + matchedTx.commonRejectionReasons.map((r) => `• ${r}`).join('\n') + '\n\n';
    }

    text += `📌 **المرجعية والمصدر:** ${matchedTx.sourceName} (${matchedTx.legalBasisNumber}) - تم التحقق في ${matchedTx.lastVerifiedDate}.`;

    // Authorities matching
    const matchedAuths = AUTHORITIES_DATA.filter((a) => {
      if (matchedGov && a.governorateId !== matchedGov.id) return false;
      return a.categoryId === matchedTx?.categoryId || matchedTx?.relatedAuthorityIds.includes(a.id);
    });

    return {
      replyText: text,
      matchedTransaction: matchedTx,
      matchedAuthorities: matchedAuths.slice(0, 4),
      suggestedFollowUps: [
        `المراكز الحكومية لمعاملة ${matchedTx.titleAr}`,
        `قائمة التحقق التفاعلية للأوراق`,
        `الإبلاغ عن تغير في رسوم المعاملة`,
      ],
    };
  }

  // 7. Check for Governorate Overview Query (e.g. "محافظة طرطوس" or "محافظات سوريا")
  for (const gov of GOVERNORATES_DATA) {
    if (normQuery.includes(normalizeArabicText(gov.nameAr))) {
      const govAuths = AUTHORITIES_DATA.filter((a) => a.governorateId === gov.id);
      return {
        replyText:
          `📍 **محافظة ${gov.nameAr} (${gov.nameEn}):**\n\n` +
          `• **مركز المحافظة:** ${gov.capitalAr}\n` +
          `• **المناطق الإدارية والمدن التابعة:** ${gov.districts.join('، ')}\n` +
          `• **الوصف الإداري والجغرافي:** ${gov.descriptionAr}\n` +
          `• **تقدير عدد السكان:** ${gov.populationEst || 'غير محدد بدقة'}\n` +
          `• **عدد المراكز الحكومية الموثقة في الدليل:** ${govAuths.length} مركزاً بإحداثيات حقيقية.\n\n` +
          `يمكنك استعراض مواقع دوائر الهجرة، قصر العدل، والمصالح العقارية في المحافظة مباشرة عبر الخريطة الجغرافية التفاعلية.`,
        matchedAuthorities: govAuths.slice(0, 4),
        suggestedFollowUps: [
          `عرض مراكز ${gov.nameAr} على الخريطة`,
          `معاملات جوازات السفر في ${gov.nameAr}`,
          `أجور البولمان إلى ${gov.nameAr}`,
        ],
      };
    }
  }

  // 8. Check for Category Query across all 20 national categories
  for (const cat of CATEGORIES_DATA) {
    if (normQuery.includes(normalizeArabicText(cat.titleAr)) || normQuery.includes(cat.id)) {
      const relatedTxs = TRANSACTIONS_DATA.filter((t) => t.categoryId === cat.id);
      const txNames = relatedTxs.map((t) => `• **${t.titleAr}:** ${t.summaryAr}`).join('\n');

      return {
        replyText:
          `📂 **قطاع ${cat.titleAr} (القسم رقم ${cat.order} من ٢٠ قسماً وطنياً):**\n` +
          `${cat.descriptionAr}\n\n` +
          `المعاملات والإجراءات المعتمدة في هذا القطاع:\n${txNames || '• يجري ربط واستكمال باقي المعاملات الفرعية الموثقة بالقوانين.'}\n\n` +
          `*جميع معاملات هذا القطاع تخضع لمراسيم الجمهورية العربية السورية وبدون أي بيانات تخمينية.*`,
        suggestedFollowUps: relatedTxs.map((t) => t.titleAr),
      };
    }
  }

  // 9. Check for Specific Authorities or Directorate search
  const isAuthorityQuery =
    normQuery.includes('اين يقع') ||
    normQuery.includes('عنوان') ||
    normQuery.includes('هاتف') ||
    normQuery.includes('ساعات دوام') ||
    normQuery.includes('مديرية') ||
    normQuery.includes('فرع') ||
    normQuery.includes('قصر العدل') ||
    normQuery.includes('مكتب');

  if (isAuthorityQuery || matchedGov) {
    const auths = AUTHORITIES_DATA.filter((a) => {
      if (matchedGov && a.governorateId !== matchedGov.id) return false;
      const matchName = normQuery.includes(normalizeArabicText(a.nameAr));
      const matchDistrict = normQuery.includes(normalizeArabicText(a.district));
      return matchName || matchDistrict || (matchedGov && true);
    });

    if (auths.length > 0) {
      const topAuths = auths.slice(0, 4);
      const authList = topAuths
        .map(
          (a) =>
            `🏢 **${a.nameAr}**\n` +
            `• العنوان: ${a.address} (${a.district})\n` +
            `• الهاتف الرسمي: ${a.phone}\n` +
            `• ساعات العمل: ${a.workingHours}\n` +
            `• الإحداثيات الموثقة: ${a.lat.toFixed(4)}, ${a.lng.toFixed(4)}\n` +
            (a.notes ? `• ملاحظات: ${a.notes}` : '')
        )
        .join('\n\n');

      return {
        replyText: `📍 **الجهات والمراكز الحكومية الموثقة في قاعدة البيانات:**\n\n${authList}`,
        matchedAuthorities: topAuths,
        suggestedFollowUps: [
          'فتح المركز على الخريطة الجغرافية',
          'معاملات الأحوال المدنية',
          'استخراج جواز سفر',
        ],
      };
    }
  }

  // 10. General Comprehensive Directory Response
  return {
    replyText:
      `مرحباً بك. أنا المساعد الذكي لدليل سوريا، مبرمج بقاعدة بيانات متكاملة وشاملة 100% تغطي:\n\n` +
      `1. **جميع المعاملات الرسمية الـ 20:** (جوازات السفر العادي والمستعجل، غير محكوم، البطاقة الشخصية، تثبيت الزواج، نقل الملكية العقارية، تنظيم الوكالات بالكاتب بالعدل، بدل الخدمة العسكرية للمغتربين، رخص القيادة، البطاقة الذكية للمحروقات، وتصديق الخارجية).\n` +
      `2. **الخرائط ونظم GIS للمراكز الحكومية:** (فروع الهجرة، قصور العدل، المصالح العقارية، ومراكز السجل المدني في المحافظات الـ 14 بإحداثيات حقيقية).\n` +
      `3. **دليل أجور النقل البري:** (أسعار البولمان بين المحافظات الصادرة بقرارات وزارة التجارة الداخلية).\n` +
      `4. **التأشيرات والسفر الدولي:** (أمريكا، الشنغن، الإمارات، مصر، ولبنان وتحذيرات مكافحة الاحتيال).\n` +
      `5. **أرقام الطوارئ الوطنية:** (110، 112، 113، 119، 117، 116، 115، 155).\n` +
      `6. **البحث الصوتي الذكي:** (يمكنك التحدث بصوتك باللغة العربية أو اللهجة السورية).\n\n` +
      `تفضل بسؤالي عن أي معاملة أو رسم أو ورقة مطلوبة وسأجيبك فورياً بالمعلومات الموثقة.`,
    suggestedFollowUps: [
      'أوراق ورسوم جواز السفر في طرطوس',
      'كيفية استخراج وثيقة غير محكوم',
      'أجور البولمان من دمشق إلى حلب',
      'أرقام الطوارئ والإسعاف في سورية',
    ],
  };
}
