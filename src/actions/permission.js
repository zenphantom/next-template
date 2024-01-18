import { apiPost, urls } from "@/utils/fetch";

export const permissionCreate = (params) => apiPost(urls.permission.create, params).then(res => res.data);

export const permissionListGet = (params) => apiPost(urls.permission.list, params).then(res => res.data);

export const permissionUpdate = (params) => apiPost(urls.permission.update, params).then(res => res.data);

export const permissionDelete = (params) => apiPost(urls.permission.delete, params).then(res => res.data);


