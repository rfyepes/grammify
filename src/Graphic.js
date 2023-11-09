import Awards from "./Awards";

import spotify from './images/spotify.png'

export default function Graphic({ nominations, season }) {
  return (
    <div className="export-image" id="export-image">
      <div className="export-image-header"></div>
      <Awards nominations={nominations} palette={season} toggleWinners={() => {}} isChoosable={false} />
      <div className="export-image-footer">
        <div className="export-image-footer-title">
          <img src={spotify} alt="" style={{width: "80px", marginRight: "10px"}}/>
          <div className="export-image-footer-title-text">SpotiGrammy {nominations.year}</div>
        </div>
        <div className="export-image-footer-description">SpotiGrammy.com</div>
      </div>
    </div>
  );
}
