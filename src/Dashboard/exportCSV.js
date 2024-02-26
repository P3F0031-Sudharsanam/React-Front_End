import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col } from "antd";
import { CSVLink } from "react-csv";
import axios from "axios";

const fetchData = async (page) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/users/limit?page=${page}&limit=5`
    );
    const responseData = response.data;
    if (!Array.isArray(responseData.users)) {
      throw new Error("Users array not found in API response");
    }
    return responseData.users.map((item) => ({
      ID: item.id,
      Name: item.name,
      Description: item.description,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const ExportCSV = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      setLoading(true);
      try {
        const initialResponse = await axios.get(
          "http://localhost:8080/api/users/limit?page=1&limit=5"
        );
        const initialData = initialResponse.data;
        const totalPages = initialData.totalPages;

        const requests = [];
        for (let page = 1; page <= totalPages; page++) {
          requests.push(fetchData(page));
        }

        const userDataPages = await Promise.all(requests);
        const allData = userDataPages.flat();
        setUserData(allData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndUpdateState();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "ID", key: "ID" },
    { title: "Name", dataIndex: "Name", key: "Name" },
    { title: "Description", dataIndex: "Description", key: "Description" },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <h2 style={{ color: "#5d748a" }}>Export CSV</h2>
          <Button style={{ float: "right" }} type="primary" disabled={loading}>
            <CSVLink
              data={userData}
              filename={`user_data_${new Date().toISOString()}.csv`}
              target="_blank"
            >
              Export CSV
            </CSVLink>
          </Button>
          <Table dataSource={userData} columns={columns} loading={loading} />
        </Card>
      </Col>
    </Row>
  );
};

export default ExportCSV;
