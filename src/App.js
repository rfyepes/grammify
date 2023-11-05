import React, { StrictMode } from "react";
import { useState } from 'react';
// icons from https://react-icons.github.io/react-icons
import { RxInfoCircled } from 'react-icons/rx';
import { TbLogout2 } from 'react-icons/tb';

// class Question extends React.Component {
//   render() {
//     return <h3> Lets go for a <RxInfoCircled />? </h3>
//   }
// }

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

var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
url += '&state=' + encodeURIComponent(state);



function Awards() {
  return (
    <div className="awards">hi
    </div>
  );
}

function MenuButton({ icon: Icon, onClick }) {
  return (
    <div className="button" onClick={onClick}>
      <span><Icon /></span>
    </div>
  )
}

function MenuBar() {
  function handleClick() {
    window.open(url, "_self");


  }
  
  return (
    <div className="menu">
      <MenuButton icon={RxInfoCircled} onClick={handleClick} />
      <div className="title">SpotiGrammy</div>
      <MenuButton icon={TbLogout2} onClick={handleClick} />
    </div>
  );
}


export default function Game() {

  return (
    <div className="main-wrapper">
      <MenuBar />
      <Awards />
    </div>
  );
}

