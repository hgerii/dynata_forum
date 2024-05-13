import React, { useState, useEffect, useMemo } from "react";
import { Breadcrumb, Space, Select, Collapse } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectUsers } from "../../features/usersSlice";
import { fetchRoles, selectRoles } from "../../features/rolesSlice";
import { RoleUsersForm } from "./RoleUsersForm";
import { RoleDetailsForm } from "./RoleDetailsForm";

// The main component for the Admin page
export default function AdminPage() {
    const dispatch = useDispatch();

    const roles = useSelector(selectRoles);
    const users = useSelector(selectUsers);
    const [selectedRole, setSelectedRole] = useState();

    const [isInitialised, setInitialised] = useState(false);
    useEffect(() => {
        if (!isInitialised) {
            // Fetch the stores which are not available yet
            const promises = [];
            if (!roles.length) {
                promises.push(dispatch(fetchRoles()));
            }
            if (!users.length) {
                promises.push(dispatch(fetchUsers()));
            }
            Promise.all(promises).finally(() => setInitialised(true));
        }
    }, [isInitialised, roles, users, dispatch]);

    // Create the 'items' object for the Collapse panel and store it in the cache
    const collapseItems = useMemo(
        () => [
            {
                key: "1",
                label: "Update the role details",
                children: <RoleDetailsForm roles={roles} selectedRole={selectedRole} />,
            },
            {
                key: "2",
                label: "Update the assign users",
                children: <RoleUsersForm users={users} roles={roles} selectedRole={selectedRole} />,
            },
        ],
        [users, roles, selectedRole]
    );

    // Create the 'options' object for the Select field from the latest 'roles' collection and store it in the cache
    const roleSelectOptions = useMemo(
        () =>
            roles.map((role) => ({
                value: role.id,
                label: role.name,
            })),
        [roles]
    );

    // TODO: Use a loading spinner until the required stores are fetched
    return (
        isInitialised && (
            <>
                <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "Admin" }]} />
                <Space
                    direction="vertical"
                    size="middle"
                    style={{ display: "flex" }}
                    styles={{ item: { borderRadius: 8, background: "white" } }}
                >
                    <section style={{ margin: 16 }}>
                        <h3>Update roles</h3>

                        {/* The Role selector */}
                        <div>Select a role to edit:</div>
                        <Select
                            value={selectedRole?.id}
                            style={{ width: "300px", margin: "10px 0 20px 0" }}
                            options={roleSelectOptions}
                            placeholder="Select a role"
                            onChange={(e) => setSelectedRole(roles.find((r) => r.id === e))}
                        />

                        {/* A container for the forms to change role related settings */}
                        <Collapse items={collapseItems} collapsible={!selectedRole ? "disabled" : "header"} />
                    </section>
                </Space>
            </>
        )
    );
}
