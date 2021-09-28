export const inboxFields = [
  // {
  //   ar: "مسلسل",
  //   value: "seq_ar",
  //   type: "text-field"
  // },
   {
    ar: " رقم الأرشيف",
    value: "adminNo_ar",
    type: "text-field"
  },

  {
    ar: "رقم المكاتبة",
    value: "number_ar",
    type: "text-field"
  },
  {
    ar: "الجهة الواردة منها ",
    value: "direction",
    type: "text-field",
    sourceObj: "defaults",
    sourceKey: "DIRECTIONS"
  },
  {
    ar: "تاريخ المكاتبة",
    value: "date",
    type: "text-field"
  },
  {
    ar: "الموضوع",
    value: "subject",
    type: "text-field"
  },
  {
    ar: "الفرع المختص",
    value: "branch",
    type: "text-field"
  },
  {
    ar: "الأفرع للعلم",
    value: "branches",
    type: "array"
  },
  {
    ar: "المرفقات",
    value: "attachments",
    type: "links-array",
    icon: "📎"
  },
  {
    ar: "نوع المكاتبة",
    value: "mailType",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "MAILTYPES"
  },

 

  {
    ar: "قرار السيد رئيس الجهاز",
    value: "decision",
    type: "text-field"
  }, 
   {
    ar: "قرار السيد رئيس أركان الجهاز",
    value: "arkanDecision",
    type: "text-field"
  },
  /*
  {
    ar: "المستلم",
    value: "wordMule",
    type: "text-field"
  },*/
  {
    ar: "تاريخ إدخال المكاتبة",
    value: "createdAtDate",
    type: "date"
  },
  /*
  {
    ar: "التصنيف",
    value: "category",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "CATEGORIES"
  }
  */
  {
    ar: "القائم بالتسجيل",
    value: "wordMule",
    type: "text-field"
  },
];

export const outboxFields = [
  // {
  //   ar: "الاختيار",
  //   value: "seq_ar",
  //   type: "text-field"
  // },
  {
    ar:
     ` التسجيل بالأرشيف`,
    value: "adminNo_ar",
    type: "text-field"
  },
  {
    ar: "رقم المكاتبة",
    value: "number_ar",
    type: "text-field"
  },
  {
    ar: "الجهة الصادر إليها ",
    value: "direction",
    type: "text-field",
    sourceObj: "defaults",
    sourceKey: "DIRECTIONS"
  },
  {
    ar: "تاريخ المكاتبة",
    value: "date",
    type: "text-field"
  },
  {
    ar: "الموضوع",
    value: "subject",
    type: "text-field"
  },
  {
    ar: "الفرع المرسل",
    value: "branch",
    type: "text-field"
  },
  {
    ar: "المرفقات",
    value: "attachments",
    type: "links-array",
    icon: "📎"
  },
  {
    ar: "نوع المكاتبة",
    value: "mailType",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "MAILTYPES"
  },
  
  // {
  //   ar: "القائم بالتنفيذ",
  //   value: "wordMule",
  //   type: "text-field"
  // },
  // {
  //   ar: "القائم بالتسجيل من الجهة",
  //   value: "directionWordMule",
  //   type: "text-field"
  // },

  {
    ar: "قرار السيد رئيس الجهاز",
    value: "decision",
    type: "text-field"
  }, 
   {
    ar: "قرار السيد رئيس أركان الجهاز",
    value: "arkanDecision",
    type: "text-field"
  },
  {
    ar: "تاريخ إدخال المكاتبة",
    value: "createdAtDate",
    type: "date"
  },
  {
    ar: "القائم بالتسجيل",
    value: "wordMule",
    type: "text-field"
  },
 /* {
    ar: "التصنيف",
    value: "category",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "CATEGORIES"
  }*/
];





export const inboxFields_presidents = [
  // {
  //   ar: "مسلسل",
  //   value: "seq_ar",
  //   type: "text-field"
  // },
  {
    ar: "رقم المكاتبة",
    value: "number_ar",
    type: "text-field"
  },
  
  {
    ar: "المرفقات",
    value: "attachments",
    type: "links-array",
    icon: "mdi-clipboard-outline"
  },
  {
    ar: "الفرع المختص",
    value: "branch",
    type: "text-field"
  },
  {
    ar: "الجهة الواردة منها المكاتبة",
    value: "direction",
    type: "text-field",
    sourceObj: "defaults",
    sourceKey: "DIRECTIONS"
  },
  {
    ar: "الموضوع",
    value: "subject",
    type: "text-field"
  },
  {
    ar: "تاريخ المكاتبة",
    value: "date",
    type: "text-field"
  },
   {
    ar: "تاريخ إدخال المكاتبة",
    value: "createdAtDate",
    type: "date"
  },
  {
    ar: "قرار السيد رئيس الجهاز",
    value: "decision",
    type: "text-field"
  }, 
   {
    ar: "قرار السيد رئيس أركان الجهاز",
    value: "arkanDecision",
    type: "text-field"
  },
];

export const outboxFields_presidents = [
  // {
  //   ar: "الاختيار",
  //   value: "seq_ar",
  //   type: "text-field"
  // },
  {
    ar: "رقم المكاتبة",
    value: "number_ar",
    type: "text-field"
  },
  {
    ar: "المرفقات",
    value: "attachments",
    type: "links-array",
    icon: "📎"
  },
  {
    ar: "الفرع المرسل",
    value: "branch",
    type: "text-field"
  },
  {
    ar: "الجهة الصادر إليها المكاتبة",
    value: "direction",
    type: "text-field",
    sourceObj: "defaults",
    sourceKey: "DIRECTIONS"
  },
  {
    ar: "الموضوع",
    value: "subject",
    type: "text-field"
  },
  {
    ar: "تاريخ المكاتبة",
    value: "date",
    type: "text-field"
  },
  {
    ar: "تاريخ إدخال المكاتبة",
    value: "createdAtDate",
    type: "date"
  },{
    ar: "قرار السيد رئيس الجهاز",
    value: "decision",
    type: "text-field"
  }, 
   {
    ar: "قرار السيد رئيس أركان الجهاز",
    value: "arkanDecision",
    type: "text-field"
  },
];

