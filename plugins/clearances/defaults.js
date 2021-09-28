export const clearanceFields = [
  {
    ar: "الإسم",
    value: "fullName",
    type: "text-field"
  },
  {
    ar: "الرقم العسكرى",
    value: "militaryId",
    type: "text-field"
  },
  {
    ar: "القطاع",
    value: "unit.unitId.name",
    type: "select"
  },
  {
    ar: "تاريخ الضم",
    value: "joinDate",
    type: "date"
  },
  {
    ar: "مكان الضم",
    value: "joinPlace",
    type: "select",

    sourceObj: "defaults",
    sourceKey: "JOINPLACES"
  },
  {
    ar: "حالة الوثيقة",
    value: "clearanceStatus",
    type: "select",

    sourceObj: "defaults",
    sourceKey: "CLEARANCE_STATUSES"
  },
  {
    ar: "حالة المجند",
    value: "soldierStatus",
    type: "select",

    sourceObj: "defaults",
    sourceKey: "SOLDIER_STATUSES"
  },
  {
    ar: "تاريخ الترحيل",
    value: "departureDate",
    type: "date"
  }
];
