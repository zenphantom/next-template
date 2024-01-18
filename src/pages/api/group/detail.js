import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiGroupDetail(req, res) {
  try {
    let { groupId: id } = req.body || {};
    
    const where = {
      id
    };
    
    const result = await prisma.userGroup.findUnique({
      where,
    });
    
    res.status(200).json({
      message: "ok",
      code: 200,
      data: result,
    });
  } catch (e) {
    apiLog("/api/role/detail error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
