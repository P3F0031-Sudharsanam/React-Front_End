import React, { useState, useEffect } from "react";
import { Table, Row, Col, Card } from "antd";
import { getLimitedRecords } from "./api/users";
import { filterValuesStr, compareCaseIds } from "./util";

const ApipaginationPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });

  useEffect(() => {
    fetchRecords();
  }, [pagination]);

  const fetchRecords = async () => {
    try {
      const { users, total, currentPage, totalPages } = await getLimitedRecords(
        pagination.page,
        pagination.limit
      );
      setDataSource(users);
      setPagination({ ...pagination, total, currentPage, totalPages });
    } catch (error) {
      console.error("Error fetching records:", error.message);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: compareCaseIds("id"),
      filters: dataSource.length > 0 ? filterValuesStr(dataSource, "id") : [],
      onFilter: (value, record) => record.id.startsWith(value),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: dataSource.length > 0 ? filterValuesStr(dataSource, "name") : [],
      onFilter: (value, record) => record.name.startsWith(value),
    },
  ];

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card>
          <h2>Real Data</h2>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              current: pagination.currentPage,
              pageSize: pagination.limit,
              total: pagination.total,
              onChange: (page) => setPagination({ ...pagination, page }),
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ApipaginationPage;
