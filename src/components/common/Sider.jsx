import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { pathEnum } from "./";

const { Sider } = Layout;

const CommonSider = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const menuList = [
    {
      label: "权限设置",
      key: "/permission/config",
      children: [
        {
          label: "角色列表",
          key: pathEnum.UserList.key,
        },
        {
          label: "用户组",
          key: pathEnum.UserGroupList.key,
        },
        {
          label: "角色",
          key: pathEnum.RoleList.key,
        },
        {
          label: "权限点",
          key: pathEnum.PermissionList.key,
        },
      ],
    },
  ];

  const onSelect = (value) => {
    const { key } = value;
    router.push(key);
  };
  
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <Menu
        mode="inline"
        style={{ height: "100%" }}
        selectedKeys={[props.defaultKey]}
        defaultOpenKeys={[""]}
        openKeys={props.openKeys || []}
        items={menuList}
        onSelect={onSelect}
      />
    </Sider>
  );
};

export default CommonSider;
