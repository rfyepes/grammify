import React, { useState, useEffect } from 'react';
import { generateNominations } from "./dataManager";

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import html2canvas from "html2canvas";

// TODO: cite
import { RxInfoCircled } from 'react-icons/rx';
import { TbLogout2 } from 'react-icons/tb';

import grammy from './grammy.png'

const PALETTES = {
  spring: ["#fa92b1", "#94DE8B", "#F4DB87"],
  summer: ["#FFDA03", "#608f07", "#006994"],
  autumn: ["#d07f0d", "rgba(190, 89, 70, 1)", "#532e22"],
  winter: ["#FFFAF4", "#ABDCF2", "#D3CBE5"]
}

// TODO: not just overview image, but one image (looks like spotify wrapped)
// for each category? if they only want to share one
function Nominee({ data }) {
  const grammyStyle = {
    display: data.isWinner ? "block" : "none"
  };
  // TODO: make artist image round?
  
  return (
    <div className="nominee">
      <div className="image-wrap">
        <img src={data.image} alt={data.imageAlt} className="nominee-img" />
        <img src={grammy} alt="grammy icon" className="grammy" style={grammyStyle}/>
      </div>
      <div class="nominee-name">
        {data.name}
        {
          (data.details === null) 
            ? "" 
            : <div class="nominee-details">
                {data.details}
              </div>
        }
      </div>
    </div>
  );
}

function Award({ category, nominees, color }) {
  const style = {
    background: color
  };
  return (
    <div className="award" style={style}>
      <div className="category-title">{category}</div>
      <div className="nominees">
      {nominees.map((nominee) => { return <Nominee data={nominee} />; })}
      </div>
    </div>
  );
}

function Awards({ nominations, palette }) {
  return (
    <div className="awards" id="temp">
      <Award category="Song of the Year" nominees={nominations.records} color={palette[0]}/>
      <Award category="Album of the Year" nominees={nominations.albums} color={palette[1]}/>
      <Award category="Artist of the Year" nominees={nominations.artists} color={palette[2]}/>
    </div>
  );
}

function MenuButton({ icon: Icon, onClick }) {
  return (
    <div className="button" onClick={onClick}>
      <span><Icon /></span>
    </div>
  )
}

function MenuBar() {
  function handleClick() {
    // alert("clicked!")
    const albumDiv = document.getElementById('temp');


    let iframe = document.createElement("iframe");
    // iframe.style.position = 'absolute';
    // iframe.style.left = '-10000px'; // Position it off-screen
    iframe.style.width = "750px";
    iframe.style.height = "500px";
    document.body.appendChild(iframe);
    // add html to iframe
    // iframe.srcdoc = document.getElementById('temp').outerHTML;
    
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = 'styles.css'; // Replace with the correct path to your CSS file

    // Append the <link> element to the iframe's <head>
    iframe.contentDocument.head.appendChild(linkElement);
    
    iframe.contentDocument.body.innerHTML = document.getElementById('temp').outerHTML;

    

    // wait for iframe to load
    iframe.addEventListener("load", () => {
      
      htmlToImage.toPng(iframe.contentWindow.document.body)
      .then(function (dataUrl) {
        let link = document.createElement('a');
        link.href = dataUrl; // Set the base64 data as the link's href
        link.download = 'image.png'; // Set the desired filename for the download

        // Trigger a click event on the anchor element to initiate the download
        link.click();
      });
       // use html2canvas to save the webpage
       // html2canvas(iframe.contentWindow.document.body).then(function(canvas) {
       //   // document.body.removeChild(iframe);
       //   let filename = "image.jpg";
       //   let link = document.createElement("a");
       //   link.download = filename.toLowerCase();
       //   canvas.toBlob( function(blob) {
       //          link.href = URL.createObjectURL(blob);
       //          link.click();
       //      }, 'image/jpg');
       //   });
    });
  }
  
  return (
    <div className="menu">
      <MenuButton icon={RxInfoCircled} onClick={handleClick} />
      <div className="title">SpotiGrammy</div>
      <MenuButton icon={TbLogout2} onClick={handleClick} />
    </div>
  );
}

async function retrieveTopTracks(timeRange, next = "https://api.spotify.com/v1/me/top/tracks") {
  
  const response = await fetch(next, {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem("accessToken")
    },
    params: {
      time_range: timeRange, 
      limit: 20
    }
  });
  
  const data = await response.json();
  
  return (data.next === null) ? data.items : data.items.concat(await retrieveTopTracks(timeRange, data.next));
  
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

function ThemeButton({ theme, onClick }) {
  function setTheme() {
    Array.from(document.getElementsByClassName('active-theme'))
      .forEach((elem, _) => {
          elem.classList.remove('active-theme');
      });
    onClick();
    document.getElementById(theme).classList.add('active-theme');
  }
  
  return (
    <div className="theme-button" id={theme} onClick={setTheme}>
    </div>
  );
}

function ControlPanel({ changeSeason }) {
  return (
    <div className="control-panel">hi
      <div className="theme-selector">
        <ThemeButton theme="spring" onClick={() => changeSeason("spring")} />
        <ThemeButton theme="summer" onClick={() => changeSeason("summer")} />
        <ThemeButton theme="autumn" onClick={() => changeSeason("autumn")} />
        <ThemeButton theme="winter" onClick={() => changeSeason("winter")} />
      </div>
    </div>
  );
}

export default function Callback() {
  const [topTracks, setTopTracks] = useState(null);
  const [season, setSeason] = useState(Array(3).fill(null));
  const [nominations, setNominations] = useState({
    albums: [],
    records: [],
    artists: []
  });
  
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
      let nominations = generateNominations(topTracks);
      const artistImages = await getArtistImages(nominations.artists);
      nominations.artists = nominations.artists.map((artist, index) => {
        return {
          ...artist,
          image: artistImages[index]
        };
      });
      
      setNominations(nominations);
      
    };
    if (topTracks !== null) {
      getNominations();
    }
    // nominations.artists = await getArtistDetails(nominations.artists);
    
    
  }, [topTracks]);
  
  

  return (
    <div className="main-wrapper">
      <MenuBar />
      <div className="main-body">
        <Awards nominations={nominations} palette={season}/>
        <ControlPanel changeSeason={(season) => setSeason(PALETTES[season])}/>
      </div>
    </div>
  );
}