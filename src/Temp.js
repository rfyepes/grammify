import React, { useState, useEffect } from 'react';
import { generateNominations } from "./dataManager";

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import html2canvas from "html2canvas";

import grammy from './grammy4.png'

const PALETTES = {
  spring: ["#fa92b1", "#94DE8B", "#F4DB87"],
  summer: ["#FFDA03", "#608f07", "#006994"],
  autumn: ["#d07f0d", "rgba(190, 89, 70, 1)", "#532e22"],
  winter: ["#FFFAF4", "#ABDCF2", "#D3CBE5"]
}

// TODO: not just overview image, but one image (looks like spotify wrapped)
// for each category? if they only want to share one
function Nominee({ data }) {

  return (
    <div className="nominee">
      <div className="nominee-wrap">
        <div className="image-wrap">
          <img src={data.image} alt={data.imageAlt} className="nominee-img" />
        </div>
        { (data.isWinner) ? <img src={grammy} alt="grammy icon" className="grammy" /> : "" }
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
    </div>
  );
}

function Award({ category, nominees, color, row }) {
  const isEvenRow = (row % 2) == 0
  const awardStyle = {
    background: color
  };
  const titleStyle = {
    transform: isEvenRow ? "rotate(180deg)" : "rotate(0deg)"
  };
  const title = <div className="category-title" style={titleStyle}>{category}</div>;
  const winner = (
    <div className="winner">
      {nominees.map((nominee, rank) => { 
        return (rank == 0) ? <Nominee data={nominee} /> : "";
      })}
    </div>
  );
  const losers = (
    <div className="losers">
      {nominees.map((nominee, rank) => { 
        return (rank != 0) ? <Nominee data={nominee} /> : "";
      })}
    </div>
  );
  // TODO: fix map situation...
  return (
    <div className="award" style={awardStyle}>
      {isEvenRow ? title : ""}
      <div className="nominees">
        {isEvenRow ? winner : losers}
        {isEvenRow ? losers : winner}
      </div>
      {isEvenRow ? "" : title}
    </div>
  );
}

function Awards({ nominations, palette }) {
  return (
    <div className="awards" id="temp">
      <Award category="Song of the Year" nominees={nominations.records} color={palette[0]} row={0} />
      <Award category="Album of the Year" nominees={nominations.albums} color={palette[1]} row={1} />
      <Award category="Artist of the Year" nominees={nominations.artists} color={palette[2]} row={2} />
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



export default function Temp() {
  const [topTracks, setTopTracks] = useState(null);
  const [season, setSeason] = useState(PALETTES.autumn);
  const [nominations, setNominations] = useState({
    albums: [],
    records: [],
    artists: []
  });
  useEffect(() => {
      const getTopTracks = async () => {
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
    
    
  }, [topTracks]);
  
  // useEffect(() => {
  //   if (nominations.albums.length != 0) {
  //     htmlToImage.toPng(document.getElementById('final-image'))
  //       .then(function (dataUrl) {
  //         const downloadLink = document.createElement('a');
  //         downloadLink.href = dataUrl; // Set the base64 data as the link's href
  //         downloadLink.download = 'image.png'; // Set the desired filename for the download
  // 
  //         // Trigger a click event on the anchor element to initiate the download
  //         downloadLink.click();
  //       });
  //   }
  // 
  // }, [nominations])
  
  return (
    <div className="final-image" id="final-image">
      <div className="image-title">
        SpotiGrammy
      </div>
      <Awards nominations={nominations} palette={season} />
      <div className="image-footer">
        spotigrammy.com
      </div>
    </div>
  );
}