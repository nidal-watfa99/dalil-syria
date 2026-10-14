import { Transaction } from '../types';

export const TRANSACTIONS_DATA: Transaction[] = [
  {
    id: 'tx-passport-normal',
    titleAr: 'إصدار وتجديد جواز السفر الإلكتروني (الدور العادي)',
    titleEn: 'Ordinary Electronic Passport Issuance & Renewal',
    commonNames: ['جواز سفر عادي', 'تجديد الجواز', 'دفتر السفر السوري'],
    synonyms: ['بوابة الجوازات', 'حجز دور جواز', 'جواز السفر الداخلي'],
    categoryId: 'passports-immigration',
    responsibleAuthority: 'وزارة الداخلية - إدارة الهجرة والجوازات',
    summaryAr: 'معاملة استخراج جواز سفر سوري إلكتروني وفق نظام الدور العادي المسبق عبر البوابة الإلكترونية أو المراكز المعتمدة للمواطنين المقيمين داخل القطر.',
    eligibility: 'كل مواطن عربي سوري أتم الثامنة عشرة من عمره، أو القاصرون بموافقة خطية من الولي الشرعي، مع تسوية الوضع التجنيدي لمن تنطبق عليهم شروط خدمة العلم.',
    requiredDocuments: [
      {
        id: 'doc-id-card',
        nameAr: 'البطاقة الشخصية (الهوية) السورية الأصلية سارية المفعول',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false,
        notes: 'يجب أن تكون الهوية واضحة وغير مشوهة، وفي حال تعذر ذلك يطلب بيان قيد إفرادي حديث ممهور بصورة شخصية ملونة.'
      },
      {
        id: 'doc-photos',
        nameAr: 'صورتان شخصيتان حديثتان ملونتان (قياس 4×4 سم)',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false,
        notes: 'خلفية بيضاء نقية، بدون نظارات شمسية أو لمعان، وإظهار كامل ملامح الوجه بحيادية.'
      },
      {
        id: 'doc-military',
        nameAr: 'موافقة شعبة التجنيد (دفتر خدمة العلم أو تصريح سفر)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false,
        notes: 'إلزامية للذكور الذين تتراوح أعمارهم بين 17 و42 عاماً، وتستثنى الفئات المعفية قانوناً بوثيقة رسمية.'
      },
      {
        id: 'doc-old-passport',
        nameAr: 'جواز السفر القديم المنتهي أو المراد تجديده (في حال التجديد)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false,
        notes: 'يتم تسليمه لإلغائه وتثقيبه وإعادته لصاحب العلاقة مع الجواز الجديد.'
      },
      {
        id: 'doc-guardian-consent',
        nameAr: 'موافقة الولي الشرعي (للأبناء القاصرين دون 18 عاماً)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'الكاتب بالعدل أو بحضور الأب/الولي شخصياً في فرع الهجرة',
        notes: 'حضور الأب أو الوصي الشرعي مصطحباً بطاقته الشخصية أو وكالة شرعية متضمنة الإذن بالسفر واستخراج الجواز.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'حجز الموعد عبر المنصة الإلكترونية الرسمية',
        description: 'الدخول إلى بوابة وزارة الداخلية وإدخال الرقم الوطني وتثبيت حجز موعد ضمن فرع الهجرة في المحافظة المختارة.',
        locationName: 'البوابة الإلكترونية الموحدة لوزارة الداخلية'
      },
      {
        stepNumber: 2,
        title: 'تسديد الرسوم المالية المقررة قانوناً',
        description: 'تسديد الرسوم عبر قنوات الدفع الإلكتروني المصرفية المعتمدة (تطبيق بنكي أو شركات الدفع الإلكتروني المرخصة) والحصول على إشعار الدفع المرجعي.',
        locationName: 'المصارف المعتمدة أو نقاط الدفع الإلكتروني'
      },
      {
        stepNumber: 3,
        title: 'مراجعة فرع الهجرة والجوازات في الموعد المحدد',
        description: 'الحضور بالموعد المحدد مصطحباً الأوراق الثبوتية وإشعار الدفع، لإجراء البصمة الحيوية والتقاط الصورة الرقمية والتحقق الجنائي.',
        locationName: 'فرع الهجرة والجوازات في المحافظة المعنية'
      },
      {
        stepNumber: 4,
        title: 'استلام جواز السفر',
        description: 'استلام الجواز شخصياً أو عبر وكيل قانوني بموجب وكالة خاصة، بعد التحقق من البيانات المطبوعة.',
        locationName: 'نافذة تسليم الجوازات في فرع الهجرة والجوازات'
      }
    ],
    officialFees: [
      {
        item: 'رسم استخراج وتجديد جواز السفر العادي المنظم قانوناً',
        amount: 312000,
        currency: 'SYP',
        legalReference: 'قرار وزارة الداخلية والمالية النافذ لعام 2024',
        paymentMethod: 'دفع إلكتروني عبر منظومة المصرف التجاري / الدفع المصرفي المرخص',
        effectiveDate: '2024-01-01'
      },
      {
        item: 'طابع الإدارة المحلية ورسوم المجهود الحربي والشهيد',
        amount: 15000,
        currency: 'SYP',
        legalReference: 'المرسوم التشريعي الناظم للرسوم المحلية المضافة',
        paymentMethod: 'مشمول ضمن الدفع الإلكتروني الموحد',
        effectiveDate: '2024-01-01'
      }
    ],
    processingTimeOfficial: 'من 15 إلى 35 يوماً وفق مواعيد الدور المتاحة على المنصة',
    processingTimeEstimated: 'حوالي 20 يوماً عمل',
    personalAttendanceRequired: true,
    powerOfAttorneyAllowed: true,
    appointmentRequired: true,
    formsAvailable: [
      {
        title: 'استمارة طلب استخراج جواز سفر سوري إلكتروني',
        formCode: 'MOI-PASS-01',
        downloadUrl: 'http://moi.gov.sy/forms/passport-request.pdf'
      }
    ],
    submittingEntity: 'فرع الهجرة والجوازات في محافظة الإقامة أو القيود المدنية',
    issuingEntity: 'إدارة الهجرة والجوازات - وزارة الداخلية',
    commonRejectionReasons: [
      'عدم تطابق الاسم أو بيانات القيد مع السجل المدني المركزي',
      'وجود مانع سفر قضائي أو مالي أو عدم ورود موافقة التجنيد',
      'تلف الصورة الشخصية أو عدم استيفائها للمواصفات الحيوية (خلفية غير بيضاء أو ملابس عسكرية للمدنيين)',
      'عدم إحضار الجواز القديم في معاملات التجديد لتسديد قيوده'
    ],
    officialPortalUrl: 'http://moi.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'قرارات وزارة الداخلية وإدارة الهجرة والجوازات المنشورة بالجريدة الرسمية',
    sourceUrl: 'http://moi.gov.sy',
    legalBasisNumber: 'المرسوم التشريعي رقم 29 لعام 1970 وتعديلاته بالمرسوم رقم 18 لعام 2022',
    lastVerifiedDate: '2024-09-15',
    nextReviewDate: '2025-01-15',
    relatedAuthorityIds: ['auth-damascus-immigration', 'auth-tartus-immigration', 'auth-latakia-immigration', 'auth-aleppo-immigration', 'auth-homs-immigration', 'auth-hama-immigration', 'auth-daraa-immigration', 'auth-suwayda-immigration'],
    governorateNotes: {
      'tartus': 'يتم تقديم الطلبات في فرع الهجرة والجوازات على طريق المرفأ، وينصح بتسديد الرسوم إلكترونياً قبل الحضور بنصف ساعة.',
      'damascus': 'مراكز الخدمة تستقبل المواعيد المحجوزة في مجمع كفرسوسة والبرامكة وركن الدين.'
    }
  },
  {
    id: 'tx-passport-instant',
    titleAr: 'إصدار جواز السفر الفوري (المستعجل / المنصة الفورية)',
    titleEn: 'Instant Electronic Passport Issuance',
    commonNames: ['جواز فوري', 'جواز مستعجل بنفس اليوم', 'جواز السفر الفوري الداخلي'],
    synonyms: ['جواز فوري داخلي', 'جواز خلال 24 ساعة', 'جواز سفر مستعجل'],
    categoryId: 'passports-immigration',
    responsibleAuthority: 'وزارة الداخلية - إدارة الهجرة والجوازات',
    summaryAr: 'معاملة استخراج أو تجديد جواز السفر الفوري خلال مدة تتراوح بين 24 إلى 48 ساعة دون التقيد بدور المنصة العادي لمن تستدعي ظروفهم السفر العاجل.',
    eligibility: 'جميع المواطنين السوريين ومن في حكمهم الراغبين بالحصول الفوري على الجواز بعد استيفاء الشروط القانونية وسداد الرسم الفوري المقر قانوناً.',
    requiredDocuments: [
      {
        id: 'doc-inst-id',
        nameAr: 'البطاقة الشخصية الأصلية سارية المفعول',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false,
        notes: 'إلزامية مع التحقق من البصمة.'
      },
      {
        id: 'doc-inst-photos',
        nameAr: 'صورتان شخصيتان حديثتان ملونتان قياس 4×4 سم بخلفية بيضاء',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false
      },
      {
        id: 'doc-inst-military',
        nameAr: 'موافقة شعبة التجنيد أو إذن السفر العسكري للمكلفين',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      },
      {
        id: 'doc-inst-old',
        nameAr: 'جواز السفر القديم لتثقيبه (في حال التجديد)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'اختيار مسار الجواز الفوري عبر البوابة الرسمية',
        description: 'تسجيل الدخول واختيار خدمة الجواز الفوري وتحديد مركز الاستلام.',
        locationName: 'بوابة وزارة الداخلية الإلكترونية'
      },
      {
        stepNumber: 2,
        title: 'تسديد الرسم الفوري المقرر إلكترونياً',
        description: 'تسديد الرسم المحدد (2,000,000 ل.س للجواز الفوري الداخلي) مع الرسوم الملحقة.',
        locationName: 'منظومة الدفع الإلكتروني المصرفية'
      },
      {
        stepNumber: 3,
        title: 'مراجعة الفرع وتثبيت البصمات',
        description: 'التوجه إلى الفرع خلال ساعات الدوام الفوري لأخذ البصمات وإتمام التحقق.',
        locationName: 'فرع الهجرة والجوازات'
      },
      {
        stepNumber: 4,
        title: 'الاستلام خلال 24 إلى 48 ساعة',
        description: 'استلام الجواز من صالة التسليم الفوري.',
        locationName: 'فرع الهجرة والجوازات'
      }
    ],
    officialFees: [
      {
        item: 'رسم جواز السفر الفوري الداخلي (القرار الوزاري لعام 2024)',
        amount: 2000000,
        currency: 'SYP',
        legalReference: 'قرار وزارة الداخلية رقم 2024/ج الناظم للجواز الفوري الداخلي',
        paymentMethod: 'دفع إلكتروني مصرفي حصراً',
        effectiveDate: '2024-01-01'
      }
    ],
    processingTimeOfficial: 'من 24 إلى 48 ساعة كحد أقصى',
    processingTimeEstimated: 'يوم عمل واحد',
    personalAttendanceRequired: true,
    powerOfAttorneyAllowed: true,
    appointmentRequired: true,
    formsAvailable: [],
    submittingEntity: 'فروع الهجرة والجوازات في المحافظات',
    issuingEntity: 'إدارة الهجرة والجوازات - دمشق',
    commonRejectionReasons: [
      'فشل عملية الدفع الإلكتروني أو نقص في الرصيد المصرفي',
      'وجود إذاعة بحث أو منع سفر صادر عن جهة قضائية نافذة'
    ],
    officialPortalUrl: 'http://moi.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'بيان رسمي صادر عن إدارة الهجرة والجوازات السورية',
    sourceUrl: 'http://moi.gov.sy',
    legalBasisNumber: 'القرار الوزاري رقم 2024/85 الناظم لتعرفة الجواز الفوري والمستعجل',
    lastVerifiedDate: '2024-09-10',
    nextReviewDate: '2025-01-10',
    relatedAuthorityIds: ['auth-damascus-immigration', 'auth-tartus-immigration', 'auth-latakia-immigration', 'auth-aleppo-immigration', 'auth-homs-immigration']
  },
  {
    id: 'tx-non-conviction',
    titleAr: 'استخراج وثيقة غير محكوم (خلاصة السجل العدلي)',
    titleEn: 'Criminal Record Clearance (Non-Conviction Certificate)',
    commonNames: ['لا حكم عليه', 'غير محكوم', 'شهادة السجل العدلي'],
    synonyms: ['براءة ذمة قضائية', 'سجل السوابق العدلية', 'وثيقة لا سوابق'],
    categoryId: 'justice-judiciary',
    responsibleAuthority: 'وزارة العدل - دائرة السجل العدلي المؤتمت',
    summaryAr: 'شهادة رسمية تثبت خلو صحيفة المواطن أو المقيم من أي أحكام جزائية أو جنائية مانعة، وتطلب عند التقدم للوظائف الحكومية والخاصة والجامعات والسفر والتراخيص.',
    eligibility: 'أي مواطن سوري أتم سن الرشد القانوني (18 عاماً) أو الأجانب المقيمون في سورية بصورة قانونية، ويجوز للوكيل القانوني أو أحد الأصول أو الفروع استخراجها.',
    requiredDocuments: [
      {
        id: 'doc-nc-id',
        nameAr: 'البطاقة الشخصية السورية الأصلية سارية المفعول',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false,
        notes: 'أو إخراج قيد مدني فردي حديث عليه صورة ممهورة بخاتم أمين السجل المدني.'
      },
      {
        id: 'doc-nc-poa',
        nameAr: 'الوكالة القانونية (في حال عدم حضور صاحب العلاقة شخصياً)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'الكاتب بالعدل أو نقابة المحامين',
        notes: 'يستثنى من ذلك الأب والأم والزوج والزوجة في حال إبراز الدفتر العائلي.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'شراء الطوابع القانونية والتوجه لصالة السجل العدلي المؤتمت',
        description: 'إلصاق طابع السجل العدلي وطابع الإدارة المحلية على الاستمارة في قصر العدل أو المراكز المخصصة.',
        locationName: 'قصر العدل أو مجمع الخدمات الحكومية'
      },
      {
        stepNumber: 2,
        title: 'المطابقة الإلكترونية للبصمة والرقم الوطني',
        description: 'يقوم الموظف المختص بتدقيق الرقم الوطني ومقاطعة القيود مع قاعدة بيانات وزارة العدل والداخلية.',
        locationName: 'نافذة السجل العدلي المؤتمت'
      },
      {
        stepNumber: 3,
        title: 'طباعة وتوقيع وثيقة السجل العدلي وتصديقها',
        description: 'طباعة الوثيقة ومهره بخاتم قاضي النيابة العامة وتوقيعه الرسمي.',
        locationName: 'ديوان النيابة العامة بقصر العدل'
      }
    ],
    officialFees: [
      {
        item: 'رسم استخراج خلاصة السجل العدلي القانوني المؤتمت',
        amount: 5000,
        currency: 'SYP',
        legalReference: 'قانون الرسوم القضائية رقم 42 لعام 2023',
        paymentMethod: 'نقداً في صندوق المحكمة أو عبر الدفع الإلكتروني بالمراكز الذكية',
        effectiveDate: '2023-11-01'
      },
      {
        item: 'طابع العدالة وطابع الإدارة المحلية والمجهود الحربي',
        amount: 2500,
        currency: 'SYP',
        legalReference: 'المرسوم الناظم للطوابع المالية والقضائية',
        paymentMethod: 'إلصاق طوابع مالية وقضائية معتمدة',
        effectiveDate: '2023-11-01'
      }
    ],
    processingTimeOfficial: 'نفس اليوم (خلال 30 إلى 60 دقيقة في المراكز المؤتمتة)',
    processingTimeEstimated: 'أقل من ساعتين',
    personalAttendanceRequired: false,
    powerOfAttorneyAllowed: true,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'أقسام السجل العدلي في قصور العدل أو مراكز خدمة المواطن التابعة لمجالس المدن',
    issuingEntity: 'وزارة العدل - إدارة النيابة العامة',
    commonRejectionReasons: [
      'تشابه أسماء دون توفر الرقم الوطني الدقيق في قيد الأحوال المدنية',
      'وجود حكم جزائي غير مبرأ أو قيد إعادة اعتبار غير مكتمل',
      'وجود إذاعة بحث صادرة تتطلب مراجعة النيابة العامة المختصة لتسويتها'
    ],
    officialPortalUrl: 'http://moj.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'وزارة العدل السورية - دليل الخدمات القضائية المؤتمتة',
    sourceUrl: 'http://moj.gov.sy',
    legalBasisNumber: 'قانون أصول المحاكمات الجزائية السوري وتعديلاته وقانون الرسوم القضائية رقم 42/2023',
    lastVerifiedDate: '2024-08-20',
    nextReviewDate: '2025-02-20',
    relatedAuthorityIds: ['auth-damascus-justice-palace', 'auth-tartus-justice-palace', 'auth-latakia-justice-palace', 'auth-aleppo-justice-palace', 'auth-homs-justice-palace'],
    governorateNotes: {
      'tartus': 'متوفرة في قصر العدل بطرطوس وفي مركز خدمة المواطن بالمدينة القديمة والكورنيش.',
      'damascus': 'متوفرة في قصر العدل بالمرجة وفي مراكز خدمة المواطن بالبرامكة، المزة، القنوات، وكفرسوسة.'
    }
  },
  {
    id: 'tx-civil-national-id',
    titleAr: 'إصدار البطاقة الشخصية السورية لأول مرة (سن 14 عاماً فما فوق)',
    titleEn: 'First-Time Syrian National Identity Card Issuance',
    commonNames: ['استخراج هوية جديدة', 'أول هوية', 'البطاقة الشخصية'],
    synonyms: ['الهوية السورية', 'البطاقة المدنية', 'استخراج بطاقة شخصية لأول مرة'],
    categoryId: 'civil-status',
    responsibleAuthority: 'وزارة الداخلية - الإدارة العامة للشؤون المدنية',
    summaryAr: 'معاملة إصدار البطاقة الشخصية الرسمية للمواطن السوري عند إتمامه سن الرابعة عشرة من العمر وحتى الثامنة عشرة وما بعدها وفق القانون الناظم للأحوال المدنية.',
    eligibility: 'كل مواطن عربي سوري أتم سن الرابعة عشرة، أو السوريون الذين سويت قيودهم المدنية حديثاً.',
    requiredDocuments: [
      {
        id: 'doc-id-family-book',
        nameAr: 'البطاقة العائلية (دفتر العائلة) الأصلية المسجل فيها صاحب الطلب',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false,
        notes: 'يجب أن يكون صاحب العلاقة مسجلاً بوضوح ومكتمل البيانات في الدفتر العائلي.'
      },
      {
        id: 'doc-id-photos',
        nameAr: '3 صور شخصية حديثة وملونة قياس 4×4 سم بخلفية واضحة',
        isOriginal: true,
        copiesCount: 3,
        needsAttestation: false
      },
      {
        id: 'doc-id-witness',
        nameAr: 'شهادة تعريف موقعة من المختار أو ولي الأمر ومعتمدة أصولاً',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'مختار المحلة المعتمد رسمياً',
        notes: 'مرفقة بطابع المختار وطابع الإدارة المحلية.'
      },
      {
        id: 'doc-id-parent-id',
        nameAr: 'البطاقة الشخصية لولي الأمر (الأب أو الوصي الشرعي)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'تنظيم استمارة البطاقة الشخصية وتصديقها من المختار',
        description: 'شراء الاستمارة الرسمية وختمها من مختار الحي المعتمد مع إلصاق الصور وتوقيع ولي الأمر.',
        locationName: 'مكتب مختار الحي أو القرية'
      },
      {
        stepNumber: 2,
        title: 'مراجعة أمانة السجل المدني التابع لها القيد',
        description: 'تسليم الاستمارة لمطابقة صحيفة القيد وسحب بيان القيد العائلي المؤتمت ومطابقة السجل الورقي الأصلي.',
        locationName: 'مديرية الأحوال المدنية'
      },
      {
        stepNumber: 3,
        title: 'التقاط الصورة والبصمة الرقمية',
        description: 'أخذ البصمات العشرية الحيوية لصاحب العلاقة أمام أمين السجل والتوقيع على البطاقة.',
        locationName: 'قسم البطاقات الشخصية بالأحوال المدنية'
      },
      {
        stepNumber: 4,
        title: 'استلام البطاقة الشخصية المنجزة',
        description: 'استلام الهوية بعد طباعتها وتغليفها الأمني بموجب إيصال الاستلام الرسمي.',
        locationName: 'نافذة التسليم بالسجل المدني'
      }
    ],
    officialFees: [
      {
        item: 'رسم منح البطاقة الشخصية لأول مرة المحدد قانوناً',
        amount: 5000,
        currency: 'SYP',
        legalReference: 'القانون رقم 37 لعام 2023 المعدل لقانون الأحوال المدنية',
        paymentMethod: 'نقداً في صندوق أمانة السجل المدني',
        effectiveDate: '2023-12-15'
      },
      {
        item: 'طابع الشؤون المدنية وطابع الإدارة المحلية والمجهود الحربي',
        amount: 2000,
        currency: 'SYP',
        legalReference: 'مرسوم الرسوم المالية المضافة',
        paymentMethod: 'طوابع تلصق على الاستمارة',
        effectiveDate: '2023-12-15'
      }
    ],
    processingTimeOfficial: 'من 7 إلى 15 يوماً عمل',
    processingTimeEstimated: 'حوالي 10 أيام',
    personalAttendanceRequired: true,
    powerOfAttorneyAllowed: false,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'أمانة السجل المدني في المحافظة أو الناحية التابع لها القيد',
    issuingEntity: 'الإدارة العامة للشؤون المدنية - وزارة الداخلية',
    commonRejectionReasons: [
      'نقص في صور صاحب الطلب أو عدم استيفائها المقاييس المحددة من الشؤون المدنية',
      'وجود اختلاف بين تاريخ الولادة المكتوب وواقع السجل الأصلي الورقي',
      'عدم حضور ولي الأمر في حال كان طالب الهوية دون سن الثامنة عشرة'
    ],
    officialPortalUrl: 'http://moi.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'القانون رقم 37 لعام 2023 الصادر عن مجلس الشعب ونصوص وزارة الداخلية',
    sourceUrl: 'http://moi.gov.sy',
    legalBasisNumber: 'القانون رقم 37 لعام 2023 القاضي بتعديل بعض مواد قانون الأحوال المدنية رقم 13 لعام 2021',
    lastVerifiedDate: '2024-09-01',
    nextReviewDate: '2025-03-01',
    relatedAuthorityIds: ['auth-damascus-civil-status', 'auth-tartus-civil-status']
  },
  {
    id: 'tx-marriage-registration',
    titleAr: 'تثبيت وتسجيل واقعة الزواج الإداري في السجل المدني',
    titleEn: 'Civil Registration of Marriage (Post-Court Attestation)',
    commonNames: ['تثبيت الزواج بالأحوال', 'تسجيل عقد الزواج', 'إضافة الزوجة للدفتر'],
    synonyms: ['واقعة زواج', 'عقد الزواج الشرعي', 'تسجيل واقعة زواج بالأحوال المدنية'],
    categoryId: 'civil-status',
    responsibleAuthority: 'وزارة الداخلية - الإدارة العامة للشؤون المدنية',
    summaryAr: 'تسجيل وتثبيت واقعة الزواج المنعقدة شرعاً أو قانوناً في السجلات المدنية الرسمية وتدوينها في صحيفة الزوجين واستخراج أو تحديث البطاقة العائلية.',
    eligibility: 'الزوجان اللذان أبرما عقد زواج قضائي شرعي أو كنسي صادر عن المحكمة المختصة داخل سورية، أو عقد زواج خارجي مصدق أصولاً.',
    requiredDocuments: [
      {
        id: 'doc-mrg-court-cert',
        nameAr: 'وثيقة عقد الزواج الأصلية مصدقة وممهورة من المحكمة الشرعية أو الروحية',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: true,
        attestationEntity: 'المحكمة الشرعية وقصر العدل',
        notes: 'يجب أن تتضمن الوثيقة تثبيت المهر والشاهدين وتاريخ الانعقاد.'
      },
      {
        id: 'doc-mrg-ids',
        nameAr: 'البطاقة الشخصية الأصلية للزوج والزوجة مع صورة واضحة لكل منهما',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false
      },
      {
        id: 'doc-mrg-family-book',
        nameAr: 'البطاقة العائلية (دفتر عائلة والد الزوج أو دفتر عائلة الزوج إن كان مستقلاً)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'استلام صك الزواج الشرعي أو الحكم القضائي المبرم من المحكمة',
        description: 'الحصول على النسخة التنفيذية الموجهة لأمين السجل المدني من ديوان المحكمة الشرعية.',
        locationName: 'المحكمة الشرعية بقصر العدل'
      },
      {
        stepNumber: 2,
        title: 'تقديم المعاملة لأمانة السجل المدني',
        description: 'تسليم الوثائق مع استمارة تسجيل واقعة زواج لدى أمانة السجل المدني المختصة.',
        locationName: 'مديرية الأحوال المدنية'
      },
      {
        stepNumber: 3,
        title: 'إسقاط الواقعة على القيد الحاسوبي وإصدار الدفتر العائلي',
        description: 'تدوين الواقعة على قيد الزوج ونقل قيد الزوجة حاسوبياً لخانة الزوج وطباعة الدفتر العائلي الجديد.',
        locationName: 'قسم الواقعات بالسجل المدني'
      }
    ],
    officialFees: [
      {
        item: 'رسم تسجيل الواقعة ضمن المدة القانونية (خلال 30 يوماً من العقد)',
        amount: 0,
        currency: 'SYP',
        legalReference: 'القانون رقم 37 لعام 2023 - مجانية التسجيل بالمهلة المحددة',
        paymentMethod: 'مجانية بدون رسم تسجيل',
        effectiveDate: '2023-12-15'
      },
      {
        item: 'طابع الإدارة المحلية المضاف على استمارة الواقعة',
        amount: 1000,
        currency: 'SYP',
        legalReference: 'نظام الطوابع المالية المحلية',
        paymentMethod: 'طابع مالي يلصق على الإشعار',
        effectiveDate: '2023-12-15'
      },
      {
        item: 'غرامة التأخير في التسجيل بعد انقضاء 30 يوماً وحتى سنة (في حال التأخر)',
        amount: 5000,
        currency: 'SYP',
        legalReference: 'المادة 42 من قانون الأحوال المدنية السوري المعدل',
        paymentMethod: 'نقداً في صندوق السجل المدني بموجب إيصال غرامة',
        effectiveDate: '2023-12-15'
      }
    ],
    processingTimeOfficial: 'نفس اليوم إلى 3 أيام عمل',
    processingTimeEstimated: 'يوم عمل واحد',
    personalAttendanceRequired: false,
    powerOfAttorneyAllowed: true,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'أمانة السجل المدني التابع لها قيد الزوج',
    issuingEntity: 'وزارة الداخلية - الشؤون المدنية',
    commonRejectionReasons: [
      'نقص تصديق رئيس المحكمة الشرعية على صك الزواج',
      'عدم استيفاء وثيقة الفحص الطبي لما قبل الزواج في الملف القضائي الأصلي',
      'تجاوز المهلة القانونية دون تسديد الغرامة المقررة'
    ],
    officialPortalUrl: 'http://moi.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'القانون رقم 37 لعام 2023 وقانون الأحوال الشخصية السوري',
    sourceUrl: 'http://moi.gov.sy',
    legalBasisNumber: 'المرسوم التشريعي رقم 59 لعام 1953 وتعديلاته وقانون الأحوال المدنية 2023',
    lastVerifiedDate: '2024-09-05',
    nextReviewDate: '2025-03-05',
    relatedAuthorityIds: ['auth-damascus-civil-status', 'auth-tartus-civil-status']
  },
  {
    id: 'tx-cadastre-property-transfer',
    titleAr: 'نقل ملكية عقار مبني أو أرض (فراغ عقاري - بيع وشراء)',
    titleEn: 'Real Estate Property Ownership Transfer & Registration',
    commonNames: ['فراغ عقار', 'نقل طابو', 'فراغ بالمالية والعقارية'],
    synonyms: ['طابو أخضر', 'فراغ بيت', 'نقل ملكية بالسجل العقاري'],
    categoryId: 'real-estate-cadastre',
    responsibleAuthority: 'وزارة الإدارة المحلية والبيئة - المديرية العامة للمصالح العقارية',
    summaryAr: 'إجراءات نقل الملكية العقارية القانونية من البائع إلى المشتري في السجل العقاري وتثبيت عقد البيع والتوثيق بعد سداد الضريبة المقررة وفق قانون البيوع العقارية.',
    eligibility: 'المالك المسجل في الصحيفة العقارية أو وكيله القانوني بموجب وكالة عقارية غير قابلة للعزل متضمنة البيع والإسقاط، والمشتري المؤهل قانوناً للتملك.',
    requiredDocuments: [
      {
        id: 'doc-cad-cadastral-extract',
        nameAr: 'قيد عقاري حديث للصحيفة العقارية (ساري لمدة لا تتجاوز شهراً)',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: true,
        attestationEntity: 'أمانة السجل العقاري المختصة',
        notes: 'يجب أن يثبت خلو العقار من أي إشارات حجز قضائي أو منع تصرف أو رهن غير مبرأ.'
      },
      {
        id: 'doc-cad-tax-clearance',
        nameAr: 'براءة ذمة مالية حديثة وفق قانون البيوع العقارية رقم 15 لعام 2021',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'مديرية المالية التابع لها العقار',
        notes: 'تتضمن تحديد القيمة الرائجة المعتمدة وتسديد ضريبة البيوع العقارية بنسبة 1% من القيمة الرائجة للعقارات السكنية.'
      },
      {
        id: 'doc-cad-municipal-clearance',
        nameAr: 'براءة ذمة من الوحدة الإدارية (مجلس المدينة أو البلدية)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'مجلس المدينة أو البلدية المختصة',
        notes: 'تثبت سداد كافة الرسوم البلدية والتحسين ورسوم النظافة ورخص البناء.'
      },
      {
        id: 'doc-cad-ids',
        nameAr: 'البطاقات الشخصية الأصلية للبائع والمشتري مع صور عنها',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false
      },
      {
        id: 'doc-cad-bank-receipt',
        nameAr: 'إشعار تحويل مصرفي بنكي لجزء من الثمن عبر الحساب المصرفي',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'مصرف سوري معتمد',
        notes: 'وفق القرارات الناظمة لعمليات بيع العقارات عبر القنوات المصرفية.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'استخراج القيد العقاري والمخطط المساحي',
        description: 'مراجعة أمانة السجل العقاري واستخراج قيد عقاري مطابق وتدقيق ملكية البائع وعدم وجود موانع.',
        locationName: 'مديرية المصالح العقارية'
      },
      {
        stepNumber: 2,
        title: 'الحصول على براءة الذمة البلدية وسداد رسوم التحسين',
        description: 'مراجعة مجلس المدينة أو البلدية والتحقق من عدم وجود مخالفات بناء غير مسواة وسداد رسوم الخدمات.',
        locationName: 'مجلس المدينة / الدائرة الفنية'
      },
      {
        stepNumber: 3,
        title: 'الكشف المالي وتسديد ضريبة البيوع العقارية بالمالية',
        description: 'مراجعة مديرية المالية لتطبيق نظام القيمة الرائجة وتخمين العقار ودفع ضريبة البيع واستلام إشعار براءة الذمة المالية.',
        locationName: 'مديرية مالية المحافظة'
      },
      {
        stepNumber: 4,
        title: 'توقيع عقد البيع والفراغ في السجل العقاري',
        description: 'حضور الطرفين أمام رئيس مكتب التوثيق العقاري، والتوقيع على عقد البيع، وتدوين المشتري مالكاً في الصحيفة وطباعة سند التمليك (الطابو).',
        locationName: 'دائرة التسجيل والتوثيق العقاري بالمصالح العقارية'
      }
    ],
    officialFees: [
      {
        item: 'ضريبة البيوع العقارية للعقارات السكنية (1% من القيمة الرائجة المخمنة)',
        amount: 0,
        currency: 'SYP',
        legalReference: 'القانون رقم 15 لعام 2021 الناظم لضريبة البيوع العقارية',
        paymentMethod: 'دفع عبر حساب مصرفي في المصرف التجاري أو المالي',
        effectiveDate: '2021-05-01'
      },
      {
        item: 'رسم التسجيل العقاري ورسوم السجل المؤقت',
        amount: 50000,
        currency: 'SYP',
        legalReference: 'المرسوم التشريعي الناظم لرسوم المصالح العقارية',
        paymentMethod: 'صندوق مديرية المصالح العقارية',
        effectiveDate: '2023-01-01'
      }
    ],
    processingTimeOfficial: 'من 3 إلى 10 أيام عمل متتالية',
    processingTimeEstimated: 'أسبوع عمل واحد لإنجاز كافة الموافقات المالية والبلدية',
    personalAttendanceRequired: true,
    powerOfAttorneyAllowed: true,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'أمانة السجل العقاري في منطقة العقار التابعة لمديرية المصالح العقارية',
    issuingEntity: 'المديرية العامة للمصالح العقارية',
    commonRejectionReasons: [
      'وجود إشارة حجز مالي أو دعوى قضائية مانعة للتصرف على الصحيفة العقارية',
      'عدم تطابق اسم البائع في الهوية مع اسمه المسجل في الصحيفة العقارية القديمة وتطلبه معاملة تصحيح',
      'عدم تسديد ضريبة البيوع العقارية المقدرة وفق القيمة الرائجة المحدثة'
    ],
    officialPortalUrl: 'http://mof.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'القانون رقم 15 لعام 2021 وقانون السجل العقاري رقم 188 لعام 1926 وتعديلاته',
    sourceUrl: 'http://mof.gov.sy',
    legalBasisNumber: 'القانون رقم 15 لعام 2021 وقرارات رئاسة مجلس الوزراء ذات الصلة',
    lastVerifiedDate: '2024-08-15',
    nextReviewDate: '2025-02-15',
    relatedAuthorityIds: ['auth-damascus-cadastre', 'auth-tartus-cadastre']
  },
  {
    id: 'tx-commercial-registration',
    titleAr: 'تأسيس وقيد سجل تجاري لمؤسسة فردية جديدة',
    titleEn: 'Sole Proprietorship Commercial Registration',
    commonNames: ['فتح سجل تجاري', 'ترخيص محل', 'سجل فردي تجاري'],
    synonyms: ['أمانة السجل التجاري', 'شهادة تجارية', 'رخصة تجارية'],
    categoryId: 'commerce-business',
    responsibleAuthority: 'وزارة التجارة الداخلية وحماية المستهلك - أمانة السجل التجاري',
    summaryAr: 'معاملة قيد وتسجيل مؤسسة أو متجر تجاري فردي في السجل التجاري الرسمي لمنح التاجر الشخصية القانونية وحق ممارسة النشاط التجاري والاستيراد والتمثيل.',
    eligibility: 'كل سوري أو من في حكمه أتم الحادية والعشرين من عمره، غير محكوم بجناية أو جنحة مخلة بالأمانة أو الشرف، ويمتلك محلاً أو مقراً ثابتاً لنشاطه.',
    requiredDocuments: [
      {
        id: 'doc-com-id',
        nameAr: 'البطاقة الشخصية الأصلية للتاجر مع صورة عنها',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false
      },
      {
        id: 'doc-com-nc',
        nameAr: 'وثيقة لا حكم عليه حديثة (لم يمضِ على إصدارها أكثر من 3 أشهر)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'السجل العدلي - وزارة العدل'
      },
      {
        id: 'doc-com-lease',
        nameAr: 'عقد إيجار مسجل لدى البلدية أو سند ملكية العقار التجاري',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'مجلس المدينة أو الوحدة الإدارية المختصة',
        notes: 'يجب أن يكون العقار مرخصاً تجارياً أو إدارياً وفق المخطط التنظيمي.'
      },
      {
        id: 'doc-com-chamber',
        nameAr: 'شهادة انتساب وتسجيل في غرفة تجارة المحافظة',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'غرفة التجارة في المحافظة'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'مراجعة غرفة التجارة وتحديد الدرجة والتسجيل',
        description: 'تقديم طلب الانتساب لغرفة التجارة وتحديد تصنيف المتجر وسداد الرسوم السنوية للغرفة.',
        locationName: 'غرفة التجارة في المحافظة'
      },
      {
        stepNumber: 2,
        title: 'حجز الاسم التجاري وتدقيقه',
        description: 'مراجعة أمانة السجل التجاري للتأكد من عدم حجز الاسم التجاري مسبقاً وتطابقه مع الشروط.',
        locationName: 'مديرية التجارة الداخلية وحماية المستهلك'
      },
      {
        stepNumber: 3,
        title: 'الكشف الميداني والتسجيل وإصدار السجل التجاري',
        description: 'إجراء الكشف على المقر عند الحاجة وسداد الرسوم القانونية واستلام شهادة القيد بالسجل التجاري.',
        locationName: 'أمانة السجل التجاري'
      }
    ],
    officialFees: [
      {
        item: 'رسم قيد وتسجيل مؤسسة فردية بالسجل التجاري الرسمي',
        amount: 35000,
        currency: 'SYP',
        legalReference: 'قانون التجارة السوري رقم 33 لعام 2007 وتعديلاته بالمرسوم رقم 8 لعام 2021',
        paymentMethod: 'صندوق مديرية التجارة الداخلية أو الدفع الإلكتروني',
        effectiveDate: '2023-01-01'
      },
      {
        item: 'رسم الانتساب السنوي لغرفة التجارة (حسب الدرجة المصنفة من الرابعة للأولى)',
        amount: 75000,
        currency: 'SYP',
        legalReference: 'نظام الرسوم لغرف التجارة السورية',
        paymentMethod: 'صندوق غرفة التجارة المعنية',
        effectiveDate: '2024-01-01'
      }
    ],
    processingTimeOfficial: 'من 3 إلى 7 أيام عمل',
    processingTimeEstimated: '3 أيام عمل',
    personalAttendanceRequired: true,
    powerOfAttorneyAllowed: true,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'أمانة السجل التجاري بمديرية التجارة الداخلية وحماية المستهلك',
    issuingEntity: 'وزارة التجارة الداخلية وحماية المستهلك',
    commonRejectionReasons: [
      'العقار غير مستوفٍ للتراخيص الإدارية والتنظيمية البلدية للمهن المقترحة',
      'تشابه أو تطابق الاسم التجاري المقترح مع اسم مسجل مسبقاً في المحافظة ذاتها'
    ],
    officialPortalUrl: 'http://mitcp.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'قانون التجارة السوري رقم 33 لعام 2007 وقرارات وزارة التجارة الداخلية',
    sourceUrl: 'http://mitcp.gov.sy',
    legalBasisNumber: 'قانون التجارة رقم 33 لعام 2007 والمرسوم رقم 8 لعام 2021 الناظم لحماية المستهلك والأسواق',
    lastVerifiedDate: '2024-08-10',
    nextReviewDate: '2025-02-10',
    relatedAuthorityIds: ['auth-damascus-chamber-commerce']
  },
  {
    id: 'tx-driving-license-renew',
    titleAr: 'تجديد شهادة (رخصة) القيادة الخاصة أو العامة',
    titleEn: 'Driver License Renewal (Private & Public)',
    commonNames: ['تجديد شهادة السواقة', 'رخصة القيادة', 'تجديد إجازة السوق'],
    synonyms: ['إجازة سوق', 'شهادة قيادة سيارة', 'تجديد دفتر السواقة'],
    categoryId: 'transport-vehicles',
    responsibleAuthority: 'وزارة النقل - إدارة المرور وإجازات السوق',
    summaryAr: 'معاملة تجديد رخصة القيادة المنتهية الصلاحية بعد إجراء الفحص الطبي للنظر واللياقة البدنية وسداد الرسوم المقررة لضمان سلامة المرور.',
    eligibility: 'حاملو رخص القيادة السورية الصادرة سابقاً والمنتهية صلاحيتها، مع سلامة الحواس واللياقة الطبية لقيادة المركبات.',
    requiredDocuments: [
      {
        id: 'doc-drv-old-license',
        nameAr: 'رخصة القيادة الأصلية المنتهية الصلاحية',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      },
      {
        id: 'doc-drv-id',
        nameAr: 'البطاقة الشخصية السورية الأصلية سارية المفعول مع صورة عنها',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      },
      {
        id: 'doc-drv-photos',
        nameAr: 'صورتان شخصيتان حديثتان ملونتان قياس 3×4 سم بخلفية واضحة',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false
      },
      {
        id: 'doc-drv-medical',
        nameAr: 'تقرير الفحص الطبي (فحص النظر واللياقة البدنية) المعتمد رسمياً',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'اللجنة الطبية لفحص السائقين بمديرية النقل / الصحة',
        notes: 'يجرى مباشرة في المركز الصحي المعتمد التابع للمرور.'
      },
      {
        id: 'doc-drv-traffic-clearance',
        nameAr: 'براءة ذمة من إدارة المرور تثبت خلو الرخصة من المخالفات غير المسددة',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'فرع المرور بالمحافظة'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'إجراء الفحص الطبي للنظر واللياقة',
        description: 'مراجعة اللجنة الطبية لفحص النظر وتخطيط حدة الإبصار وتثبيت النتيجة في الاستمارة.',
        locationName: 'اللجنة الطبية المعتمدة بمركز إجازات السوق'
      },
      {
        stepNumber: 2,
        title: 'استخراج براءة الذمة المرورية والمخالفات',
        description: 'مطابقة قيود رخصة القيادة في نظام المرور وتسديد أي مخالفات سابقة مسجلة على الرقم الوطني أو المركبة.',
        locationName: 'دائرة المرور / فرع المرور'
      },
      {
        stepNumber: 3,
        title: 'تسديد الرسوم وطباعة البطاقة الذكية الجديدة',
        description: 'تسديد الرسوم في الصندوق المعتمد واستلام الرخصة البلاستيكية الحديثة الممغنطة.',
        locationName: 'مديرية النقل أو فرع المرور'
      }
    ],
    officialFees: [
      {
        item: 'رسم تجديد رخصة القيادة الخاصة المحدد قانوناً',
        amount: 25000,
        currency: 'SYP',
        legalReference: 'قانون السير والمركبات وتعديلاته بقرارات وزارة النقل والداخلية النافذة',
        paymentMethod: 'نقداً في الصندوق أو عبر منظومة الدفع الإلكتروني',
        effectiveDate: '2024-01-01'
      },
      {
        item: 'رسم الفحص الطبي وطابع الشهادة وطابع المجهود الحربي',
        amount: 10000,
        currency: 'SYP',
        legalReference: 'نظام رسوم اللجان الطبية لنقابة الأطباء ووزارة الصحة',
        paymentMethod: 'صندوق اللجنة الطبية مباشرة',
        effectiveDate: '2024-01-01'
      }
    ],
    processingTimeOfficial: 'نفس اليوم (خلال ساعتين إلى 4 ساعات)',
    processingTimeEstimated: 'يوم عمل واحد',
    personalAttendanceRequired: true,
    powerOfAttorneyAllowed: false,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'فروع المرور وإدارة إجازات السوق أو مراكز خدمة المواطن المتخصصة بالنقل',
    issuingEntity: 'وزارة الداخلية - إدارة المرور بالتعاون مع وزارة النقل',
    commonRejectionReasons: [
      'عدم اجتياز فحص النظر دون ارتداء نظارات طبية معتمدة وفق اشتراطات السلامة',
      'وجود مخالفات سير غيابية مسجلة في محافظات أخرى تتطلب التسوية المركزية'
    ],
    officialPortalUrl: 'http://mot.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'قانون السير والمركبات السوري رقم 31 لعام 2004 وتعديلاته وقرارات وزارة النقل',
    sourceUrl: 'http://mot.gov.sy',
    legalBasisNumber: 'قانون السير والمركبات رقم 31 لعام 2004 والمرسوم التشريعي رقم 11 لعام 2008',
    lastVerifiedDate: '2024-08-01',
    nextReviewDate: '2025-02-01',
    relatedAuthorityIds: []
  },
  {
    id: 'tx-consular-attestation',
    titleAr: 'تصديق الوثائق الرسمية والشهادات للاستخدام خارج القطر',
    titleEn: 'Official Documents & Certificates Consular Attestation',
    commonNames: ['تصديق الخارجية', 'ختم الخارجية السورية', 'تصديق شهادات'],
    synonyms: ['تصديق أوراق السفر', 'تصديق قنصلي', 'ختم وزارة الخارجية والمغتربين'],
    categoryId: 'syrians-abroad-consular',
    responsibleAuthority: 'وزارة الخارجية والمغتربين - الإدارة القنصلية',
    summaryAr: 'تصديق الوثائق الرسمية والشهادات التعليمية والوثائق المدنية والتجارية المعتمدة محلياً لمطابقتها وإكسابها الصفة القانونية الدولية للاعتراف بها لدى السفارات والقنصليات والدول الأجنبية.',
    eligibility: 'أي مواطن أو مقيم يحمل وثيقة رسمية سورية أصلية ممهورة بالأختام الوزارية المختصة السابقة لتصديق الخارجية.',
    requiredDocuments: [
      {
        id: 'doc-att-original',
        nameAr: 'الوثيقة الأصلية المراد تصديقها وممهورة بختم الوزارة المعنية سابقاً',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'الوزارة المختصة (مثل وزارة التربية، الصحة، العدل، أو التعليم العالي)',
        notes: 'الخارجية لا تصدق أي وثيقة دون ختم وتوقيع معتمد من الوزارة المصدرة للوثيقة.'
      },
      {
        id: 'doc-att-id',
        nameAr: 'البطاقة الشخصية السورية لمقدم المعاملة مع صورة عنها',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'استكمال الأختام التمهيدية من الوزارة المختصة',
        description: 'تصديق الوثيقة من الوزارة المشرفة (مثلاً وثيقة التخرج من وزارة التعليم العالي، شهادة الولادة من مديرية الصحة والأحوال المدنية).',
        locationName: 'الوزارة المختصة صاحبة العلاقة'
      },
      {
        stepNumber: 2,
        title: 'مراجعة مكتب التصديق القنصلي وشراء الطوابع المعتمدة',
        description: 'تسليم الوثيقة للموظف للتدقيق الإلكتروني ومطابقة نماذج الأختام والتواقيع المعتمدة.',
        locationName: 'مكتب تصديقات وزارة الخارجية والمغتربين'
      },
      {
        stepNumber: 3,
        title: 'ختم وتوقيع الوثيقة واستلامها فورياً',
        description: 'إلصاق طابع الخارجية والقنصلية ومهره بالختم الحي وتوقيع المفوض القنصلي.',
        locationName: 'نافذة التسليم بمكتب التصديقات'
      }
    ],
    officialFees: [
      {
        item: 'رسم وطابع تصديق وزارة الخارجية والمغتربين لكل وثيقة',
        amount: 5000,
        currency: 'SYP',
        legalReference: 'المرسوم التشريعي الناظم لرسوم التصديقات القنصلية والمحلية',
        paymentMethod: 'إلصاق طابع مالي وقنصلي معتمد',
        effectiveDate: '2023-06-01'
      },
      {
        item: 'طابع الإدارة المحلية والمجهود الحربي المضاف',
        amount: 1500,
        currency: 'SYP',
        legalReference: 'نظام الطوابع المضافة',
        paymentMethod: 'طابع مالي يلصق مع الختم',
        effectiveDate: '2023-06-01'
      }
    ],
    processingTimeOfficial: 'فوري (خلال 15 إلى 30 دقيقة حسب الازدحام)',
    processingTimeEstimated: 'نفس اليوم',
    personalAttendanceRequired: false,
    powerOfAttorneyAllowed: true,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'مكاتب تصديقات وزارة الخارجية في دمشق والمحافظات (طرطوس، اللاذقية، حلب، حمص، حماة، السويداء)',
    issuingEntity: 'وزارة الخارجية والمغتربين - الإدارة القنصلية',
    commonRejectionReasons: [
      'نقص ختم الوزارة المشرفة المختصة على الوثيقة قبل الوصول للخارجية',
      'تعديل أو كشط أو شطب على نص الوثيقة دون توقيع رسمي يبرر التصحيح',
      'صورة ضوئية غير مصدقة طبق الأصل بأختام حية'
    ],
    officialPortalUrl: 'http://mofaex.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'دليل المعاملات القنصلية الصادر عن وزارة الخارجية والمغتربين السورية',
    sourceUrl: 'http://mofaex.gov.sy',
    legalBasisNumber: 'المرسوم التشريعي رقم 18 لعام 2014 المنظم لعمل وزارة الخارجية والمغتربين وتعديلاته',
    lastVerifiedDate: '2024-09-01',
    nextReviewDate: '2025-03-01',
    relatedAuthorityIds: ['auth-damascus-foreign-consular']
  },
  {
    id: 'tx-birth-registration',
    titleAr: 'تسجيل واقعة ولادة جديدة وإصدار شهادة الميلاد',
    titleEn: 'Civil Registration of Newborn Birth & Birth Certificate',
    commonNames: ['تسجيل مولود جديد', 'شهادة ولادة', 'إضافة طفل لدفتر العائلة'],
    synonyms: ['تسجيل ولادة بالأحوال المدنية', 'قيد مولود', 'شهادة ميلاد'],
    categoryId: 'civil-status',
    responsibleAuthority: 'وزارة الداخلية - الإدارة العامة للشؤون المدنية',
    summaryAr: 'تسجيل واقعة الولادة التي تحدث داخل سورية في السجل المدني وتدوينها على الصحيفة الأسرية واستخراج شهادة الميلاد والبطاقة العائلية المحدثة.',
    eligibility: 'الأب أو الأم أو أحد الأقارب حتى الدرجة الرابعة المكلفين بالتبليغ قانوناً، أو مدير المشفى الذي تمت فيه الولادة.',
    requiredDocuments: [
      {
        id: 'doc-birth-cert',
        nameAr: 'شهادة ولادة أصلية صادرة عن المشفى أو الطبيب أو القابلة القانونية المرخصة',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: true,
        attestationEntity: 'مديرية الصحة في المحافظة',
        notes: 'يجب أن تكون ممهورة بتوقيع الطبيب وخاتم المشفى ومديرية الصحة ومحددة تاريخ وساعة الولادة وجنس المولود بدقة.'
      },
      {
        id: 'doc-birth-family-book',
        nameAr: 'البطاقة العائلية (دفتر العائلة) المسجل فيه عقد الزواج بين الوالدين',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      },
      {
        id: 'doc-birth-parents-ids',
        nameAr: 'البطاقات الشخصية الأصلية للوالدين (الأب والأم) مع صور عنها',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'استخراج شهادة الولادة من المشفى وتصديقها من مديرية الصحة',
        description: 'تسليم إشعار الولادة الصادر عن المشفى لمديرية الصحة في المحافظة لمهره بالختم الإداري.',
        locationName: 'المشفى ومديرية الصحة'
      },
      {
        stepNumber: 2,
        title: 'مراجعة أمانة السجل المدني التابع لها قيد الأب',
        description: 'تسليم الوثائق مع استمارة تسجيل مولود جديد والمطابقة على السجل الإلكتروني.',
        locationName: 'أمانة السجل المدني'
      },
      {
        stepNumber: 3,
        title: 'إصدار شهادة الميلاد وتحديث الدفتر العائلي',
        description: 'منح المولود رقماً وطنياً فريداً وإدراجه في خانة الأسرة وطباعة شهادة الميلاد الممهورة رسمياً.',
        locationName: 'قسم الواقعات بالسجل المدني'
      }
    ],
    officialFees: [
      {
        item: 'رسم تسجيل واقعة الولادة خلال المهلة القانونية (30 يوماً من تاريخ الولادة)',
        amount: 0,
        currency: 'SYP',
        legalReference: 'القانون رقم 37 لعام 2023 - مجانية التسجيل بالمهلة القانونية',
        paymentMethod: 'مجانية بدون رسم تسجيل',
        effectiveDate: '2023-12-15'
      },
      {
        item: 'غرامة التأخير في التبليغ بعد انقضاء 30 يوماً وحتى سنة (في حال التأخر)',
        amount: 5000,
        currency: 'SYP',
        legalReference: 'المادة 40 من قانون الأحوال المدنية السوري المعدل بالقانون 37/2023',
        paymentMethod: 'نقداً في صندوق أمانة السجل المدني',
        effectiveDate: '2023-12-15'
      },
      {
        item: 'رسم استخراج شهادة ميلاد ورقية رسمية مؤتمتة',
        amount: 2000,
        currency: 'SYP',
        legalReference: 'قانون الأحوال المدنية ورسوم البيانات المؤتمتة',
        paymentMethod: 'طابع مالي يلصق على الشهادة',
        effectiveDate: '2023-12-15'
      }
    ],
    processingTimeOfficial: 'نفس اليوم (خلال 30 إلى 60 دقيقة)',
    processingTimeEstimated: 'ساعة واحدة',
    personalAttendanceRequired: false,
    powerOfAttorneyAllowed: true,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'أمانة السجل المدني التابع لها قيد والد المولود',
    issuingEntity: 'وزارة الداخلية - الإدارة العامة للشؤون المدنية',
    commonRejectionReasons: [
      'عدم تسجيل واقعة زواج الوالدين مسبقاً في السجل المدني السوري',
      'عدم تصديق شهادة المشفى من مديرية الصحة',
      'تجاوز مهلة السنة دون صدور ضبط شرطة أو حكم قضائي يثبت واقعة الولادة المتأخرة'
    ],
    officialPortalUrl: 'http://moi.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'القانون رقم 37 لعام 2023 المعدل لقانون الأحوال المدنية رقم 13 لعام 2021',
    sourceUrl: 'http://moi.gov.sy',
    legalBasisNumber: 'القانون رقم 37 لعام 2023',
    lastVerifiedDate: '2024-09-01',
    nextReviewDate: '2025-03-01',
    relatedAuthorityIds: ['auth-damascus-civil-status', 'auth-tartus-civil-status']
  },
  {
    id: 'tx-power-of-attorney-notary',
    titleAr: 'تنظيم وتوثيق وكالة عامة أو خاصة لدى الكاتب بالعدل',
    titleEn: 'Notary Public Power of Attorney (General / Special POA)',
    commonNames: ['عمل وكالة', 'وكالة كاتب عدل', 'وكالة بيع', 'وكالة عامة'],
    synonyms: ['توثيق وكالة خاصة', 'سند وكالة', 'الكاتب بالعدل'],
    categoryId: 'justice-judiciary',
    responsibleAuthority: 'وزارة العدل - دائرة الكاتب بالعدل',
    summaryAr: 'إجراء توثيق إرادة الموكل بتفويض شخص آخر (الوكيل) للقيام بتصرفات قانونية أو إدارية أو قضائية محددة، مع قيدها بسجلات الكاتب بالعدل الرسمية.',
    eligibility: 'كل شخص كامل الأهلية القانونية (سليم العقل، أتم الثامنة عشرة) وغير ممنوع من التصرف.',
    requiredDocuments: [
      {
        id: 'doc-poa-id',
        nameAr: 'البطاقة الشخصية الأصلية السورية للموكل سارية المفعول (مع صورة عنها)',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false,
        notes: 'حضور الموكل شخصياً إلزامي أمام الكاتب بالعدل للتحقق من هويته وأهليته وبصمته.'
      },
      {
        id: 'doc-poa-agent-id',
        nameAr: 'صورة واضحة عن البطاقة الشخصية للوكيل تتضمن الرقم الوطني والاسم الكامل',
        isOriginal: false,
        copiesCount: 1,
        needsAttestation: false
      },
      {
        id: 'doc-poa-property-proof',
        nameAr: 'سند الملكية أو قيد عقاري حديث (في حال كانت الوكالة تتضمن بيع أو شراء عقارات أو مركبات)',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'السجل العقاري أو مديرية النقل المختصة',
        notes: 'إلزامي للتحقق من حدود العقار أو مواصفات المركبة.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'صياغة سند الوكالة وشراء الطوابع القانونية',
        description: 'تنظيم مسودة نص الوكالة بدقة وتحديد الصلاحيات الممنوحة وإلصاق الطوابع المالية والعدلية.',
        locationName: 'ديوان الكاتب بالعدل بقصر العدل'
      },
      {
        stepNumber: 2,
        title: 'المثول الشخصي أمام الكاتب بالعدل والتحقق من الأهلية',
        description: 'قراءة الوكالة أمام الموكل والتأكد من إرادته الحرة، ثم التوقيع وأخذ البصمة الحيوية في السجل اليومي.',
        locationName: 'مكتب الكاتب بالعدل'
      },
      {
        stepNumber: 3,
        title: 'استلام النسخة الأصلية للوكالة بعد قيدها وترقيمها',
        description: 'ختم النسخ وتدوين رقم السجل والصحيفة وتسليم الموكل نسخته القانونية المعتمدة.',
        locationName: 'قلم الكاتب بالعدل'
      }
    ],
    officialFees: [
      {
        item: 'رسم التوثيق المالي للوكالة القضائية أو الإدارية الخاصة',
        amount: 25000,
        currency: 'SYP',
        legalReference: 'قانون الكاتب بالعدل والرسوم القضائية رقم 42 لعام 2023',
        paymentMethod: 'صندوق قصر العدل المعتمد',
        effectiveDate: '2023-11-01'
      },
      {
        item: 'رسم الوكالة العامة متضمنة التصرف بالأموال والحقوق',
        amount: 45000,
        currency: 'SYP',
        legalReference: 'قانون الرسوم القضائية رقم 42/2023',
        paymentMethod: 'نقداً في الصندوق القضائي',
        effectiveDate: '2023-11-01'
      },
      {
        item: 'طابع العدالة وطابع الإدارة المحلية المضاف',
        amount: 5000,
        currency: 'SYP',
        legalReference: 'المرسوم الناظم للطوابع المالية والقضائية',
        paymentMethod: 'طوابع ملصقة على السند',
        effectiveDate: '2023-11-01'
      }
    ],
    processingTimeOfficial: 'نفس اليوم (خلال 30 إلى 60 دقيقة في حال جاهزية المسودة والأطراف)',
    processingTimeEstimated: 'ساعة عمل واحدة',
    personalAttendanceRequired: true,
    powerOfAttorneyAllowed: false,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'دائرة الكاتب بالعدل في قصر العدل بالمحافظة أو المنطقة',
    issuingEntity: 'وزارة العدل السورية',
    commonRejectionReasons: [
      'عدم حضور الموكل شخصياً أو الاشتباه بخلل في أهليته العقلية أو وقوعه تحت إكراه',
      'تلف أو انتهاء صلاحية البطاقة الشخصية للموكل',
      'صياغة بنود غامضة أو مخالفة للنظام العام والقوانين السورية النافذة'
    ],
    officialPortalUrl: 'http://moj.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'قانون الكاتب بالعدل السوري وقانون الرسوم القضائية رقم 42 لعام 2023',
    sourceUrl: 'http://moj.gov.sy',
    legalBasisNumber: 'المرسوم التشريعي رقم 11 لعام 1952 وتعديلاته وقانون الرسوم القضائية 42/2023',
    lastVerifiedDate: '2024-08-25',
    nextReviewDate: '2025-02-25',
    relatedAuthorityIds: ['auth-damascus-justice-palace', 'auth-tartus-justice-palace', 'auth-latakia-justice-palace', 'auth-aleppo-justice-palace', 'auth-homs-justice-palace']
  },
  {
    id: 'tx-military-exemption-fee',
    titleAr: 'دفع بدل الخدمة العسكرية الإلزامية للمغتربين والمقيمين خارج القطر',
    titleEn: 'Military Service Exemption Cash Payment (Badal) for Expatriates',
    commonNames: ['بدل الخدمة الإلزامية', 'دفع البدل النقدي', 'بدل فوات الخدمة'],
    synonyms: ['بدل عسكري', 'إعفاء التجنيد بالبدل', 'تسوية خدمة العلم للمغترب'],
    categoryId: 'syrians-abroad-consular',
    responsibleAuthority: 'وزارة الدفاع - الإدارة العامة للتجنيد بالتعاون مع مصرف سورية المركزي ووزارة الخارجية',
    summaryAr: 'معاملة تسوية ودفع البدل النقدي للخدمة الإلزامية للمواطنين السوريين ومن في حكمهم المقيمين خارج القطر بعد إتمام مدد الإقامة القانونية المحددة بالمرسوم التشريعي.',
    eligibility: 'المكلف السوري المقيم خارج الجمهورية العربية السورية لمدة لا تقل عن سنة كاملة متصلة وفق شرائح الإقامة المعتمدة قانوناً، أو من تجاوز سن التكليف (42 عاماً).',
    requiredDocuments: [
      {
        id: 'doc-badal-passport',
        nameAr: 'جواز السفر السوري وجوازات السفر أو الإقامات الأجنبية المعتمدة',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: true,
        attestationEntity: 'السفارة أو القنصلية السورية في بلد الإقامة',
        notes: 'لإثبات تواريخ الدخول والخروج وحساب مدد الإقامة بدقة.'
      },
      {
        id: 'doc-badal-id',
        nameAr: 'البطاقة الشخصية السورية أو بيان قيد إفرادي حديث ممهور بالصورة',
        isOriginal: true,
        copiesCount: 2,
        needsAttestation: false
      },
      {
        id: 'doc-badal-residency-record',
        nameAr: 'بيان حركة دخول وخروج رسمي (سند إقامة قنصلي) صادر عن السفارة',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: true,
        attestationEntity: 'الإدارة القنصلية - وزارة الخارجية والمغتربين',
        notes: 'يوثق عدد سنوات الإقامة الفعلية في بلد الاغتراب.'
      },
      {
        id: 'doc-badal-family-book',
        nameAr: 'دفتر خدمة العلم السوري (في حال وجوده) أو الرقم التجنيدي المسجل',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'تنظيم إضبارة البدل لدى السفارة السورية أو عبر وكيل قانوني بدمشق',
        description: 'تقديم طلب دفع البدل وتدقيق سنوات الإقامة وحساب المدة المستحقة للشريحة التجنيدية.',
        locationName: 'السفارة السورية بالخارج أو الإدارة القنصلية بدمشق'
      },
      {
        stepNumber: 2,
        title: 'إحالة الإضبارة للإدارة العامة للتجنيد للتدقيق والموافقة',
        description: 'مراجعة شعبة التجنيد ومطابقة القيد التجنيدي واستصدار أمر القبض المالي الرسمي.',
        locationName: 'شعبة التجنيد المركزية بدمشق'
      },
      {
        stepNumber: 3,
        title: 'تسديد المبلغ المالي المعتمد في مصرف سورية المركزي بالدولار الأمريكي أو اليورو',
        description: 'إيداع المبلغ المحدد حصراً في الحساب المعتمد لمصرف سورية المركزي واستلام إشعار التسديد الرسمي.',
        locationName: 'مصرف سورية المركزي'
      },
      {
        stepNumber: 4,
        title: 'استلام وثيقة براءة الذمة التجنيدية وتثبيت الإعفاء النهائي',
        description: 'إلغاء قيود المكلف التجنيدية وتأشير سجلاته بشعبة التجنيد ومنحه شهادة تأدية البدل.',
        locationName: 'إدارة التجنيد العامة'
      }
    ],
    officialFees: [
      {
        item: 'بدل الإقامة لمدة لا تقل عن سنة متصلة خارج القطر',
        amount: 10000,
        currency: 'USD',
        legalReference: 'المرسوم التشريعي الناظم لخدمة العلم وتعديلاته بالمرسوم رقم 31 لعام 2020',
        paymentMethod: 'إيداع بنكي بالدولار الأمريكي بمصرف سورية المركزي أو الحساب القنصلي',
        effectiveDate: '2020-11-08'
      },
      {
        item: 'بدل الإقامة لمدة لا تقل عن سنتين كاملتين',
        amount: 9000,
        currency: 'USD',
        legalReference: 'المرسوم التشريعي رقم 31 لعام 2020',
        paymentMethod: 'حساب مصرف سورية المركزي',
        effectiveDate: '2020-11-08'
      },
      {
        item: 'بدل الإقامة لمدة لا تقل عن 3 سنوات متصلة',
        amount: 8000,
        currency: 'USD',
        legalReference: 'المرسوم التشريعي رقم 31 لعام 2020',
        paymentMethod: 'حساب مصرف سورية المركزي',
        effectiveDate: '2020-11-08'
      },
      {
        item: 'بدل الإقامة لمدة 4 سنوات متصلة أو أكثر خارج القطر',
        amount: 7000,
        currency: 'USD',
        legalReference: 'المرسوم التشريعي رقم 31 لعام 2020',
        paymentMethod: 'حساب مصرف سورية المركزي',
        effectiveDate: '2020-11-08'
      },
      {
        item: 'بدل فوات الخدمة لمن أتم سن الثانية والأربعين (42 عاماً) دون أداء الخدمة',
        amount: 8000,
        currency: 'USD',
        legalReference: 'المرسوم التشريعي رقم 31 لعام 2020',
        paymentMethod: 'إيداع بالدولار بمصرف سورية المركزي',
        effectiveDate: '2020-11-08'
      }
    ],
    processingTimeOfficial: 'من 15 إلى 30 يوماً عمل متواصلة لاستكمال الموافقات التجنيدية',
    processingTimeEstimated: 'حوالي 20 يوماً',
    personalAttendanceRequired: false,
    powerOfAttorneyAllowed: true,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'السفارات والقنصليات السورية في الخارج أو الإدارة العامة للتجنيد بدمشق عبر وكيل قانوني',
    issuingEntity: 'وزارة الدفاع - الإدارة العامة للتجنيد',
    commonRejectionReasons: [
      'نقص عدد أيام الإقامة الفعلية خارج القطر عن الشريحة المحددة بموجب أختام الجوازات',
      'عدم تصديق حركة الدخول والخروج من إدارة الهجرة والجوازات السورية',
      'محاولة السداد بغير العملة الأجنبية المحددة قانوناً بالمرسوم'
    ],
    officialPortalUrl: 'http://mod.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'المرسوم التشريعي رقم 31 لعام 2020 الصادر عن السيد رئيس الجمهورية الناظم لبدل الخدمة العسكرية',
    sourceUrl: 'http://mod.gov.sy',
    legalBasisNumber: 'المرسوم التشريعي رقم 31 لعام 2020 المعدل لقانون خدمة العلم الصادر بالمرسوم 30 لعام 2007',
    lastVerifiedDate: '2024-09-01',
    nextReviewDate: '2025-03-01',
    relatedAuthorityIds: ['auth-damascus-foreign-consular']
  },
  {
    id: 'tx-smart-card-fuel',
    titleAr: 'إصدار وتفعيل البطاقة الإلكترونية للمخصصات العائلية والمحروقات (تكامل)',
    titleEn: 'Electronic Smart Card Issuance for Subsidized Fuel & Family Allocations',
    commonNames: ['بطاقة تكامل', 'البطاقة الذكية', 'بطاقة المازوت والغاز'],
    synonyms: ['كرت تكامل', 'بطاقة المخصصات التموينية', 'بطاقة الغاز الذكية'],
    categoryId: 'energy-fuel',
    responsibleAuthority: 'وزارة النفط والثروة المعدنية ووزارة التجارة الداخلية بالتعاون مع شركة تكامل',
    summaryAr: 'معاملة استخراج البطاقة الإلكترونية الأسرية لتسجيل واستلام مخصصات مادة مازوت التدفئة، أسطوانات الغاز المنزلي، والسلع المقننة المدعومة.',
    eligibility: 'كل أسرة سورية بموجب دفتر العائلة، أو الحالات الخاصة المنفصلة بموجب قرارات وزارية معتمدة.',
    requiredDocuments: [
      {
        id: 'doc-sc-family-book',
        nameAr: 'البطاقة العائلية (دفتر العائلة) الأصلية المسجل فيها الزوج والزوجة والأولاد',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false,
        notes: 'يجب أن تكون النسخة الأصلية حاضرة للمطابقة.'
      },
      {
        id: 'doc-sc-id',
        nameAr: 'البطاقة الشخصية لرب الأسرة (الزوج) مع صورة واضحة عنها',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false
      },
      {
        id: 'doc-sc-phone',
        nameAr: 'رقم هاتف محمول مسجل رسمياً باسم رب الأسرة لدى شركات الاتصالات المعتمدة',
        isOriginal: true,
        copiesCount: 1,
        needsAttestation: false,
        notes: 'لربط تطبيق «وين» واستقبال رسائل استلام مخصصات الغاز والمازوت.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'مراجعة أحد مراكز خدمة البطاقة الإلكترونية (تكامل)',
        description: 'الحضور مصطحباً دفتر العائلة والهوية الشخصية لأحد المراكز المنتشرة في المحافظة.',
        locationName: 'مراكز تكامل في مجمعات الخدمات والبلديات'
      },
      {
        stepNumber: 2,
        title: 'إدخال البيانات والمطابقة مع قاعدة بيانات السجل المدني',
        description: 'يقوم الموظف بإدخال الرقم الوطني وتدقيق عدد أفراد الأسرة وربط رقم الهاتف الذكي.',
        locationName: 'محطة الإدخال بمركز تكامل'
      },
      {
        stepNumber: 3,
        title: 'طباعة البطاقة البلاستيكية الذكية وتفعيل الحساب',
        description: 'استلام البطاقة فورياً وتفعيل الرسائل النصية لتوزيع مخصصات الغاز والمازوت بالسعر المدعوم.',
        locationName: 'نافذة تسليم البطاقات'
      }
    ],
    officialFees: [
      {
        item: 'رسم إصدار البطاقة الذكية لأول مرة المعتمد رسمياً',
        amount: 5000,
        currency: 'SYP',
        legalReference: 'قرارات وزارة النفط ووزارة التجارة الداخلية النافذة',
        paymentMethod: 'نقداً في مركز الخدمة',
        effectiveDate: '2023-01-01'
      },
      {
        item: 'بدل ضائع أو تالف للبطاقة الإلكترونية',
        amount: 15000,
        currency: 'SYP',
        legalReference: 'نظام رسوم بدل الضائع لشركة تكامل والمحروقات',
        paymentMethod: 'نقداً في المركز',
        effectiveDate: '2023-01-01'
      }
    ],
    processingTimeOfficial: 'فوري (خلال 15 إلى 30 دقيقة بحسب دور المركز)',
    processingTimeEstimated: 'نفس اليوم',
    personalAttendanceRequired: true,
    powerOfAttorneyAllowed: true,
    appointmentRequired: false,
    formsAvailable: [],
    submittingEntity: 'مراكز خدمة البطاقة الذكية في مجالس المدن والبلدات في كافة المحافظات',
    issuingEntity: 'وزارة النفط والثروة المعدنية',
    commonRejectionReasons: [
      'وجود بطاقة سابقة مفعلة باسم الأسرة ذاتها دون إلغائها أو تقديم طلب بدل فاقد',
      'رقم الهاتف غير مسجل رسمياً باسم صاحب البطاقة في نظام سيريتل أو إم تي إن',
      'نقص في صفحات دفتر العائلة أو عدم تسجيل واقعات الولادة الحديثة'
    ],
    officialPortalUrl: 'http://petroleum.gov.sy',
    verificationStatus: 'verified',
    sourceName: 'وزارة النفط والثروة المعدنية والشركة السورية لتخزين وتوزيع المواد البترولية (محروقات)',
    sourceUrl: 'http://petroleum.gov.sy',
    legalBasisNumber: 'قرارات مجلس الوزراء الخاصة بمنظومة الدعم الإلكتروني وتوزيع المشتقات النفطية',
    lastVerifiedDate: '2024-09-01',
    nextReviewDate: '2025-03-01',
    relatedAuthorityIds: []
  }
];
