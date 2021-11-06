import "./App.style.scss"
import React, { useState } from "react";

import Sources from "./components/sources/Sources.component"
import Transactions from "./components/transactions/Transactions.component"

import { LoadingContext } from "./contexts/loadingContext";

export default () => {
  const [loading, setLoading] = useState<string | null>(null)

  return <>
    <LoadingContext.Provider value={{ setLoading }}>
      <h1 className="header">
        <span>Expenses</span>
        <img src="/favicon.svg" alt="" />
      </h1>

      <div className="content">
        <Sources />
        <Transactions />
      </div>

      {loading != null && <div className="loading-overlay">
        <span>{loading}</span>
      </div>}
    </LoadingContext.Provider>
  </>;
};
