import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import * as rolesApi from "../apis/rolesApi";

// Redux configuration for the Role model

const initialState = {
    data: [],
};

export const fetchRoles = createAsyncThunk("roles/get", async (payload, thunkAPI) => {
    // A thunk for getting the Roles collection
    const response = await rolesApi.getRoles();
    return response.data.data;
});

export const updateRole = createAsyncThunk("role/update", async (payload, thunkAPI) => {
    // A thunk for updating the specified Role
    let response;
    const { id, data } = payload;
    try {
        response = await rolesApi.updateRole(id, data);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }

    return { id, data: response.data };
});

export const rolesSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                // Merge the changes into the specified Role
                const { id, data } = action.payload;
                const item = state.data.find((item) => item.id === id);
                if (item) {
                    Object.assign(item, data.data);
                }
            });
    },
});

// Selectors
export const selectRoles = (state) => state[rolesSlice.name]?.data;
export const selectRoleById = (roleId) =>
    createSelector(selectRoles, (roles) => roles && roles.find((role) => role.id === roleId));

const reducer = { [rolesSlice.name]: rolesSlice.reducer };
export default reducer;
