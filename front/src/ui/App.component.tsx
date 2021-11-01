import "./App.style.scss"
import React, { useState } from "react";

import Sources from "./components/sources/Sources.component"

import { LoadingContext } from "./contexts/loadingContext";

export default () => {
  const [loading, setLoading] = useState<string | null>(null)

  return <>
    <LoadingContext.Provider value={{ setLoading }}>
      <h1>Expenses</h1>
      <Sources />

      {loading != null && <div className="loading-overlay">
        <span>{loading}</span>
      </div>}

    </LoadingContext.Provider>
  </>;
};
