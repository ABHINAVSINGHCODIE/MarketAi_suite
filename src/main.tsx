import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, useInRouterContext } from "react-router-dom";

const AppRoot: React.FC = () => {
  const inRouter = useInRouterContext();
  return inRouter ? <App /> : (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);