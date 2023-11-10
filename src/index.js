import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./styles/home-styles.css";
import "./styles/awards-styles.css";
import "./styles/graphic-styles.css";
import "./styles/privacy-styles.css";

import HomePage from "./HomePage";
import AwardsPage from "./AwardsPage";
import PrivacyPage from "./PrivacyPage";

// TODO: 
//  = [DONE] fix album size issue on mobile
//  = fix artist padding issue?
//  = find alternate way of indicating winner
//  = change domian name 😭 (updating header, info modal, example, image, graphic, app name)
// then:
//  - remove strict mode 
//  - update redirect uri 
//  - remove hard-coded noms

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="awards" element={<AwardsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  </StrictMode>
); // TODO: remove strict mode once complete? also remove awards path?