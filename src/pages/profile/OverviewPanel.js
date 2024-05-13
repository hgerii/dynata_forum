import React, { useState, useEffect, useMemo } from "react";
import { Form, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectRoles, selectRoleById, fetchRoles } from "../../features/rolesSlice";
import { selectTopics, fetchTopics } from "../../features/topicsSlice";
import { PERMISSIONS } from "../../constants";

// A component for displaying an overview of the user profile
export const OverviewPanel = ({ user }) => {
    const dispatch = useDispatch();
    const roles = useSelector(selectRoles);
    const role = useSelector(selectRoleById(user.role));
    const topics = useSelector(selectTopics);

    const [isInitialised, setInitialised] = useState();
    useEffect(() => {
        if (!isInitialised) {
            const promises = [];
            if (!roles.length) {
                promises.push(dispatch(fetchRoles()));
            }
            if (!topics.length) {
                promises.push(dispatch(fetchTopics()));
            }
            Promise.all(promises).finally(() => setInitialised(true));
        }
    }, [isInitialised, roles, topics, dispatch]);

    // Recursively collect all the comments created by the current user
    // and store that in the cache until the current user or topics collection change
    // Note that the 'deleted' comment also used in the calculation now
    const userComments = useMemo(() => {
        let comments = [];
        if (user && topics.length) {
            // Recursively go through the comment tree to find the ones
            // created by the current user
            const findComments = (items, result) => {
                if (!items || !items.length) return [];
                let userComments = items.filter((item) => item.author.id === user.id);
                items.forEach((item) => userComments.push(...findComments(item.comments)));
                return userComments;
            };
            comments = topics.reduce((result, topic) => {
                return result.concat(findComments(topic.comments));
            }, []);
        }
        return comments;
    }, [user, topics]);

    // Collect all the topics created by the current user
    // and store that in the cache until the user or topics collection change
    const userTopics = useMemo(() => {
        let userTopics = [];
        if (user && topics.length) {
            userTopics = topics.filter((topic) => topic.author.id === user.id);
        }
        return userTopics;
    }, [user, topics]);

    // TODO: Use a loading spinner until initialized instead of returning with null
    return (
        isInitialised && (
            <Spin spinning={!isInitialised}>
                <Form labelCol={{ span: 3 }} wrapperCol={{ span: 16 }} labelAlign="left" name="overview">
                    <Form.Item label="Name">{user.name}</Form.Item>
                    <Form.Item label="Email">{user.email}</Form.Item>
                    <Form.Item label="Role">{role?.name}</Form.Item>
                    <Form.Item label="Permissions">
                        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                            {Object.keys(PERMISSIONS).map((permission) => (
                                <li
                                    key={permission}
                                    style={{ color: PERMISSIONS[permission] & role?.rights ? "green" : "red" }}
                                >
                                    {permission}
                                </li>
                            ))}
                        </ul>
                    </Form.Item>
                    <Form.Item label="Topics">{userTopics.length}</Form.Item>
                    <Form.Item label="Comments">{userComments.length}</Form.Item>
                </Form>
            </Spin>
        )
    );
};
