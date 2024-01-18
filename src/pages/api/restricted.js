import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    res.send({
      content:
        "这是受保护的内容。您可以访问此内容，因为您已登录",
    })
  } else {
    res.send({
      error: "您必须登录才能查看此页面上的受保护内容.",
    })
  }
}
