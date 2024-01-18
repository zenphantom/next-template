import { useRouter } from "next/router";
import { CommonLayout, pathEnum } from "@/components/common";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import {
  roleCreate,
  roleListGet,
  roleUpdate,
  roleDelete,
} from "@/actions/role";
import "./list.scss";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import Link from "next/link";

const RoleList = (props) => {
  const formList = [
    {
      label: "角色id",
      key: "roleId",
      jsx: <InputNumber placeholder="请输入用户id" style={{ width: "100%" }} />,
    },

    {
      label: "角色名",
      key: "roleName",
      jsx: (
        <Input
          placeholder="请输入角色名"
          style={{ width: "100%" }}
          allowClear
        />
      ),
    },
    {
      label: "code",
      key: "roleCode",
      jsx: (
        <Input placeholder="请输入code" style={{ width: "100%" }} allowClear />
      ),
    },

    {
      label: "修改人",
      key: "editor",
      jsx: (
        <Input
          placeholder="请输入修改人"
          style={{ width: "100%" }}
          allowClear
        />
      ),
    },

    {
      span: 24,
      jsx: (
        <Space className="btn-box">
          <Button onClick={addRole}>新增</Button>
          <Button className="form-button" type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      ),
    },
  ];

  const editEle = (key, row, link) =>
    edit && editData.id === row.id ? (
      <Input
        value={editData[key]}
        onChange={(e) =>
          setEditData((data) => ({ ...data, [key]: e.target.value }))
        }
      />
    ) : link ? (
      <Link href={`/role/detail?roleId=${row.id}`}>{row[key]}</Link>
    ) : (
      row[key]
    );

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "角色名",
      key: "id",
      width: 160,
      render: (row) => editEle("name", row, true),
    },
    {
      title: "code",
      key: "code",
      width: 160,
      render: (row) => editEle("code", row),
    },
    {
      title: "介绍",
      key: "intro",
      render: (row) => editEle("intro", row),
    },
    {
      title: "用户",
      key: "id",
      dataIndex: "_count",
      width: 60,
      render: (count) => count?.userRole,
    },
    {
      title: "用户组",
      key: "id",
      dataIndex: "_count",
      width: 60,
      render: (count) => count.userGroupRole,
    },
    {
      title: "权限点",
      key: "id",
      dataIndex: "_count",
      width: 60,
      render: (count) => count.rolePermission,
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
      render: (row) =>
        edit && editData.id === row.id ? (
          <Space>
            <Button size="small" type="primary" onClick={() => editRole()}>
              保存
            </Button>
            <Button size="small" onClick={() => editCancel()}>
              取消
            </Button>
          </Space>
        ) : (
          <Space>
            <Button size="small" type="primary" onClick={() => editHandle(row)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除"
              description={`你确认删除角色【${row.name}】么`}
              onConfirm={() => deleteRole(row.id)}
              okText="删除"
              cancelText="取消"
            >
              <Button
                size="small"
                danger
                disabled={
                  row._count.userRole > 0 || row._count.userGroupRole > 0 || row._count.rolePermission > 0
                }
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const [roleForm] = Form.useForm();
  const router = useRouter();
  const [page, setPage] = useState({
    pageSize: 10,
    current: 1,
    total: 1,
  });
  const [roleList, setRoleList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    getRoleList();
  }, []);

  const onSearch = () => {
    getRoleList({ pageIndex: 1 });
  };

  const [newRoleForm] = Form.useForm();
  const newRoleFormList = [
    {
      label: "角色名",
      key: "name",
      jsx: <Input placeholder="请输入角色名" />,
      rules: [{ required: true, message: "请输入角色名" }],
    },
    {
      label: "code",
      key: "code",
      jsx: <Input placeholder="请输入code,格式aaa_bbb" />,
      rules: [
        {
          pattern: /^[a-z]+(_[a-z]+)+$/,
          message: "请输入code,格式aaa_bbb",
        },
      ]
    },
    {
      label: "介绍",
      key: "intro",
      jsx: <Input placeholder="请输角色介绍" />,
      rules: [{ required: true, message: "请输入介绍" }],
    },
  ];

  // 新建角色
  function addRole() {
    Modal.confirm({
      title: "新建角色",
      content: (
        <Form form={newRoleForm}>
          {newRoleFormList.map((item, idx) => (
            <Form.Item
              key={idx}
              label={item.label}
              name={item.key}
              rules={item.rules}
            >
              {item.jsx}
            </Form.Item>
          ))}
        </Form>
      ),
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        await newRoleForm.validateFields();
        const params = newRoleForm.getFieldsValue();
        roleCreate(params)
          .then((res) => {
            const { result, msg } = res;
            if (result === true) {
              message.success("创建成功");
              newRoleForm.resetFields();
              getRoleList({ pageIndex: 1 });
            } else {
              message.error(msg);
              Promise.reject();
            }
          })
          .catch((err) => {
            Promise.reject();
          });
      },
      onCancel: () => {
        newRoleForm.resetFields();
      },
    });
  }

  const getRoleList = (p = {}) => {
    const formParams = roleForm.getFieldsValue();
    roleListGet({ ...formParams, ...page, ...p }).then((res) => {
      const { list, total, pageSize, pageIndex } = res;
      setRoleList(list);
      setPage({ total, pageSize, pageIndex });
    });
  };

  // 打开列表编辑
  const editHandle = (row) => {
    const { id, name, code, intro } = row;
    setEdit(true);
    setEditData({ id, name, code, intro });
  };

  const deleteRole = (roleId) => {
    roleDelete({ roleId })
      .then((res) => {
        message.success("删除成功");
        getRoleList();
      })
      .catch((err) => {
        message.error("删除失败");
      });
  };

  const editRole = () => {
    const { id, name, code, intro } = editData;
    roleUpdate({ id, name, code, intro }).then((res) => {
      const { result, msg } = res;
      if (result === true) {
        message.success("修改成功");
        setEdit(false);
        getRoleList();
      } else {
        message.error(msg);
      }
    });
  };

  // 取消编辑
  const editCancel = () => {
    setEdit(false);
    setEditData({});
  };

  const toDetail = (row) => {
    const { id: roleId } = row;
    router.push({
      pathname: pathEnum.RoleDetail.key,
      query: {
        roleId,
      },
    });
  };

  return (
    <CommonLayout
      className="role-list"
      title="角色列表"
      siderKey={pathEnum.RoleList.key}
      openKeys={['/permission/config']}
    >
      <Form className="filter-box" form={roleForm} onFinish={onSearch}>
        <Row justify="space-between" wrap={true} gutter={[10, 10]}>
          {formList.map((item, idx) => {
            const { label, key, span, jsx } = item;
            return (
              <Col key={idx} span={span || 6}>
                <Form.Item name={key} label={label} labelCol={{ span: 6 }}>
                  {jsx}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>

      <Table
        className="table"
        size="small"
        columns={columns}
        dataSource={roleList}
        // scroll={{ x: 1600 }}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: page.pageSize,
          current: page.pageIndex,
          total: page.total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (pageIndex, pageSize) => {
            getRoleList({ pageIndex, pageSize });
          },
        }}
      />
    </CommonLayout>
  );
};

export default RoleList;
