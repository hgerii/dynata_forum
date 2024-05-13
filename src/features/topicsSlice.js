import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as topicsApi from "../apis/topicsApi";

// Redux configuration for the Topic model

const initialState = {
    data: [],
};

export const fetchTopics = createAsyncThunk("topics/get", async (payload, thunkAPI) => {
    // A thunk for getting the Topics collection
    const response = await topicsApi.getTopics();
    return response.data.data;
});

export const addTopic = createAsyncThunk("topic/add", async (payload, thunkAPI) => {
    // A thunk for creating a new Topic
    let response;
    try {
        response = await topicsApi.addTopic(payload);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
    // Fetch the topics to get the latest comments
    await thunkAPI.dispatch(fetchTopics(null, thunkAPI));
    return response.data;
});

export const deleteTopicById = createAsyncThunk("topic/delete", async (id, thunkAPI) => {
    // A thunk for deleting the specified Topic
    try {
        await topicsApi.deleteTopic(id);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
    return id;
});

export const addComment = createAsyncThunk("component/add", async (payload, thunkAPI) => {
    // A thunk for creating a Comment on the specified Topic
    let response;
    try {
        response = await topicsApi.addComment(payload.id, payload.data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
    // Fetch the topics to get the latest comments
    await thunkAPI.dispatch(fetchTopics(null, thunkAPI));
    return response.data;
});

export const deleteCommentByIds = createAsyncThunk("comment/delete", async (payload, thunkAPI) => {
    // A thunk for deleting a Comment
    try {
        await topicsApi.deleteComment(payload.topicId, payload.commentId);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
    // Fetch the topics to get the latest comments
    await thunkAPI.dispatch(fetchTopics(null, thunkAPI));
    return payload.commentId;
});

export const topicsSlice = createSlice({
    name: "topics",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopics.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addCase(deleteTopicById.fulfilled, (state, action) => {
                // Remove the deleted topic from the store
                const id = action.payload;
                state.data = state.data.filter((item) => item.id !== id);
            });
    },
});

// Selectors
export const selectTopics = (state) => state[topicsSlice.name]?.data;

const reducer = { [topicsSlice.name]: topicsSlice.reducer };
export default reducer;
