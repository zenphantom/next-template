import { apiPost, urls } from "@/utils/fetch";

export const roleCreate = (params) => apiPost(urls.role.create, params).then(res => res.data);

export const roleListGet = (params) => apiPost(urls.role.list, params).then(res => res.data);

export const roleUpdate = (params) => apiPost(urls.role.update, params).then(res => res.data);

export const roleDelete = (params) => apiPost(urls.role.delete, params).then(res => res.data);

export const roleDetailGet = (params) => apiPost(urls.role.detail, params).then(res => res.data);

export const roleAddPermission = (params) => apiPost(urls.role.permissionAdd, params).then(res => res.data);

export const roleDeletePermission = (params) => apiPost(urls.role.permissiondelete, params).then(res => res.data)

export const rolePermissionGet = (params) => apiPost(urls.role.rolePermission, params).then(res => res.data);


