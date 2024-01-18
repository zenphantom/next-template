import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";
import { Inika } from "next/dist/compiled/@next/font/dist/google";

export default async function apiRoleList(req, res) {
  try {
    let {
      roleId: id,
      roleName: name,
      roleCode: code = "",
      editor,
      pageSize = 10,
      pageIndex = 1,
    } = req.body || {};

    const where = {
      ...(id && { id }),
      name: { contains: name },
      code: { contains: code },
      editor: { contains: editor },
      creator: { contains: editor },
    };

    let list = await prisma.role.findMany({
      where,
      include: {
        _count: {
          select: {
            userRole: true,
            rolePermission: true,
            userGroupRole: true
          }
        }
      },
      skip: pageSize * (pageIndex - 1),
      take: pageSize,
      orderBy: {
        id: "desc",
      },
    });
    const total = await prisma.role.count({ where });

    res.status(200).json({
      message: "ok",
      code: 200,
      data: { list, total, pageIndex, pageSize },
    });
  } catch (e) {
    apiLog("/api/role/list error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
