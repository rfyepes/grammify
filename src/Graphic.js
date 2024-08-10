import Awards from "./Awards";

import spotify from './images/spotify-green.png'
import spotigrammy from './images/spotigrammy.png'

import { AWARD_YEAR } from "./Constants"

export default function Graphic({ nominations, season }) {
  return (
    <div className="export-image" id="export-image">
      <div className="export-image-header"></div>
      <Awards nominations={nominations} palette={season} toggleWinners={() => {}} isChoosable={false} />
      <div className="export-image-footer">
        <div className="export-image-footer-title">
          <img src={spotigrammy} alt="" />
          <div className="export-image-footer-title-text">GRAMMIFY <span style={{color: "#b89a5a"}}>{AWARD_YEAR}</span></div>
        </div>
        <div className="export-image-footer-description">
          <div className="export-image-footer-url">
            GRAMMIFY.com
          </div>
          <img src={spotify} alt="" />
        </div>
      </div>
    </div>
  );
}