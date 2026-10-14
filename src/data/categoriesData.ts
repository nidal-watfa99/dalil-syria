import { Category } from '../types';

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'civil-status',
    titleAr: 'الأحوال المدنية والشخصية',
    titleEn: 'Civil Status',
    icon: 'Users',
    descriptionAr: 'معاملات الهوية الشخصية، الولادة، الزواج، الطلاق، الوفاة، الإرث، الوصاية، الحضانة، القيود العائلية وتصحيح البيانات.',
    order: 1
  },
  {
    id: 'passports-immigration',
    titleAr: 'الهجرة والجوازات والسفر',
    titleEn: 'Passports & Immigration',
    icon: 'Plane',
    descriptionAr: 'إصدار وتجديد جوازات السفر (عادي، مستعجل، فوري)، بدل فاقد/تالف، معاملات القاصرين، الإقامات وتأشيرات الخروج.',
    order: 2
  },
  {
    id: 'justice-judiciary',
    titleAr: 'القضاء والعدل والتوثيق',
    titleEn: 'Justice & Legal Notary',
    icon: 'Scale',
    descriptionAr: 'المحاكم، خلاصة السجل العدلي (لا حكم عليه)، الكاتب بالعدل، الوكالات الخاصة والعامة، حصر الإرث الشرعي والترجمة المحلفة.',
    order: 3
  },
  {
    id: 'real-estate-cadastre',
    titleAr: 'العقارات والسجل العقاري',
    titleEn: 'Real Estate & Cadastre',
    icon: 'Building2',
    descriptionAr: 'المصالح العقارية، الطابو، فراغ العقارات، نقل الملكية، الرهن العقاري، الإفراز والمساحة، وبراءات الذمة المالية.',
    order: 4
  },
  {
    id: 'commerce-business',
    titleAr: 'التجارة والأعمال والاستثمار',
    titleEn: 'Commerce & Business',
    icon: 'Briefcase',
    descriptionAr: 'أمانة السجل التجاري، تأسيس الشركات والمؤسسات، غرف التجارة، التراخيص الاستثمارية، العلامات التجارية والجمارك.',
    order: 5
  },
  {
    id: 'industry',
    titleAr: 'الصناعة والمدن الصناعية',
    titleEn: 'Industry & Manufacturing',
    icon: 'Factory',
    descriptionAr: 'تراخيص المنشآت الصناعية والحرفية، تراخيص المدن الصناعية (عدرا، حسياء، الشيخ نجار)، مواصفات الجودة والمقاييس والطاقة الصناعية.',
    order: 6
  },
  {
    id: 'agriculture-livestock',
    titleAr: 'الزراعة والثروة الحيوانية',
    titleEn: 'Agriculture & Livestock',
    icon: 'Wheat',
    descriptionAr: 'حيازة الأراضي الزراعية، تراخيص الآبار والري، الأعلاف والبذور المدعومة، الصحة والبيطرة والجمعيات الفلاحية التعاونية.',
    order: 7
  },
  {
    id: 'finance-banking',
    titleAr: 'المال والمصارف والتأمين',
    titleEn: 'Finance & Banking',
    icon: 'Landmark',
    descriptionAr: 'الحسابات المصرفية، خدمات الدفع الإلكتروني، الصرافة والحوالات المالية المرخصة، قروض الاستثمار والتأمين الإلزامي.',
    order: 8
  },
  {
    id: 'health-medical',
    titleAr: 'الصحة والمنشآت الطبية',
    titleEn: 'Health & Medical Services',
    icon: 'HeartPulse',
    descriptionAr: 'المشافي الوطنية والمراكز الصحية، التراخيص الطبية والصيدلانية، التأمين الصحي، بنك الدم وفحوصات ما قبل الزواج.',
    order: 9
  },
  {
    id: 'education-higher-ed',
    titleAr: 'التعليم والجامعات والشهادات',
    titleEn: 'Education & Universities',
    icon: 'GraduationCap',
    descriptionAr: 'التسجيل والقبول الجامعي، المفاضلات العامة والخاصة، تصديق ومعادلة الشهادات الأجنبية، امتحانات الشهادات العامة.',
    order: 10
  },
  {
    id: 'labor-syndicates',
    titleAr: 'العمل والمهن والتأمينات الاجتماعية',
    titleEn: 'Labor & Social Security',
    icon: 'HardHat',
    descriptionAr: 'عقود العمل، اشتراكات مؤسسة التأمينات الاجتماعية، المعاشات التقاعدية، وتراخيص مزاولة المهن والنقابات المهنية.',
    order: 11
  },
  {
    id: 'transport-vehicles',
    titleAr: 'النقل والمركبات ورخص القيادة',
    titleEn: 'Transport & Driving Licenses',
    icon: 'Car',
    descriptionAr: 'تسجيل وفراغ المركبات، الفحص الفني، إصدار وتجديد رخص القيادة، براءة ذمة المرور، ومكاتب الشحن البري.',
    order: 12
  },
  {
    id: 'municipal-utilities',
    titleAr: 'الخدمات البلدية والمرافق العامة',
    titleEn: 'Municipal Services & Utilities',
    icon: 'Home',
    descriptionAr: 'مجالس المدن والبلديات، رخص البناء والإشغال، اشتراكات وتوصيلات مياه الشرب، الكهرباء، الاتصالات والهاتف الثابت.',
    order: 13
  },
  {
    id: 'tourism-hospitality',
    titleAr: 'السياحة والمنشآت الفندقية والآثار',
    titleEn: 'Tourism & Hospitality',
    icon: 'Compass',
    descriptionAr: 'تصنيف وترخيص الفنادق والمطاعم، تراخيص مكاتب السياحة والسفر، تصاريح زيارة المواقع الأثرية والمتاحف الوطنية.',
    order: 14
  },
  {
    id: 'ports-airports-freezones',
    titleAr: 'المرافئ والمطارات والمناطق الحرة',
    titleEn: 'Ports, Airports & Free Zones',
    icon: 'Anchor',
    descriptionAr: 'المؤسسة العامة للخطوط الحديدية، مرافئ اللاذقية وطرطوس، مطار دمشق وحلب واللاذقية الدولي، والاستثمار بالمناطق الحرة.',
    order: 15
  },
  {
    id: 'energy-fuel',
    titleAr: 'الطاقة والمحروقات والثروة المعدنية',
    titleEn: 'Energy & Petroleum',
    icon: 'Zap',
    descriptionAr: 'مخصصات المحروقات والغاز عبر البطاقة الإلكترونية (تكامل)، تراخيص الطاقة المتجددة، ومقالع الثروة المعدنية.',
    order: 16
  },
  {
    id: 'endowments-civic',
    titleAr: 'الأوقاف والجمعيات والمنظمات',
    titleEn: 'Endowments & Civil Societies',
    icon: 'HandHeart',
    descriptionAr: 'تراخيص وإشهار الجمعيات الأهلية والخيرية، إدارة الأوقاف الإسلامية والمسيحية، وحملات الإغاثة المصرحة رسمياً.',
    order: 17
  },
  {
    id: 'emergency-consumer-protection',
    titleAr: 'الطوارئ والإطفاء وحماية المستهلك',
    titleEn: 'Civil Defense & Consumer Protection',
    icon: 'ShieldAlert',
    descriptionAr: 'أرقام الطوارئ الوطنية (الدفاع المدني 113، الإسعاف 110، الشرطة 112)، شكاوى الأسعار التموينية وحماية المستهلك.',
    order: 18
  },
  {
    id: 'syrians-abroad-consular',
    titleAr: 'شؤون السوريين في الخارج والتصديقات',
    titleEn: 'Expatriates & Consular Affairs',
    icon: 'Globe',
    descriptionAr: 'التصديقات القنصلية، الوكالات المنظمة في الخارج، تمديد الوثائق، دفع بدل الخدمة العسكرية الإلزامية، ومعاملات لمّ الشمل.',
    order: 19
  },
  {
    id: 'inter-governorate-transport',
    titleAr: 'النقل البري والسفر بين المحافظات',
    titleEn: 'Inter-Governorate Transport',
    icon: 'Bus',
    descriptionAr: 'دليل محطات البولمان المركزية، الشركات المرخصة، جدول المسافات والتعرفة الرسمية المعتمدة وفق قرارات وزارة التجارة الداخلية.',
    order: 20
  }
];
