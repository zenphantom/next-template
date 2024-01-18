import { Layout } from "antd";
import { Header, Sider } from "./index";
import classNames from "classnames";
import "./Layout.scss";

const { Content } = Layout;

const RenderContent = (props) => (
  <Content className={classNames("content-right", props.className)}>
    {props.children}
  </Content>
);

const RednerSider = (props) => (
  <Content className="content-bottom">
    <Layout>
      <Sider defaultKey={props.siderKey} openKeys={props.openKeys} />
      {RenderContent(props)}
    </Layout>
  </Content>
);

const CommonLayout = (props) => {
  return (
    <Layout className="common-layout">
      <Header title={props.title} />
      {props.siderKey ? RednerSider(props) : RenderContent(props)}
    </Layout>
  );
};

const CommonLayoutDefaultProps = {
  title: "",
  className: "",
  siderKey: "",
  children: null,
};

export default CommonLayout;
