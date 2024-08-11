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
    }
  ]
};





