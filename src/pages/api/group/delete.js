import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiRoleDelete(req, res) {
  try {
    const { groupId: id } = req.body || {};

    const result = await prisma.userGroup.deleteMany({
      where: { id },
    });

    res.status(200).json({
      message: "ok",
      code: 200,
      data: {
        result: true,
      },
    });
  } catch (e) {
    apiLog("/api/userGroup/delete error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
