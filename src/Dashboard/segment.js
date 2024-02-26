import React, { useState, useEffect } from "react";
import { Card, Col, Row, Tabs } from "antd";
import "./segment.css";
import UsersPage from "./users";

import TutorialPage from "./tutorial.js";
const { TabPane } = Tabs;

const TabsPage = () => {

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card className="segment-card">
          <Tabs defaultActiveKey="3" tabBarStyle={{ borderBottom: "none" }} x>
            <TabPane tab="User List" key="1">
              <UsersPage />
            </TabPane>
            <TabPane tab="Pagination" key="2">
              <TutorialPage />
            </TabPane>
            <TabPane tab="Export" key="3">

            </TabPane>
            <TabPane tab="Next Task?" key="4">
              <Card>
                <h3>Comming Soon..!</h3>
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );
};

export default TabsPage;
