import React from "react";
import { UpdateAccountForm } from "./UpdateAccountForm";
import { ChangePasswordForm } from "./ChangePasswordForm";

// A component with different forms for updating settings
export const SettingsPanel = ({ user }) => (
    <>
        <h3>Update account details</h3>
        <UpdateAccountForm user={user} />
        <h3>Change password</h3>
        <ChangePasswordForm user={user} />
    </>
);
