import Awards from "./Awards";

import award from './images/award.png'
import spotify from './images/spotify-green.png'

import { AWARD_YEAR } from "./Constants"

export default function Graphic({ nominations, season, forExport }) {
  return (
    <div className={"export-image " + (forExport ? "staticFont" : "dynamicFont")} id="export-image">
      <Awards nominations={nominations} palette={season} toggleWinners={() => {}} isChoosable={false} />
      <div className="export-image-footer">
        <div className="export-image-footer-title">
          <img src={award} alt="" />
          <div className="export-image-footer-title-text">GRAMMIFY <span style={{color: "#b89a5a"}}>{AWARD_YEAR}</span></div>
        </div>
        <div className="export-image-footer-description">
          <div className="export-image-footer-url">
            GRAMMIFY.app
          </div>
          <img src={spotify} alt="" />
        </div>
      </div>
    </div>
  );
}
