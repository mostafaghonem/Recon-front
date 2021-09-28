import Swal from "sweetalert2";
import _ from "lodash";
import moment from "moment";
import { MINIO_URL } from "~/plugins/axiosbase";
const defaultKeys = [
  {
    UIKey: "RECRUITMENT_LEVELS",
    DataKey: "recruitmentLevel"
  },
  {
    UIKey: "FORCES_LIST",
    DataKey: "force"
  },
  {
    UIKey: "ARMY_LIST",
    DataKey: "army"
  },
  {
    UIKey: "EDUCATION_RANKS",
    DataKey: "educationRank"
  },
  {
    UIKey: "SITUATIONS",
    DataKey: "situation"
  },
  {
    UIKey: "TREATMENTS",
    DataKey: "treatment"
  },
  {
    UIKey: "DIRECTIONS",
    DataKey: "direction"
  },
  {
    UIKey: "MAILTYPES",
    DataKey: "mailType"
  },
  {
    UIKey: "COURSETYPES",
    DataKey: "courseType"
  },
  {
    UIKey: "COLLEGES",
    DataKey: "courseCollege"
  },
  {
    UIKey: "COUNTRIES",
    DataKey: "country"
  },
  {
    UIKey: "TRAVELTYPES",
    DataKey: "travelType"
  },
  {
    UIKey: "GRADUATION_LEVELS",
    DataKey: "graduationLevel"
  },
  {
    UIKey: "DEGREES",
    DataKey: "degree"
  },
  {
    UIKey: "RANKS",
    DataKey: "higherRank"
  },
  {
    UIKey: "RANKS",
    DataKey: "lowerRank"
  },
  {
    UIKey: "INFLUENCES_TYPES",
    DataKey: "type"
  },
  {
    UIKey: "PUNISHMENTS",
    DataKey: "title"
  },
  {
    UIKey: "ORDERMAKERS",
    DataKey: "orderMaker"
  },
  {
    UIKey: "CRIMEMAJORLAWS",
    DataKey: "crimeMajorLaw"
  },
  {
    UIKey: "PERIOD_TYPES",
    DataKey: "periodType"
  },
  {
    UIKey: "DISHONORED",
    DataKey: "dishonored"
  },
  {
    UIKey: "COURTS",
    DataKey: "sentenceCourt"
  },
  {
    UIKey: "ANSWER_DIRECTIONS",
    DataKey: "answerDirection"
  },
  {
    UIKey: "JOINPLACES",
    DataKey: "joinPlace"
  },
  {
    UIKey: "CLEARANCE_STATUSES",
    DataKey: "clearanceStatus"
  },
  {
    UIKey: "SOLDIER_STATUSES",
    DataKey: "soldierStatus"
  }
];
const staffDefaultKeys = [
  {
    UIKey: "STAFF_CATEGORIES",
    DataKey: "category"
  },
  {
    UIKey: "STAFF_RANKS",
    DataKey: "rank"
  },
  {
    UIKey: "MEDICAL_SITUATIONS",
    DataKey: "medicalSituation"
  },
  {
    UIKey: "MEDICAL_CARDS",
    DataKey: "medicalCard"
  },
  {
    UIKey: "FORCES_LIST",
    DataKey: "force"
  },
  {
    UIKey: "ARMY_LIST",
    DataKey: "army"
  }
];
const recommendationDefaultKeys = [
  {
    UIKey: "RECOMMENDATION_TYPES",
    DataKey: "type"
  },
  {
    UIKey: "RECRUITMENT_LEVELS",
    DataKey: "recruitmentLevel"
  }
];
const dateKeys = [
  "date",
  "abscenseDate",
  "removalDate",
  "noticeDate",
  "noticeArrivalDate",
  "comebackDate",
  "orderDate",
  "travelDate",
  "confirmationDate",
  "from",
  "to",
  "startDate",
  "answerDate",
  "crimeDate",
  "firstLicenseDate",
  "secondLicenseDate",
  "lastCommissionDate",
  "departureDate",
  "joinDate"
];
const locationKeys = [
  {
    UIKey: "governates",
    SpecialKey: "governate",
    DataKey: "address.governate"
  },
  {
    UIKey: "recruitmentAreas",
    DataKey: "recruitmentArea"
  }
];
const numbersKeys = [
  {
    DataKey: "adminNo"
  },
  {
    DataKey: "seq"
  },
  {
    DataKey: "number"
  },
  {
    DataKey: "militaryId"
  },
  {
    DataKey: "nationalId"
  },
  {
    DataKey: "recordId"
  },
  {
    DataKey: "tripleNumber.value"
  },

  {
    DataKey: "division.name"
  },
  {
    DataKey: "joinDate"
  },
  {
    DataKey: "departureDate"
  },
  {
    DataKey: "birthDate"
  },
  {
    DataKey: "releaseDate"
  },
  {
    DataKey: "unit.unitId.name"
  },
  {
    DataKey: "division.divisionId.name"
  }
];

// User Specific
const userDefaultKeys = [
  {
    UIKey: "RANKS",
    DataKey: "rank"
  },
  {
    UIKey: "BRANCHES",
    DataKey: "branch"
  }
];

// Change of unit specifiic
const changeOfUnitDefaultKeys = [
  {
    UIKey: "RANKS",
    DataKey: "rank"
  },
  {
    UIKey: "BRANCHES",
    DataKey: "branch"
  }
];

// Units Specific
const unitDefaultKeys = [
  {
    UIKey: "FORCES_LIST",
    DataKey: "force"
  },
  {
    UIKey: "ARMY_LIST",
    DataKey: "army"
  },
  {
    UIKey: "UNIT_TYPES",
    DataKey: "type"
  }
];
export const Confirmer = Swal.mixin({
  icon: "warning",
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger"
  }
});

export const Toaster = Swal.mixin({
  toast: true,
  position: "top-start"
});
export const hasNumber = myString => {
  return /\d/.test(myString);
};
export const translateNumbers = str => {
  const englishNumbers = [
    /0/g,
    /1/g,
    /2/g,
    /3/g,
    /4/g,
    /5/g,
    /6/g,
    /7/g,
    /8/g,
    /9/g
  ];
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  if (typeof str === "string") {
    for (var i = 0; i < 10; i++) {
      str = str.replace(englishNumbers[i], arabicNumbers[i]);
    }
  }
  return str;
};
export const getKeyPair = (p, o) => {
  const res = p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);
  if (res && typeof res === "object" && res.length) {
    return res.map(o => o.ar).join(",");
  }
  if (res && typeof res === "object" && res.ar) {
    return res.ar;
  }

  if (res && typeof res === "object" && !res.length) {
    return "";
  }
  return res;
};
export const setKeyPair = (obj, key, value) => {
  const object = _.set(obj, key, value);
  return object;
};
export const onlyNumber = $event => {
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    // 46 is dot
    $event.preventDefault();
  }
};
export const filterAllNumbers = (value, search) => {
  let searchVal = search;
  const numeric = hasNumber(search);
  if (numeric) {
    searchVal = translateNumbers(search);
  }
  return (
    value != null &&
    searchVal != null &&
    typeof value === "string" &&
    value.toString().indexOf(searchVal) !== -1
  );
};
export const releaseDate = function() {
  if (!this.joinDate) {
    return undefined;
  }

  const EducationRanks = _.cloneDeep(this.defaults.EDUCATION_RANKS);
  const RecruitmentLevels = _.cloneDeep(this.defaults.RECRUITMENT_LEVELS);
  const EducationRanksKeys = _.cloneDeep(this.defaults.EDUCATION_RANKS_KEYS);
  const Treatments = _.cloneDeep(this.defaults.TREATMENTS_KEYS);

  EducationRanks.splice(1, 1);
  const startYear = moment(this.joinDate, "YYYY-MM-DD").year();
  const addedMonths = RecruitmentLevels.findIndex(
    o => o.value === this.recruitmentLevel
  );
  let addedYears;
  let formula = addedMonths * 3 - 1 + 3;

  console.log(
    "treamtn",
    this.treatment,
    Treatments.WITH_EXTRA_YEAR_NOT_APPLICABLE_FOR_REMOVAL
  );
  if (
    this.treatment === Treatments.WITH_EXTRA_YEAR_NOT_APPLICABLE_FOR_REMOVAL
  ) {
    formula += 2;
  }

  if (this.educationRank === EducationRanksKeys.ABOVE_AVERAGE) {
    addedYears = 1;
    formula += 6;
  } else {
    addedYears =
      EducationRanks.findIndex(o => o.value === this.educationRank) + 1;
  }

  console.log("forumula", formula);
  const year = startYear + addedYears;
  const releaseDate = moment(this.joinDate)
    .year(year)
    .month(formula)
    .hour(0)
    .minute(0)
    .startOf("month")
    .add("1", "day");
  return releaseDate.format("YYYY-MM-DD");
};

export const processClearance = (clearance, { locations, defaults }) => {
  console.log("processing clearnace", clearance);
  defaultKeys.map(keyObj => {
    if (clearance[keyObj.DataKey]) {
      const data = defaults[keyObj.UIKey];

      const item = data.find(
        o =>
          o.value === clearance[keyObj.DataKey] ||
          o._id === clearance[keyObj.DataKey]
      );

      if (item) {
        clearance[keyObj.DataKey] = item.ar;
      }
    }
  });
  locationKeys.map(keyObj => {
    if (clearance[keyObj.SpecialKey]) {
      const data = locations[keyObj.UIKey];

      const item = data.find(o => o.value === clearance[keyObj.SpecialKey]);

      if (item.value) {
        clearance[keyObj.SpecialKey] = item.ar;
      }
    }
  });

  dateKeys.map(keyObj => {
    if (clearance[keyObj]) {
      clearance[keyObj] = moment(clearance[keyObj])
        .locale("ar")
        .format("YYYY/MM/DD");
    }
  });

  return clearance;
};
export const processSoldier = (soldier, { locations, defaults }) => {
  defaultKeys.map(keyObj => {
    if (soldier[keyObj.DataKey]) {
      const data = defaults[keyObj.UIKey];

      const item = data.find(o => o.value === soldier[keyObj.DataKey]);

      if (item) {
        soldier[keyObj.DataKey] = item.ar;
      }
    }
  });

  locationKeys.map(keyObj => {
    const DataKeyArray = keyObj.DataKey.split(".");
    if (soldier[DataKeyArray[0]]) {
      const data = locations[keyObj.UIKey];

      const item = data.find(
        o => o.value === getKeyPair(DataKeyArray, soldier)
      );
      if (item) {
        if (soldier[DataKeyArray[0]][1] === "governate") {
          soldier.address.governate = item.ar;
        } else {
          soldier[keyObj.DataKey] = item.ar;
          setKeyPair(soldier, DataKeyArray, item.ar);
        }
      }
    }
  });

  // soldier.militaryId = translateNumbers(soldier.militaryId);
  // soldier.recordId = translateNumbers(soldier.recordId.toString());
  // soldier.tripleNumber.value = translateNumbers(
  //   soldier.tripleNumber.value.toString()
  // );
  // soldier.unit.name = translateNumbers(soldier.unit.name);
  soldier.birthDate = moment(soldier.birthDate)
    .locale("ar")
    .format("YYYY/MM/DD");

  // soldier.birthDate = NS(parseInt(soldier.birthDate, 10), "Arabic");

  soldier.joinDate = moment(soldier.joinDate)
    .locale("ar")
    .format("YYYY/MM/DD");

  soldier.releaseDate = moment(soldier.releaseDate)
    .locale("ar")
    .startOf('month')
    .format("YYYY/MM/DD");

  numbersKeys.map(keyObj => {
    const value = getKeyPair(keyObj.DataKey.split("."), soldier);
    if (value) {
      const translation = translateNumbers(value.toString());
      setKeyPair(soldier, `${keyObj.DataKey}_ar`.split("."), translation);
    }
  });

  // Add few keys for reports
  soldier.tn = soldier.tripleNumber.value;
  soldier.un =
    soldier.unit && soldier.unit.unitId ? soldier.unit.unitId.name : "";
  soldier.cn = soldier.address.centre;
  soldier.vl = soldier.address.village;
  soldier.gov = soldier.address.governate;
  // soldier.joinDate = NS(parseInt(soldier.joinDate, 10), "Arabic");
  return soldier;
};
export const processStaff = (staff, { locations, defaults }) => {
  staffDefaultKeys.map(keyObj => {
    if (staff[keyObj.DataKey]) {
      const data = defaults[keyObj.UIKey];

      const item = data.find(o => o.value === staff[keyObj.DataKey]);

      if (item) {
        staff[keyObj.DataKey] = item.ar;
      }
    }
  });

  locationKeys.map(keyObj => {
    const DataKeyArray = keyObj.DataKey.split(".");
    if (staff[DataKeyArray[0]]) {
      const data = locations[keyObj.UIKey];

      const item = data.find(o => o.value === getKeyPair(DataKeyArray, staff));
      if (item) {
        if (staff[DataKeyArray[0]][1] === "governate") {
          staff.address.governate = item.ar;
        } else {
          staff[keyObj.DataKey] = item.ar;
          setKeyPair(staff, DataKeyArray, item.ar);
        }
      }
    }
  });

  staff.birthDate = moment(staff.birthDate)
    .locale("ar")
    .format("YYYY/MM/DD");

  staff.joinDate = moment(staff.joinDate)
    .locale("ar")
    .format("YYYY/MM/DD");

  staff.rankingDate = moment(staff.rankingDate)
    .subtract(1, "day")
    .locale("ar")
    .format("YYYY/MM/DD");

  // Add few keys for reports
  staff.un = staff.unit && staff.unit.unitId ? staff.unit.unitId.name : "";
  staff.cn = staff.address.centre;
  staff.vl = staff.address.village;
  staff.gov = staff.address.governate;
  return staff;
};
export const processUser = (user, { defaults }) => {
  userDefaultKeys.map(keyObj => {
    if (user[keyObj.DataKey]) {
      console.log("value", user[keyObj.DataKey], "the object", keyObj);
      const data = defaults[keyObj.UIKey];

      const item = data.find(o => o.value === user[keyObj.DataKey]);

      if (item) {
        user[keyObj.DataKey] = item.ar;
      }
    }
  });

  const userPermissions = defaults.PERMISSIONS.find(
    o => o.value === user.permissions[0]
  );
  user.permissions = userPermissions ? userPermissions.ar : user.permissions;

  if (user.clearance && user.clearance.clearanceId) {
    user.clearance = processClearance(user.clearance.clearanceId, {
      locations,
      defaults
    });
  } else {
  }
  return user;
};
export const processMail = (mail, { defaults }) => {
  defaultKeys.map(keyObj => {
    if (mail[keyObj.DataKey]) {
      const data = defaults[keyObj.UIKey];
      const item = data
        ? data.find(o => o.value === mail[keyObj.DataKey])
        : undefined;

      if (item) {
        mail[keyObj.DataKey] = item.ar;
      }
    }
  });

  numbersKeys.map(keyObj => {
    const value = getKeyPair(keyObj.DataKey.split("."), mail);
    if (value) {
      const translation = translateNumbers(value.toString());
      setKeyPair(mail, `${keyObj.DataKey}_ar`.split("."), translation);
    }
  });

  mail.date = moment(mail.date)
    .locale("ar")
    .format("YYYY/MM/DD");

  mail.createdAtDate = moment(mail.createdAt)
    .locale("ar")
    .format("YYYY/MM/DD hh:mm a");
  const mailBranches = defaults.BRANCHES.filter(o =>
    mail.branches.find(m => o.value === m)
  );
  const mailBranch = defaults.BRANCHES.find(o => o.value === mail.branch);
  mail.branches = mailBranches;
  mail.branch = mailBranch;
  mail.attachments = mail.attachments.map(o => {
    o.link = `${MINIO_URL}${o.path}`;
    return o;
  });
  return mail;
};
export const processInfluence = (influence, { locations, defaults }) => {
  defaultKeys.map(keyObj => {
    if (influence[keyObj.DataKey]) {
      const data = defaults[keyObj.UIKey];

      const item = data.find(
        o =>
          o.value === influence[keyObj.DataKey] ||
          o._id === influence[keyObj.DataKey]
      );

      if (item) {
        influence[keyObj.DataKey] = item.ar;
      }
    }
  });

  locationKeys.map(keyObj => {
    if (influence[keyObj.SpecialKey]) {
      const data = locations[keyObj.UIKey];

      const item = data.find(o => o.value === influence[keyObj.SpecialKey]);

      if (item.value) {
        influence[keyObj.SpecialKey] = item.ar;
      }
    }
  });

  dateKeys.map(keyObj => {
    if (influence[keyObj]) {
      influence[keyObj] = moment(influence[keyObj])
        .locale("ar")
        .format("YYYY/MM/DD");
    }
  });

  // numbersKeys.map(keyObj => {
  //   const value = getKeyPair(keyObj.DataKey.split("."), soldier);
  //   if (value) {
  //     const translation = translateNumbers(value.toString());
  //     setKeyPair(soldier, `${keyObj.DataKey}_ar`.split("."), translation);
  //   }
  // });
  return influence;
};
export const processChangeOfUnit = (change, { defaults }) => {
  const result = {};
  if (change.soldierId) {
    result.soldierId = change.soldierId.militaryId;
    result.fullName = change.soldierId.fullName;
  } else if (change.staffId) {
    result.soldierId = change.staffId.militaryId;
    result.fullName = change.staffId.fullName;
  }
  if (change.pastUnit) {
    result.pastUnit = change.pastUnit.unitId.name;
  }
  if (change.unitId) {
    result.unitName = change.unitId.name;
  }
  if (change.userId) {
    result.username = change.userId.username;
  }
  result.timestamp = moment(change.createdAt).format("x");
  result.createdAt = moment(change.createdAt)
    .locale("ar")
    .format("YYYY/MM/DD hh:mm a");
  return result;
};
export const processUnit = (unit, { defaults }) => {
  unitDefaultKeys.map(keyObj => {
    if (unit[keyObj.DataKey]) {
      const data = defaults[keyObj.UIKey];
      const item = data
        ? data.find(o => o.value === unit[keyObj.DataKey])
        : undefined;
      if (item) {
        unit[keyObj.DataKey] = item.ar;
      }
    }
  });

  numbersKeys.map(keyObj => {
    const value = getKeyPair(keyObj.DataKey.split("."), unit);
    if (value) {
      const translation = translateNumbers(value.toString());
      setKeyPair(unit, `${keyObj.DataKey}_ar`.split("."), translation);
    }
  });

  if (unit.force === "recon") {
    const ReconForce = defaults.FORCES_LIST.find(o => o.value === "86");
    unit.force = ReconForce ? ReconForce.ar : "الاستطلاع";
  }
  return unit;
};
export const processRecommendation = (
  recommendation,
  { defaults, locations }
) => {
  console.log("processing recommendation", locations);
  recommendationDefaultKeys.map(keyObj => {
    if (recommendation[keyObj.DataKey]) {
      const data = defaults[keyObj.UIKey];
      const item = data
        ? data.find(o => o.value === recommendation[keyObj.DataKey])
        : undefined;
      if (item) {
        recommendation[keyObj.DataKey] = item.ar;
      }
    }
  });

  locationKeys.map(keyObj => {
    if (recommendation[keyObj.DataKey]) {
      const data = locations[keyObj.UIKey];

      const item = data.find(o => o.value === recommendation[keyObj.DataKey]);

      if (item && item.value) {
        recommendation[keyObj.DataKey] = item.ar;
      }
    }
  });
  numbersKeys.map(keyObj => {
    const value = getKeyPair(keyObj.DataKey.split("."), recommendation);
    if (value) {
      const translation = translateNumbers(value.toString());
      setKeyPair(
        recommendation,
        `${keyObj.DataKey}_ar`.split("."),
        translation
      );
    }
  });

  recommendation.createdAt = moment(recommendation.createdAt)
    .locale("ar")
    .format("YYYY/MM/DD");

  recommendation.updatedAt = moment(recommendation.updatedAt)
    .locale("ar")
    .format("YYYY/MM/DD");

  return recommendation;
};
export const processSoldiers = (data, { locations, defaults }) => {
  return data.map(o => processSoldier(o, { locations, defaults }));
};
export const processStaffs = (data, { locations, defaults }) => {
  return data.map(o => processStaff(o, { locations, defaults }));
};
export const processUsers = (data, { defaults }) => {
  return data.map(o => processUser(o, { defaults }));
};
export const processMails = (data, { defaults }) => {
  return data.map(o => processMail(o, { defaults }));
};
export const processChangeOfUnits = (data, { defaults }) => {
  const unordered = data.map(o => processChangeOfUnit(o, { defaults }));
  const ordered = _.orderBy(unordered, ["unitName"], ["asc"]);
  return ordered;
};
export const processInfluences = (data, { locations, defaults }) => {
  const copy = JSON.parse(JSON.stringify(data));
  const unordered = copy.map(o => processInfluence(o, { locations, defaults }));
  const ordered = _.orderBy(unordered, ["createdAt"], ["desc"]);
  return ordered;
};

export const processClearances = (data, { locations, defaults }) => {
  const copy = JSON.parse(JSON.stringify(data));
  const unordered = copy.map(o => processClearance(o, { locations, defaults }));
  const ordered = _.orderBy(unordered, ["createdAt"], ["desc"]);
  return ordered;
};
export const processUnits = (data, { defaults }) => {
  return data.map(o => processUnit(o, { defaults }));
};
export const processRecommendations = (data, { defaults, locations }) => {
  return data.map(o => processRecommendation(o, { defaults, locations }));
};
export const selectAllFields = function(value) {
  if (
    !this.selectAll &&
    value &&
    value.length &&
    value.includes("select_all")
  ) {
    this.selectAll = true;
    this.fieldsValue = this.fieldsItems.map(o => o.value);
  } else if (
    this.selectAll &&
    value &&
    value.length &&
    !value.includes("select_all")
  ) {
    this.selectAll = false;
    this.fieldsValue = [];
  } else if (
    this.selectAll &&
    this.fieldsValue.length !== this.fieldsItems.length
  ) {
    this.fieldsValue.splice(this.fieldsValue.indexOf("select_all"), 1);
    this.selectAll = false;
  }
};

// Wether This Indiviual Comeback Influence Can Be Added To Him
export const comebackAvailable = ({ indiviual }) => {
  let flee = {};
  const flees = indiviual.influences.filter(
    o => o.influenceId && ["flee", "comeback"].includes(o.influenceId.type)
  );
  const lastFlee = flees[flees.length - 1];
  if (flees.length && lastFlee.influenceId.type == "flee") {
    flee = lastFlee.influenceId.flee;
    const fleeKeys = [
      "noticeDate",
      "noticeArrivalDate",
      "abscenseDate",
      "removalDate"
    ];
    fleeKeys.map(key => {
      flee[key] = moment(flee[key]).format("YYYY-MM-DD");
    });
    return { available: true, flee };
  }
  return { available: false };
};

export const fleeAvailable = ({ indiviual }) => {
  const flees = indiviual.influences.filter(
    o => o.influenceId && ["flee", "comeback"].includes(o.influenceId.type)
  );
  const lastFlee = flees[flees.length - 1];

  if (!flees.length) {
    return { available: true };
  }

  if (flees.length && lastFlee.influenceId.type == "comeback") {
    return { available: true };
  }
  return { available: false };
};

export const driversLicenseAvailable = ({ indiviual }) => {
  const driversForces = ["66"];
  const educationRank = ["normal", "average"];
  const available =
    driversForces.includes(indiviual.force) &&
    educationRank.includes(indiviual.educationRank);

  return { available };
};

export const literacyAvailable = ({ indiviual }) => {
  const educationRank = ["normal"];
  const available = educationRank.includes(indiviual.educationRank);

  return { available };
};

export const executionAvailable = ({ indiviual, ranks }) => {
  const allowedRanks = ["seargent", "corporal"];
  let available = allowedRanks.includes(indiviual.rank);

  if (!available) {
    return { available: false, executionData: {} };
  }

  if (!ranks || (ranks && !ranks.length)) {
    return { available: false, executionData: {} };
  }
  const rankIndex = ranks.findIndex(o => indiviual.rank === o.value);
  const executionData = {
    lowerRank: ranks[rankIndex - 1].value,
    higherRank: indiviual.rank
  };

  return { available: true, executionData };
};

export const promotionAvailable = ({ indiviual, ranks }) => {
  if (!ranks || (ranks && !ranks.length)) {
    return { available: true, promotion: {} };
  }
  const rankIndex = ranks.findIndex(o => indiviual.rank === o.value);
  const available = true;
  const promotionData = {
    lowerRank: indiviual.rank,
    higherRank: ranks[rankIndex + 1].value
  };
  return { available, promotionData };
};

export const demotionAvailable = ({ indiviual, ranks }) => {
  const disallowedRanks = ["soldier"];
  let available = !disallowedRanks.includes(indiviual.rank);

  if (!available) {
    return { available: false, demotionData: {} };
  }

  if (!ranks || (ranks && !ranks.length)) {
    return { available: false, demotionData: {} };
  }
  const rankIndex = ranks.findIndex(o => indiviual.rank === o.value);
  const demotionData = {
    lowerRank: ranks[rankIndex - 1].value,
    higherRank: indiviual.rank
  };

  return { available: true, demotionData };
};

export const filterInfluenceTypes = function(types, ranks, category) {
  const filtered = types.filter(o => {
    if (category && o.category !== category) {
      return false;
    }

    if (o.value === "comeback") {
      const { available, flee } = comebackAvailable({
        indiviual: this.indiviualData
      });
      this.flee = flee;
      return available;
    }

    if (o.value === "flee") {
      const { available } = fleeAvailable({
        indiviual: this.indiviualData
      });
      return available;
    }

    if (o.value === "driversLicense") {
      const { available } = driversLicenseAvailable({
        indiviual: this.indiviualData
      });
      return available;
    }

    if (o.value === "literacy") {
      const { available } = literacyAvailable({
        indiviual: this.indiviualData
      });
      return available;
    }

    if (o.value === "execution") {
      const { available, executionData } = executionAvailable({
        indiviual: this.indiviualData,
        ranks
      });
      this.executionData = executionData;
      return available;
    }

    if (o.value === "demotion") {
      const { available, demotionData } = demotionAvailable({
        indiviual: this.indiviualData,
        ranks
      });
      this.demotionData = demotionData;
      return available;
    }

    if (o.value === "promotion") {
      const { available, promotionData } = promotionAvailable({
        indiviual: this.indiviualData,
        ranks
      });
      this.promotionData = promotionData;
      return available;
    }
    return true;
  });

  return filtered;
};
