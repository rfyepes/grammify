import grammy from './images/grammy.png'

function Nominee({ data, isArtist, makeWinner, isWinnable }) {
  const visibleGrammy = { display: "block", opacity: "1" };
  const imageStyle = { borderRadius: isArtist ? "50%" : "0%" };
  const nameStyle = { textAlign: isArtist ? "center" : "left" };
  
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
  return (
    <div className="award" style={{ background: color }}>
      <div className="category-title">{category}</div>
      <div className="nominees">
        <div className="nominees-wrap">
          {nominees.map((nominee) => { return <Nominee data={nominee} isArtist={category === "Artist of the Year"} makeWinner={() => { makeWinner(nominee) }} isWinnable={isChoosable} />; })}
        </div>
      </div>
    </div>
  );
}

export default function Awards({ nominations, palette, toggleWinners, isChoosable }) {
  return (
    <div className="awards" id="temp">
      <Award category="Song of the Year" nominees={nominations.songs} color={palette[0]} makeWinner={(nom) => { toggleWinners(nom, "songs") }} isChoosable={isChoosable} />
      <Award category="Album of the Year" nominees={nominations.albums} color={palette[1]} makeWinner={(nom) => { toggleWinners(nom, "albums") }} isChoosable={isChoosable} />
      <Award category="Artist of the Year" nominees={nominations.artists} color={palette[2]} makeWinner={(nom) => { toggleWinners(nom, "artists") }} isChoosable={isChoosable} />
    </div>
  );
}
