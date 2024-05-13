import React from "react";
import { Button } from "antd";
import {
    CommentOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
    EditOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteCommentByIds } from "../../features/topicsSlice";
import { withNotificationContext, withModalContext } from "../../decorators";
import { parseResponseError } from "../../utils/errors";

// A component to render a comment
export const CommentPanel = withNotificationContext(
    withModalContext(({ notification, modal, topicId, comment }) => {
        const dispatch = useDispatch();

        // Handle topic delete operation
        const handleDeleteComment = (item) => {
            modal.confirm({
                title: "Confirm delete",
                icon: <ExclamationCircleFilled />,
                content: "Are you sure you want to delete the comment?",
                okText: "Confirm",
                okType: "danger",
                cancelText: "No",
                onOk() {
                    // Delete the comment on confirm
                    return dispatch(deleteCommentByIds({ topicId: topicId, commentId: comment.id }))
                        .then((result) => {
                            if (result.error) throw result;
                        })
                        .catch((result) => {
                            notification.error({
                                message: "Delete Comment Failed",
                                description: parseResponseError(result),
                            });
                        });
                },
                onCancel() {},
            });
        };

        return (
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 6 }}>
                {/* Main content */}
                <div style={{ marginRight: 8, color: "gray" }}>
                    <UserOutlined /> [{comment.author.name}]
                </div>
                <div style={{ flex: 1 }}>{comment.body}</div>

                {/* Botton toolbar */}
                <div style={{ color: "grey" }}>
                    <CommentOutlined />
                    <span style={{ padding: "0 15px 0 6px" }}>{comment.comments.length}</span>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        style={{ color: "lightgrey" }}
                        title="Reply to the Comment (Not supported yet)"
                        disabled
                    >
                        Reply
                    </Button>
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        style={{ color: "grey" }}
                        title="Delete comment"
                        onClick={handleDeleteComment}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        );
    })
);
