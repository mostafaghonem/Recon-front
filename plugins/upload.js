import { get } from "~/plugins/axiosbase";

export const uploadHandler = async (
  file,
  metadata,
  load,
  error,
  progress,
  abort
) => {
  // set busy state
  // do signing
  const path = "/upload/sign";
  const params = {
    ["file-name"]: file.name,
    ["default-ext"]: "pdf"
  };
  console.log("getting signed", params);
  const signResponse = await get(path, params);
  return signResponse;
};

export const signFiles = function(file, done) {
  // fPutObject(file);
  uploadHandler(file).then(response => {
    // this.files.push({ filename: file.name, uploadUrl: response });
    file.dynamicUploadUrl = response.postURL;
    file.presignedURL = response.presignedURL;
    file.data = response.formData;
    let uri = response.imageLink.replace("http://", "").replace("https://", "");
    const attachment = {
      link: response.imageLink,
      name: file.name.slice(0, file.name.indexOf(".")),
      size: file.size,
      originalName: file.name,
      path: uri.slice(uri.indexOf("/"), uri.length)
    };
    this.mail.attachments.push(attachment);
    done();
  });
};

export const vremoved = function(file, xhr, error) {
  const found = this.mail.attachments.find(
    o => o.originalName === file.name || file.name.includes(o.name)
  );
  if (found) {
    this.mail.attachments.splice(this.mail.attachments.indexOf(found), 1);
  }
};

export const getMeUploadUrl = files => {
  return `${files[0].presignedURL}`;
};

export const sendFiles = (file, xhr, formData) => {
  // Will send the filesize along with the file as POST data.
  // console.log("file data", file.dynamicUploadUrl, file.data);
  // Object.keys(file.data).map(o => formData.append(o, file.data[o]));
  xhr.setRequestHeader("Content-Type", "application/pdf");
  console.log("form data", formData);
};

export const dropzoneOptions = obj => ({
  thumbnailWidth: 120,
  maxFilesize: 25,
  method: "put",
  accept: obj.signFiles,
  url: obj.getMeUploadUrl,
  sending: obj.sendFiles,
  acceptedFiles: ".pdf",
  dictDefaultMessage: "اضغط هنا لرفع ملف المكاتبة بصيغة pdf 📎",
  dictRemoveFile: "❌",
  addRemoveLinks: true
});
