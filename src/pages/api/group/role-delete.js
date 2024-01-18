import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function apiGroupRoleDelete(req, res) {
  try {
    const { groupRoleId: id} = req.body || {};
    const session = await getServerSession(req, res, authOptions);
    const result = await prisma.userGroupRole.delete({
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
    apiLog("/api/group/role-delete error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
