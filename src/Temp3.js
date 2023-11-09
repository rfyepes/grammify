import React, { useState, useEffect } from 'react';
import { generateNominations } from "./dataManager";
import { Link } from 'react-router-dom';
import Temp2 from "./Temp2";
import Menu from "./Menu";

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import html2canvas from "html2canvas";
import html2pdf from 'html2pdf.js';

// TODO: cite
import { RxInfoCircled } from 'react-icons/rx';
import { TbLogout2 } from 'react-icons/tb';

import grammy from './grammy3.png'
// 🐣 🐦‍⬛🐬🐳🐠🌲🌴🌱🌿🍂🍁🌾🪺🌷☀️❄️⛄️🏝️🏖️
// 
// 🌷🌴🍂🌲
// 🌷☀️🍂❄️
const SYMBOLS = {
  spring: "🌷",
  summer: "🌴",
  autumn: "🍂",
  winter: "⛄️"
};

const PALETTES = {
  spring: ["#e0c9a4", "#e6bfaa", "#BABD8D"],
  summer: ["#E9B41D", "#F15E34", "#0087AE"],
  autumn: ["#d07f0d", "rgba(168,63,44,1)", "#532e22"],
  winter: ["#9FB3D3", "#383D57", "#564238"]
};

// TODO: not just overview image, but one image (looks like spotify wrapped)
// for each category? if they only want to share one
function Nominee({ data, isArtist, makeWinner, isWinnable }) {
  const visibleGrammy = {
    display: "block",
    opacity: "1"
  };
  const imageStyle = {
    borderRadius: isArtist ? "50%" : "0%",
  };
  const nameStyle = {
    textAlign: isArtist ? "center" : "left",
  };
  
  return (
    <div className="nominee">
      <div className="nominee-wrap">
        <div className={isWinnable ? "image-wrap user-select" : "image-wrap"} onClick={isWinnable ? makeWinner : () => {}}>
          <img src={data.image} alt={data.imageAlt} className="nominee-img" style={imageStyle} />
          <img src={grammy} alt="grammy icon" className="grammy" style={data.isWinner ? visibleGrammy : {}}/>
        </div>
        <div className="nominee-name" style={nameStyle}>
          {data.name}
          {
            (data.details === null) 
              ? "" 
              : <div className="nominee-details">
                  {data.details}
                </div>
          }
        </div>
      </div>
    </div>
  );
}

function Award({ category, nominees, color, makeWinner, isChoosable }) {
  const style = {
    background: color
  };
  const isArtist = category == "Artist of the Year";
  return (
    <div className="award" style={style}>
      <div className="category-title">{category}</div>
      <div className="nominees">
        <div className="nominees-wrap">
          {nominees.map((nominee) => { return <Nominee data={nominee} isArtist={isArtist} makeWinner={() => { makeWinner(nominee) }} isWinnable={isChoosable} />; })}
        </div>
      </div>
    </div>
  );
}

function Awards({ nominations, palette, toggleWinners, isChoosable }) {
  console.log("rendering awards - noms:");
  console.log(nominations);
  return (
    <div className="awards" id="temp">
      <Award category="Song of the Year" nominees={nominations.records} color={palette[0]} makeWinner={(nom) => { toggleWinners(nom, "records") }} isChoosable={isChoosable} />
      <Award category="Album of the Year" nominees={nominations.albums} color={palette[1]} makeWinner={(nom) => { toggleWinners(nom, "albums") }} isChoosable={isChoosable} />
      <Award category="Artist of the Year" nominees={nominations.artists} color={palette[2]} makeWinner={(nom) => { toggleWinners(nom, "artists") }} isChoosable={isChoosable} />
    </div>
  );
}

async function retrieveTopTracks(timeRange) {
  
  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`, {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem("accessToken")
    }
  });
  
  const data = await response.json();
  
  return (data.next === null) ? data.items : data.items.concat(await retrieveTopTracks(timeRange, data.next));
  
}

// TODO: remove!!!!
async function replaceImages(nominations) {
  
  const fetchImage = (elem, index) => {
    return new Promise((resolve, reject) => {
    fetch(elem.image)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a FileReader to read the image data
        const reader = new FileReader();

        reader.onload = () => {
          // The 'reader.result' contains the base64 data URL
          const dataURL = reader.result;
          // Use 'dataURL' in your application
          resolve(dataURL);
        };
      
      // Convert the blob to a base64 data URL
      reader.readAsDataURL(blob);
    })
    .catch((error) => {
      reject(error);
    });
  });
  };
      
      const makeReplaceImage = (images) => {
        return (elem, index) => {
          let newElem = elem;
          newElem.image = images[index];
          return newElem;
        };
      }
  
  let recordImages = await nominations.records.map(fetchImage);
  let albumImages = await nominations.albums.map(fetchImage);
  let artistImages = await nominations.artists.map(fetchImage);
  
  nominations.records = nominations.records.map(makeReplaceImage(await Promise.all(recordImages)));
  nominations.albums = nominations.albums.map(makeReplaceImage(await Promise.all(albumImages)));
  nominations.artists = nominations.artists.map(makeReplaceImage(await Promise.all(artistImages)));
  
  return nominations;
}

async function getArtistImages(artists) {
  
  const images = await artists.map(async (artist) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem("accessToken")
          }
        });
        const data = await response.json();
        // alert(JSON.stringify(data));
        return data.images[1].url; // TODO: image array may vary
    } catch (error) {
      throw error;
    }
  })
  return await Promise.all(images);
}

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
  //  <WinnerButton label="Let the algorithm choose!" symbol="🧮" onClick={toggleWinners} />
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
            <ThemeButton theme="spring" isActive={season == "spring"} onClick={() => changeSeason("spring")} />
            <ThemeButton theme="summer" isActive={season == "summer"} onClick={() => changeSeason("summer")} />
            <ThemeButton theme="autumn" isActive={season == "autumn"} onClick={() => changeSeason("autumn")} />
            <ThemeButton theme="winter" isActive={season == "winter"} onClick={() => changeSeason("winter")} />
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

export default function Temp3() {
  const [topTracks, setTopTracks] = useState(null);
  const [season, setSeason] = useState(Object.keys(PALETTES)[Math.floor(Math.random() * Object.keys(PALETTES).length)]);
  const [ogNominations, setOgNominations] = useState({
    albums: [],
    records: [],
    artists: []
  });
  const [nominations, setNominations] = useState(ogNominations);
  const [canToggleWinners, setCanToggleWinners] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(true);
  
  const toggleWinnerSelection = (id) => {
    let newNoms = JSON.parse(JSON.stringify(ogNominations));
    if (id == "algorithm-pick") {
      setNominations(JSON.parse(JSON.stringify(ogNominations)));
      setCanToggleWinners(false);
    } else if (id == "me-pick") {
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
      nominee.isWinner = nominee.name == newWinner.name;
      // console.log("setting " + nominee.name + " to " + (nominee.name == newWinner.name ? "winner" : "loser"));
    });
    setNominations(newNoms);
  };
  
  const exportImage = () => {
    if (nominations.albums.length != 0) {
          const imageDiv = document.getElementById("export-image");
          imageDiv.style.display = "block";
          html2canvas(imageDiv, { scale: 2 }).then(canvas => {
            imageDiv.style.display = "none";
            // document.body.append(canvas);
            var link = document.createElement('a');
            // link.download = 'my-spotigrammy.jpg';
            link.href = canvas.toDataURL("image/jpeg");
            console.log(canvas.toDataURL("image/jpeg"));
            link.click();
          });
    } else {
      alert("Error: wait a few seconds and try again.");
    }
  };
  
  useEffect(() => {
    const getTopTracks = async () => {
      // alert("in GET TOP TRACKS");
      const params = new URLSearchParams(window.location.hash.slice(1));
      
      const accessToken = params.get('access_token');
      sessionStorage.setItem("accessToken", accessToken);
      const error = params.get('error');
      const tracks = {
        long_term: await retrieveTopTracks("long_term"),
        medium_term: await retrieveTopTracks("medium_term"),
        short_term: await retrieveTopTracks("short_term")
      };
      setTopTracks(tracks);
    }
    getTopTracks();
  }, []);
  
  useEffect(() => { 
    const getNominations = async () => {
      let noms = generateNominations(topTracks);
      const artistImages = await getArtistImages(noms.artists);
      noms.artists = noms.artists.map((artist, index) => {
        return {
          ...artist,
          image: artistImages[index]
        };
      });
      
      // noms = {
      //   records: [
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
  }, [topTracks]);
  
  useEffect(() => {
    if (nominations.albums.length !== 0) {
      setLoading(false);
    }
  }, [nominations]);
  
  if (isLoading) {
    return (
      <div className="main-wrapper">
        <Menu showLogOut={true} />
        <div className="main-body">
          <div className="loading-message">
            Loading results...
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
    <div className="main-wrapper">
      <Menu showLogOut={true} />
      <div className="main-body">
        <Awards nominations={nominations} palette={PALETTES[season]} toggleWinners={toggleWinners} isChoosable={canToggleWinners} />
        <ControlPanel isTogglable={canToggleWinners} toggleWinnerSelection={toggleWinnerSelection} season={season} changeSeason={setSeason} saveAndShare={exportImage} />
      </div>
      <div className="footer">
        <div className="footer-content">Made by <a href="https://www.linkedin.com/in/robertyepes/" target="_blank">Robert Yepes</a></div>
        <div className="footer-content"><a href="/privacy" target="_blank">Privacy Policy</a></div>
      </div>
    </div>
    <Temp2 nominations={nominations} season={PALETTES[season]} />
    </>
  );
}