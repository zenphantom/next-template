import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function apiRoleCreate(req, res) {
  try {
    const { id, name, code, intro, statue } = req.body || {};
    const session = await getServerSession(req, res, authOptions);
    const editor = session.user.name;

    const result = await prisma.role.update({
      where: {
        id,
      },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(intro && { intro }),
        ...(editor && { editor }),
        ...(statue && { statue }),
      },
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
