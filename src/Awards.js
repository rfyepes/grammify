import grammy from './images/grammy.png'
import songPlaceholder from './images/song-placeholder.png'
import albumPlaceholder from './images/album-placeholder.png'
import artistPlaceholder from './images/artist-placeholder.png'

import { IoPerson } from "react-icons/io5";
import { BiSolidAlbum } from "react-icons/bi";
import { IoMdMusicalNote } from "react-icons/io";

function Nominee({ data, isArtist, makeWinner, isWinnable, altImage }) {
  const visibleGrammy = { display: "block", opacity: "1" };
  const imageStyle = { borderRadius: isArtist ? "50%" : "0%" };
  const nameStyle = { textAlign: isArtist ? "center" : "left" };
  const image = (data.image != null) ? data.image : altImage;
  
  return (
    <div className="nominee">
      <div className="nominee-wrap">
        <div className={isWinnable ? "image-wrap user-select" : "image-wrap"} onClick={isWinnable ? makeWinner : () => {}}>
          <img src={image} alt={data.imageAlt} className="nominee-img" draggable="false" style={imageStyle} />
          <img src={grammy} alt="grammy icon" className="grammy" draggable="false" style={data.isWinner ? visibleGrammy : {}}/>
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

function Award({ category, icon: Icon, nominees, color, makeWinner, isChoosable }) {
  const altImage = (category === "Song") ? songPlaceholder : (category === "Album") ? albumPlaceholder : artistPlaceholder;
  return (
    <div className="award" style={{ background: color }}>
      <div className="category-title">
        <span className="category-icon"><Icon /></span>
        <span>&nbsp;{category}</span>
        <span style={{ opacity: "100%" }}>&nbsp;of the Year</span>
      </div>
      <div className="nominees">
        <div className="nominees-wrap">
          {nominees.map((nominee) => { return <Nominee data={nominee} isArtist={category === "Artist"} makeWinner={() => { makeWinner(nominee) }} isWinnable={isChoosable} altImage={altImage} />; })}
        </div>
      </div>
    </div>
  );
}

export default function Awards({ nominations, palette, toggleWinners, isChoosable }) {
  return (
    <div className="awards" id="temp">
      <Award category="Song" icon={IoMdMusicalNote} nominees={nominations.songs} color={palette[0]} makeWinner={(nom) => { toggleWinners(nom, "songs") }} isChoosable={isChoosable} />
      <Award category="Album" icon={BiSolidAlbum} nominees={nominations.albums} color={palette[1]} makeWinner={(nom) => { toggleWinners(nom, "albums") }} isChoosable={isChoosable} />
      <Award category="Artist" icon={IoPerson} nominees={nominations.artists} color={palette[2]} makeWinner={(nom) => { toggleWinners(nom, "artists") }} isChoosable={isChoosable} />
    </div>
  );
}
