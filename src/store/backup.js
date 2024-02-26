
import { useEffect, useState } from "react";
import { Table, Input, Button, Row, Col, Modal } from "antd";
import Axios from "axios";
import { getAllRecords, deleteRecordByKey } from "../../api/process-flow";


const App = () => {
  const [users, setUsers] = useState([]);
  const [addUserName, setAddUserName] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalName, setEditModalName] = useState("");
  const [processFlows, setProcessFlows] = useState([]);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    Axios.get("http://localhost:8080/api/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAddUser = () => {
    Axios.post("http://localhost:8080/api/users", {
      name: addUserName,
    })
      .then(() => {
        fetchUsers();
        setAddUserName("");
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditModalName(user.name);
    setEditModalVisible(true);
  };

  const handleEditModalOk = () => {
    Axios.put(`http://localhost:8080/api/users/${editUserId}`, {
      name: editModalName,
    })
      .then(() => {
        fetchUsers();
        setEditUserId(null);
        setEditModalVisible(false);
      })
      .catch((error) => {
        console.error("Error editing user:", error);
      });
  };

  const handleDeleteUser = (userId) => {
    Axios.delete(`http://localhost:8080/api/users/${userId}`)
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button onClick={() => handleEditUser(record)}>Edit</Button>
          <span> </span>
          <Button onClick={() => handleDeleteUser(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <Row justify="space-around" align="top" style={{ marginTop: "25px" }}>
      <Col span={12}>
        <Row gutter={[32, 32]}>
          <Col span={18}>
            <Input
              id="usernameInput"
              name="username"
              placeholder="Enter Name"
              value={addUserName}
              onChange={(e) => setAddUserName(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={handleAddUser}>
              Add New User
            </Button>
          </Col>
        </Row>
        <h4>Users List</h4>
        <Table dataSource={users} columns={columns} rowKey="id" />
      </Col>
      <Modal
        title="Edit User"
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => setEditModalVisible(false)}
      >
        <Input
          value={editModalName}
          onChange={(e) => setEditModalName(e.target.value)}
        />
      </Modal>
    </Row>
  );
};

export default App;
