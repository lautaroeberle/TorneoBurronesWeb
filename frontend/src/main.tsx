
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import Login from "../src/pages/Login.tsx";
import Panel from "../src/pages/Panel.tsx";
import './styles/global.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/panel" element={<Panel />} />
      </Routes>
    </Router>
  </React.StrictMode>
);