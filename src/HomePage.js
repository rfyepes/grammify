import { useState, useEffect } from "react";

import Menu from "./Menu";
import Footer from "./Footer";
import AwardsPage from "./AwardsPage";
import Graphic from "./Graphic";
import spotigrammy from "./images/example-new.jpg";

import { AUTH_URL_SHOW_DIALOG, PALETTES, EXAMPLE_NOMINATIONS } from "./Constants"

function HomeContent() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [winners, setWinners] = useState([2, 1, 3]);
  const [prevWinners, setPrevWinners] = useState([0, 0, 0]);
  
  useEffect(() => {
    // code adapted from https://betterprogramming.pub/using-window-matchmedia-in-react-8116eada2588?gi=1ac30d49552e
    const mediaWatcher = window.matchMedia("screen and (prefers-reduced-motion: reduce)")
    setReduceMotion(mediaWatcher.matches);

    function updateReduceMotion(e) {
      setReduceMotion(e.matches);
    }
    if (mediaWatcher.addEventListener) {
      mediaWatcher.addEventListener('change', updateReduceMotion)
      return function cleanup() {
        mediaWatcher.removeEventListener('change', updateReduceMotion)
      }
    } else {
      // for older Safari versions
      mediaWatcher.addListener(updateReduceMotion)
      return function cleanup() {
        mediaWatcher.removeListener(updateReduceMotion)
      }
    }
  }, []);
  
  const reduceMotionNoms = {
    songs: EXAMPLE_NOMINATIONS.songs.slice(0, 5),
    albums: EXAMPLE_NOMINATIONS.albums.slice(0, 5),
    artists: EXAMPLE_NOMINATIONS.artists.slice(0, 5)
  };
  const nominations = reduceMotion ? reduceMotionNoms : {
    songs: EXAMPLE_NOMINATIONS.songs.concat(reduceMotionNoms.songs),
    albums: EXAMPLE_NOMINATIONS.albums.concat(reduceMotionNoms.albums),
    artists: EXAMPLE_NOMINATIONS.artists.concat(reduceMotionNoms.artists),

  };

  for (let i = 0; i < nominations.songs.length; i += 5) {
    nominations.songs[winners[0] + i].isWinner = true;
    nominations.songs[prevWinners[0] + i].isWinner = false;
    nominations.albums[winners[1] + i].isWinner = true;
    nominations.albums[prevWinners[1] + i].isWinner = false;
    nominations.artists[winners[2] + i].isWinner = true;
    nominations.artists[prevWinners[2] + i].isWinner = false;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevWinners(winners);
      let newWinners = new Array(3);
      for (let i = 0; i < 3; i++) {
        let rand;
        do {
          rand = Math.floor(Math.random() * 5);
        } while (rand === winners[i]);
        newWinners[i] = rand;
      }
      setWinners(newWinners);
    }, 3000);
  
    return () => clearInterval(interval);
  }, [nominations, winners]);
  
  return (
    <div className="main-page">
      <div className="example-awards">
      <div className="example-image"> 
      <Graphic nominations={nominations} season={PALETTES["summer"]} forExport={false} />
      </div> 
      </div>
      <div className="description">
        <div className="description-block description-title">
          Your own personalized music awards.
        </div>
        <div className="description-block sign-in-message">
          Sign in to meet the nominees.
        </div>
        <div className="description-block sign-in" onClick={() => window.open(AUTH_URL_SHOW_DIALOG, "_self")}>
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
