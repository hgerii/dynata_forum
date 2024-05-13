import React, { useState, useEffect } from "react";
import { Form, Input, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { updateRole } from "../../features/rolesSlice";
import { PERMISSIONS, VALIDATION_RULES } from "../../constants";
import { withNotificationContext } from "../../decorators";
import { parseResponseError } from "../../utils/errors";
import { SubmitButton } from "../../components/SubmitButton";

// Build a config object to the permission Select field
const permissionOptions = Object.keys(PERMISSIONS).map((p) => ({ value: PERMISSIONS[p], label: p }));

// A form component for updating the selected Role details
export const RoleDetailsForm = withNotificationContext(({ notification, selectedRole }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (selectedRole) {
            // Update the form fields with the values from the selected role
            // Note that the Radio Group for the permissions expect an array of numbers
            // from the permission values
            form.setFieldsValue({
                name: selectedRole.name,
                permission: Object.keys(PERMISSIONS).reduce((result, p) => {
                    if (PERMISSIONS[p] & selectedRole.rights) {
                        result.push(PERMISSIONS[p]);
                    }
                    return result;
                }, []),
            });
        }
    }, [selectedRole]);

    const handleSave = (values) => {
        // Handle the role update operation
        setSaving(true);
        dispatch(
            // The 'right' property of the 'role' is calculated from the Radio Group values
            // by summarizing them
            updateRole({
                id: selectedRole.id,
                data: {
                    name: values.name,
                    rights: values.permission.reduce((result, value) => result + value, 0),
                },
            })
        )
            .then((result) => {
                if (result.error) throw result;
            })
            .catch((result) => {
                notification.error({
                    message: "Save User Details Failed",
                    description: parseResponseError(result),
                });
            })
            .finally(() => setSaving(false));
    };

    return (
        <Form
            name="roleDetails"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            form={form}
            disabled={!selectedRole || saving}
            onFinish={handleSave}
        >
            <Form.Item
                label="Name"
                name="name"
                hasFeedback
                rules={[VALIDATION_RULES.required, VALIDATION_RULES.alphanumeric]}
            >
                <Input placeholder="Set the role name." />
            </Form.Item>
            <Form.Item label="Permission" name="permission">
                <Checkbox.Group options={permissionOptions} style={{ flexDirection: "column" }} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <SubmitButton form={form}>Save</SubmitButton>
            </Form.Item>
        </Form>
    );
});
