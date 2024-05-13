import { configureStore } from "@reduxjs/toolkit";
import topicsReducer from "./features/topicsSlice";
import usersReducer from "./features/usersSlice";
import rolesReducer from "./features/rolesSlice";

export const store = configureStore({
    reducer: {
        ...topicsReducer,
        ...usersReducer,
        ...rolesReducer,
    },
});
