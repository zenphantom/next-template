import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiDetail(req, res) {
  try {
    let { userId: id } = req.body || {};

    const where = {
      id
    };

    const result = await prisma.user.findUnique({
      where,
      include:{
        userRole: true
      }
    });

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
