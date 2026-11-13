import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./App.css";
import "@mantine/core/styles.css";

document.documentElement.lang = "tr";
document.documentElement.dir = "ltr";
localStorage.removeItem("gastronova_lang");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
