const urls = {
  user: {
    list: "/api/user/list",
    update: "/api/user/update",
    detail: "/api/user/detail",
    roleAdd: "/api/user/role-add",
    roleDelete: "/api/user/role-delete",
    userRole: "/api/user/user-role",
  },
  role: {
    create: "/api/role/create",
    list: "/api/role/list",
    detail: "/api/role/detail",
    update: "/api/role/update",
    delete: "/api/role/delete",
    permissionAdd: "/api/role/permission-add",
    permissiondelete: "/api/role/permission-delete",
    rolePermission: "/api/role/role-permission",
  },
  permission: {
    create: "/api/permission/create",
    list: "/api/permission/list",
    update: "/api/permission/update",
    delete: "/api/permission/delete",
  },
  group: {
    create: "/api/group/create",
    list: "/api/group/list",
    update: "/api/group/update",
    delete: "/api/group/delete",

    detail: "/api/group/detail",
    userAdd: "/api/group/user-add",
    roleAdd: "/api/group/role-add",
    userDelete: "/api/group/user-delete",
    roleDelete: "/api/group/role-delete",
    user: "/api/group/user",
    role: "/api/group/role",
  },
};

export default urls;
