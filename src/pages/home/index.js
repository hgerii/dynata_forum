import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Space, Collapse, Skeleton } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { selectTopics, fetchTopics, deleteTopicById } from "../../features/topicsSlice";
import { withNotificationContext, withModalContext } from "../../decorators";
import { parseResponseError } from "../../utils/errors";
import { TopicPanel, TopicCommentsPanel } from "./TopicPanels";
import { CreateTopicForm } from "./TopicPanels";

// This is the main component for the Home page
const HomePage = ({ notification, modal }) => {
    const dispatch = useDispatch();
    const [isInitialised, setInitialised] = useState(false);

    // Fetch the topics from the server on first render
    // TODO: Keep the store in sync with the server
    const topics = useSelector(selectTopics);
    useEffect(() => {
        if (topics.length) {
            // on server preload
            setInitialised(true);
        } else {
            dispatch(fetchTopics()).finally(() => {
                setInitialised(true);
            });
        }
    }, []);

    // Handle topic delete operation
    const handleDeleteTopic = (item) => {
        modal.confirm({
            title: "Confirm delete",
            icon: <ExclamationCircleFilled />,
            content: `Are you sure you want to delete the "${item.title}" topic?`,
            okText: "Confirm",
            okType: "danger",
            cancelText: "No",
            onOk() {
                return dispatch(deleteTopicById(item.id))
                    .then((result) => {
                        if (result.error) throw result;
                    })
                    .catch((result) => {
                        notification.error({
                            message: "Delete Topic Failed",
                            description: parseResponseError(result),
                        });
                    });
            },
            onCancel() {},
        });
    };

    // Create the items for the topic Collapse component
    // useMemo id used to cache the value and rebuild only when the 'topics' change
    const topicItems = useMemo(() => {
        return topics.map((topic) => ({
            key: topic.id,
            label: <TopicPanel topic={topic} onDeleteTopic={handleDeleteTopic} />,
            children: <TopicCommentsPanel topic={topic} onDeleteTopic={handleDeleteTopic} />,
        }));
    }, [topics]);

    return (
        <>
            <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "Home" }]} />
            <Space direction="vertical" size="middle" style={{ display: "flex" }}>
                <section style={{ background: "white", borderRadius: 8, padding: 16 }}>
                    <h3>Topics</h3>
                    {isInitialised ? <Collapse accordion items={topicItems} /> : <Skeleton />}
                </section>
                <section style={{ background: "white", padding: 16, borderRadius: 8 }}>
                    <h3>Create topic</h3>
                    <CreateTopicForm />
                </section>
            </Space>
        </>
    );
};

// Inject the customized notification api to the props
export default withNotificationContext(withModalContext(HomePage));
