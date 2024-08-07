import { useState, useEffect } from "react";

import Menu from "./Menu";
import Footer from "./Footer";
import AwardsPage from "./AwardsPage";
import spotigrammy from "./images/example-new.jpg";

// TODO: credit Spotify for code
var generateRandomString = function (length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var client_id = "daf1a83621b44968afa25e3d49387bf1";
var redirect_uri = "https://rfyepes.github.io/grammify";

var state = generateRandomString(16);
localStorage.setItem("stateKey", state);
var scope = "user-top-read";

var AUTH_URL = "https://accounts.spotify.com/authorize";
AUTH_URL += "?response_type=token";
AUTH_URL += "&client_id=" + encodeURIComponent(client_id);
AUTH_URL += "&scope=" + encodeURIComponent(scope);
AUTH_URL += "&redirect_uri=" + encodeURIComponent(redirect_uri);
AUTH_URL += "&state=" + encodeURIComponent(state);
AUTH_URL += "&show_dialog=true";

function HomeContent() {
  return (
    <div className="main-page">
      <div className="example-awards"> 
        <img src={spotigrammy} alt="Example of a SpotiGrammy graphic" className="example-image" />
      </div>
      <div className="description">
        <div className="description-block description-title">
          Your own personalized music awards.
        </div>
        <div className="description-block sign-in-message">
          Sign in to meet the nominees.
        </div>
        <div className="description-block sign-in" onClick={() => window.open(AUTH_URL, "_self")}>
          Sign in with Spotify
        </div>
        <div className="description-block privacy">
          <a href="/grammify/#/privacy" target="_blank">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [accessToken, setAccessToken] = useState("");
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);
  
  if (accessToken !== "") {
    return <AwardsPage accessToken={accessToken} logOut={() => setAccessToken("")} />;
  }
  
  return (
    <div className="main-wrapper">
      <Menu showLogOut={false} logOut={() => setAccessToken("")} />
      <HomeContent />
      <Footer />
    </div>
  );
}
