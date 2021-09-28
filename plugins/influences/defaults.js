export const fleeFields = [
  {
    ar: "رقم إخطار الهروب",
    value: "noticeNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ الغياب",
    value: "abscenseDate",
    type: "text-field"
  },
  {
    ar: "تاريخ الشطب",
    value: "removalDate",
    type: "text-field"
  },
  {
    ar: "تاريخ إخطار الهروب",
    value: "noticeDate",
    type: "text-field"
  },
  {
    ar: "تاريخ وصول إخطار الهروب",
    value: "noticeArrivalDate",
    type: "text-field"
  }
];

export const comebackFields = [
  {
    ar: "رقم إخطار الهروب",
    value: "noticeNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ الغياب",
    value: "abscenseDate",
    type: "text-field"
  },
  {
    ar: "تاريخ الشطب",
    value: "removalDate",
    type: "text-field"
  },
  {
    ar: "تاريخ إخطار الهروب",
    value: "noticeDate",
    type: "text-field"
  },
  {
    ar: "تاريخ وصول إخطار الهروب",
    value: "noticeArrivalDate",
    type: "text-field"
  },
  {
    ar: "تاريخ العودة",
    value: "comebackDate",
    type: "text-field"
  }
];

export const fugitivesFields = [
  {
    ar: "نوع المؤثر",
    value: "type",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "INFLUENCES_TYPES"
  },
  {
    ar: "رقم إخطار الهروب",
    value: "noticeNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ الغياب",
    value: "abscenseDate",
    type: "text-field"
  },
  {
    ar: "تاريخ الشطب",
    value: "removalDate",
    type: "text-field"
  },
  {
    ar: "تاريخ إخطار الهروب",
    value: "noticeDate",
    type: "text-field"
  },
  {
    ar: "تاريخ وصول إخطار الهروب",
    value: "noticeArrivalDate",
    type: "text-field"
  },
  {
    ar: "تاريخ العودة",
    value: "comebackDate",
    type: "text-field"
  }
];

export const trainingFields = [
  {
    ar: "الدورة",
    value: "courseType",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "COURSETYPES"
  },
  {
    ar: "رقم الفرقة/الدورة",
    value: "courseNumber",
    type: "text-field"
  },
  {
    ar: "إسم الفرقة/الدورة",
    value: "courseName",
    type: "text-field"
  },
  {
    ar: "المعهد/المركز",
    value: "courseCollege",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "COLLEGES"
  },
  {
    ar: "من تاريخ",
    value: "from",
    type: "text-field"
  },
  {
    ar: "إلي تاريخ",
    value: "to",
    type: "text-field"
  },
  {
    ar: "بند الأوامر",
    value: "orderNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ بند الأوامر",
    value: "orderDate",
    type: "text-field"
  },
  {
    ar: "التقدير",
    value: "score",
    type: "text-field"
  }
];

export const travellingFields = [
  {
    ar: "البلد",
    value: "country",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "COUNTRIES"
  },
  {
    ar: "تاريخ السفر",
    value: "travelDate",
    type: "text-field"
  },
  {
    ar: "تاريخ العودة",
    value: "comebackDate",
    type: "text-field"
  },
  {
    ar: "سبب السفر",
    value: "travelType",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "TRAVELTYPES"
  },
  {
    ar: "جهة التصديق",
    value: "confirmationDirection",
    type: "text-field"
  },
  {
    ar: "تاريخ تصديق السفر",
    value: "confirmationDate",
    type: "text-field"
  },
  {
    ar: "تاريخ تصديق العودة",
    value: "comebackDate",
    type: "text-field"
  },
  {
    ar: "رقم تصديق السفر",
    value: "confirmationNumber",
    type: "text-field"
  },
  {
    ar: "رقم تصديق العودة",
    value: "confirmationComebackNumber",
    type: "text-field"
  }
];

export const literacyFields = [
  {
    ar: "المحافظة",
    value: "governate",
    type: "select",
    sourceObj: "locations",
    sourceKey: "governates"
  },
  {
    ar: "دور التخرج",
    value: "graduationLevel",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "GRADUATION_LEVELS"
  },
  {
    ar: "تاريخ الحصول على الدرجة",
    value: "date",
    type: "text-field"
  },
  {
    ar: "الشهادة",
    value: "degree",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "DEGREES"
  },
  {
    ar: "رقم التسجيل",
    value: "literacyNumber",
    type: "text-field"
  },
  {
    ar: "رقم الجلوس",
    value: "seatNumber",
    type: "text-field"
  },
  {
    ar: "المجموع الكلي",
    value: "score",
    type: "text-field"
  }
];

export const promotionFields = [
  {
    ar: "الدرجة الجديدة",
    value: "higherRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "RANKS"
  },
  {
    ar: "الدرجة القديمة",
    value: "lowerRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "RANKS"
  },
  {
    ar: "تاريخ الترقي",
    value: "date",
    type: "text-field"
  },
  {
    ar: "بند الأوامر",
    value: "orderNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ بند الأوامر",
    value: "orderDate",
    type: "text-field"
  }
];

export const demotionFields = [
  {
    ar: "الدرجة الجديدة",
    value: "lowerRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "RANKS"
  },
  {
    ar: "الدرجة القديمة",
    value: "higherRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "RANKS"
  },
  {
    ar: "تاريخ الترقي",
    value: "date",
    type: "text-field"
  },
  {
    ar: "بند الأوامر",
    value: "orderNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ بند الأوامر",
    value: "orderDate",
    type: "text-field"
  }
];

export const executionFields = [
  {
    ar: "الدرجة الجديدة",
    value: "lowerRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "RANKS"
  },
  {
    ar: "الدرجة القديمة",
    value: "higherRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "RANKS"
  },
  {
    ar: "تاريخ الترقي",
    value: "date",
    type: "text-field"
  },
  {
    ar: "بند الأوامر",
    value: "orderNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ بند الأوامر",
    value: "orderDate",
    type: "text-field"
  }
];

export const rankingFields = [
  {
    ar: "نوع المؤثر",
    value: "type",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "INFLUENCES_TYPES"
  },
  {
    ar: "الدرجة الجديدة",
    value: "higherRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "RANKS"
  },
  {
    ar: "الدرجة القديمة",
    value: "lowerRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "RANKS"
  },
  {
    ar: "التاريخ",
    value: "date",
    type: "text-field"
  },

  {
    ar: "بند الأوامر",
    value: "orderNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ بند الأوامر",
    value: "orderDate",
    type: "text-field"
  }
];

export const driversLicenseFields = [
  {
    ar: "رقم الرخصة الأولى",
    value: "firstLicenseNumber",
    type: "text-field"
  },
  {
    ar: "رقم الرخصة الثانية",
    value: "secondLicenseNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ الرخصة الأولى",
    value: "firstLicenseDate",
    type: "text-field"
  },
  {
    ar: "تاريخ الرخصة الثانية",
    value: "secondLicenseDate",
    type: "text-field"
  },
  {
    ar: "تاريخ اخر كشف بالكومسيون الطبي",
    value: "lastCommissionDate",
    type: "text-field"
  }
];
export const punishmentsFields = [
  {
    ar: "العقوبة",
    value: "title",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "PUNISHMENTS"
  },
  {
    ar: "الأمر بالعقوبة",
    value: "orderMaker",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "ORDERMAKERS"
  },
  {
    ar: "تاريخ بداية العقوبة",
    value: "startDate",
    type: "text-field"
  },
  {
    ar: "مده العقوبة",
    value: "period",
    type: "text-field"
  },
  {
    ar: "بند أوامر الوحدة",
    value: "orderNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ بند أوامر الوحدة",
    value: "orderDate",
    type: "text-field"
  },
  {
    ar: "تاريخ الغياب من",
    value: "abscenseDate",
    type: "text-field"
  },
  {
    ar: "تاريخ الغياب إلى",
    value: "comebackDate",
    type: "text-field"
  },
  {
    ar: "نص الجريمة/القانون/المادة",
    value: "crimeMajorLaw",
    sourceObj: "defaults",
    sourceKey: "CRIMEMAJORLAWS"
  },
  {
    ar: "نوع الجريمة",
    value: "dishonored",
    type: "text-field"
  },
  {
    ar: "بيان",
    value: "statement",
    type: "text-field"
  },
  {
    ar: "المحكمة",
    value: "sentenceCourt",
    type: "text-field"
  },
  {
    ar: "مكان انعقاد المحكمة",
    value: "courtPlace",
    type: "text-field"
  },
  {
    ar: "رقم القضية",
    value: "caseNumber",
    type: "text-field"
  },
  {
    ar: "تاريخ القضية",
    value: "caseDate",
    type: "text-field"
  },
  {
    ar: "الغرامة",
    value: "fine",
    type: "text-field"
  },
  {
    ar: "جهة رد الأعتبار",
    value: "answerDirection",
    type: "text-field"
  },
  {
    ar: "تاريخ رد الأعتبار",
    value: "answerDate",
    type: "text-field"
  }
];
