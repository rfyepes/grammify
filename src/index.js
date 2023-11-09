import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./styles.css";
import "./main-styles.css";
import "./temp2-styles.css";
import "./temp3-styles.css";
import "./privacy.css";

import App from "./App";
import Callback from "./Callback";
import Temp2 from "./Temp2";
import Temp3 from "./Temp3";
import Privacy from "./Privacy";
import NoPage from "./NoPage";

export default function App1() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="callback" element={<Temp3 />} />
        <Route path="privacy" element={<Privacy />} />
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