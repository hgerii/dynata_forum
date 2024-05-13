import React from "react";
import { Form, Button } from "antd";

// A form submit button which control the 'disabled' state
// by validating the form on changes
export const SubmitButton = ({ form, ...other }) => {
    const [isFormValid, setFormValid] = React.useState(false);

    const values = Form.useWatch([], form);
    React.useEffect(() => {
        form.validateFields({
            validateOnly: true,
        })
            .then(() => setFormValid(true))
            .catch(() => setFormValid(false));
    }, [form, values]);

    return <Button type="primary" htmlType="submit" disabled={!isFormValid} {...other} />;
};
