import React, { useContext, useState } from "react";
import { Button, Input, Tree, Empty, Form } from "antd";
import {
    CommentOutlined,
    DeleteOutlined,
    UserOutlined,
    PlusSquareOutlined,
    MinusSquareOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addComment, addTopic } from "../../features/topicsSlice";
import { withNotificationContext } from "../../decorators";
import { parseResponseError } from "../../utils/errors";
import { SubmitButton } from "../../components/SubmitButton";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { CommentPanel } from "./CommentPanels";
import { VALIDATION_RULES } from "../../constants";

// Utility method to build the configuration object for a Tree component
// from the nested comments structure in the topic API response
// This function is called recursively
const createCommentsTree = (topicId, comment, parentKey = "") => {
    // Generate unique id for each component by using their parent ids
    const key = parentKey ? `${parentKey}-${comment.id}` : comment.id;
    return comment.removed
        ? {
              key,
              title: <div style={{ color: "red" }}>[Comment deleted]</div>,
              children: [],
          }
        : {
              key,
              title: <CommentPanel topicId={topicId} comment={comment} />,
              children: comment.comments.map((comment) => createCommentsTree(topicId, comment, key)),
          };
};

// Component for creating new topic
export const CreateTopicForm = withNotificationContext(({ notification }) => {
    const currentUser = useContext(CurrentUserContext);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);

    const handleCreate = (values) => {
        setSaving(true);
        dispatch(addTopic({ author: currentUser, ...values }))
            .then((result) => {
                if (result.error) throw result;
                form.resetFields();
            })
            .catch((result) => {
                notification.error({
                    message: "Create Topic Failed",
                    description: parseResponseError(result),
                });
            })
            .finally(() => setSaving(false));
    };

    return (
        <Form
            name="createTopic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            form={form}
            onFinish={handleCreate}
            validateTrigger={["onBlur", "onChange"]}
            disabled={saving}
        >
            <Form.Item label="Title" name="title" rules={[VALIDATION_RULES.required, VALIDATION_RULES.alphanumeric]}>
                <Input placeholder="Set the topic title." />
            </Form.Item>
            <Form.Item label="Body" name="body" rules={[VALIDATION_RULES.required, VALIDATION_RULES.alphanumeric]}>
                <Input.TextArea placeholder="Set the description of the topic." />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <SubmitButton form={form} loading={saving}>
                    Create
                </SubmitButton>
            </Form.Item>
        </Form>
    );
});

// Component to render a topic header section
export const TopicPanel = ({ topic, onDeleteTopic = () => {} }) => {
    const handleDeleteTopic = (event) => {
        event.stopPropagation();
        onDeleteTopic(topic);
    };

    return (
        <>
            <div style={{ color: "grey" }}>
                <UserOutlined /> [{topic.author.name}]
            </div>
            <div style={{ fontWeight: "bold" }}>{topic.title}</div>
            <div style={{ color: "grey" }}>{topic.body}</div>
            <div style={{ marginTop: 6, color: "grey" }}>
                <div style={{ cursor: "default", display: "inline-block" }}>
                    <CommentOutlined />
                    <span style={{ padding: "0 15px 0 6px" }}>{topic.comments.length}</span>
                </div>
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    style={{ color: "grey" }}
                    title="Delete topic"
                    onClick={handleDeleteTopic}
                >
                    Delete
                </Button>
            </div>
        </>
    );
};

// Component to render a topic comments section
export const TopicCommentsPanel = withNotificationContext(({ notification, topic }) => {
    const dispatch = useDispatch();
    // isEditing is set when the "new comment" input is active
    const [isEditing, setEditing] = useState(false);
    const [newComment, setNewComment] = useState();

    const handleCancelNewComment = (event) => {
        // Clear the input field on cancel
        setEditing(false);
        setNewComment("");
    };

    const handleAddNewComment = (event) => {
        // Dispatch an action to create a new comment
        return dispatch(addComment({ id: topic.id, data: { body: newComment, author: topic.author } }))
            .then((result) => {
                if (result.error) throw result;
                setNewComment("");
            })
            .catch((result) => {
                // Display a notification on error
                notification.error({
                    message: "Add Comment Failed",
                    description: parseResponseError(result),
                });
            })
            .finally(() => setEditing(false));
    };

    return (
        <>
            <Input.TextArea
                rows={1}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add comment"
                onFocus={() => setEditing(true)}
                addonAfter={<DeleteOutlined />}
            />
            {isEditing && (
                <div>
                    <Button type="link" size="small" onClick={handleCancelNewComment}>
                        Cancel
                    </Button>
                    <Button type="link" size="small" onClick={handleAddNewComment}>
                        Add
                    </Button>
                </div>
            )}
            {topic.comments.length ? (
                <Tree
                    className="topic-comment"
                    style={{ marginTop: 12 }}
                    blockNode
                    showIcon={false}
                    selectable={false}
                    treeData={topic.comments.map((c) => createCommentsTree(topic.id, c))}
                    switcherIcon={({ expanded }) => (expanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />)}
                />
            ) : (
                <Empty description="No Comment" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </>
    );
});
