import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

export default async (req, res) => {
  try {
    let { userId: id, userName: name, departmentName, email, pageSize, pageIndex } = req.body || {};

    pageSize = Number(pageSize) || 10;
    pageIndex = Number(pageIndex) || 1;

    const where = {
      ...(id && { id }),
      name: { contains: name },
      departmentName: { contains: departmentName },
      email: { contains: email },
    };
    const list = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            userGroupUser: true,
            userRole: true
          }
        }
      },
      skip: pageSize * (pageIndex - 1),
      take: pageSize,
      orderBy: {
        id: "desc",
      },
    });
    const total = await prisma.user.count({ where });
    
    res.status(200).json({
      message: "ok",
      code: 200,
      data: { list, total, pageIndex, pageSize },
    });
  } catch (e) {
    apiLog("/api/user/list error: ", e)
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
};
