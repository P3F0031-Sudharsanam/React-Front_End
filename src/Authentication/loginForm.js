import React from "react";
import { Form, Input, Button, Col, Row, Image, Card } from "antd";
import backgroundImage from "../assets/images/login-bg.jpg";
import logo from "../assets/images/logo.jpg";

const LoginForm = ({ onLogin }) => {
  const onFinish = (values) => {
    const { username, password } = values;
    onLogin(username, password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row>
      <Col
        span={16}
        className="bg"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Col>
      <Col span={8}>
        <Row justify={"space-around"} align="middle">
          <Col span={16}>
            <Row align="center" className="loginForm">
              <Col>
                <Image src={logo} width={160} preview={false} />
              </Col>
            </Row>
            <Card style={{ marginTop: "50px" }}>
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="ver-middle"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LoginForm;
