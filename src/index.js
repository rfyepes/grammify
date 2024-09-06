import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./styles/home-styles.css";
import "./styles/awards-styles.css";
import "./styles/graphic-styles.css";
import "./styles/privacy-styles.css";
import "./styles/carosel-styles.css";
import "./styles/modal-styles.css";

import HomePage from "./HomePage";
import AwardsPage from "./AwardsPage";
import PrivacyPage from "./PrivacyPage";

// TODO: 
//  = find alternate way of indicating winner?
//  = Remove space between GRAMMIFY and 2025? (menu and graphic)
//  = shadow behind images on graphic?
//  = finalize font size for graphic
//  = remove unneeded font imports
//  - glassomorphic design for modal?
//  = images - smallest dimension rather than last in array?
//  = fix modal background scroll on mobile
//  = update secondary font?
//  = disable text highlight for buttons? footer spotify logo?
// then:
//  - remove strict mode 
//  - update redirect uri (homepage.js and package.json)
//  - remove hard-coded noms

const root = createRoot(document.getElementById("root"));
root.render(
    <HashRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="awards" element={<AwardsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
); // TODO: remove strict mode once complete? also remove awards path?