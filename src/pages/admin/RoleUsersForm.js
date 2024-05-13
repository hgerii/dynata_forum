import React, { useState, useEffect } from "react";
import { Form, Transfer } from "antd";

// A form component for updating the assigned users to the selected role
export const RoleUsersForm = ({ selectedRole, users, roles }) => {
    const [targetKeys, setTargetKeys] = useState();
    const [selectedKeys, setSelectedKeys] = useState([]);

    useEffect(() => {
        if (selectedRole) {
            setTargetKeys(users.filter((user) => user.role === selectedRole.id).map((user) => user.id));
        }
    }, [selectedRole, users]);

    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    return (
        <Form
            name="roleUsers"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ display: "flex", justifyContent: "center" }}
        >
            <Transfer
                dataSource={users}
                showSelectAll={false}
                titles={["Other users", "Assigned users"]}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                render={(item) => (
                    <>
                        {item.name}{" "}
                        <span style={{ color: "grey" }}>
                            ({roles.find((r) => r.id === item.role)?.name || "No role"})
                        </span>
                    </>
                )}
                rowKey={(item) => item.id}
                listStyle={{ width: 350, height: 350 }}
            />
        </Form>
    );
};
