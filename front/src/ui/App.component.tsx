import "./App.style.scss"
import React from "react";
import { HashRouter, NavLink, Navigate, Route, Routes } from "react-router-dom"

import Collecting from "./views/Collecting";
import Categorizing from "./views/Categorizing";

import { useLoadingStore } from "./stores/loading"

export default () => {
  const loading = useLoadingStore((s) => s.loading)

  return <>
    <HashRouter>
      <div className="header">
        <h1 className="title">
          <span>Expenses</span>
          <img src="/favicon.svg" alt="" />
        </h1>
        <div className="menu">
          <NavLink className="menu-link" to="/collecting">Collecting</NavLink>
          <NavLink className="menu-link" to="/categorizing">Categorizing</NavLink>
        </div>
      </div>

      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/collecting" replace />} />
          <Route path="/collecting" element={<Collecting />} />
          <Route path="/categorizing" element={<Categorizing />} />
        </Routes>
      </div>

      {loading != null && <div className="loading-overlay">
        <span>{loading}</span>
      </div>}
    </HashRouter>
  </>;
};
