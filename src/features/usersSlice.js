import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as usersApi from "../apis/usersApi";

// Redux configuration for the User model

const initialState = {
    data: [],
};

export const fetchUsers = createAsyncThunk("users/get", async (payload, thunkAPI) => {
    // A thunk for getting the Users collection
    const response = await usersApi.getUsers();
    return response.data.data;
});

export const updateUserDetailsById = createAsyncThunk("user/updateDetails", async (payload, thunkAPI) => {
    // A thunk for updating the specified User properties
    let response;
    const { id, data } = payload;
    try {
        response = await usersApi.updateUser(id, data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }

    return { id, data: response.data };
});

export const updateUserPasswordById = createAsyncThunk("user/updatePassword", async (payload, thunkAPI) => {
    // A thunk for updating the password of the specified User
    let response;
    const { id, data } = payload;
    try {
        response = await usersApi.updateUserPassword(id, data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }

    return { id, data: response.data };
});

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addCase(updateUserDetailsById.fulfilled, (state, action) => {
                // Merge the updated values in the current user object
                const { id, data } = action.payload;
                const item = state.data.find((item) => item.id === id);
                if (item) {
                    Object.assign(item, data.data);
                }
            })
            .addCase(updateUserPasswordById.fulfilled, (state, action) => {
                // Merge the updated values in the current user object
                const { id, data } = action.payload;
                const item = state.data.find((item) => item.id === id);
                if (item) {
                    Object.assign(item, data.data);
                }
            });
    },
});

// Selectors
export const selectUsers = (state) => state[usersSlice.name]?.data;
export const selectCurrentUser = (state) => state[usersSlice.name]?.data[0];

const reducer = { [usersSlice.name]: usersSlice.reducer };
export default reducer;
