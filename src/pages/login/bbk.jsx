import { Form, Input, Button, message } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, withRouter } from "next/router";
import "./login.scss";
import { useEffect } from "react";
import axios from "axios";
// import background from "@/app/assets/background.jpeg";

const clientId = process.env.FEISHU_APP_ID;
const redirectUri = `${process.env.NEXTAUTH_URL}/login/bbk`;

const BBK = (props) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.error(status, session, props.router.query.code);

    if (status === "authenticated") {
      console.error("jwt init: ", session.user);
      localStorage.setItem("username", session.user.name);
    }

    if (status === "unauthenticated") {
      if (props.router.query.code) {
        doSignin();
      } else {
        QRCodeInit();
      }
    }
  }, [status, props.router.query.code]);

  const doSignin = () => {
    signIn("credentials", {
      code: props.router.query.code,
      redirectUri,
      redirect: false,
      // callbackUrl: 'http://127.0.0.1:3091/login/bbk'
    })
      .then((res) => {
        console.error("登录成功", res);
        router.push(redirectUri).then(() => {
          router.reload();
        });
        axios
          .get("/api/jwt")
          .then((res) => res.data)
          .then((res) => {
            console.error("jwt2: ", res);
          });
      })
      .catch((err) => {
        console.error("登录失败", err);
      });
  };

  const QRCodeInit = () => {
    const goto = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=STATE`;

    const QRLoginObj = window?.QRLogin({
      id: "feishu-login",
      goto,
      width: "500",
      height: "500",
      style: "width:250px;height:250px", //可选的，二维码html标签的style属性
    });

    const handleMessage = (event) => {
      const origin = event.origin;
      // 使用 matchOrigin 方法来判断 message 来自页面的url是否合法
      if (QRLoginObj.matchOrigin(origin)) {
        const loginTmpCode = event.data;
        // 在授权页面地址上拼接上参数 tmp_code，并跳转
        window.location.href = `${goto}&tmp_code=${loginTmpCode}`;
      }
    };
    if (typeof window.addEventListener != "undefined") {
      window.addEventListener("message", handleMessage, false);
    } else if (typeof window.attachEvent != "undefined") {
      window.attachEvent("onmessage", handleMessage);
    }
  };

  const logout = () => {
    signOut({ redirect: false }).then(() => {
      router.replace("/login/bbk");
      localStorage.removeItem("username");
    });
  };

  const toLogin = () => {
    location.assign(
      `https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=${redirectUri}&app_id=${clientId}&state=STATE`,
    );
  };

  return (
    <div className="login">
      {status !== "loading" && (
        <div>
          {session ? (
            <Button onClick={() => logout()}>已登录</Button>
          ) : (
            <>
              <div id="feishu-login" />
              <Button onClick={toLogin}>登录</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default withRouter(BBK);
