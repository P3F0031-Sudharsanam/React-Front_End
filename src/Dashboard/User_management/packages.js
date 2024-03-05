import React, { useState, useEffect } from "react";
import { Card, Col, Row, Alert } from "antd";

const PackagePage = () => {
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <h2 style={{ color: "#5d748a" }}>Packages used</h2>
            </Col>
            <Col span={8}>
              <Alert message="jspdf - ^2.5.1" type="success" />
            </Col>
            <Col span={8}>
              <Alert message="jspdf-autotable - ^3.8.2" type="success" />
            </Col>
            <Col span={8}>
              <Alert message="react-csv - ^2.2.2" type="success" />
            </Col>
            <Col span={8}>
              <Alert message="xlsx - ^0.18.5" type="success" />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default PackagePage;
