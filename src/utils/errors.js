// Used to get information from a failed request
// and provide a user friendly message
export const parseResponseError = (response) => {
    return String(response?.payload?.message || response?.error?.message || response);
};
