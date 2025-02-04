import { useState, useEffect, useRef } from "react";

import { spotifySearch } from "./fetchData";
import { isEligible } from "./generateNominations";

import grammy from './images/grammy.png'
import award from './images/award-white.png'
import spotify from './images/2024-spotify-logo-icon/Primary_Logo_White_CMYK.svg'
import songPlaceholder from './images/song-placeholder.png'
import albumPlaceholder from './images/album-placeholder.png'
import artistPlaceholder from './images/artist-placeholder.png'

import { IoPerson, IoSearch } from "react-icons/io5";
import { BiSolidAlbum } from "react-icons/bi";
import { IoMdMusicalNote } from "react-icons/io";
import { BiPlus } from "react-icons/bi";

function Nominee({ data, isArtist, makeWinner, isWinnable, altImage, accessToken, type, nominate, ids, addId, hide, handleError }) {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const inputRef = useRef(null);
  
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      inputRef.current.blur();
      handleSubmit(e);
    }
  };
  
  useEffect(() => {
    if (showModal) {
      inputRef.current.focus();
      inputRef.current.select();
      document.body.classList.add("overflow-y-hidden");
    } else {
      inputRef.current.blur();
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const searchData = await spotifySearch(query, type, accessToken);
      setResults(parseData(searchData));
    } catch (error) {
      handleError(error.message);
    }
  };
  const parseData = (d) => {
    const filteredData = [];
    for (let i = 0; i < d.length; i++) {
      const releaseDate = (type === "artist") ? null : (type === "album") ? d[i].release_date : d[i].album.release_date;
      if ((type === "album" && (d[i].total_tracks < 5    || !isEligible(releaseDate))) ||
          (type === "track" && (d[i].duration_ms < 60000 || !isEligible(releaseDate))) ||
          (ids.has(d[i].id))) { // TODO: change hard-coded nums
        continue;
      }
      const images = (type === "track") ? d[i].album.images : d[i].images;
      filteredData.push({
        name: d[i].name,
        details: type === "artist" ? null : d[i].artists.map(artist => artist.name).join(", "),
        image: (images.length === 0) ? null : (images.length < 2) ? images[0].url : images[1].url,
        previewImage: (images.length === 0) ? altImage : images[images.length - 1].url, //TODO: make null image show placeholder
        popularity: d[i].popularity,
        releaseDate: releaseDate,
        id: d[i].id,
        url: d[i].external_urls?.spotify || "https://open.spotify.com/"
      });
    }
    return filteredData;
  };
  
  const imageWrapStyle = { 
    borderRadius: isArtist ? "50%" : "0%",
    boxSizing: "border-box"
  };
  const imageStyle = {
    borderRadius: isArtist ? "50%" : "0%",
    visibility: data.empty ? "hidden" : "visible"
  };
  const nameStyle = { textAlign: isArtist ? "center" : "left" };
  const image = (data.image != null) ? data.image : altImage;
  
  return (
    <div className={`nominee${data.isWinner ? " winner" : ""}`}>
      <div className={`nominee-wrap${isWinnable && !data.empty ? " user-select" : ""}${showModal ? " hover-active" : ""}`} onClick={data.empty ? () => {} : isWinnable ? makeWinner : () => {}}>
        <div className="nominee-inner-wrap">
          <img className="award-icon" src={award} />
          <div className={`image-wrap${data.empty && hide ? " hidden-nominee" : ""}${data.empty && !hide ? " empty-nominee": ""}`} style={{...imageWrapStyle, ...showModal ? {background: "rgba(255, 255, 255, 0.2)"} : {}}} onClick={data.empty ? () => setShowModal(true) : () => {}}>
            <div className="plus" style={{visibility: data.empty && !hide ? "visible" : "hidden" }}><BiPlus /></div>
            <img src={image} alt={data.imageAlt} className="nominee-img" draggable="false" style={imageStyle} />
          </div>
          <div className="nominee-name" style={nameStyle}>
            <div className="nominee-title">
              {data.name}
            </div>
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

      <div className={`spotify-link ${data.empty ? " hidden-nominee" : ""}`}>
        <a className="spotify-button" href={data.url} target="_blank">
          <div>
            <img className="spotify-icon" src={spotify} />
            <p>OPEN</p><p id="spotify-string">&nbsp;SPOTIFY</p>
          </div>
        </a>
      </div>
      <div className="modal" onClick={() => {setResults(null); setQuery(""); setShowModal(false);}} style={{display: (showModal ? "block" : "none")}}>
        <div className="choose-nominee-modal">
          <div className="search-block"  onClick={(e) => {e.stopPropagation()}}>
            <div className="search-bar">
              <input type="text" id="searchInput" ref={inputRef} placeholder={`Search for ${type}...`} value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={handleKeyPress} />
            </div>
            <div className="search-submit" onClick={handleSubmit}>
              <IoSearch />
            </div>
          </div>
          <div className="result-block" style={{display: results ? "block" : "none"}}  onClick={(e) => {e.stopPropagation()}}>
          { !results ? "" : results.length === 0 ? 
          <div className="no-results">No eligible results 😢</div> :
            <ul>
              {results.map((n) => <li onClick={() => { nominate(n); addId(n.id); setResults(null); setQuery(""); setShowModal(false); }}>
                {
                <img src={n.previewImage} className="search-img" draggable="false" style={{ borderRadius: isArtist ? "50%" : "0%" }} />
              }
              <div className="result-text">
                <div className="result-name">{n.name}</div>
                <div className="result-details">{n.details}</div>
              </div>
                </li>)}
            </ul>

          }
          </div>
        </div>
      </div>
    </div>
  );
}

function Award({ category, icon: Icon, nominees, color, makeWinner, isChoosable, accessToken, addNominee, handleError }) {
  const [ids, setIds] = useState(new Set(nominees.map(n => n.id)));
  const altImage = (category === "Song") ? songPlaceholder : (category === "Album") ? albumPlaceholder : artistPlaceholder;
  const type = {
    Song: "track",
    Album: "album",
    Artist: "artist"
  };
  const addId = (id) => {
    setIds((prevState) => new Set(prevState.add(id)));
  };
  
  return (
    <div className="award" style={{ background: color }}>
      <div className="category-title">
        <span className="category-icon"><Icon /></span>
        <span>&nbsp;{category}</span>
        <span style={{ opacity: "100%" }}>&nbsp;of the Year</span>
      </div>
      <div className="nominees">
        <div className="nominees-wrap">
          {nominees.map((nominee, i) => { return <Nominee data={nominee} isArtist={category === "Artist"} makeWinner={() => { makeWinner(nominee) }} isWinnable={isChoosable} altImage={altImage} accessToken={accessToken} type={type[category]} nominate={addNominee} ids={ids} addId={addId} hide={ids.size <= i} handleError={handleError} />; })}
        </div>
      </div>
    </div>
  );
}

export default function Awards({ nominations, palette, toggleWinners, isChoosable, accessToken, addNominee, handleError }) {
  return (
    <div className="awards" id="temp">
      <Award category="Song" icon={IoMdMusicalNote} nominees={nominations.songs} color={palette[0]} makeWinner={(nom) => { toggleWinners(nom, "songs") }} isChoosable={isChoosable} accessToken={accessToken} addNominee={(n) => addNominee(n, "songs")} handleError={handleError} />
      <Award category="Album" icon={BiSolidAlbum} nominees={nominations.albums} color={palette[1]} makeWinner={(nom) => { toggleWinners(nom, "albums") }} isChoosable={isChoosable} accessToken={accessToken} addNominee={(n) => addNominee(n, "albums")} handleError={handleError} />
      <Award category="Artist" icon={IoPerson} nominees={nominations.artists} color={palette[2]} makeWinner={(nom) => { toggleWinners(nom, "artists") }} isChoosable={isChoosable} accessToken={accessToken} addNominee={(n) => addNominee(n, "artists")} handleError={handleError} />
    </div>
  );
}
