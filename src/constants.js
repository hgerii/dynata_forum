// URL to the demo server API
export const SERVER_API_URL = "http://localhost:8888/api";

export const PERMISSIONS = Object.freeze({
    "Read Comments": 1,
    "Add/delete comments": 2,
    "Add/delete topics": 4,
    "Delete others' comments/topics": 8,
});

// Custom and commonly used validation rules for form fields
export const VALIDATION_RULES = {
    alphanumeric: {
        message: "Only alphanumeric characters and space are allowed.",
        pattern: "^[a-zA-Z0-9 ]+$",
    },
    email: { type: "email" },
    password: {
        message:
            "The password must be minimum 8 characters and contain at least 1 uppercase letter, at least 1 lowercase letter and at least 1 digit.",
        pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$",
    },
    required: { required: true, message: "This field is required." },
};
