import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function apiRoleAddPermission(req, res) {
  try {
    const { roleId, permissionIds } = req.body || {};
    const session = await getServerSession(req, res, authOptions);

    const creator = session.user.name;

    const result = await prisma.rolePermission.createMany({
      data: [
        ...permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
          creator,
          editor: creator,
        })),
      ],
    });

    res.status(200).json({
      message: "ok",
      code: 200,
      data: {
        result: true,
      },
    });
  } catch (e) {
    apiLog("/api/role/create error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
