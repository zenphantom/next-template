import prisma from "@/service/prisma";
import apiLog from "@/utils/api-log";

// 用户状态更新
export default async (req, res) => {
  try {
    let { userId: id, state } = req.body || {};

    const where = {
      id,
    };
    const result = await prisma.user.update({
      where,
      data: {
        state,
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
    apiLog("/api/user/list error: ", e);
    res.status(200).json({
      message: "数据库错误",
      code: 500,
      data: {},
    });
  }
};
