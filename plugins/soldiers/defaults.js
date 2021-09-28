export const fields = [
  {
    ar: "الرقم العسكرى",
    value: "militaryId",
    type: "text-field"
  },
  {
    ar: "رقم السجل",
    value: "recordId",
    type: "text-field"
  },
  {
    ar: "الرقم الثلاثى",
    value: "tripleNumber.value",
    type: "text-field"
  },
  {
    ar: "منطقة التجنيد",
    value: "recruitmentArea",
    type: "select",
    sourceObj: "locations",
    sourceKey: "recruitmentAreas"
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
    ar: "الجيش/المنطقة",
    value: "army",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "ARMY_LIST"
  },
  {
    ar: "المؤهل",
    value: "educationRank",
    type: "select",
    sourceObj: "defaults",
    sourceKey: "EDUCATION_RANKS"
  },
  {
    ar: "الموقف",
    value: "situation",
    sourceObj: "defaults",
    sourceKey: "SITUATIONS",
    type: "select"
  },
  {
    ar: "المعاملة التجنيدية",
    value: "treatment",
    sourceObj: "defaults",
    sourceKey: "TREATMENTS",
    type: "select"
  },
  {
    ar: "تاريخ الميلاد",
    value: "birthDate",
    type: "date"
  },
  {
    ar: "تاريخ الالتحاق",
    value: "joinDate",
    type: "date"
  },
  {
    ar: "تاريخ التسريح",
    value: "releaseDate",
    type: "date"
  },
  {
    ar: "المرحلة التجنيدية",
    value: "recruitmentLevel",
    sourceObj: "defaults",
    sourceKey: "RECRUITMENT_LEVELS",
    type: "select"
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
    ar: "ملاحظات",
    value: "notes"
  }
];

export const editAction = instance => {
  return {
    icon: "mdi-folder-edit",
    text: instance.$i18n.t("Edit"),
    call: instance.showEditDialog
  };
};

// update

export const editReleaseDateAction = instance => {
  return {
    icon: "mdi-folder-edit",
    text: instance.$i18n.t("Edit_Release_Date"),
    call: item => {
      instance.showSoldierDialog("changeReleaseDate", item);
    }
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
