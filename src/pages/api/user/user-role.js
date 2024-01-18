import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiRolePermission(req, res) {
  try {
    let {
      userId,
    } = req.body || {};
    
    const where = {
      userId
    };
    
    const list = await prisma.userRole.findMany({
      where,
      include: {
        role: {
          select: {
            id:true,
            name: true,
            code: true,
            intro: true
          }
        }
      }
    });
    const total = await prisma.userRole.count({ where });
    
    res.status(200).json({
      message: "ok",
      code: 200,
      data: { list, total },
    });
  } catch (e) {
    apiLog("/api/user/user-role error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
