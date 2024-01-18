import { apiPost, urls } from "@/utils/fetch";

export const groupCreate = (params) => apiPost(urls.group.create, params).then(res => res.data);

export const groupListGet = (params) => apiPost(urls.group.list, params).then(res => res.data);

export const groupUpdate = (params) => apiPost(urls.group.update, params).then(res => res.data);

export const groupDelete = (params) => apiPost(urls.group.delete, params).then(res => res.data);
export const groupDetailGet = (params) => apiPost(urls.group.detail, params).then(res => res.data);

export const groupAddUser = (params) => apiPost(urls.group.userAdd, params).then(res => res.data);

export const groupAddRole = (params) => apiPost(urls.group.roleAdd, params).then(res => res.data);

export const groupDeleteUser = (params) => apiPost(urls.group.userDelete, params).then(res => res.data);

export const groupDeleteRole = (params) => apiPost(urls.group.roleDelete, params).then(res => res.data);

export const groupUserGet = (params) => apiPost(urls.group.user, params).then(res => res.data);
export const groupRoleGet = (params) => apiPost(urls.group.role, params).then(res => res.data);
