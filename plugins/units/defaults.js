export const unitFields = [
  {
    ar: "الإسم",
    value: "name",
    type: "text-field"
  },
  {
    ar: "النوع",
    value: "type",
    type: "text-field",
    sourceObj: "defaults",
    sourceKey: "FORCES_LIST"
  },
  {
    ar: "السلاح",
    value: "force",
    type: "text-field",
    sourceObj: "defaults",
    sourceKey: "FORCES_LIST"
  },
  {
    ar: "الجيش",
    value: "army",
    type: "text-field",
    sourceObj: "defaults",
    sourceKey: "ARMY_LIST"
  },
  {
    ar: "الفرقة",
    value: "divisionId.name",
    type: "text-field"
  },
  {
    ar: "اللواء",
    value: "brigdeId.name",
    type: "text-field"
  },
  {
    ar: "الكتيبة",
    value: "battalionId.name",
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

export const removeAction = instance => {
  return {
    icon: "mdi-folder-remove",
    call: item => {
      instance.showRemoveDialog(item);
    },
    text: instance.$i18n.t("Remove")
  };
};
