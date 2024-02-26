import React, { useState, useEffect } from "react";
import { Table, Card, Col, Row } from "antd";
import axios from "axios";

const PaginationPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords(1);
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const fetchRecords = (page) => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/users/limit?page=${page}&limit=5`)
      .then((response) => {
        setDataSource(response.data.users);
        setTotalPages(response.data.total);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card>
          <h2 style={{ color: "#5d748a" }}>Pagination API</h2>
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              pageSize: 5,
              total: totalPages,
              onChange: (page) => {
                fetchRecords(page);
              },
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default PaginationPage;
