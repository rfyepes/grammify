import spotify from "./images/spotify.png";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-inner">
        <div className="footer-content" id="credit-2">Made by <a href="https://www.linkedin.com/in/robertyepes/" target="_blank" rel="noreferrer">Robert Yepes</a></div>
        <div className="footer-content"><img src={spotify} alt="Spotify Logo" style={{width: "120px"}}/></div>
        </div>
    </div>
  );
}
