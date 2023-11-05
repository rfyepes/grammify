import React, { useState, useEffect } from 'react';
import { generateNominations } from "./dataManager";

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

// TODO: cite
import { RxInfoCircled } from 'react-icons/rx';
import { TbLogout2 } from 'react-icons/tb';
// TODO: not just overview image, but one image (looks like spotify wrapped)
// for each category? if they only want to share one
function Nominee({ data }) {
  return (
    <div className="nominee">
      <img src={data.image} alt={data.imageAlt} />
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

function Award({ category, nominees }) {
  return (
    <div className="award">
      <div className="category-title">{category}</div>
      <div className="nominees">
      {nominees.map((nominee) => { return <Nominee data={nominee} />; })}
      </div>
    </div>
  );
}

function Awards({ nominations }) {
  return (
    <div className="awards" id="temp">
      <Award category="Song of the Year" nominees={nominations.records}/>
      <Award category="Album of the Year" nominees={nominations.albums}/>
      <Award category="Artist of the Year" nominees={nominations.artists}/>
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
    var node = document.getElementById('temp');
    
    htmlToImage.toPng(node)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
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

function ThemeButton() {
  return (
    <div className="theme-button">x
    </div>
  );
}

function ControlPanel() {
  return (
    <div className="control-panel">hi
      <div className="theme-selector">
        <ThemeButton theme="Spring" />
        <ThemeButton theme="Summer" />
        <ThemeButton theme="Autumn" />
        <ThemeButton theme="Winter" />
      </div>
    </div>
  );
}

export default function Callback() {
  const [topTracks, setTopTracks] = useState(null);
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
    if (topTracks === null) {
      return;
    }

    setNominations(generateNominations(topTracks));
    // nominations.artists = await getArtistDetails(nominations.artists);
    
    
  }, [topTracks]);
  

  return (
    <div className="main-wrapper">
      <MenuBar />
      <div className="main-body">
        <Awards nominations={nominations} />
        <ControlPanel />
      </div>
    </div>
  );
}