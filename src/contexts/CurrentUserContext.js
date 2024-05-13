import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, selectCurrentUser } from "../features/usersSlice";

export const CurrentUserContext = React.createContext(null);

export const CurrentUserProvider = ({ children }) => {
    const dispatch = useDispatch();

    // Fetch the topics from the server on first render
    // TODO: Keep the store in sync with the server
    const currentUser = useSelector(selectCurrentUser);
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // This is a temporary solution to get the currently logged in user in the demo
    return <CurrentUserContext.Provider value={currentUser}>{children}</CurrentUserContext.Provider>;
};
