import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function apiGroupRoleAdd(req, res) {
  try {
    const { groupId: userGroupId, roleIds } = req.body || {};
    const session = await getServerSession(req, res, authOptions);
    
    const creator = session.user.name;
    
    const result = await prisma.userGroupRole.createMany({
      data: [
        ...roleIds.map((roleId) => ({
          userGroupId,
          roleId,
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
    apiLog("/api/group/role-add error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
}
