import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { BASE_URI } from "~/plugins/axiosbase";
import moment from "moment";
import { template } from "lodash";
const templateURI = `${BASE_URI.replace("api/", "template.docx")}/`;
let PizZipUtils = null;
if (typeof window !== "undefined") {
  import("pizzip/utils/index.js").then(function(r) {
    PizZipUtils = r;
  });
}

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
function parser(tag) {
  return {
    get(scope, context) {
      if (tag === "$i") {
        const indexes = context.scopePathItem;
        return indexes[indexes.length - 1] + 1;
      }
      return scope[tag];
    }
  };
}

export const generateDocument = ({
  template,
  data,
  searchFields,
  locations,
  defaults,
  divisions
}) => {
  console.log("generating with data", data);
  let holder;
  let uri = templateURI;
  const date = moment()
    .locale("ar")
    .format("YYYY / MM / DD");
  const total = data.length;
  const search = searchFields
    ? searchFields.map(o => {
        switch (o.keyObj.sourceObj) {
          case "divisions":
            holder = divisions;
            break;
          case "locations":
            holder = locations;
            break;
          default:
            holder = defaults;
        }
        let value = o.value;
        const key = o.keyObj ? o.keyObj.ar : o.value;
        if (holder.length) {
          const obj = holder.find(m => m._id === o.value);
          if (obj) {
            value = obj.name;
          }
        } else if (holder[o.keyObj.sourceKey]) {
          const obj = holder[o.keyObj.sourceKey].find(
            m => m.value === o.value || m.code === o.value
          );
          if (obj) {
            value = obj.ar;
          }
        }
        return { key, value };
      })
    : [];

  if (template) {
    uri = templateURI.replace("template", template);
  }

  loadFile(uri, function(error, content) {
    if (error) {
      throw error;
    }
    var zip = new PizZip(content);
    var doc = new Docxtemplater().loadZip(zip).setOptions({ parser });
    doc.setData({
      s: data,
      search,
      date,
      total,
      raw: `<w:p><w:br w:type="page" /></w:p>`
    });
    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();
    } catch (error) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
      function replaceErrors(key, value) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce(function(error, key) {
            error[key] = value[key];
            return error;
          }, {});
        }
        return value;
      }
      console.log(JSON.stringify({ error: error }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function(error) {
            return error.properties.explanation;
          })
          .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }
    var out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }); //Output the document using Data-URI
    saveAs(out, "output.docx");
  });
};
