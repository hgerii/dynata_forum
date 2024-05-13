import axios from "axios";
import { SERVER_API_URL } from "../constants";

export const getTopics = async () => {
    return axios.get(`${SERVER_API_URL}/topics`);
};

export const addTopic = async (data) => {
    return axios.post(`${SERVER_API_URL}/topic/add`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const deleteTopic = async (topicId) => {
    return axios.delete(`${SERVER_API_URL}/topic/${topicId}`);
};

export const addComment = async (topicId, data) => {
    return axios.post(`${SERVER_API_URL}/topic/${topicId}/comment/add`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const deleteComment = async (topicId, commentId) => {
    return axios.delete(`${SERVER_API_URL}/topic/${topicId}/comment/${commentId}`);
};
