import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import PublicLayout from './layouts/PublicLayout.tsx';
import App from './App.tsx'
import Login from "../src/pages/Login.tsx";
import Panel from "./pages/Panel.tsx";
import CopaPage from "../src/pages/CopaPage.tsx";
import AperturaPage from "../src/pages/AperturaPage.tsx";
import './styles/global.css';
import ReglamentoPage from "./pages/ReglamentoPage.tsx";
import PanelNoticias from "./pages/PanelNoticias.tsx";
import NoticiasPage from "./pages/NoticiasPage.tsx";
import NoticiaIndividual from "./pages/NoticiaIndividual.tsx";
import EquipoIndividual from "./pages/EquipoIndividual.tsx";

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
  <Route path="/noticias" element={<NoticiasPage />} />
  <Route path="/noticias/:id" element={<NoticiaIndividual />} /> 
  <Route path="/equipos/:id" element={<EquipoIndividual />} /> 
</Route>

        {/* Rutas admin sin navbar */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/panel" element={<Panel />} />
        <Route path="/admin/lucio" element={<PanelNoticias />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
