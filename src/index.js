import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./temp2-styles.css";

import App from "./App";
import Callback from "./Callback";
import Temp2 from "./Temp2";
import NoPage from "./NoPage";

export default function App1() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="callback" element={<Temp2 />} />
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