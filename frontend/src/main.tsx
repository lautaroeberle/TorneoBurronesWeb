import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import PublicLayout from './layouts/PublicLayout.tsx';
import App from './App.tsx'
import Login from "../src/pages/Login.tsx";
import Panel from "../src/pages/Panel.tsx";
import CopaPage from "../src/pages/CopaPage.tsx";
import AperturaPage from "../src/pages/AperturaPage.tsx";
import './styles/global.css';
import ReglamentoPage from "./pages/ReglamentoPage.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Rutas públicas con navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/copa" element={<CopaPage />} />
          <Route path="/apertura" element={<AperturaPage />} />
          <Route path="/reglamento" element={<ReglamentoPage />} />
        </Route>

        {/* Rutas admin sin navbar */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/panel" element={<Panel />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
