import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import prisma from "@/service/prisma";

const redirect_uri = `${process.env.NEXTAUTH_URL}/login/bbk`;
const app_id = process.env.FEISHU_APP_ID;
const app_secret = process.env.FEISHU_APP_SECRET;
const state = "STATE";

// 跳转登录页面
// https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=http://127.0.0.1:3091/login/bbk&app_id=cli_a44d9d7eefba100b&state=STATE
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "登录",
      type: "credentials",
      async authorize(credentials, req) {
        const { code, redirectUri = process.env.NEXTAUTH_URL } =
          credentials || {};
        try {
          const { access_token: userAccessToken, user_id: userId } =
            await getUserAccessToken(code);
          console.error(
            "user_access_token: ",
            userAccessToken,
            "userId: ",
            userId,
          );
          const userInfo = await getUserInfo(userId, userAccessToken);
          const {
            user: {
              name,
              enterprise_email: email,
              mobile,
              department_path,
              avatar: { avatar_72: avatar },
            },
          } = userInfo;
          // 部门名
          console.error('--- userInfo:', userInfo)
          const department = department_path?.[0] || {}
          const { department_name, department_id: departmentId } = department;
          const departmentName = department_name.name
          console.error(
            "userName: ",
            name,
            "email: ",
            email,
            "department: ",
            departmentName,
            departmentId
          );

          // TODO 数据库储存

          const result = await prisma.user.upsert({
            where: {
              name,
            },
            create: {
              name: name + Math.random(),
              avatar,
              mobile,
              email,
              departmentName,
              departmentId
            },
            update: {
              avatar,
              mobile,
              email,
              departmentName,
              departmentId
            }
          });

          return Promise.resolve({
            userAccessToken,
            name,
            departmentName,
            avatar,
          });
        } catch (e) {
          console.error("feishu login err 3:", e);
          return Promise.reject(new Error("数据库错误"));
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
    async jwt(params) {
      let { token, user, account, profile, trigger, session } = params;
      /*console.error(" ");
      console.error(
        "------ jwt: ",
        "token: ",
        token,
        "account: ",
        account,
        "user: ",
        user,
        'profile: ',
        profile
      );*/
      // 更新 token
      /*console.error('token---trigger: ', trigger, 'token: ', token)
      
      if (trigger === "update") {
        console.error('update token: ', token)
      }*/
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        const { name, departmentName, avatar, userAccessToken } = user;
        token = {
          ...token,
          name,
          departmentName,
          avatar,
          userAccessToken,
        };
      }

      // token.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
      return token;
    },
    async session({ session, token, user, trigger, newSession }) {
      /*console.error(
        "------ session: ",
        "token: ",
        token,
        "session:",
        session,
        "user:",
        user,
      );*/
      // session.accessToken = token.accessToken;
      // session.refreshToken = token.refreshToken;
      // Send properties to the client, like an access_token from a provider.
      /*console.error('session---trigger: ', trigger, 'session: ', session, 'newSession: ', newSession)
      if (trigger === "update") {
        console.error('update session: ', token)
      }*/
      
      const { name, departmentName, avatar, userAccessToken } = token;
      session.user = {
        ...session.user,
        name,
        departmentName,
        avatar,
        // userAccessToken
      };
      return session;
    },
  },
  session: {
    strategy: "jwt", // 如果这里设置的不是 jwt，那么 jwt 回调函数不会触发
    maxAge: 2 * 60 * 60,
    updateAge: 1 * 60 * 60, //  hours
  },
  jwt: {
    //   // The maximum age of the NextAuth.js issued JWT in seconds.
    //   // Defaults to `session.maxAge`.
    maxAge: 2 * 60 * 60,
    //   // You can define your own encode/decode functions for signing and encryption
    //   async encode() {},
    //   async decode() {},
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const getIp = (req) => {
  const xRealIp = req?.headers["x-real-ip"];
  const xForwardedFor = req?.headers["x-forwarded-for"];
  const hostnames = req?.nextUrl?.hostname;
  const ip = xRealIp || xForwardedFor || hostnames;
  return ip;
};

const getUserAccessToken = (code) => {
  return axios({
    method: "post",
    url: "https://open.feishu.cn/open-apis/authen/v1/access_token",
    headers: {
      "Content-Type": "application/json",
      charset: "utf-8",
    },
    data: {
      app_id,
      app_secret,
      code,
      grant_type: "authorization_code",
    },
  })
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("--- user_access_token err: ", err);
      return err;
    });
};

// 获取用户信息
const getUserInfo = (userId, userAccessToken) => {
  return axios({
    method: "get",
    url: `https://open.feishu.cn/open-apis/contact/v3/users/${userId}`,
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
    },
    params: {
      user_id_type: "user_id",
      department_id_type: "open_department_id",
    },
  })
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("getUserInfo err: ", err);
    });
};

const getAppAccessToken = () => {
  return axios({
    method: "post",
    url: "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal",
    data: {
      app_id: app_id,
      app_secret: app_secret,
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.data)
    .then((res) => {
      console.error("--- app_access_token succ: ", res);
      return res;
    })
    .then((err) => {
      console.error("--- app_access_token err: ", err);
      return err.data;
    });
};

// 获取部门信息
const getDepartmentInfo = (userAccessToken) => {
  return axios({
    method: "get",
    url: "https://open.feishu.cn/open-apis/contact/v3/users/find_by_department",
    responseType: "json",
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
    },
  })
    .then((res) => res.data)
    .then((res) => {
      console.error("用户部门信息 succ", res);
    })
    .catch((err) => {
      console.error("用户部门信息 err", err);
    });
};

export default NextAuth(authOptions);
