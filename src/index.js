import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/home-styles.css";
import "./styles/awards-styles.css";
import "./styles/graphic-styles.css";
import "./styles/privacy-styles.css";

import HomePage from "./HomePage";
import AwardsPage from "./AwardsPage";
import PrivacyPage from "./PrivacyPage";
import NoPage from "./NoPage";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="awards" element={<AwardsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
); // TODO: remove strict mode once complete?