import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { Link, Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Profile from "../pages/profile";
import Admin from "../pages/admin";
const { Content, Sider } = Layout;

function buildMenuItem(label, key, icon) {
    return {
        key,
        icon,
        label: <Link to={key}>{label}</Link>,
    };
}
const items = [
    buildMenuItem("Home", "/", <HomeOutlined />),
    buildMenuItem("Profile", "/profile", <UserOutlined />),
    buildMenuItem("Admin", "/admin", <SettingOutlined />),
];

export default function App() {
    return (
        <Layout style={{ height: "100vh" }}>
            <Sider theme="light">
                <Menu defaultSelectedKeys={[window.location.pathname]} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Content style={{ padding: "0 16px 16px", overflow: "auto" }}>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}
