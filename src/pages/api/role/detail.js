import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiRoleDetail(req, res) {
  try {
    let { roleId: id } = req.body || {};

    const where = {
      id
    };

    const result = await prisma.role.findUnique({
      where,
      include:{
        rolePermission: true
      }
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
