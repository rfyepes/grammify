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
  autumn: ["#dda15e", "#bc6c25", "#606c38"], // original: ["#d07f0d", "#a83f2c", "#532e22"]
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
    if (nominations.albums.length !== 0) {
      const imageDiv = document.getElementById("export-image");
      imageDiv.style.display = "block";
      html2canvas(imageDiv, { scale: 2 }).then(canvas => {
        imageDiv.style.display = "none";
        var link = document.createElement('a');
        link.download = 'my-grammify.jpg';
        link.href = canvas.toDataURL("image/jpeg");
        link.click();
        ///////
        // navigator.share(canvas.toDataURL("image/jpeg"));
        // var image = document.createElement('img');
        // image.src = canvas.toDataURL("image/jpeg");
        // image.style = "width: 100px";
        // document.body.appendChild(image);
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
      // TODO: first check if topTracks has enough data, 
      //       OR just check if returned noms have 5 per category
      let noms = generateNominations(topTracks);
      // TODO: uncomment and refine
      // if (noms.songs.length !== 5 || noms.albums.length !== 5 || noms.artists.length !== 5) {
      //   setLoadingMessage("ERROR: Insufficient listening data (sorry 😢)");
      //   setLoading(true);
      //   return;
      // }
      const artistImages = await getArtistImages(noms.artists, accessToken);
      noms.artists = noms.artists.map((artist, index) => {
        return {
          ...artist,
          image: artistImages[index]
        };
      });
      
      // noms = {
      //   songs: [
      //     {
      //       name: "Flowers",
      //       details: "Miley Cyrus",
      //       image: "https://i.scdn.co/image/ab67616d00001e02cd222052a2594be29a6616b5",
      //       isWinner: false
      //     },
      //     {
      //       name: "Boy's a liar Pt. 2",
      //       details: "PinkPantheress, Ice Spice",
      //       image: "https://i.scdn.co/image/ab67616d00001e029567e1aa41657425d046733b",
      //       isWinner: false
      //     },
      //     {
      //       name: "Cupid - Twin Ver.",
      //       details: "FIFTY FIFTY",
      //       image: "https://i.scdn.co/image/ab67616d00001e0237c0b3670236c067c8e8bbcb",
      //       isWinner: false
      //     },
      //     {
      //       name: "FLOWER",
      //       details: "JISOO",
      //       image: "https://i.scdn.co/image/ab67616d00001e02f35b8a6c03cc633f734bd8ac",
      //       isWinner: false
      //     },
      //     {
      //       name: "vampire",
      //       details: "Olivia Rodrigo",
      //       image: "https://i.scdn.co/image/ab67616d00001e02e85259a1cae29a8d91f2093d",
      //       isWinner: false
      //     }
      //   ],
      //   albums: [
      //     {
      //       name: "Midnights",
      //       details: "Taylor Swift",
      //       image: "https://i.scdn.co/image/ab67616d00001e02bb54dde68cd23e2a268ae0f5",
      //       isWinner: false
      //     },
      //     {
      //       name: "SOS",
      //       details: "SZA",
      //       image: "https://i.scdn.co/image/ab67616d00001e0270dbc9f47669d120ad874ec1",
      //       isWinner: false
      //     },
      //     {
      //       name: "Red Moon In Venus",
      //       details: "Kali Uchis",
      //       image: "https://i.scdn.co/image/ab67616d00001e0281fccd758776d16b87721b17",
      //       isWinner: false
      //     },
      //     {
      //       name: "Did you know that there's a tunnel under Ocean Blvd",
      //       details: "Lana Del Rey",
      //       image: "https://i.scdn.co/image/ab67616d00001e0259ae8cf65d498afdd5585634",
      //       isWinner: false
      //     },
      //     {
      //       name: "UTOPIA",
      //       details: "Travis Scott",
      //       image: "https://i.scdn.co/image/ab67616d00001e02881d8d8378cd01099babcd44",
      //       isWinner: false
      //     },
      //   ],
      //   artists: [
      //     {
      //       name: "Gracie Abrams",
      //       image: "https://i.scdn.co/image/ab67616100005174416bd8a66bfcbc545c2009ac",
      //       isWinner: false
      //     },
      //     {
      //       name: "NewJeans",
      //       image: "https://i.scdn.co/image/ab676161000051745da361915b1fa48895d4f23f",
      //       isWinner: false
      //     },
      //     {
      //       name: "Noah Kahan",
      //       image: "https://i.scdn.co/image/ab676161000051747bfba04955b666b8b8219541",
      //       isWinner: false
      //     },
      //     {
      //       name: "Shakira",
      //       image: "https://i.scdn.co/image/ab67616100005174284894d68fe2f80cad555110",
      //       isWinner: false
      //     },
      //     {
      //       name: "Taylor Swift",
      //       image: "https://i.scdn.co/image/ab67616100005174859e4c14fa59296c8649e0e4",
      //       isWinner: false
      //     }
      //   ]
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
