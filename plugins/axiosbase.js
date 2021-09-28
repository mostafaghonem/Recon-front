import axios from "axios";
let URI, HOST, MINIO;
// ["62.117.55.189", "10.0.0.149"]
const ip = "10.0.0.37"; //[lp;]
if (process.server) {
  HOST = process.env.HOST;
}
// eslint-disable-next-line
console.log("NODE_ENV ============>`", process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
  case "production":
    URI = `/api/`;
    MINIO = `http://${ip}:9000`;
    break;
  case "staging":
    URI = `http://${ip}:5050/api/`;
    MINIO = `http://${ip}:9000`;
    break;
  case "development":
    URI = "http://localhost:5050/api/";
    MINIO = `http://localhost:9000`;
    break;

  case "local":
    URI = "http://localhost:5050/api/";
    MINIO = `http://localhost:9000`;
    break;
  default:
    break;
}

// ! uncomment me before build and move dist to public in server
// URI = 'https://app.dev.sknhost.com/api/'
// ! staging server build
// URI = 'https://app.staging.sknhost.com/api/'
// ! testing server build
// URI = 'https://app.test.sknhost.com/api/'

const AxiosBase = axios.create({
  baseURL: URI,
  withCredentials: true
});

export const setAuthToken = token => {
  if (token) {
    // this apply to every request
    AxiosBase.defaults.headers.common["access-token"] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["access-token"];
  }
};

export const post = async (path, data) => {
  try {
    const response = await AxiosBase.post(path, data);
    return response.data;
  } catch (err) {
    console.log("error message", err.message);
    if (err.response) {
      let message = err.response.data.message
        ? err.response.data.message
        : undefined;
      console.log("response data", err.response.data.error);

      if (!message) {
        message =
          err.response.data.error &&
          Object.values(err.response.data.error).length > 0
            ? Object.values(err.response.data.error)[0]
            : "حدث خطأ فى التواصل مع الخادم";
      }

      return {
        error: message
      };
    }

    if (!err.response) {
      return { error: "حدث خطأ فى التواصل مع الخادم" };
    }
  }
};

export const get = async (path, params = {}) => {
  try {
    console.log("sending data", params);
    const response = await AxiosBase.get(path, { params });
    return response.data;
  } catch (err) {
    // console.log("error response", err.response, err.message);
    if (err.response) {
      let message = err.response.data.message
        ? err.response.data.message
        : undefined;
      console.log("response data", err.response.data.error);

      if (!message) {
        message =
          err.response.data.error &&
          Object.values(err.response.data.error).length > 0
            ? Object.values(err.response.data.error)[0]
            : "حدث خطأ فى التواصل مع الخادم";
      }

      return {
        error: message
      };
    }

    if (!err.response) {
      return { error: "حدث خطأ فى التواصل مع الخادم" };
    }
  }
};

export const putObj = async (url, file) => {
  try {
    const response = await axios.put(url, file);
    return response.data;
  } catch (err) {
    // console.log("error response", err.response, err.message);
    if (err.response) {
      let message = err.response.data.message
        ? err.response.data.message
        : undefined;
      console.log("response data", err.response.data.error);

      if (!message) {
        message =
          err.response.data.error &&
          Object.values(err.response.data.error).length > 0
            ? Object.values(err.response.data.error)[0]
            : "حدث خطأ فى التواصل مع الخادم";
      }

      return {
        error: message
      };
    }

    if (!err.response) {
      return { error: "حدث خطأ فى التواصل مع الخادم" };
    }
  }
};

export const MINIO_URL = MINIO;
export const BASE_URI = URI;
export default AxiosBase;
