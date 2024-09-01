import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./styles/home-styles.css";
import "./styles/awards-styles.css";
import "./styles/graphic-styles.css";
import "./styles/privacy-styles.css";
import "./styles/carosel-styles.css";

// import "./test-styles.css";

import HomePage from "./HomePage";
import AwardsPage from "./AwardsPage";
import PrivacyPage from "./PrivacyPage";
import TestPage from "./TestPage";

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
//  = make seperate CSS for touchscreen (media query hover?)
//       = make active button pop a bit
//       = make winner selection animate grammy award (bounce)
//  = fix footer
//  = fix flexbox column-reverse issue (doesn't work on mobile)
//  = Remove space between GRAMMIFY and 2025? (menu and graphic)
//  = shadow behind images on graphic?
//  = finalize font size for graphic
//  = remove unneeded font imports
//  = change 401 behaviour - refreshes page when signing in...
//  - glassomorphic design for modal?
//  = images - smallest dimension rather than last in array?
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
        <Route path="test" element={<TestPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
); // TODO: remove strict mode once complete? also remove awards path?