import React, { StrictMode } from "react";
import { useState } from 'react';
// icons from https://react-icons.github.io/react-icons
import { RxInfoCircled } from 'react-icons/rx';
import { TbLogout2 } from 'react-icons/tb';
import { Link } from 'react-router-dom';

import Temp3 from "./Temp3";
import Menu from "./Menu";

import spotigrammy from "./example-2.jpg";

const EXAMPLES = ["example-1.jpg", "example-2.jpg", "example-3.jpg", "example-4.jpg"]

// const AUTH_URL = "https://accounts.spotify.com/authorize?response_type=code&client_id=daf1a83621b44968afa25e3d49387bf1&scope=user-top-read&redirect_uri=http://localhost:3000/callback";
// TODO: credit Spotify for code
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


var client_id = 'daf1a83621b44968afa25e3d49387bf1';
var redirect_uri = 'http://localhost:3000/callback';

var state = generateRandomString(16);
var stateKey
localStorage.setItem(stateKey, state);
var scope = 'user-top-read';

var AUTH_URL = 'https://accounts.spotify.com/authorize';
AUTH_URL += '?response_type=token';
AUTH_URL += '&client_id=' + encodeURIComponent(client_id);
AUTH_URL += '&scope=' + encodeURIComponent(scope);
AUTH_URL += '&redirect_uri=' + encodeURIComponent(redirect_uri);
AUTH_URL += '&state=' + encodeURIComponent(state);



function MainPage() {
  
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
  // slides = ["images/bunny.jpg", "images/kitten.jpg", "images/hedgehog.jpg", 
  //           "images/puppy.jpg", "images/penguin.jpg"];
  // 
  // currIndex = 0;
  // 
  // $(document).ready (function()
  // {   
  //   $("#start").click(startShow);
  //   $("#stop").click(stopShow);
  // })
  // 
  // function startShow()
  // {
  //   $("#slides img").fadeOut(2000, nextSlide);
  // }
  // 
  // function nextSlide()
  // {
  //   currIndex++;
  // 
  //   if (currIndex >= slides.length) {
  //     currIndex = 0;
  //   }
  // 
  //   $("#slides img").attr("src", slides[currIndex]);
  //   $("#slides img").fadeIn(2000, startShow);
  // }
  // 
  // function stopShow()
  // {
  //   $("#slides img").stop().fadeIn();
  // }
  

export default function Game() {
  
  return (
  <div className="main-wrapper">
    <Menu showLogOut={false} />
    <MainPage />
    <div className="footer">
      <div className="footer-content">Made by <a href="https://www.linkedin.com/in/robertyepes/" target="_blank">Robert Yepes</a></div>
      <div className="footer-content"><a href="/privacy" target="_blank">Privacy Policy</a></div>
    </div>
  </div>
  );
}

