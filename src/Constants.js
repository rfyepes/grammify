// AWARD ELIGIBILITY
const CURR_YEAR = new Date().getFullYear();
const CURR_MONTH = new Date().getMonth() + 1;

const AWARD_MONTH = 2; // Assumes GRAMMIFY Awards are held in February
export const AWARD_YEAR = (CURR_MONTH > AWARD_MONTH) ? CURR_YEAR + 1 : CURR_YEAR;

export const ELIGIBILITY = {
  start_month: 9, // Elibilility period begins Sept 16
  start_day: 16,
  end_month: 8, // Elibilility period ends Aug 30
  end_day: 30
};
export const NUM_NOMINATIONS = 5; // Needs 5 nominees per category


// AUTHORIZATION

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
var redirect_uri = "https://www.grammify.app";

var state = generateRandomString(16);
localStorage.setItem("stateKey", state);
var scope = "user-top-read";

export const AUTH_URL = "https://accounts.spotify.com/authorize"
  + "?response_type=token"
  + "&client_id=" + encodeURIComponent(client_id)
  + "&scope=" + encodeURIComponent(scope)
  + "&redirect_uri=" + encodeURIComponent(redirect_uri)
  + "&state=" + encodeURIComponent(state);
export const AUTH_URL_SHOW_DIALOG = AUTH_URL + "&show_dialog=true";


// THEME SELECTION
export const SYMBOLS = {
  spring: "🌷",
  summer: "🌴",
  autumn: "🍂",
  winter: "⛄️"
};
// ffdac6 ffe7c2 bAbD8D
// d1b8a3 e596a1 c3d59f
export const PALETTES = {
  spring: ["#e0c9a4", "#e6bfaa", "#bAbD8D"],
  summer: ["#e9b41d", "#f15e34", "#0087ae"],
  autumn: ["#dda15e", "#bc6c25", "#606c38"], // original: ["#d07f0d", "#a83f2c", "#532e22"]
  winter: ["#9fb3d3", "#383d57", "#564238"]
};


// NULL NOMINEE (space fillers in case there aren't enough nominations)
export const NULL_NOMINEE = {
  name: "",
  image: null,
  imageAlt: "",
  details: "",
  isWinner: false,
  releaseDate: null,
  empty: true
};


// EXAMPLE AWARD NOMINEES
export const EXAMPLE_NOMINATIONS = {
  songs: [
    {
      name: "Espresso",
      details: "Sabrina Carpenter",
      image: require("./images/examples/songs/0.webp"),
      isWinner: false
    },
    {
      name: "Too Sweet",
      details: "Hozier",
      image: require("./images/examples/songs/1.webp"),
      isWinner: false
    },
    {
      name: "A Bar Song (Tipsy)",
      details: "Shaboozey",
      image: require("./images/examples/songs/2.webp"),
      isWinner: true
    },
    {
      name: "Houdini",
      details: "Dua Lipa",
      image: require("./images/examples/songs/3.webp"),
      isWinner: false
    },
    {
      name: "Not Like Us",
      details: "Kendrick Lamar",
      image: require("./images/examples/songs/4.webp"),
      isWinner: false
    },
    {
      name: "Saturn",
      details: "SZA",
      image: require("./images/examples/songs/5.webp"),
      isWinner: false
    },
    {
      name: "Cruel Summer",
      details: "Taylor Swift",
      image: require("./images/examples/songs/7.webp"),
      isWinner: false
    },
    {
      name: "Cosmic",
      details: "Red Velvet",
      image: require("./images/examples/songs/8.webp"),
      isWinner: true
    },
    {
      name: "Nasty",
      details: "Tinashe",
      image: require("./images/examples/songs/6.webp"),
      isWinner: false
    },
    {
      name: "obsessed",
      details: "Olivia Rodrigo",
      image: require("./images/examples/songs/9.webp"),
      isWinner: false
    }
  ],
  albums: [
    {
      name: "HIT ME HARD AND SOFT",
      details: "Billie Eilish",
      image: require("./images/examples/albums/0.webp"),
      isWinner: false
    },
    {
      name: "ORQUÍDEAS",
      details: "Kali Uchis",
      image: require("./images/examples/albums/1.webp"),
      isWinner: true
    },
    {
      name: "BRAT",
      details: "Charli xcx",
      image: require("./images/examples/albums/2.webp"),
      isWinner: false
    },
    {
      name: "God Said No",
      details: "Omar Apollo",
      image: require("./images/examples/albums/3.webp"),
      isWinner: false
    },
    {
      name: "COWBOY CARTER",
      details: "Beyoncé",
      image: require("./images/examples/albums/4.webp"),
      isWinner: false
    },
    {
      name: "LA PANTERA NEGRA",
      details: "Myke Towers",
      image: require("./images/examples/albums/9.webp"),
      isWinner: false
    },
    {
      name: "TIMELESS",
      details: "KAYTRANADA",
      image: require("./images/examples/albums/8.webp"),
      isWinner: true
    },
    {
      name: "<Dall>",
      details: "ARTMS",
      image: require("./images/examples/albums/5.webp"),
      isWinner: false
    },
    {
      name: "empathogen",
      details: "WILLOW",
      image: require("./images/examples/albums/6.webp"),
      isWinner: false
    },
    {
      name: "F-1 Trillion",
      details: "Post Malone",
      image: require("./images/examples/albums/7.webp"),
      isWinner: false
    }
  ],
  artists: [
    {
      name: "Chappell Roan",
      image: require("./images/examples/artists/0.webp"),
      isWinner: false
    },
    {
      name: "Vince Staples",
      image: require("./images/examples/artists/1.webp"),
      isWinner: false
    },
    {
      name: "Tyla",
      image: require("./images/examples/artists/2.webp"),
      isWinner: false
    },
    {
      name: "Sabrina Carpenter",
      image: require("./images/examples/artists/3.webp"),
      isWinner: true
    },
    {
      name: "Benson Boone",
      image: require("./images/examples/artists/4.webp"),
      isWinner: false
    },
    {
      name: "Tate McRae",
      image: require("./images/examples/artists/5.webp"),
      isWinner: false
    },
    {
      name: "Ariana Grande",
      image: require("./images/examples/artists/6.webp"),
      isWinner: false
    },
    {
      name: "KAYTRANADA",
      image: require("./images/examples/artists/7.webp"),
      isWinner: false
    },
    {
      name: "Kendrick Lamar",
      image: require("./images/examples/artists/8.webp"),
      isWinner: true
    },
    {
      name: "Taylor Swift",
      image: require("./images/examples/artists/9.webp"),
      isWinner: false
    }
  ]
};
