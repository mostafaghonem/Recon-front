import moment from "moment";
import { translateNumbers } from "~/plugins/helpers";

export const changeOfUnitLetter = ({ change, extra }) => {
  const refernceNumber = extra.referenceNumber;
  change.pastUnit = translateNumbers(change.pastUnit);
  change.unitName = translateNumbers(change.unitName);
  const sender = extra.sender;

  console.log("moving dat", sender.movingDate);
  change.time = moment(parseInt(change.timestamp, 10))
    .locale("ar")
    .format("YYYY/MM/DD");

  sender.movingDateString = moment(sender.movingDate)
    .locale("ar")
    .format("YYYY/MM/DD");

  // const stringV1 = `إيماءً إلى كتاب هيئة التنظيم والإدارة للقوات المسلحة رقم (${refernceNumber}) بتاريخ ${
  //   change.date
  // } بشأن نقل المذكور بعد من وإلى الوحدة المدونة قرينة \n
  //   قادم  لكم ${sender.rank} / ${
  //   sender.name
  // } ومعه المذكور بعد بمهماته وملبوساته الأميرية والنموذج (1س) الأصل وشهادة أخر صرفية خاصتة وهو:-
  //   `;

  const stringV1 = `إيماءً إلى كتاب هيئة التنظيم والإدارة للقوات المسلحة رقم (${refernceNumber}) بتاريخ ${
    change.time
  } بشأن نقل الجندى / ${change.fullName}`;

  const stringV2 = `من الوحدة / ${change.pastUnit} إلى الوحدة / ${
    change.unitName
  } قادم لكم ${sender.rank} / ${sender.name} ومعه المذكور بعاليه`;

  const stringV3 = `ونماذج خدمته كاملة المرفقات  ومعه مهماته وملبساته الأميرية وقد تنبه عليه بتقديم نفسه إليكم يوم ${
    sender.movingDateString
  } مستخدماً المواصلات الأميرية المصرح بها`;

  return [stringV1, stringV2, stringV3];
};
