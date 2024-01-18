import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import {Button, Space} from "antd";
import "./LoginBtn.scss";
const LoginBtn = () => {
  const router = useRouter();
  const { data: session = undefined } = useSession();


  const onSignOut = () => {
    signOut({ redirect: false }).then((res) => {
      router.push("/login");
    });
  };

  return (
    <div className="login-btn">
      {session ? (
        <div className='logged'>
          {/*<img className='avatar' src={session.user.avatar} />*/}
          <span className="username">{session.user?.name}</span>
          <Button onClick={() => onSignOut()}>退出</Button>
        </div>
      ) : (
        <Button type="primary" onClick={() => router.push("/login")}>
          登录
        </Button>
      )}
    </div>
  );
};

export default LoginBtn;
