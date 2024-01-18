import { useState } from "react";
import { LoginBtn } from "./";
import { Layout, Button, Space, Modal } from "antd";
const { Header } = Layout;
import { useSession, signOut } from "next-auth/react";
import "./Header.scss";

const CommonHeader = (props) => {
  const { data: session, status, update } = useSession();
  const [signOutModalShow, setSignOutModalShow] = useState(false);

  // 退出登录
  const signOutHandle = (show) => {
    setSignOutModalShow(show);
  };

  const doSignOut = () => {
    signOut({ redirect: false })
    signOutHandle(false);
  };

  return (
    <>
      <Header className="header">
        <span className="header-title">{props.title}</span>
        <Space className="user-info" size={10}>
          <LoginBtn />
        </Space>
      </Header>
      <Modal
        title="退出确认"
        width={400}
        open={signOutModalShow}
        onOk={doSignOut}
        onCancel={() => signOutHandle(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>您是否确认退出登录</p>
      </Modal>
    </>
  );
};

export default CommonHeader;
