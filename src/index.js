import React from "react";
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
//  = [DONE] fix artist padding issue?
//  = fix export image overflow when long titles
//  = find alternate way of indicating winner?
//  = [DONE] use image placeholder if no image
//  = [DONE] fix image stretch for non-square images
//  = handle empty dataset (not enough listening history)
//  = improve responsive design: sign in above image, etc.
//  = change domian name 😭 (updating header, info modal, example, image, graphic, app name)
//    Grammify?
//  = make height of each award category the same? match the max?
// then:
//  - remove strict mode 
//  - update redirect uri 
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