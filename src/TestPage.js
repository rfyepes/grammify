import { useState, useEffect } from "react";

import example from "./images/empty.jpg";
import album from "./images/album-placeholder.png";
import song from "./images/song-placeholder.png";
import artist from "./images/artist-placeholder.png";
import test1 from "./images/test1.jpg";
import test2 from "./images/test2.jpg";

import song0 from "./images/animation/songs/0.jpg";
import song1 from "./images/animation/songs/1.jpg";
import song2 from "./images/animation/songs/2.jpg";
import song3 from "./images/animation/songs/3.jpg";
import song4 from "./images/animation/songs/4.jpg";
import song5 from "./images/animation/songs/5.jpg";
import song6 from "./images/animation/songs/6.jpg";
import song7 from "./images/animation/songs/7.jpg";
import song8 from "./images/animation/songs/8.jpg";
import song9 from "./images/animation/songs/9.jpg";

import album0 from "./images/animation/albums/0.jpg";
import album1 from "./images/animation/albums/1.jpg";
import album2 from "./images/animation/albums/2.jpg";
import album3 from "./images/animation/albums/3.jpg";
import album4 from "./images/animation/albums/4.jpg";
import album5 from "./images/animation/albums/5.jpg";
import album6 from "./images/animation/albums/6.jpg";
import album7 from "./images/animation/albums/7.jpg";
import album8 from "./images/animation/albums/8.jpg";
import album9 from "./images/animation/albums/9.jpg";

import award from "./images/animation/award.png";


export default function TestPage() {
  
  // const x = {
  //   fontSize: "5em",
  //   display: "flex",
  //   fontFamily: "Bebas Neue",
  //   contentArea: "1",
  //   lineHeight: "1"
  // };
  
  // const imgStyle = {
  //   width: "600px",
  //   border: "1px black solid"
  // };
  
  // const wrapperStyle = {
  //   border: "1px red solid",
  //   height: "300px",
  //   width: "600px",
  //   backgroundColor: "pink",
  //   overflow: "hidden",
  //   marginLeft: "20px"
  // };
  // 
  // const caroselStyle = {
  //   display: "flex",
  //   animation: "slide 15s linear infinite"
  // };
  // 
  // const albumStyle = {
  //   width: "200px",
  //   height: "200px"
  // };
  // 
  // const shellStyle = {
  //   padding: "10px",
  //   backgroundColor: "black"
  // }
  
  // if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  //   // use image instead
  // }
  
  const songs = [song0, song1, song2, song3, song4, song5, song6, song7, song8, song9];
  const albums = [album0, album1, album2, album3, album4, album5, album6, album7, album8, album9];
  const [awardSong, setAwardSong] = useState(3);
  const [awardAlbum, setAwardAlbum] = useState(1);
  
  // const generateCarosel = (category) => {
    
    const opaque = { opacity: "1" };
  
  useEffect(() => {
  const interval = setInterval(() => {
    let rand = Math.floor(Math.random() * 5)
    setAwardSong(rand == awardSong ? awardSong + 2 : rand);
  }, 3000);

  return () => clearInterval(interval);
}, [awardSong]);

useEffect(() => {
const interval = setInterval(() => {
  let rand = Math.floor(Math.random() * 5)
  setAwardAlbum(rand == awardAlbum ? awardAlbum - 1 : rand);
}, 3000);

return () => clearInterval(interval);
}, [awardAlbum]);

const songNoms = songs.map((image, index) => (
  <div className="carosel-nominee">
    <img src={image} className="plain" />
    <img src={award} className="awarded" style={awardSong == (index % 5) ? opaque : {}} />
  </div>
));
const albumNoms = albums.map((image, index) => (
  <div className="carosel-nominee">
    <img src={image} className="plain" />
    <img src={award} className="awarded" style={awardAlbum == (index % 5) ? opaque : {}} />
  </div>
));
  
  return (
  <div className="shell">
    <div className="graphic">
      <div className="wrapper songs">
        <div className="carosel">{songNoms}{songNoms}</div>
        <div className="carosel carosel-2">{songNoms}{songNoms}</div>
      </div>
      <div className="wrapper albums">
        <div className="carosel">{albumNoms}{albumNoms}</div>
        <div className="carosel carosel-2">{albumNoms}{albumNoms}</div>
      </div>
    </div>
  </div>
  );
}
