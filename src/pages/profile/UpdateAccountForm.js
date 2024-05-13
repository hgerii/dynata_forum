import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { updateUserDetailsById } from "../../features/usersSlice";
import { withNotificationContext } from "../../decorators";
import { parseResponseError } from "../../utils/errors";
import { SubmitButton } from "../../components/SubmitButton";
import { VALIDATION_RULES } from "../../constants";

// A form component for updating the user account details
export const UpdateAccountForm = withNotificationContext(({ notification, user }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        // Update the form values when the user changes
        form.setFieldsValue(user);
    }, [user, form]);

    const [saving, setSaving] = useState(false);
    const handleSave = (values) => {
        // Handle the save process of the user account changes
        setSaving(true);
        dispatch(updateUserDetailsById({ id: user.id, data: values }))
            .then((result) => {
                if (result.error) throw result; // on error in the response
            })
            .catch((result) => {
                // Let the user know about the failing request
                notification.error({
                    message: "Save User Details Failed",
                    description: parseResponseError(result),
                });
            })
            .finally(() =>
                // Note that 'setTimeout' is used to demo the saving process only
                setTimeout(() => {
                    setSaving(false);
                }, 2000)
            );
    };

    return (
        <Form
            name="updateAccount"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            form={form}
            onFinish={handleSave}
            validateTrigger={["onBlur", "onChange"]}
            disabled={saving}
        >
            <Form.Item
                label="Name"
                name="name"
                hasFeedback
                rules={[VALIDATION_RULES.required, VALIDATION_RULES.alphanumeric]}
            >
                <Input placeholder="Set a profile name." />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                hasFeedback
                rules={[VALIDATION_RULES.required, VALIDATION_RULES.email]}
            >
                <Input placeholder="Set the email address." />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <SubmitButton form={form} loading={saving}>
                    Save
                </SubmitButton>
            </Form.Item>
        </Form>
    );
});
