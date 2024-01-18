import { useEffect } from "react";
import { useRouter, withRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "antd";

function Login(props) {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    console.error("status", status, session);
  }, [status]);

  /*useEffect(() => {
    console.error(
      "code: ",
      props.router.query.code,
      "status: ",
      status,
      "session: ",
      session,
    );
    console.error(status, props.router.query.code, session)
    if (status !== "loading" && props.router.query.code && !session) {
      signIn("credentials", {
        code: props.router.query.code,
        redirect: false,
      })
        .then((res) => {
          console.error("登录成功", res);
        })
        .catch((err) => {
          console.error("登录失败", err);
        });
    }
  }, [props.router.query, status]);*/

  return (
    <div>
      <p>This is Index Page.</p>
      {session ? <Button>已登录</Button> : <Button>未登录</Button>}
      <Button
        danger
        type="primary"
        onClick={() => signOut({ redirect: false })}
      >
        退出
      </Button>
    </div>
  );
}

export default withRouter(Login);
