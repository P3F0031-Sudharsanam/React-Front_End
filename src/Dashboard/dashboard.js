import React from "react";
import { Button, Col, Row, Card, Tabs, Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import "../assets/style/global.css";
import ExportPage from "./export.js";
import PaginationPage from "./pagination.js";
import UsersPage from "./users.js";
import ExportCSV from "./exportCSV.js";
import "../assets/style/segment.css";
import PackagePage from "./packages.js";

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

class DashboardPage extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <Row>
            <Col span={24}>
              <h2 className="center color-grey">React Exercises</h2>
            </Col>
          </Row>
          <Menu mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<AreaChartOutlined />}>
              Upcomming Task
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: this.toggle,
              }
            )}
            <Button className="logout" onClick={this.props.onLogout}>
              Logout
            </Button>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <Row gutter={[32, 32]}>
              <Col span={12}>
                <Tabs defaultActiveKey="3">
                  <TabPane tab="Users" key="1">
                    <UsersPage />
                  </TabPane>
                  <TabPane tab="Pagination" key="2">
                    <PaginationPage />
                  </TabPane>
                  <TabPane tab="Export PDF" key="3">
                    <ExportPage />
                  </TabPane>
                  <TabPane tab="Export CSV" key="4">
                    <ExportCSV />
                  </TabPane>
                </Tabs>
              </Col>
              <Col span={12}>
                <Tabs defaultActiveKey="3">
                  <TabPane tab="Export" key="3">
                    <PackagePage />
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default DashboardPage;
