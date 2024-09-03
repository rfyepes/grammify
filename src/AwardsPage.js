import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import html2canvas from "html2canvas";

import Awards from "./Awards";
import Graphic from "./Graphic";
import Menu from "./Menu";
import Footer from "./Footer";

import { LuShare, LuDownload } from "react-icons/lu";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaHome } from "react-icons/fa";

import { generateNominations } from "./generateNominations";
import { retrieveTopTracks, getArtistImages, replaceImages, replaceImage, getAlbumPopularity } from "./fetchData";
import { SYMBOLS, PALETTES, AUTH_URL, EXAMPLE_NOMINATIONS, NULL_NOMINEE, NUM_NOMINATIONS } from "./Constants"


function ThemeButton({ theme, isActive, onClick }) {
  return (
    <div className="theme-option">
      <div className={isActive ? "option-button active-option" : 'option-button'} id={theme} onClick={onClick}>
      <span>{SYMBOLS[theme]}</span>
      </div>
      <div className="theme-label">{theme}</div>
    </div>
  );
}

function ControlPanel({ isTogglable, toggleWinnerSelection, season, changeSeason, toggleWinners, saveAndShare }) {
  return (
    <div className="control-panel">
      <div className="controls">
        <div className="controls-title">
          Control Panel
        </div>
        <div className="control">
          <div className="control-title">Winner Selection</div>
          <div className="control-options">
            <div className="winner-selector-option">
              <div className={isTogglable ? "option-button" : "option-button active-option"} id="algorithm-pick" onClick={() => toggleWinnerSelection("algorithm-pick")}>
                <span>🧮</span>
              </div>
              <div className="winner-selector-option-label">
                Let the algorithm choose!
              </div>
            </div>
            <div className="winner-selector-option">
              <div className={isTogglable ? "option-button active-option" : "option-button"} id="me-pick" onClick={() => toggleWinnerSelection("me-pick")}>
                <span>🤓</span>
              </div>
              <div className="winner-selector-option-label">
                Let me choose!
              </div>
            </div>
          </div>
        </div>
        <div className="control">
          <div className="control-title">Theme Selection</div>
          <div className="theme-wrap">
            <div className="control-options theme-selector-buttons">
              <ThemeButton theme="spring" isActive={season === "spring"} onClick={() => changeSeason("spring")} />
              <ThemeButton theme="summer" isActive={season === "summer"} onClick={() => changeSeason("summer")} />
              <ThemeButton theme="autumn" isActive={season === "autumn"} onClick={() => changeSeason("autumn")} />
              <ThemeButton theme="winter" isActive={season === "winter"} onClick={() => changeSeason("winter")} />
            </div>
          </div>
        </div>
        <div className="control save-and-share-wrapper">
        <div className="save-and-share" onClick={saveAndShare}>
          <span>Save and Share</span>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function AwardsPage({ accessToken, logOut }) {
  const [topTracks, setTopTracks] = useState(null);
  const [season, setSeason] = useState(Object.keys(PALETTES)[Math.floor(Math.random() * Object.keys(PALETTES).length)]);
  const [ogNominations, setOgNominations] = useState({
    albums: [],
    songs: [],
    artists: []
  });
  const [nominations, setNominations] = useState(ogNominations);
  const [canToggleWinners, setCanToggleWinners] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState(["", ""]);
  const [reauthenticate, setReauthenticate] = useState(false);
  
  const clearQueryParams = () => {
    navigate(0, { replace: true });
  }
  
  const addNominee = async (nominee, cat) => {
    const updateNominations = (n) => {
      let maxPopularity = 0;
      let maxPopularityIndex = 0;
      const newOgNoms = JSON.parse(JSON.stringify(ogNominations));
      const newNoms = JSON.parse(JSON.stringify(nominations));
      for (let i = 0; i < NUM_NOMINATIONS; i++) {
        newOgNoms[cat][i].isWinner = false;
        newNoms[cat][i].isWinner = false;//TODO?
        
        if (!newOgNoms[cat][i].empty && newOgNoms[cat][i].popularity > maxPopularity) {
          maxPopularityIndex = i;
          maxPopularity = newOgNoms[cat][i].popularity;
        }
        if (newOgNoms[cat][i].empty) {
          newOgNoms[cat][i].name = newNoms[cat][i].name = n.name;
          newOgNoms[cat][i].image = newNoms[cat][i].image = n.image;
          newOgNoms[cat][i].imageAlt = newNoms[cat][i].imageAlt = n.name + (cat == "artists") ? " profile image" : " album cover"; // TODO: ugh
          newOgNoms[cat][i].details = newNoms[cat][i].details = n.details;
          newOgNoms[cat][i].releaseDate = newNoms[cat][i].releaseDate = n.release_date;
          newOgNoms[cat][i].empty = newNoms[cat][i].empty = false;
          newOgNoms[cat][i].isWinner = false;
          newNoms[cat][i].isWinner = false;//TODO?
          newOgNoms[cat][i].popularity = newNoms[cat][i].popularity = n.popularity;
          
          if (n.popularity > maxPopularity) {
            maxPopularityIndex = i;
            maxPopularity = n.popularity;
          }

          break;
        } 

      }
      newOgNoms[cat][maxPopularityIndex].isWinner = true;
      newNoms[cat][maxPopularityIndex].isWinner = !canToggleWinners;


      
      // noms = await replaceImages(noms);
            
      setOgNominations(JSON.parse(JSON.stringify(newOgNoms)));
      setNominations(JSON.parse(JSON.stringify(newNoms)));

    };
    replaceImage(nominee.image).then((res) => {
      nominee.image = res;
      if (cat == "albums") {
        getAlbumPopularity(nominee.id, accessToken).then((res) => {
          nominee.popularity = res;
          updateNominations(nominee);
        });
      } else {
        updateNominations(nominee);
      }
    })
    
  };
  
  const toggleWinnerSelection = (id) => {
    let newNoms = JSON.parse(JSON.stringify(ogNominations));
    if (id === "algorithm-pick") {
      setNominations(JSON.parse(JSON.stringify(ogNominations)));
      setCanToggleWinners(false);
    } else if (id === "me-pick") {
      for (const category in newNoms) {
        newNoms[category].forEach((nominee) => {
          nominee.isWinner = false;
        });
      }
      setCanToggleWinners(true);
    }
    setNominations(newNoms);
  };
  
  const toggleWinners = (newWinner, category) => {
    let newNoms = JSON.parse(JSON.stringify(nominations));
    newNoms[category].forEach((nominee) => {
      nominee.isWinner = nominee.name === newWinner.name;
    });
    setNominations(newNoms);
  };
  
  const exportImage = () => {
    const missingNoms = (prev, n) => {
      return n.empty || prev;
    };
    if (nominations.songs.reduce(missingNoms, false) || nominations.albums.reduce(missingNoms, false) || nominations.artists.reduce(missingNoms, false)) {
      setAlert([
        "Oh you thought you were done? 🤭 That's funny.",
        "You're not done selecting the missing nominees!"
      ]);
      setShowAlert(true);
      return;
    } else if (!nominations.songs.some(n => n.isWinner) || !nominations.albums.some(n => n.isWinner) || !nominations.artists.some(n => n.isWinner)) {
      setAlert([
        "The nominees are revolting! 🫣",
        "They won't accept a tie! Select the winners or let the algorithm choose for you."
      ]);
      setShowAlert(true);
      return;
    }
    if (nominations.albums.length !== 0) {
      const imageDiv = document.getElementById("export-image");
      imageDiv.style.display = "block";
      html2canvas(imageDiv, { scale: 2, windowWidth: 1050 }).then(canvas => {
        imageDiv.style.display = "none";
        imageData.current.src = canvas.toDataURL("image/jpeg");
        setShowModal(true);
      });
    } else {
      alert("Error: wait a few seconds and try again.");
    }
  };
  
  const handleError = (status) => {
    if (status == 401) {
      setReauthenticate(true);
      setAlert([
        "😔 Access token expired 😔", 
        "Reauthenticate by signing in below."
      ]);
    } else {
      setReauthenticate(false);
      setAlert(["😬 HTTP Error 😬", `Status ${status}`]);
    }
    setShowAlert(true);
  };
  
  useEffect(() => {
    const getTopTracks = async () => {
      
      // Retrieve top tracks
      try {
        var tracks = {
          long_term: await retrieveTopTracks("long_term", accessToken),
          medium_term: await retrieveTopTracks("medium_term", accessToken),
          short_term: await retrieveTopTracks("short_term", accessToken)
        };
      } catch (error) {
        // if (error === 401) { // TODO: replace with Error object
        //   clearQueryParams();
        //   window.location.href = window.location.pathname;
        // } else {
        //   setLoadingMessage(error.toString());
        // }
        handleError(error.message);
        return;
      }
      
      setTopTracks(tracks);
    }
    getTopTracks();
  }, [accessToken]);
  
  useEffect(() => { 
    const getNominations = async () => {
      // TODO: first check if topTracks has enough data, 
      //       OR just check if returned noms have 5 per category
      let noms = generateNominations(topTracks);
      // TODO: uncomment and refine
      if (noms.songs.length !== 5 || noms.albums.length !== 5 || noms.artists.length !== 5) {
        setAlert([
          <>🤩&nbsp;&nbsp;It's your lucky day!&nbsp;&nbsp;🤩</>, 
          <>Your top tracks don't contain enough eligible music to generate all nominees, so...<p style={{fontWeight: "bold"}}>...you get to hand-pick the rest!</p></>
        ]);
        setReauthenticate(false);
        setShowAlert(true);
      }
      
      for (let i = 0; i < NUM_NOMINATIONS; i++) {
        if (noms.songs.length - 1 < i) {
          noms.songs.push(NULL_NOMINEE);
        }
        if (noms.albums.length - 1 < i) {
          noms.albums.push(NULL_NOMINEE);
        }
        if (noms.artists.length - 1 < i) {
          noms.artists.push(NULL_NOMINEE);
        }
      }
      
      const artistImages = await getArtistImages(noms.artists, accessToken);
      noms.artists = noms.artists.map((artist, index) => {
        return {
          ...artist,
          image: artistImages[index]
        };
      });
      
      // noms = {
      //   songs: EXAMPLE_NOMINATIONS.songs.slice(0, 5),
      //   albums: EXAMPLE_NOMINATIONS.albums.slice(0, 5),
      //   artists: EXAMPLE_NOMINATIONS.artists.slice(0, 5)
      // };
      
      noms = await replaceImages(noms);
            
      setOgNominations(JSON.parse(JSON.stringify(noms)));
      setNominations(JSON.parse(JSON.stringify(noms)));
    };
    if (topTracks !== null) {
      getNominations();
    }
  }, [topTracks, accessToken]);
  
  useEffect(() => {
    if (nominations.albums.length !== 0) {
      setLoading(false);
    }
  }, [nominations]);
  const [showModal, setShowModal] = useState(false);
  const imageData = useRef(null);
  useEffect(() => {
    if (!isLoading && (showModal || showAlert)) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [showModal, showAlert, isLoading]);
  
  const handleDownload = () => {
    var link = document.createElement('a');
    link.download = 'my-grammify.jpg';
    link.href = imageData.current.src;
    link.click();
  };
  
  const handleShare = async () => {
  if (navigator.share) {
    try {
      const response = await fetch(imageData.current.src);
      const blob = await response.blob();
      const file = new File([blob], "my-grammify.jpg", { type: "image/jpeg" });
      
      await navigator.share({
        title: "GRAMMIFY",
        text: "Check out my GRAMMIFY lineup!", // TODO: insert grammify link
        files: [file],
      });
      
      console.log("Share successful");
    } catch (error) {
      console.error("Error sharing: ", error);
    }
  } else {
    console.error("Share API not supported");
  }
};

  return (
    <>
    <div className="main-wrapper">
      <Menu showLogOut={true} logOut={logOut} />
      <div className="main-body" id="user-grammify">
        {
          isLoading 
          ? <div className="loading-message">{loadingMessage}</div>
          : <>
              <Awards nominations={nominations} palette={PALETTES[season]} toggleWinners={toggleWinners} isChoosable={canToggleWinners} accessToken={accessToken} addNominee={addNominee} handleError={handleError} />
              <ControlPanel isTogglable={canToggleWinners} toggleWinnerSelection={toggleWinnerSelection} season={season} changeSeason={setSeason} saveAndShare={exportImage} />
            </>
        }
      </div>
      <Footer />
    </div>
    <div className="modal" onClick={() => setShowAlert(reauthenticate)} style={{display: (showAlert ? "block" : "none")}}>
    <div className="alert-modal" onClick={(e) => {e.stopPropagation()}}>
      <div className="alert-modal-inner">
        <div className="alert">
          <div className="alert-header">{alert[0]}</div>
          <div className="alert-body">{alert[1]}</div>
        </div>
        { reauthenticate ? 
          <>
          <div className="description-block sign-in" style={{ alignSelf: "center" }} onClick={() => window.open(AUTH_URL, "_self")}>
            Sign in with Spotify
          </div>
          <div className="export-close">
            <Link to="/" onClick={logOut} style={{textDecoration: "none"}}>
              <div className="export-close-button">
                <FaHome />
                <span style={{marginLeft: "5px"}}>Home</span>
              </div>
            </Link>
          </div>
          </>
          :
          <div className="export-close">
            <div className="export-close-button" onClick={() => setShowAlert(false)}>
              <AiOutlineCloseCircle />
              <span>Close</span>
            </div>
          </div>
        }
      </div>
    </div>
    </div>
    <div className="modal" onClick={() => setShowModal(false)} style={{display: (showModal ? "block" : "none")}}>
      <div className="export-modal" onClick={(e) => {e.stopPropagation()}}>
        <div className="export-modal-inner">
          <div className="info-close-button-mini">
            <div id="info-close-button-mini" onClick={() => setShowModal(false)}>&times;</div>
          </div>
          <img ref={imageData} alt="Screenshot" />
          <div className="export-buttons">
            <div className="export-button" onClick={handleDownload}>
              <LuDownload />
              <span>Download</span>
            </div>
            <div className="export-button" onClick={handleShare}>
              <LuShare />
              <span>Share</span>
            </div>
          </div>
          <div className="export-close">
          <div className="export-close-button" onClick={() => setShowModal(false)}>
            <AiOutlineCloseCircle />
            <span>Close</span>
          </div>
          </div>
        </div>
      </div>
    </div>
    <Graphic nominations={nominations} season={PALETTES[season]} forExport={true} />
    </>
  );
}
