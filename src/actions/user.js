import {apiGet, apiPost, urls} from "@/utils/fetch";

export const userListGet = (params) =>
  apiPost(urls.user.list, params).then((res) => res.data);

export const userStateUpdate = (params) =>
  apiPost(urls.user.update, params).then((res) => res.data);

export const userDetailGet = (params) =>
  apiPost(urls.user.detail, params).then((res) => res.data);

export const userAddRole = (params) =>
  apiPost(urls.user.roleAdd, params).then((res) => res.data);

export const userDeleteRole = (params) =>
  apiPost(urls.user.roleDelete, params).then((res) => res.data);

export const userRoleGet = (params) =>
  apiPost(urls.user.userRole, params).then((res) => res.data);
