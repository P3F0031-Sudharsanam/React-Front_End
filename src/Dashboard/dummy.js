import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col } from "antd";
import { CSVLink } from "react-csv";
import axios from "axios";

const fetchData = async () => {
  try {
    const initialResponse = await axios.get(
      "http://localhost:8080/api/users/limit?page=1&limit=5"
    );
    const initialData = initialResponse.data;
    const totalPages = initialData.totalPages;

    // Iterate over each page and fetch data
    const allData = [];
    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(
        `http://localhost:8080/api/users/limit?page=${page}&limit=5`
      );
      const responseData = response.data;
      if (!Array.isArray(responseData.users)) {
        console.error("Users array not found in API response:", responseData);
        return;
      }
      const transformedData = responseData.users.map((item) => ({
        ID: item.id,
        Name: item.name,
        Description: item.description,
      }));
      allData.push(...transformedData);
    }
    return allData;
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
      const data = await fetchData();
      setUserData(data);
      setLoading(false);
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
          <Button style={{ float: "right" }} type="primary">
            <CSVLink data={userData} filename={"user_data.csv"}>
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
