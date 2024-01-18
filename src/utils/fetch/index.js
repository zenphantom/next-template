import request from './request';
import urls from './urls';

const apiGet = (url, params = {}, opt = {}) => {
  return request({ method: 'get', url, params, ...opt }).then((res) => res.data);
};

const apiPost = (url, params, opt) => {
  return request({ method: 'post', url, params, ...opt }).then((res) => res.data);
};

const apiPostJson = (url, params, opt) => {
  return request({ method: 'post', url, params, ...opt, dataType: 'json' }).then((res) => res.data);
};

const apiForm = (url, params, opt) => {
  return request({ method: 'post', url, params, ...opt, dataType: 'formData' }).then((res) => res.data);
};

const apiFile = () => {};

const apiPut = () => {};

const apiDelete = (url, params, opt) => {
  return request({ method: 'delete', url, params, ...opt }).then((res) => res.data);
}

export { apiGet, apiPost, apiPostJson, apiForm, apiFile, apiPut, apiDelete, urls };
