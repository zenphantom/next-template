import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function apiPermissionDelete(req, res) {
  try {
    const { rolePermissionId: id} = req.body || {};
    const session = await getServerSession(req, res, authOptions);
    const result = await prisma.rolePermission.delete({
      where: {
        id
      }
    });
    res.status(200).json({
      message: "ok",
      code: 200,
      data: {
        result: true,
      },
    });
  } catch (e) {
    apiLog("/api/role/permission-delete error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
