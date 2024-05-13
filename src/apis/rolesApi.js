import axios from "axios";
import { SERVER_API_URL } from "../constants";

export const getRoles = async () => {
    return axios.get(`${SERVER_API_URL}/roles`);
};

export const updateRole = async (id, data) => {
    return axios.put(`${SERVER_API_URL}/role/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};
