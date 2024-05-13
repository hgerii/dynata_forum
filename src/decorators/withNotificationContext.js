import React from "react";
import { notification as antNotification } from "antd";

// Insert the notification in the current context and pass it to the Component as a prop
// Make the notification's style unique and unified across the user interface
// This is just an example of a HOC
const withNotificationContext =
    (Component, propName = "notification") =>
    (props) => {
        const [api, contextHolder] = antNotification.useNotification();

        // Provide a notification API to keep settings/stylings consistent in Components
        const notification = {
            error: ({ description, ...props }) => {
                api.error({
                    duration: 0,
                    description: <div style={{ whiteSpace: "pre-wrap" }}>{description}</div>,
                    placement: "bottomRight",
                    ...props,
                });
            },
            info: (props) => {
                api.info({
                    duration: 3,
                    placement: "bottomRight",
                    ...props,
                });
            },
            success: (props) => {
                api.success({
                    duration: 3,
                    placement: "bottomRight",
                    ...props,
                });
            },
        };

        return (
            <>
                {contextHolder}
                <Component {...props} {...{ [propName]: notification }} />
            </>
        );
    };

export default withNotificationContext;
