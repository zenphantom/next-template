import { useEffect, useState } from "react";
import { withRouter } from "next/router";
import { Button, message, Popconfirm, Select, Space, Table } from "antd";
import { CommonLayout, pathEnum } from "@/components/common";
import {
  roleDetailGet,
  roleAddPermission,
  roleDeletePermission,
  rolePermissionGet,
} from "@/actions/role";
import {
  permissionCreate,
  permissionListGet,
  permissionUpdate,
  permissionDelete,
} from "@/actions/permission";
import "./detail.scss";
import moment from "moment";

const { Option } = Select;

const RoleDetail = (props) => {
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
      render: (row) => row.permission.name,
    },
    {
      title: "code",
      key: "id",
      width: 80,
      render: (row) => row.permission.code,
    },
    {
      title: "介绍",
      key: "id",
      width: 80,
      render: (row) => row.permission.intro,
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
          description={`你确认删除权限点【${row.permission.name}】么`}
          onConfirm={() => deletePermission(row.id)}
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
  const [permissionList, setPermissionList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [selectSearchValue, setSelectSearchValue] = useState("");
  const [rolePermissionList, setRolePerMissionList] = useState([]);
  const [savedMap, setSavedMap] = useState({});

  useEffect(() => {
    const roleId = Number(props.router.query.roleId);
    if (roleId) {
      init();
    }
  }, [props.router.query]);

  const init = () => {
    const roleId = Number(props.router.query.roleId);
    getUserDetail(roleId);
    getRolePermission(roleId);
    getPermissionList();
  };

  const getUserDetail = (roleId) => {
    roleDetailGet({ roleId }).then((res) => {
      const { id } = res;
      setDetail(res);
    });
  };

  const getPermissionList = () => {
    permissionListGet({}).then((res) => {
      // const list = res.list.map(({ id, name }) => ({ label: name, value: id }))
      setPermissionList(res.list);
    });
  };

  const getRolePermission = (roleId) => {
    rolePermissionGet({ roleId }).then((res) => {
      setRolePerMissionList(res.list);
      const map = {};
      res.list.forEach((rolePermission) => {
        map[rolePermission.permission.id] = true;
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

  const addPermission = () => {
    roleAddPermission({
      roleId: Number(props.router.query.roleId),
      permissionIds: selectedList,
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

  const deletePermission = (rolePermissionId) => {
    roleDeletePermission({ rolePermissionId })
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
      className="role-detail"
      title="角色详情"
      siderKey={pathEnum.RoleList.key}
    >
      <div className="role-detail-header">
        <Space size='large'>
          <span>{detail.name}</span> -
          <span>{detail.code}</span> -
          <span className='intro'>{detail.intro}</span>
        </Space>
      </div>
      <div className="content">
        <div className="content-title">新增权限点</div>
        <div className="select-row">
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="请选择权限点"
            style={{ width: "100%" }}
            optionFilterProp="children"
            value={selectedList}
            onSearch={onSelectSearch}
            searchValue={selectSearchValue}
            onChange={onSelect}
          >
            {permissionList
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
            onClick={addPermission}
          >
            确定
          </Button>
        </div>
      </div>
      <div className="table-box">
        <div className="table-box-title">已选权限点</div>
        <Table
          className="table"
          size="small"
          columns={columns}
          dataSource={rolePermissionList}
          // scroll={{ x: 1600 }}
          rowKey={(record) => record.id}
          pagination={false}
        />
      </div>
    </CommonLayout>
  );
};

export default withRouter(RoleDetail);
