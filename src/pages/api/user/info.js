import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiUserInfo(req, res) {
  try {
    let { userId: id } = req.query || {};

    const where = {
      id: Number(id),
    };

    const result = await prisma.user.findUnique({
      where,
      select: {
        name: true,
        departmentName: true,
        departmentId: true,
        avatar: true,
        email: true,
        userRole: {
          select: {
            role: {
              select: {
                rolePermission: {
                  select: {
                    permission: {
                      select: {
                        code: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        userGroupUser: {
          select: {
            userGroup: {
              select: {
                userGroupRole: {
                  select: {
                    role: {
                      select: {
                        rolePermission: {
                          select: {
                            permission: {
                              select: {
                                code: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // 通过角色获取权限点
    const userRole = result.userRole || [];
    const rolePermissionList = userRole
      .map((item) =>
        item.role.rolePermission.map((item) => item.permission.code),
      )
      .flat(Infinity);

    // 通过用户组获取权限点
    const userGroupUser = result.userGroupUser || [];
    const userGroupPermissionList = userGroupUser
      .map((item) =>
        (item.userGroup.userGroupRole || []).map((userGroupRole) =>
          (userGroupRole.role?.rolePermission || []).map(
            (rolePermission) => rolePermission.permission.code,
          ),
        ),
      )
      .flat(Infinity);

    // 权限点汇总
    result.permission = [
      ...new Set([...rolePermissionList, ...userGroupPermissionList]),
    ];

    delete result.userRole;
    delete result.userGroupUser;

    res.status(200).json({
      message: "ok",
      code: 200,
      data: result,
    });
  } catch (e) {
    apiLog("/api/user/detail error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
