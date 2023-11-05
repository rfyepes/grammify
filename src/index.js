import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

import App from "./App";
import Callback from "./Callback";
import NoPage from "./NoPage";

export default function App1() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="callback" element={<Callback />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App1 />
  </StrictMode>
); // TODO: remove strict mode once complete?