import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiRoleList(req, res) {
  try {
    let {
      permissionId: id,
      permissionName: name,
      permissionCode: code = "",
      editor,
      pageSize,
      pageIndex,
    } = req.body || {};

    const where = {
      ...(id && { id }),
      name: { contains: name },
      code: { contains: code },
      editor: { contains: editor },
      creator: { contains: editor },
    };

    const list = await prisma.permission.findMany({
      where,
      include: {
        _count: {
          select: {
            rolePermission: true,
          }
        }
      },
      ...(pageSize &&
        pageIndex && {
          skip: pageSize * (pageIndex - 1),
          take: pageSize,
        }),
      orderBy: {
        id: "desc",
      },
    });
    const total = await prisma.permission.count({ where });

    res.status(200).json({
      message: "ok",
      code: 200,
      data: { list, total, pageIndex, pageSize },
    });
  } catch (e) {
    apiLog("/api/permission/list error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
