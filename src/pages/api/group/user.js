import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiGroupUser(req, res) {
  try {
    let {
      groupId: userGroupId,
    } = req.body || {};
    console.error(1111, userGroupId, typeof userGroupId)
    
    const where = {
      userGroupId,
    };
    
    const list = await prisma.userGroupUser.findMany({
      where,
      include: {
        user: true
      }
    });
    const total = await prisma.userGroupUser.count({ where });
    
    res.status(200).json({
      message: "ok",
      code: 200,
      data: { list, total },
    });
  } catch (e) {
    apiLog("/api/group/user error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
