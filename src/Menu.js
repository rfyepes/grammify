import { useState, useEffect } from 'react';

// Icons from https://react-icons.github.io/react-icons
import { RxInfoCircled } from 'react-icons/rx';
import { TbLogout2 } from 'react-icons/tb';
import { Link } from 'react-router-dom';

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
      <div className="info-title info-block">
        Welcome to SpotiGrammy!
      </div>
      <div className="info-block">
        <div className="info-block-header">
          What is SpotiGrammy?
        </div>
        <div className="info-block-content">
          SpotiGrammy is a personalized adaptation of the GRAMMY® Awards based on your most-listened-to Spotify tracks, albums, and artists. SpotiGrammy creates a graphic showcasing nominees and a winner for each category: Song of the Year, Album of the Year, and Artist of the Year. Note that SpotiGrammy is not affiliated with the actual GRAMMY® Awards.
          <br />
          <br />
          SpotiGrammy was inspired by <a href="https://www.instafest.app/home">Instafest</a>, which creates a festival lineup based on your Spotify data.
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-header">
          What are the eligibility requirements? 
        </div>
        <div className="info-block-content">
          SpotiGrammy eligibility is loosely based on the Grammy Awards, taking place in February. The eligibility period is October to the end of September. For example, tracks/albums released between October 2022 and September 2023 are eligible for SpotiGrammy 2024. Albums are only eligible if they contain at least 5 tracks, while songs are only eligible if they are at least 1 minute long. 
        </div>
      </div>
      <div className="info-block">
        <div className="info-block-header">
          How are nominees ordered?
        </div>
        <div className="info-block-content">
          Songs and albums are presented chronologically by release date, artists are presented in alphabetical order by first name.
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
      <Link to="/" className="home-button" onClick={logOut}><div className="title">SpotiGrammy</div></Link>
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
