import React, { useContext, useMemo } from "react";
import { Breadcrumb, Space, Avatar, Tabs, theme } from "antd";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { UserOutlined } from "@ant-design/icons";
import { OverviewPanel } from "./OverviewPanel";
import { SettingsPanel } from "./SettingsPanel";

const { useToken } = theme;

// Main component fo the Profile page
export default function ProfilePage() {
    // Token is used to get theme related styling settings
    const { token } = useToken();
    // Get the current user
    const currentUser = useContext(CurrentUserContext);

    // Save tab items in the cache
    const tabItems = useMemo(
        () => [
            { key: "overview", label: "Overview", children: <OverviewPanel user={currentUser} /> },
            { key: "settings", label: "Settings", children: <SettingsPanel user={currentUser} /> },
        ],
        [currentUser]
    );

    // TODO: Use a loading spinner until the current user is available
    // If there was a login page, then this should be available on first render
    return (
        currentUser && (
            <>
                <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "Profile" }]} />
                <Space direction="vertical" size="middle" style={{ display: "flex", flex: 1 }}>
                    <section style={{ background: "white", padding: 16, borderRadius: 8 }}>
                        {/* Profile header */}
                        <div style={{ textAlign: "center" }}>
                            <Avatar
                                size={128}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: token.colorPrimary }}
                            />
                            <div style={{ fontSize: "1.2em", margin: 12 }}>{currentUser && currentUser.name}</div>
                        </div>
                        {/* Profile content */}
                        <Tabs centered defaultActiveKey={tabItems[0].key} items={tabItems} />
                    </section>
                </Space>
            </>
        )
    );
}
