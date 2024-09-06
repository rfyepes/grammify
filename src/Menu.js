import { useState, useEffect } from 'react';

// Icons from https://react-icons.github.io/react-icons
import { RxInfoCircled } from 'react-icons/rx';
import { TbLogout2 } from 'react-icons/tb';
import { Link } from 'react-router-dom';

import { AWARD_YEAR } from "./Constants"

function MenuButton({ icon: Icon, onClick, isVisible }) {
  return (
    <div className="button" onClick={onClick}>
      <span><Icon /></span>
    </div>
  )
}

function Info({ hideInfo }) {
  return (
    <div className="info-modal" onClick={(e) => {e.stopPropagation()}}>
      <div className="info-close-button-mini">
        <div id="info-close-button-mini" onClick={hideInfo}>&times;</div>
      </div>
      <div className="info-title">
        Welcome to GRAMMIFY!
      </div>
      <div className="info-block">
        <div className="info-block-header">
          What is GRAMMIFY?
        </div>
        <div className="info-block-content">
          GRAMMIFY is a personalized take on the GRAMMY Awards® based on your most-listened-to Spotify tracks, albums, and artists. GRAMMIFY creates a graphic showcasing nominees and a winner for each category: Song of the Year, Album of the Year, and Artist of the Year. GRAMMIFY is not affiliated with the actual GRAMMY Awards®.
          <br />
          <br />
          GRAMMIFY was inspired by <a href="https://www.instafest.app/home" target="_blank" rel="noreferrer">Instafest</a>, which creates a festival lineup based on your Spotify data.
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-header">
          What are the eligibility requirements? 
        </div>
        <div className="info-block-content">
          GRAMMIFY eligibility is loosely based on the GRAMMY Awards®, taking place in February. The eligibility period is September 16 to August 30. For example, tracks/albums released between September 16st, 2023 and August 30th, 2024 are eligible for GRAMMIFY 2025. 
          <br />
          <br />
          Albums are eligible if they contain at least 5 tracks, while songs are eligible if they are at least 1 minute long. 
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-header">
          How will my data be used?
        </div>
        <div className="info-block-content">
          Your data is not stored, collected, or shared with any third parties. For more details, see the <a href="/#/privacy" target="_blank">Privacy Policy</a>.
        </div>
      </div>
      <div className="info-close info-block">
        <div id="info-close-button" onClick={hideInfo}>Close</div>
      </div>
    </div>
  );
}

export default function Menu({ showLogOut, logOut }) {
  
  const [showModal, setShowModal] = useState(false);
  
  const logOutStyle = {
    color: "black",
    visibility: showLogOut ? "visible" : "hidden"
  };
  
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [showModal]);
  
  return (
    <>
    <div className="menu">
      <MenuButton icon={RxInfoCircled} onClick={() => setShowModal(true)} />
      <Link to="/" className="home-button" onClick={logOut}><div className="title">GRAMMIFY&nbsp;<span style={{color: "#b89a5a"}}>{AWARD_YEAR}</span></div></Link>
      <Link to="/" style={logOutStyle} onClick={logOut}>
        <MenuButton icon={TbLogout2} onClick={() => {}} />
      </Link>
    </div>
    <div className="modal" onClick={() => setShowModal(false)} style={{display: (showModal ? "block" : "none")}}>
      <Info hideInfo={() => setShowModal(false)} />
    </div>
    </>
  );
}
