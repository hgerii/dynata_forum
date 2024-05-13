import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import Application from "./components/Application";
import ErrorBoundary from "./components/ErrorBoundary";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <ErrorBoundary msg="There was an unexpected error during loading the page.">
        <Provider store={store}>
            <CurrentUserProvider>
                <BrowserRouter>
                    <Application />
                </BrowserRouter>
            </CurrentUserProvider>
        </Provider>
    </ErrorBoundary>
);
