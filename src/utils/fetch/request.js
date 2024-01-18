import axios from 'axios';

// axios.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (/5\d{2}/.test(error.message)) {
//       console.error('系统繁忙');
//     }
//   },
// );

const request = (opts) => {
  let { url, headers = {}, params, responseType = 'json', dataType } = opts;
  const method = (opts.method || 'get').toLowerCase();
  const canData = ['post', 'put', 'patch'].includes(method.toLowerCase());
  if (!url) {
    console.error('utils.request: url未指定');
    return;
  }
  if (['get', 'delete'].includes(method)) {
    params = { ...params };
  } else if (dataType === 'formData') {
    if (!(params instanceof FormData)) {
      const formData = new FormData();
      for (const key in params) {
        formData.append(key, params[key]);
      }
      params = formData;
    }
  }
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      headers,
      ...(canData && params ? { data: params } : { params }),
      timeout: 5000,
      responseType, // arraybuffer, blob, document, json, text, stream
    })
      .then((res) => {
        const { status, data = {} } = res || {};
        if (status === 200) {
          if (data.code === 200) {
            resolve({ code: 300, data, msg: 'ok' });
          } else {
            reject({ code: 500, data, msg: 'interface error' });
          }
        } else {
          reject({ code: 500, data, msg: 'fetch error' });
        }
      })
      .catch((err) => {
        reject({ code: 500, data: err, msg: 'network error' });
      });
  });
};

export default request;
