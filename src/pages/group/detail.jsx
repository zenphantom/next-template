import { useEffect, useState } from "react";
import { withRouter } from "next/router";
import { Button, message, Popconfirm, Select, Space, Table, Tabs } from "antd";
import { CommonLayout, pathEnum } from "@/components/common";
import {
  groupDetailGet,
  groupAddUser,
  groupAddRole,
  groupDeleteRole,
  groupDeleteUser,
  groupRoleGet,
  groupUserGet,
} from "@/actions/group";
import { roleListGet } from "@/actions/role";
import { userListGet } from "@/actions/user";
import "./detail.scss";
import moment from "moment";

const { Option } = Select;

const UserGroupDetail = (props) => {
  const [detail, setDetail] = useState({});

  useEffect(() => {
    const groupId = Number(props.router.query.groupId);
    if (groupId) {
      init();
    }
  }, [props.router.query]);

  const init = () => {
    const groupId = Number(props.router.query.groupId);
    getGroupDetail(groupId);
    getGroupUser(groupId);
    getGroupRole(groupId);
    getUserList();
    getRoleList();
  };

  const getGroupDetail = (groupId) => {
    groupDetailGet({ groupId }).then((res) => {
      const { id } = res;
      setDetail(res);
    });
  };

  /* ------ 用户 ------ */
  const userColumns = [
    {
      title: "id",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "用户名",
      key: "id",
      width: 80,
      render: (row) => row.user.name,
    },
    {
      title: "部门",
      key: "id",
      width: 80,
      render: (row) => row.user.departmentName,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "id",
      width: 120,
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "创建人",
      dataIndex: "creator",
      key: "id",
      width: 120,
    },
    {
      title: "修改时间",
      dataIndex: "updated",
      key: "id",
      width: 120,
      render: (updated) => moment(updated).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "修改人",
      dataIndex: "editor",
      key: "id",
      width: 120,
    },
    {
      title: "操作",
      key: "id",
      width: 120,
      render: (row) => (
        <Popconfirm
          title="确认删除"
          description={`你确认删除用户【${row.user.name}】么`}
          onConfirm={() => deleteUser(row.id)}
          okText="删除"
          cancelText="取消"
        >
          <Button size="small" danger primary="true">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const [userList, setUserList] = useState([]);
  const [savedUserMap, setSavedUserMap] = useState({});
  const [groupUserList, setGroupUserList] = useState([]);
  const [userSearchValue, setUserSearchValue] = useState("");
  const [userSelectedList, setUserSelectedList] = useState([]);

  // 获取选择列表数据
  const getUserList = () => {
    userListGet({}).then((res) => {
      // const list = res.list.map(({ id, name }) => ({ label: name, value: id }))
      setUserList(res.list);
    });
  };

  // 获取已选列表数据，已选列表map
  const getGroupUser = (groupId) => {
    groupUserGet({ groupId }).then((res) => {
      setGroupUserList(res.list);
      const map = {};
      res.list.forEach((groupRole) => {
        map[groupRole.user.id] = true;
      });
      setSavedUserMap(map);
    });
  };

  // select搜索
  const onUserSearch = (value) => {
    setUserSearchValue(value);
  };
  
  // select选中
  const onUserSelect = (e) => {
    setUserSelectedList(e);
  };
  
  const addUser = () => {
    groupAddUser({
      groupId: Number(props.router.query.groupId),
      userIds: userSelectedList,
    })
      .then((res) => {
        const { result } = res;
        if (result) {
          message.success("添加成功");
          init();
          setUserSelectedList([]);
        }
      })
      .catch((err) => {
        message.error("添加失败");
      });
  };

  const deleteUser = (groupUserId) => {
    groupDeleteUser({ groupUserId })
      .then((res) => {
        message.success("删除成功");
        init();
      })
      .catch((err) => {
        message.error("删除失败");
      });
  };

  const userTab = () => (
    <>
      <div className="content">
        <div className="content-title">添加用户</div>
        <div className="select-row">
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="请选择角色"
            style={{ width: "100%" }}
            optionFilterProp="children"
            value={userSelectedList}
            onSearch={onUserSearch}
            searchValue={userSearchValue}
            onChange={onUserSelect}
          >
            {userList
              .filter((item) => item.name.indexOf(userSearchValue) > -1)
              .map((item, idx) => (
                <Option
                  key={item.name}
                  value={item.id}
                  disabled={savedUserMap[item.id]}
                >
                  {item.name}
                </Option>
              ))}
          </Select>
          <Button
            disabled={userSelectedList.length === 0}
            type="primary"
            onClick={addUser}
          >
            确定
          </Button>
        </div>
      </div>
      <div className="table-box">
        <div className="table-box-title">用户列表</div>
        <Table
          className="table"
          size="small"
          columns={userColumns}
          dataSource={groupUserList}
          // scroll={{ x: 1600 }}
          rowKey={(record) => record.id}
          pagination={false}
        />
      </div>
    </>
  );

  /* ------ 角色 ------ */
  const roleColumns = [
    {
      title: "id",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "角色",
      key: "id",
      width: 80,
      render: (row) => row.role.name,
    },
    {
      title: "code",
      key: "id",
      width: 80,
      render: (row) => row.role.code,
    },
    {
      title: "介绍",
      key: "id",
      width: 80,
      render: (row) => row.role.intro,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "id",
      width: 120,
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "创建人",
      dataIndex: "creator",
      key: "id",
      width: 120,
    },
    {
      title: "修改时间",
      dataIndex: "updated",
      key: "id",
      width: 120,
      render: (updated) => moment(updated).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "修改人",
      dataIndex: "editor",
      key: "id",
      width: 120,
    },
    {
      title: "操作",
      key: "id",
      width: 120,
      render: (row) => (
        <Popconfirm
          title="确认删除"
          description={`你确认删除角色【${row.role.name}】么`}
          onConfirm={() => deleteRole(row.id)}
          okText="删除"
          cancelText="取消"
        >
          <Button size="small" danger primary="true">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const [roleList, setRoleList] = useState([]);
  const [savedRoleMap, setSavedRoleMap] = useState({});
  const [groupRoleList, setGroupRoleList] = useState([]);
  const [roleSearchValue, setRoleSearchValue] = useState("");
  const [roleSelectedList, setRoleSelectedList] = useState([]);

  const getRoleList = () => {
    roleListGet({}).then((res) => {
      setRoleList(res.list);
    });
  };

  const getGroupRole = (groupId) => {
    groupRoleGet({ groupId }).then((res) => {
      setGroupRoleList(res.list);
      const map = {};
      res.list.forEach((groupRole) => {
        map[groupRole.role.id] = true;
      });
      setSavedRoleMap(map);
    });
  };

  const onRoleSearch = (value) => {
    setRoleSearchValue(value);
  };
  
  const onRoleSelect = (e) => {
    setRoleSelectedList(e);
  };

  const addRole = () => {
    groupAddRole({
      groupId: Number(props.router.query.groupId),
      roleIds: roleSelectedList,
    })
      .then((res) => {
        const { result } = res;
        if (result) {
          message.success("添加成功");
          init();
          setRoleSelectedList([]);
        }
      })
      .catch((err) => {
        message.error("添加失败");
      });
  };

  const deleteRole = (groupRoleId) => {
    groupDeleteRole({ groupRoleId })
      .then((res) => {
        message.success("删除成功");
        init();
      })
      .catch((err) => {
        message.error("删除失败");
      });
  };

  const roleTab = () => (
    <>
      <div className="content">
        <div className="content-title">新增角色</div>
        <div className="select-row">
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="请选择角色"
            style={{ width: "100%" }}
            optionFilterProp="children"
            value={roleSelectedList}
            onSearch={onRoleSearch}
            searchValue={roleSearchValue}
            onChange={onRoleSelect}
          >
            {roleList
              .filter((item) => item.name.indexOf(roleSearchValue) > -1)
              .map((item, idx) => (
                <Option
                  key={item.name}
                  value={item.id}
                  disabled={savedRoleMap[item.id]}
                >
                  {item.name}
                </Option>
              ))}
          </Select>
          <Button
            disabled={roleSelectedList.length === 0}
            type="primary"
            onClick={addRole}
          >
            确定
          </Button>
        </div>
      </div>
      <div className="table-box">
        <div className="table-box-title">角色列表</div>
        <Table
          className="table"
          size="small"
          columns={roleColumns}
          dataSource={groupRoleList}
          // scroll={{ x: 1600 }}
          rowKey={(record) => record.id}
          pagination={false}
        />
      </div>
    </>
  );

  const tabItems = [
    {
      key: "1",
      label: "用户",
      children: userTab(),
    },
    {
      key: "2",
      label: "角色",
      children: roleTab(),
    },
  ];

  return (
    <CommonLayout
      className="group-detail"
      title="分组详情"
      siderKey={pathEnum.UserGroupList.key}
    >
      <div className="group-detail-header">
        <Space size="large">
          <span>{detail.name}</span> -<span>{detail.code}</span> -
          <span className="intro">{detail.intro}</span>
        </Space>
      </div>
      <Tabs defaultActiveKey="1" items={tabItems}></Tabs>
    </CommonLayout>
  );
};

export default withRouter(UserGroupDetail);
