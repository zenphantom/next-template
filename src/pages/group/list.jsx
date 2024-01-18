import { useRouter } from "next/router";
import { CommonLayout, pathEnum } from "@/components/common";
import { Button, Col, Form, Input, InputNumber, message, Modal, Popconfirm, Row, Space, Table } from "antd";
import { groupCreate, groupListGet, groupUpdate, groupDelete } from "@/actions/group";
import "./list.scss";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import Link from "next/link";

const UserGroupList = (props) => {
  const formList = [
    {
      label: "用户组id",
      key: "groupId",
      jsx: <InputNumber placeholder="请输入用户id" style={{ width: "100%" }} />,
    },

    {
      label: "角色组名称",
      key: "groupName",
      jsx: <Input placeholder="请输入角色组" style={{ width: "100%" }} allowClear />,
    },
    {
      label: "code",
      key: "groupCode",
      jsx: <Input placeholder="请输入code" style={{ width: "100%" }} allowClear />,
    },

    {
      label: "修改人",
      key: "editor",
      jsx: <Input placeholder="请输入修改人" style={{ width: "100%" }} allowClear />,
    },

    {
      span: 24,
      jsx: (
        <Space className="btn-box">
          <Button onClick={addGroup}>新增</Button>
          <Button className="form-button" type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      ),
    },
  ];

  const editEle = (key, row, link) =>
    edit && editData.id === row.id ? (
      <Input value={editData[key]} onChange={(e) => setEditData((data) => ({ ...data, [key]: e.target.value }))} />
    ) : link ? (
      <Link href={`/group/detail?groupId=${row.id}`}>{row[key]}</Link>
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
      title: "用户组",
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
      title: "用户数量",
      dataIndex: "_count",
      key: "id",
      width: 80,
      render: (count) => count.userGroupUser || 0,
    },
    {
      title: "角色数量",
      dataIndex: "_count",
      key: "id",
      width: 80,
      render: (count) => count.userGroupRole || 0,
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
            <Button size="small" primary onClick={() => editGroup()}>
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
              description={`你确认删除用户组【${row.name}】么`}
              onConfirm={() => deleteGroup(row.id)}
              okText="删除"
              cancelText="取消"
            >
              <Button size="small" danger disabled={row._count.userGroupRole > 0 || row._count.userGroupUser > 0}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const router = useRouter();
  const [groupForm] = Form.useForm();
  const [page, setPage] = useState({
    pageSize: 10,
    current: 1,
    total: 1,
  });
  const [groupList, setGroupList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    getGroupList();
  }, []);

  const onSearch = () => {
    getGroupList({ pageIndex: 1 });
  };

  const [newGroupForm] = Form.useForm();
  const newGroupFormList = [
    {
      label: "角色组",
      key: "name",
      jsx: <Input placeholder="请输入角色组" />,
      rules: [{ required: true, message: "请输入角色组名字" }],
    },
    {
      label: "code",
      key: "code",
      jsx: <Input placeholder="请输入code,格式aaa_bbb" />,
      // 下划线命名校验
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
      jsx: <Input placeholder="请输角色介绍" />,
      rules: [{ required: true, message: "请输入介绍" }],
    },
  ];

  // 新建角色组
  function addGroup() {
    Modal.confirm({
      title: "新建角色组",
      content: (
        <Form form={newGroupForm}>
          {newGroupFormList.map((item, idx) => (
            <Form.Item key={idx} label={item.label} name={item.key} rules={item.rules}>
              {item.jsx}
            </Form.Item>
          ))}
        </Form>
      ),
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        await newGroupForm.validateFields();
        const params = newGroupForm.getFieldsValue();
        groupCreate(params)
          .then((res) => {
            const { result, msg } = res;
            if (result === true) {
              message.success("创建成功");
              newGroupForm.resetFields();
              getGroupList({ pageIndex: 1 });
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
        newGroupForm.resetFields();
      },
    });
  }

  const getGroupList = (p = {}) => {
    const formParams = groupForm.getFieldsValue();
    groupListGet({ ...formParams, ...page, ...p }).then((res) => {
      const { list, total, pageSize, pageIndex } = res;
      setGroupList(list);
      setPage({ total, pageSize, pageIndex });
    });
  };

  const editHandle = (row) => {
    const { id, name, code, intro } = row;
    setEdit(true);
    setEditData({ id, name, code, intro });
  };

  const editGroup = () => {
    const { id, name, code, intro } = editData;
    groupUpdate({ id, name, code, intro }).then((res) => {
      const { result, msg } = res;
      if (result === true) {
        message.success("修改成功");
        setEdit(false);
        getGroupList();
      } else {
        message.error(msg);
      }
    });
  };

  const editCancel = () => {
    setEdit(false);
    setEditData({});
  };

  const deleteGroup = (groupId) => {
    groupDelete({ groupId })
      .then((res) => {
        message.success("删除成功");
        getGroupList({ pageIndex: 1 });
      })
      .catch((err) => {
        message.error("删除失败");
      });
  };

  return (
    <CommonLayout
      className="group-list"
      title="用户组"
      siderKey={pathEnum.UserGroupList.key}
      openKeys={["/permission/config"]}
    >
      <Form className="filter-box" form={groupForm} onFinish={onSearch}>
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
        dataSource={groupList}
        // scroll={{ x: 1600 }}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: page.pageSize,
          current: page.pageIndex,
          total: page.total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (pageIndex, pageSize) => {
            getGroupList({ pageIndex, pageSize });
          },
        }}
      />
    </CommonLayout>
  );
};

export default UserGroupList;
