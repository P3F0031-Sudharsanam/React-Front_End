import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Form,
  Input,
  Button,
  Drawer,
  message,
  Col,
  Row,
} from "antd";
import { filterValuesStr, compareCaseIds } from "../util";
import {
  getAllRecords,
  insertRecord,
  updateRecord,
  deleteRecordByKey,
} from "../api/users";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    getUsers();
  }, [pagination]);

  const getUsers = async () => {
    const { current, pageSize } = pagination;
    const offset = (current - 1) * pageSize;
    const response = await getAllRecords({ offset, limit: pageSize });
    const reversedUsers = response.data.reverse();
    setUsers(response.data);
  };

  const handleUsersAdd = async () => {
    try {
      await insertRecord(formData);
      getUsers();
      setIsDrawerVisible(false);
      setFormData({});
      setImagePreview(null);
      message.success("User added successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to add user!");
    }
  };

  const handleUsersEdit = async () => {
    try {
      await updateRecord(formData.id, formData);
      getUsers();
      setIsDrawerVisible(false);
      setFormData({});
      message.success("User updated successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to update user!");
    }
  };

  const handleCancel = () => {
    setIsDrawerVisible(false);
    setFormData({});
    setImagePreview(null);
  };

  const handleEdit = (record) => {
    setFormData(record);
    setIsDrawerVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await deleteRecordByKey(record.id);
      getUsers();
      message.success("User deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete user!");
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: compareCaseIds("id"),
      filters: filterValuesStr(users, "id"),
      onFilter: (value, record) => record.id.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: filterValuesStr(users, "name"),
      onFilter: (value, record) => record.name.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
      filters: filterValuesStr(users, "description"),
      onFilter: (value, record) => record.description.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <a onClick={() => handleEdit(record)}>Edit</a> |{" "}
          <a onClick={() => handleDelete(record)}>Delete</a>
        </span>
      ),
    },
  ];

  return (
    <section className="process-flows">
      <Card className="card">
        <Row>
          <Col>
            <h2 style={{color: "#5d748a"}}>User Management</h2>
          </Col>
        </Row>
        <Row style={{ float: "right" }}>
          <Col span={24}>
            <Button type="primary" onClick={() => setIsDrawerVisible(true)}>
              Add User
            </Button>
          </Col>
        </Row>
        <Table
          dataSource={users}
          columns={columns}
          pagination={pagination}
          onChange={handleTableChange}
        />
        <Drawer
          title="Add/Edit User"
          open={isDrawerVisible}
          onClose={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={formData.id ? handleUsersEdit : handleUsersAdd}
            >
              {formData.id ? "Update" : "Add"}
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        </Drawer>
      </Card>
    </section>
  );
};

export default UsersPage;
