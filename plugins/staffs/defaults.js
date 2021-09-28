export const staffFields = [
  {
    ar: "الرقم العسكرى",
    value: "militaryId",
    type: "text-field"
  },
  {
    ar: "رقم الفرد",
    value: "individualId",
    type: "text-field"
  },
  {
    ar: "الفئة",
    value: "category",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "STAFF_CATEGORIES"
  },
  {
    ar: "الدرجة",
    value: "rank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "STAFF_RANKS"
  },
  {
    ar: "الإسم",
    value: "fullName",
    type: "text-field"
  },
  {
    ar: "السلاح",
    value: "force",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "FORCES_LIST"
  },
  {
    ar: "الوحدة الحالية",
    value: "unit.unitId.name",
    type: "select",
    sourceObj: "divisions"
  },
  {
    ar: "الفرقة",
    value: "unit.divisionId.name",
    type: "select",
    sourceObj: "divisions"
  },
  {
    ar: "الجيش/المنطفة",
    value: "army",
    sourceObj: "defaults",
    sourceKey: "ARMY_LIST"
  },
  {
    ar: "المحافظة",
    value: "address.governate",
    type: "select",
    sourceObj: "locations",
    sourceKey: "governates"
  },
  {
    ar: "المركز",
    value: "address.centre",
    type: "combobox"
  },
  {
    ar: "القرية",
    value: "address.village",
    type: "combobox"
  },
  {
    ar: "المؤهل",
    value: "education",
    type: "text-field"
  },
  {
    ar: "المستوى الطبى",
    value: "medicalSituation",
    sourceObj: "defaults",
    sourceKey: "MEDICAL_SITUATIONS",
    type: "select"
  },
  {
    ar: "تاريخ الميلاد",
    value: "birthDate",
    type: "date"
  },
  {
    ar: "تاريخ الضم",
    value: "joinDate",
    type: "date"
  },
  {
    ar: "تاريخ الترقى",
    value: "rankingDate",
    type: "date"
  },
  {
    ar: "رقم التليفون",
    value: "phoneNumber",
    type: "text-field"
  },
  {
    ar: "البطاقة العلاجية",
    value: "medicalCard",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "MEDICAL_CARDS"
  },
  {
    ar: "الوزن",
    value: "weight",
    type: "text-field"
  },
  {
    ar: "الطول",
    value: "height",
    type: "text-field"
  },
  {
    ar: "الديانة",
    value: "religion",
    type: "text-field"
  }
];

export const editAction = instance => {
  return {
    icon: "mdi-folder-edit",
    text: instance.$i18n.t("Edit"),
    call: instance.showEditDialog
  };
};

export const distributeAction = instance => {
  return {
    icon: "mdi-folder-move",
    call: item => {
      instance.showSoldierDialog("changeOfUnit", item);
    },
    text: instance.$i18n.t("Soldier_Change_Of_Unit")
  };
};

export const removeAction = instance => {
  return {
    icon: "mdi-folder-remove",
    call: item => {
      instance.showRemoveDialog(item);
    },
    text: instance.$i18n.t("Remove")
  };
};
