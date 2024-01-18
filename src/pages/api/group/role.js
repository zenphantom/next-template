import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiGroupUser(req, res) {
  try {
    let {
      groupId: userGroupId,
    } = req.body || {};
    
    const where = {
      userGroupId,
    };
    
    const list = await prisma.userGroupRole.findMany({
      where,
      include: {
        role: true
      }
    });
    const total = await prisma.userGroupRole.count({ where });
    
    res.status(200).json({
      message: "ok",
      code: 200,
      data: { list, total },
    });
  } catch (e) {
    apiLog("/api/group/role error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
