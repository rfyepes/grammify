import React, { useState, useEffect } from 'react';
import { generateNominations } from "./dataManager";

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import html2canvas from "html2canvas";
import html2pdf from 'html2pdf.js';

// TODO: cite
import { RxInfoCircled } from 'react-icons/rx';
import { TbLogout2 } from 'react-icons/tb';

import grammy from './grammy3.png'

const PALETTES = {
  spring: ["#fa92b1", "#94DE8B", "#F4DB87"],
  summer: ["#FFDA03", "#608f07", "#006994"],
  autumn: ["#d07f0d", "rgba(190, 89, 70, 1)", "#532e22"],
  winter: ["#FFFAF4", "#ABDCF2", "#D3CBE5"]
}

// TODO: not just overview image, but one image (looks like spotify wrapped)
// for each category? if they only want to share one
function Nominee({ data, isArtist }) {
  const grammyStyle = {
    display: data.isWinner ? "block" : "none"
  };
  const imageStyle = {
    borderRadius: isArtist ? "50%" : "0%",
    // width: data.isWinner ? "85%" : "85%"
  };
  const nameStyle = {
    textAlign: isArtist ? "center" : "left",
    // marginTop: isArtist ? "10px" : "0px"
  };
  
  return (
    <div className="nominee">
      <div className="nominee-wrap">
        <div className="image-wrap">
          <img src={data.image} alt={data.imageAlt} className="nominee-img" style={imageStyle} />
          <img src={grammy} alt="grammy icon" className="grammy" style={grammyStyle}/>
        </div>
        <div class="nominee-name" style={nameStyle}>
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

function Award({ category, nominees, color }) {
  const style = {
    background: color
  };
  const isArtist = category == "Artist of the Year";
  return (
    <div className="award" style={style}>
      <div className="category-title">{category}</div>
      <div className="nominees">
      {nominees.map((nominee) => { return <Nominee data={nominee} isArtist={isArtist} />; })}
      </div>
    </div>
  );
}

function Awards({ nominations, palette }) {
  return (
    <div className="awards" id="temp">
      <Award category="Song of the Year" nominees={nominations.records} color={palette[0]} />
      <Award category="Album of the Year" nominees={nominations.albums} color={palette[1]} />
      <Award category="Artist of the Year" nominees={nominations.artists} color={palette[2]} />
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

export default function Temp2() {
  const [topTracks, setTopTracks] = useState(null);
  const [season, setSeason] = useState(PALETTES.autumn);
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
      
      nominations = await replaceImages(nominations);
      
      setNominations(nominations);
      
    };
    if (topTracks !== null) {
      getNominations();
    }
  }, [topTracks]);
  
  useEffect(() => {
    if (nominations.albums.length != 0) {
      // var element = document.getElementById('export-image');
      // html2pdf(element);
      const generatePDF = () => {
    const divToCapture = document.getElementById('export-image'); // Replace 'yourDivId' with the actual ID of the div

    if (divToCapture) {
      const pdfOptions = {
        margin: 10,
        filename: 'div_image.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      html2pdf().from(divToCapture).set(pdfOptions).outputPdf().then(function (pdf) {
        const img = new Image();
        img.src = pdf.output('img');
        alert(pdf.output('img'));
        img.onload = function () {
          const a = document.createElement('a');
          a.href = img.src;
          a.download = 'div_image.jpg';
          a.click();
        };
      });
    }
  };
  
  generatePDF();
  
      
    
      // const imageUrls = [];
      // for (let i = 0; i < 5; i++) {
      //   imageUrls.push(nominations.records[0].image);
      //   imageUrls.push(nominations.albums[0].image);
      //   imageUrls.push(nominations.artists[0].image);
      // }
      // const preloadImages = () => {
      //   for (const imageUrl of imageUrls) {
      //     const img = new Image();
      //     img.src = imageUrl;
      //   }
      // };
      // preloadImages();
  
  
  
      // htmlToImage.toPng(document.getElementById('export-image'))
      //   .then(function (dataUrl) {
      //     const downloadLink = document.createElement('a');
      //     downloadLink.href = dataUrl; // Set the base64 data as the link's href
      //     downloadLink.download = 'export-image.png'; // Set the desired filename for the download
      // 
      //     // Trigger a click event on the anchor element to initiate the download
      //     downloadLink.click();
      //   });
    }
  
  }, [nominations]);
  
  return (
    <div className="export-image" id="export-image">
      <div className="export-image-header"></div>
      <Awards nominations={nominations} palette={season}/>
      <div className="export-image-footer">
        <div className="export-image-footer-title">SpotiGrammy</div>
        <div className="export-image-footer-description">SpotiGrammy.com</div>
      </div>
    </div>
  );
}