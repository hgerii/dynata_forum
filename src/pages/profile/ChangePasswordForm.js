import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { updateUserPasswordById } from "../../features/usersSlice";
import { withNotificationContext } from "../../decorators";
import { parseResponseError } from "../../utils/errors";
import { SubmitButton } from "../../components/SubmitButton";
import { VALIDATION_RULES } from "../../constants";

// A form component for updating the user password
export const ChangePasswordForm = withNotificationContext(({ notification, user }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(user);
    }, [user, form]);

    const [saving, setSaving] = useState(false);
    const handleSave = (values) => {
        // Handle the password save operation on form submit
        setSaving(true);
        dispatch(
            updateUserPasswordById({
                id: user.id,
                data: {
                    password1: values.password1,
                    password2: values.password2,
                },
            })
        )
            .then((result) => {
                if (result.error) throw result; // on error response
                // TODO: Depends on the requirement, but success notification could be displayed here
                form.resetFields();
            })
            .catch((result) => {
                // Display error message to user
                notification.error({
                    message: "Change Password Failed",
                    description: parseResponseError(result),
                });
            })
            .finally(() => setSaving(false));
    };

    return (
        <Form
            name="changePassword"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            form={form}
            onFinish={handleSave}
            validateTrigger={["onBlur", "onChange"]}
            disabled={saving}
        >
            <Form.Item
                label="New password"
                name="password1"
                hasFeedback
                rules={[VALIDATION_RULES.required, VALIDATION_RULES.password]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="Confirm password"
                name="password2"
                hasFeedback
                rules={[
                    VALIDATION_RULES.required,
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            // Custom validator to check the new and confirm passwords match
                            if (!value || getFieldValue("password1") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error("The passwords must match!"));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <SubmitButton form={form} loading={saving}>
                    Save
                </SubmitButton>
            </Form.Item>
        </Form>
    );
});
