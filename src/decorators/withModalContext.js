import React from "react";
import { Modal } from "antd";

// Insert the modal in the current context and pass it to the Component as a prop
// to be able to get the theme tokens there
const withModalContext =
    (Component, propName = "modal") =>
    (props) => {
        const [modal, contextHolder] = Modal.useModal();

        return (
            <>
                {contextHolder}
                <Component {...props} {...{ [propName]: modal }} />
            </>
        );
    };

export default withModalContext;
