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
var redirect_uri = "https://rfyepes.github.io/grammify";//"http://localhost:3000";//"https://www.spotigrammy.com";

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
      name: "Flowers",
      details: "Miley Cyrus",
      image: "https://i.scdn.co/image/ab67616d00001e02cd222052a2594be29a6616b5",
      isWinner: false
    },
    {
      name: "Boy's a liar Pt. 2",
      details: "PinkPantheress, Ice Spice",
      image: "https://i.scdn.co/image/ab67616d00001e029567e1aa41657425d046733b",
      isWinner: false
    },
    {
      name: "Cupid - Twin Ver.",
      details: "FIFTY FIFTY",
      image: "https://i.scdn.co/image/ab67616d00001e0237c0b3670236c067c8e8bbcb",
      isWinner: true
    },
    {
      name: "FLOWER",
      details: "JISOO",
      image: "https://i.scdn.co/image/ab67616d00001e02f35b8a6c03cc633f734bd8ac",
      isWinner: false
    },
    {
      name: "vampire",
      details: "Olivia Rodrigo",
      image: "https://i.scdn.co/image/ab67616d00001e02e85259a1cae29a8d91f2093d",
      isWinner: false
    },
    {
      name: "Espresso",
      details: "Sabrina Carpenter",
      image: "https://i.scdn.co/image/ab67616d00001e02de84adf0e48248ea2d769c3e",
      isWinner: false
    },
    {
      name: "Not Like Us",
      details: "Kendrick Lamar",
      image: "https://i.scdn.co/image/ab67616d00001e021ea0c62b2339cbf493a999ad",
      isWinner: false
    },
    {
      name: "Magnetic",
      details: "ILLIT",
      image: "https://i.scdn.co/image/ab67616d00001e02f037c5fb9de6c78726cb8e2c",
      isWinner: true
    },
    {
      name: "Too Sweet",
      details: "Hozier",
      image: "https://i.scdn.co/image/ab67616d00001e02a5aab55aa65e5f6bd19564a2",
      isWinner: false
    },
    {
      name: "Houdini",
      details: "Dua Lipa",
      image: "https://i.scdn.co/image/ab67616d00001e02778c1e4660aa23f6728b32a1",
      isWinner: false
    }
  ],
  albums: [
    {
      name: "Midnights",
      details: "Taylor Swift",
      image: "https://i.scdn.co/image/ab67616d00001e02bb54dde68cd23e2a268ae0f5",
      isWinner: false
    },
    {
      name: "SOS",
      details: "SZA",
      image: "https://i.scdn.co/image/ab67616d00001e0270dbc9f47669d120ad874ec1",
      isWinner: true
    },
    {
      name: "Red Moon In Venus",
      details: "Kali Uchis",
      image: "https://i.scdn.co/image/ab67616d00001e0281fccd758776d16b87721b17",
      isWinner: false
    },
    {
      name: "Did you know that there's a tunnel under Ocean Blvd",
      details: "Lana Del Rey",
      image: "https://i.scdn.co/image/ab67616d00001e0259ae8cf65d498afdd5585634",
      isWinner: false
    },
    {
      name: "UTOPIA",
      details: "Travis Scott",
      image: "https://i.scdn.co/image/ab67616d00001e02881d8d8378cd01099babcd44",
      isWinner: false
    },
    {
      name: "HIT ME HARD AND SOFT",
      details: "Billie Eilish",
      image: "https://i.scdn.co/image/ab67616d00001e0271d62ea7ea8a5be92d3c1f62",
      isWinner: false
    },
    {
      name: "ORQUÍDEAS",
      details: "Kali Uchis",
      image: "https://i.scdn.co/image/ab67616d00001e02b968625b03ec59b30b48e9c3",
      isWinner: true
    },
    {
      name: "God Said No",
      details: "Omar Apollo",
      image: "https://i.scdn.co/image/ab67616d00001e02f6ba7085174586aed75935bc",
      isWinner: false
    },
    {
      name: "<Dall>",
      details: "ARTMS",
      image: "https://i.scdn.co/image/ab67616d00001e023eaf9b3c1c804fec2bb06ac0",
      isWinner: false
    },
    {
      name: "TIMELESS",
      details: "KAYTRANADA",
      image: "https://i.scdn.co/image/ab67616d00001e023d1996a2dc962e53e12cb7cb",
      isWinner: false
    }
  ],
  artists: [
    {
      name: "Gracie Abrams",
      image: "https://i.scdn.co/image/ab67616100005174416bd8a66bfcbc545c2009ac",
      isWinner: false
    },
    {
      name: "NewJeans",
      image: "https://i.scdn.co/image/ab676161000051745da361915b1fa48895d4f23f",
      isWinner: false
    },
    {
      name: "Noah Kahan",
      image: "https://i.scdn.co/image/ab676161000051747bfba04955b666b8b8219541",
      isWinner: false
    },
    {
      name: "Shakira",
      image: "https://i.scdn.co/image/ab67616100005174284894d68fe2f80cad555110",
      isWinner: true
    },
    {
      name: "Taylor Swift",
      image: "https://i.scdn.co/image/ab67616100005174859e4c14fa59296c8649e0e4",
      isWinner: false
    },
    {
      name: "Tate McRae",
      image: "https://i.scdn.co/image/ab67616100005174846308bf9bf7d3183958b3a6",
      isWinner: false
    },
    {
      name: "Benson Boone",
      image: "https://i.scdn.co/image/ab67616100005174b2ce21a89c09c00d80d8ca25",
      isWinner: false
    },
    {
      name: "Chappell Roan",
      image: "https://i.scdn.co/image/ab67616100005174cde5a0d57c1b79de5fce6bee",
      isWinner: false
    },
    {
      name: "Charli xcx",
      image: "https://i.scdn.co/image/ab67616100005174936885667ef44c306483c838",
      isWinner: true
    },
    {
      name: "FLO",
      image: "https://i.scdn.co/image/ab67616100005174c11fac63b181b445fb715a44",
      isWinner: false
    }
  ]
};


