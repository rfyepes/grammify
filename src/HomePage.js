import Menu from "./Menu";
import Footer from "./Footer";
import spotigrammy from "./images/example.jpg";

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
var redirect_uri = "http://localhost:3000/awards";

var state = generateRandomString(16);
localStorage.setItem("stateKey", state);
var scope = "user-top-read";

var AUTH_URL = "https://accounts.spotify.com/authorize";
AUTH_URL += "?response_type=token";
AUTH_URL += "&client_id=" + encodeURIComponent(client_id);
AUTH_URL += "&scope=" + encodeURIComponent(scope);
AUTH_URL += "&redirect_uri=" + encodeURIComponent(redirect_uri);
AUTH_URL += "&state=" + encodeURIComponent(state);

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
          <a href="/privacy" target="_blank">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="main-wrapper">
      <Menu showLogOut={false} />
      <HomeContent />
      <Footer />
    </div>
  );
}
