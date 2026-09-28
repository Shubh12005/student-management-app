import React from "react";
import ReactDOM from "react-dom/client";
import StudentManagementSystem from "./StudentManagementSystem";
import "./style.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <StudentManagementSystem />
  </React.StrictMode>
);