import axios from "axios";
import { SERVER_API_URL } from "../constants";

export const getUsers = async () => {
    return axios.get(`${SERVER_API_URL}/users`);
};

export const getUser = async (id) => {
    return axios.get(`${SERVER_API_URL}/users/${id}`);
};

export const updateUser = async (id, data) => {
    return axios.put(`${SERVER_API_URL}/user/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const updateUserPassword = async (id, data) => {
    return axios.put(`${SERVER_API_URL}/user/${id}/password`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};
