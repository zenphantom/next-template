import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(req) {

  const token = await getToken({
    req,
    // decode,
    // cookieName: options?.cookies?.sessionToken?.name,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return notLogin(req);
  } else {
    const { exp, status } = token;
    // 登录超时
    if (Date.now() > exp * 1000) {
      return notLogin(req);
    }
    if (status > 1) {
      return Ban(req);
    }
  }
  return NextResponse.next();
}

const notLogin = (req) => {
  // 接口返回401，前端跳转到登录页
  if (new URL(req.url).pathname.startsWith("/api")) {
    return NextResponse.json({
      code: 401,
      msg: "用户未登录",
    });
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
};

// 被封禁
const Ban = (req) => {
  if (new URL(req.url).pathname.startsWith("/api")) {
    return NextResponse.json({
      code: 403,
      msg: "用户被封禁",
    });
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // "/api/user/:path*",
  ],
};
