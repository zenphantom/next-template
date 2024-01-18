import { useEffect, useState } from "react";
import { withRouter } from "next/router";
import { Button, message, Popconfirm, Select, Space, Table } from "antd";
import { CommonLayout, pathEnum } from "@/components/common";
import {
  userDetailGet,
  userAddRole,
  userDeleteRole,
  userRoleGet,
} from "@/actions/user";
import {
  roleCreate,
  roleListGet,
  roleUpdate,
  roleDelete,
} from "@/actions/role";
import "./detail.scss";
import moment from "moment";

const { Option } = Select;

const UserDetail = (props) => {
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "权限名",
      key: "id",
      width: 80,
      render: (row) => row.role?.name,
    },
    {
      title: "code",
      key: "id",
      width: 80,
      render: (row) => row.role?.code,
    },
    {
      title: "介绍",
      key: "id",
      width: 80,
      render: (row) => row.role?.intro,
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
          description={`你确认删除角色【${row.role?.name}】么`}
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

  const [detail, setDetail] = useState({});
  const [roleList, setRoleList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [selectSearchValue, setSelectSearchValue] = useState("");
  const [userRoleList, setUserPerMissionList] = useState([]);
  const [savedMap, setSavedMap] = useState({});

  useEffect(() => {
    const userId = Number(props.router.query.userId);
    if (userId) {
      init();
    }
  }, [props.router.query]);

  const init = () => {
    const userId = Number(props.router.query.userId);
    getUserDetail(userId);
    getUserRole(userId);
    getRoleList();
  };

  const getUserDetail = (userId) => {
    userDetailGet({ userId }).then((res) => {
      const { id } = res;
      setDetail(res);
    });
  };

  const getRoleList = () => {
    roleListGet({}).then((res) => {
      setRoleList(res.list);
    });
  };

  const getUserRole = (userId) => {
    userRoleGet({ userId }).then((res) => {
      setUserPerMissionList(res.list);
      const map = {};
      res.list.forEach((userRole) => {
        map[userRole.role?.id] = true;
      });
      setSavedMap(map);
    });
  };

  const onSelectSearch = (value) => {
    setSelectSearchValue(value);
  };

  const onSelect = (e) => {
    setSelectedList(e);
  };

  const addRole = () => {
    userAddRole({
      userId: Number(props.router.query.userId),
      roleIds: selectedList,
    })
      .then((res) => {
        const { result } = res;
        if (result) {
          message.success("添加成功");
          init();
        }
      })
      .catch((err) => {
        message.error("添加失败");
      });
  };

  const deleteRole = (userRoleId) => {
    userDeleteRole({ userRoleId })
      .then((res) => {
        message.success("删除成功");
        init();
      })
      .catch((err) => {
        message.error("删除失败");
      });
  };

  return (
    <CommonLayout
      className="user-detail"
      title="角色详情"
      siderKey={pathEnum.UserList.key}
    >
      <div className="user-detail-header">
        <Space size='large'>
          <span>{detail.name}</span> -
          <span>{detail.departmentName}</span>
        </Space>
      </div>
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
            value={selectedList}
            onSearch={onSelectSearch}
            searchValue={selectSearchValue}
            onChange={onSelect}
          >
            {roleList
              .filter((item) => item.name.indexOf(selectSearchValue) > -1)
              .map((item, idx) => (
                <Option
                  key={item.name}
                  value={item.id}
                  disabled={savedMap[item.id]}
                >
                  {item.name}
                </Option>
              ))}
          </Select>
          <Button
            disabled={selectedList.length === 0}
            type="primary"
            onClick={addRole}
          >
            确定
          </Button>
        </div>
      </div>
      <div className="table-box">
        <div className="table-box-title">已选角色</div>
        <Table
          className="table"
          size="small"
          columns={columns}
          dataSource={userRoleList}
          // scroll={{ x: 1600 }}
          rowKey={(record) => record.id}
          pagination={false}
        />
      </div>
    </CommonLayout>
  );
};

export default withRouter(UserDetail);
