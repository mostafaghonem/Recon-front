export const recommendationFields = [
  {
    ar: "نوع التوصية",
    value: "type",
    type: "text-field"
  },
  {
    ar: "رقم السجل",
    value: "recordId",
    type: "text-field"
  },
  {
    ar: "الرقم الثلاثى",
    value: "tripleNumber",
    type: "text-field"
  },
  {
    ar: "الرقم العسكري",
    value: "militaryId",
    type: "text-field"
  },
  {
    ar: "الإسم",
    value: "fullName",
    type: "text-field"
  },
  {
    ar: "المؤهل",
    value: "education",
    type: "select"
  },
  {
    ar: "منطقة التجنيد",
    value: "recruitmentArea",
    type: "select",
    sourceObj: "locations",
    sourceKey: "recruitmentAreas"
  },
  {
    ar: "السلاح",
    value: "force",
    type: "text-field"
  },
  {
    ar: "الوحدة",
    value: "unit",
    type: "select",
    sourceObj: "divisions"
  },
  {
    ar: "المرحلة التجنيدية",
    value: "recruitmentLevel",
    sourceObj: "defaults",
    sourceKey: "RECRUITMENT_LEVELS",
    type: "select"
  },
  {
    ar: "اسم الموصي",
    value: "recommender",
    type: "text-field"
  },
  {
    ar: "التاريخ",
    value: "createdAt",
    type: "date"
  },
  {
    ar: "تاريخ اخر تعديل",
    value: "updatedAt",
    type: "date"
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
