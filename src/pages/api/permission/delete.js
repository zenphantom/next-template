import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async function apiPermissionDelete(req, res) {
  try {
    const { permissionId: id } = req.body || {};

    const result = await prisma.permission.delete({
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
    apiLog("/api/permission/delete error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
