import React, { useState, useEffect } from "react";
import { Table, Card, Col, Row, Button, Dropdown, Menu } from "antd";
import axios from "axios";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const ExportPage = () => {
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
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleExportExcel = async () => {
    try {
      const allData = [];
      for (let page = 1; page <= totalPages; page++) {
        const response = await axios.get(
          `http://localhost:8080/api/users/limit?page=${page}&limit=5`
        );
        allData.push(...response.data.users);
      }

      const exportData = allData.map((item) => ({
        ID: item.id,
        Name: item.name,
        Description: item.description,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Users_List.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const allData = [];
      for (let page = 1; page <= totalPages; page++) {
        const response = await axios.get(
          `http://localhost:8080/api/users/limit?page=${page}&limit=5`
        );
        allData.push(...response.data.users);
      }

      const doc = new jsPDF();
      let startY = 10;
      let currentPage = 1;

      doc.setFontSize(14);
      doc.text("User List", 14, 10);
      doc.setFontSize(12);
      doc.setFontSize(10);
      doc.text(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
        14,
        30
      );
      doc.text(
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        14,
        35
      );
      doc.text(
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        14,
        40
      );
      doc.text(
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        14,
        45
      );

      // user data
      doc.autoTable({
        head: [["ID", "Name", "Description"]],
        body: allData.map((item) => [item.id, item.name, item.description]),
        startY: 70,
        didDrawPage: function (data) {
          let pageCount = currentPage;
          if (data.pageCount > 1) {
            pageCount = currentPage + "/" + data.pageCount;
          }
          doc.setFontSize(10);
          doc.text(
            "Page " + pageCount,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
          currentPage++;
        },
      });

      doc.save("Users_List.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card>
          <h2 style={{ color: "#5d748a" }}>Export Table Data</h2>
          <Row align="end" gutter={[8, 8]}>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="2" onClick={handleExportExcel}>
                    Export to Excel
                  </Menu.Item>
                  <Menu.Item key="3" onClick={handleExportPDF}>
                    Export to PDF
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button type="primary">Download Format</Button>
            </Dropdown>
          </Row>

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

export default ExportPage;
