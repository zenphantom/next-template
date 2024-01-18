import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiRolePermission(req, res) {
  try {
    let {
      roleId,
    } = req.body || {};
    
    const where = {
      roleId
    };
    
    const list = await prisma.rolePermission.findMany({
      where,
      include: {
        permission: {
          select: {
            id:true,
            name: true,
            code: true,
            intro: true
          }
        }
      }
    });
    const total = await prisma.rolePermission.count({ where });
    
    res.status(200).json({
      message: "ok",
      code: 200,
      data: { list, total },
    });
  } catch (e) {
    apiLog("/api/role/role-permission error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
