export const changeOfUnitFields = type => [
  {
    ar: "الرقم العسكرى",
    value: "soldierId",
    type: "text-field"
  },
  {
    ar: type === "staff" ? "إسم ضابط الصف" : "إسم المجند",
    value: "fullName",
    type: "text-field"
  },
  {
    ar: "الوحدة المحول منها",
    value: "pastUnit",
    type: "text-field"
  },
  {
    ar: "الوحدة المحول إليها",
    value: "unitName",
    type: "text-field"
  },
  {
    ar: "إسم المستخدم",
    value: "username",
    type: "text-field"
  },
  {
    ar: "التاريخ",
    value: "createdAt",
    type: "text-field"
  }
];
