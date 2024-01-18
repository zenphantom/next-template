import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function apiUserRoleDelete(req, res) {
  try {
    const { userRoleId: id} = req.body || {};
    const session = await getServerSession(req, res, authOptions);
    const result = await prisma.userRole.delete({
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
    apiLog("/api/user/role-delete error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
