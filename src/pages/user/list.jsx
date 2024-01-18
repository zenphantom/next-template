import { useState, useEffect } from "react";
import moment from "moment";
import {Form, Button, Table, Tag, Space, message, InputNumber, Row, Col, Input} from "antd";
import { CommonLayout, pathEnum } from "@/components/common";
import { userListGet, userStateUpdate } from "@/actions/user";
import "./list.scss";
import Link from "next/link";

const userStateMap = {
  1: <Tag color="green">正常</Tag>,
  2: <Tag color="red">封号</Tag>,
};

const formList = [
  {
    label: "用户id",
    key: "userId",
    jsx: <InputNumber placeholder="请输入用户id" style={{ width: "100%" }} />,
  },
  
  {
    label: "用户名",
    key: "userName",
    jsx: <Input placeholder="请输入用户名" style={{ width: "100%" }} allowClear />,
  },
  {
    label: "部门",
    key: "departmentName",
    jsx: <Input placeholder="请输入部门名" style={{ width: "100%" }} allowClear />,
  },
  
  {
    label: "邮箱",
    key: "email",
    jsx: <Input placeholder="请输入邮箱" style={{ width: "100%" }} allowClear />,
  },
  
  {
    span: 24,
    jsx: (
      <Button className='form-button' type="primary" htmlType="submit">
        查询
      </Button>
    ),
  },
];


const UserList = (props) => {
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "用户名",
      key: 'id',
      width: 100,
      render: (row) => <Link href={`/user/detail?userId=${row.id}`}>{row.name}</Link>
    },
    {
      title: "部门",
      dataIndex: "departmentName",
      width: 180,
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "用户组",
      dataIndex: "_count",
      key: 'id',
      render: (count) => count.userGroupUser
    },
    {
      title: "角色",
      dataIndex: "_count",
      key: 'id',
      render: (count) => count.userRole
    },
    {
      title: "账户状态",
      dataIndex: "state",
      width: 80,
      render: (state) => userStateMap[state],
    },
    {
      title: "首次登录时间",
      dataIndex: "createdAt",
      width: 100,
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "上次登录时间",
      dataIndex: "updatedAt",
      width: 100,
      render: (updatedAt) => moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "id",
      width: 60,
      render: (row) => (
        <Space>
          <Button
            type="primary"
            size="small"
            disabled={row.state === 2}
            danger
            onClick={() => userStateHandle(row.id, 2)}
          >
            禁用
          </Button>
          <Button
            type="primary"
            size="small"
            disabled={row.state === 1}
            onClick={() => userStateHandle(row.id, 1)}
          >
            解封
          </Button>
        </Space>
      ),
    },
  ];
  
  const [userForm] = Form.useForm();
  
  const [page, setPage] = useState({
    pageSize: 10,
    current: 1,
    total: 1,
  });
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getUserList();
  }, []);

  const onSearch = () => {
    getUserList({...page, pageIndex: 1});
  };

  const getUserList = (p = {}) => {
    const formParam = userForm.getFieldsValue()
    
    userListGet({...formParam, ...page, ...p}).then((res) => {
      const { list, total, pageSize, pageIndex } = res;
      setUserList(list);
      setPage({ total, pageSize, pageIndex });
    });
  };

  // 更改账号状态
  const userStateHandle = (userId, state) => {
    userStateUpdate({ userId, state }).then((res) => {
      message.success("修改成功");
      getUserList();
    });
  };

  return (
    <CommonLayout
      className="user-list"
      title="用户列表"
      siderKey={pathEnum.UserList.key}
      openKeys={['/permission/config']}
    >
      <Form className="filter-box" form={userForm} onFinish={onSearch}>
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
        dataSource={userList}
        // scroll={{ x: 1600 }}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: page.pageSize,
          current: page.pageIndex,
          total: page.total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (pageIndex, pageSize) => {
            getUserList({ pageIndex, pageSize });
          },
        }}
      />
    </CommonLayout>
  );
};

export default UserList;
