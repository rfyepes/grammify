import { useState, useEffect } from "react";
import html2canvas from "html2canvas";

import Awards from "./Awards";
import Graphic from "./Graphic";
import Menu from "./Menu";
import Footer from "./Footer";

import generateNominations from "./generateNominations";
import { retrieveTopTracks, getArtistImages, replaceImages } from "./fetchData";

const SYMBOLS = {
  spring: "🌷",
  summer: "🌴",
  autumn: "🍂",
  winter: "⛄️"
};

const PALETTES = {
  spring: ["#e0c9a4", "#e6bfaa", "#bAbD8D"],
  summer: ["#e9b41d", "#f15e34", "#0087ae"],
  autumn: ["#d07f0d", "#a83f2c", "#532e22"],
  winter: ["#9fb3d3", "#383d57", "#564238"]
};

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
          <div className="control-options theme-selector-buttons">
            <ThemeButton theme="spring" isActive={season === "spring"} onClick={() => changeSeason("spring")} />
            <ThemeButton theme="summer" isActive={season === "summer"} onClick={() => changeSeason("summer")} />
            <ThemeButton theme="autumn" isActive={season === "autumn"} onClick={() => changeSeason("autumn")} />
            <ThemeButton theme="winter" isActive={season === "winter"} onClick={() => changeSeason("winter")} />
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
  
  const toggleWinnerSelection = (id) => {
    let newNoms = JSON.parse(JSON.stringify(ogNominations));
    if (id === "algorithm-pick") {
      setNominations(JSON.parse(JSON.stringify(ogNominations)));
      setCanToggleWinners(false);
    } else if (id === "me-pick") {
      for (const category in newNoms) {
        if (category === "year") continue;
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
    if (nominations.albums.length !== 0) {
      const imageDiv = document.getElementById("export-image");
      imageDiv.style.display = "block";
      html2canvas(imageDiv, { scale: 2 }).then(canvas => {
        imageDiv.style.display = "none";
        var link = document.createElement('a');
        link.download = 'my-spotigrammy.jpg';
        link.href = canvas.toDataURL("image/jpeg");
        link.click();
      });
    } else {
      alert("Error: wait a few seconds and try again.");
    }
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
        setLoadingMessage(error.toString());
        return;
      }

      setTopTracks(tracks);
    }
    getTopTracks();
  }, [accessToken]);
  
  useEffect(() => { 
    const getNominations = async () => {
      let noms = generateNominations(topTracks);
      const artistImages = await getArtistImages(noms.artists, accessToken);
      noms.artists = noms.artists.map((artist, index) => {
        return {
          ...artist,
          image: artistImages[index]
        };
      });

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
  
  return (
    <>
    <div className="main-wrapper">
      <Menu showLogOut={true} logOut={logOut} />
      <div className="main-body">
        {
          isLoading 
          ? <div className="loading-message">{loadingMessage}</div>
          : <>
              <Awards nominations={nominations} palette={PALETTES[season]} toggleWinners={toggleWinners} isChoosable={canToggleWinners} />
              <ControlPanel isTogglable={canToggleWinners} toggleWinnerSelection={toggleWinnerSelection} season={season} changeSeason={setSeason} saveAndShare={exportImage} />
            </>
        }
      </div>
      <Footer />
    </div>
    <Graphic nominations={nominations} season={PALETTES[season]} />
    </>
  );
}
