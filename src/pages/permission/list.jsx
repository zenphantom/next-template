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
} from "antd";
import {
  permissionCreate,
  permissionListGet,
  permissionUpdate,
  permissionDelete,
} from "@/actions/permission";
import "./list.scss";
import { useEffect, useState } from "react";
import moment from "moment/moment";

const PermissionList = (props) => {
  const formList = [
    {
      label: "权限id",
      key: "permissionId",
      jsx: <InputNumber placeholder="请输入用户id" style={{ width: "100%" }} />,
    },

    {
      label: "权限名",
      key: "permissionName",
      jsx: (
        <Input
          placeholder="请输入权限名"
          style={{ width: "100%" }}
          allowClear
        />
      ),
    },
    {
      label: "code",
      key: "permissionCode",
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
          <Button onClick={addPermission}>新增</Button>
          <Button className="form-button" type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      ),
    },
  ];

  const editEle = (key, row) =>
    edit && editData.id === row.id ? (
      <Input
        value={editData[key]}
        onChange={(e) =>
          setEditData((data) => ({ ...data, [key]: e.target.value }))
        }
      />
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
      title: "权限名",
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
      title: "角色",
      key: "id",
      dataIndex: "_count",
      render: (count) => count.rolePermission || 0,
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
            <Button size="small" primary onClick={() => editPermission()}>
              保存
            </Button>
            <Button size="small" primary onClick={() => editCancel()}>
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
              description={`你确认删除权限点【${row?.name}】么`}
              onConfirm={() => deletePermission(row.id)}
              okText="删除"
              cancelText="取消"
            >
              <Button
                size="small"
                danger
                disabled={row._count.rolePermission > 0}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const [permissionForm] = Form.useForm();
  const [page, setPage] = useState({
    pageSize: 10,
    current: 1,
    total: 1,
  });
  const [permissionList, setPermissionList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    getPermissionList();
  }, []);

  const onSearch = () => {
    getPermissionList({ pageIndex: 1 });
  };

  const [newPermissionForm] = Form.useForm();
  const newPermissionFormList = [
    {
      label: "权限名",
      key: "name",
      jsx: <Input placeholder="请输入权限名" />,
      rules: [{ required: true, message: "请输入权限名" }],
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
      ],
    },
    {
      label: "介绍",
      key: "intro",
      jsx: <Input placeholder="请输权限介绍" />,
      rules: [{ required: true, message: "请输入介绍" }],
    },
  ];

  // 新建权限
  function addPermission() {
    Modal.confirm({
      title: "新建权限",
      content: (
        <Form form={newPermissionForm}>
          {newPermissionFormList.map((item, idx) => (
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
        await newPermissionForm.validateFields();
        const params = newPermissionForm.getFieldsValue();
        permissionCreate(params)
          .then((res) => {
            const { result, msg } = res;
            if (result === true) {
              message.success("创建成功");
              newPermissionForm.resetFields();
              getPermissionList({ pageIndex: 1 });
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
        newPermissionForm.resetFields();
      },
    });
  }

  const getPermissionList = (p = {}) => {
    const formParams = permissionForm.getFieldsValue();
    permissionListGet({ ...formParams, ...page, ...p }).then((res) => {
      const { list, total, pageSize, pageIndex } = res;
      setPermissionList(list);
      setPage({ total, pageSize, pageIndex });
    });
  };

  const editHandle = (row) => {
    const { id, name, code, intro } = row;
    setEdit(true);
    setEditData({ id, name, code, intro });
  };

  const deletePermission = (permissionId) => {
    permissionDelete({ permissionId })
      .then((res) => {
        message.success("删除成功");
        getPermissionList();
      })
      .catch((err) => {
        message.error("删除失败");
      });
  };

  const editPermission = () => {
    const { id, name, code, intro } = editData;
    permissionUpdate({ id, name, code, intro }).then((res) => {
      const { result, msg } = res;
      if (result === true) {
        message.success("修改成功");
        setEdit(false);
        getPermissionList();
      } else {
        message.error(msg);
      }
    });
  };

  const editCancel = () => {
    setEdit(false);
    setEditData({});
  };

  return (
    <CommonLayout
      className="permission-list"
      title="权限"
      siderKey={pathEnum.PermissionList.key}
      openKeys={['/permission/config']}
    >
      <Form className="filter-box" form={permissionForm} onFinish={onSearch}>
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
        dataSource={permissionList}
        // scroll={{ x: 1600 }}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: page.pageSize,
          current: page.pageIndex,
          total: page.total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (pageIndex, pageSize) => {
            getPermissionList({ pageIndex, pageSize });
          },
        }}
      />
    </CommonLayout>
  );
};

export default PermissionList;
