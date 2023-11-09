import PriorityQueue from "./priorityQueue"

const NOW = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
};

// TODO:
// maybe the order should be long term songs, but if a song that was 
// released <6 months ago is ranked higher than one of the long term songs
// in the 6 month list, then it moves above the long term one?

const AWARD_MONTH = 2; // Assumes Grammy Awards are held in February
const AWARD_YEAR = (NOW.month > AWARD_MONTH) ? NOW.year + 1 : NOW.year;

const ELIGIBILITY_START = 10; // Assumes elibilility period begins in October
const ELIGIBILITY_END = 9; // Assumes elibilility period ends in September

// Returns true iff the given track was released within the Grammy eligibility
// period (TODO: and is not a local track??)
function isEligible(track) {
  
  // Assumes release date is in format "YYYY-MM" or "YYYY-MM-DD"
  // TODO: account for "YYYY" by looking at release date precision field
  const splitDate = track.album.release_date.split("-");
  const releaseDate = {
    year: parseInt(splitDate[0]),
    month: parseInt(splitDate[1])
  };
  
  switch (releaseDate.year) {
    case AWARD_YEAR - 2: return releaseDate.month >= ELIGIBILITY_START;
    case AWARD_YEAR - 1: return releaseDate.month <= ELIGIBILITY_END;
    default: return false;
  }
}

// Data expected to be an object with three fields - short_term, medium_term, 
// and long_term - each mapping to an array of 50 Spotify TrackObjects
export function generateNominations(data) {
  // console.log("DATA BELOW");
  // console.log(data);
  // console.log("DATA ABOVE");
  // alert(JSON.stringify(data));
  const numNominations = 5; // TODO
  // validate that the data json is actually what we expect? right fields, etc.
  
  let trackMap = new Map();
  let tracks = new PriorityQueue();
  for (let i = 0; i < 50; i++) { // TODO: arrays might be shorter than 50
    tracks.insert(data.long_term[i].id, 150 - i);
    tracks.insert(data.medium_term[i].id, 100 - i);
    tracks.insert(data.short_term[i].id, 50 - i);

    trackMap.set(data.long_term[i].id, data.long_term[i]);
    trackMap.set(data.medium_term[i].id, data.medium_term[i]);
    trackMap.set(data.short_term[i].id, data.short_term[i]);
  }
  
  // 08 Air Force One
  // 10 Did You Wait?
  // 18 Get Up
  // 10 Cool With You
  // 21 New Jeans
  // 22 OMG
  // 31 FLOWER
  
  
  let artistSet = new Set();
  let artistQueue = new PriorityQueue();
  let albumQueue = new PriorityQueue();
  let nominations = {
    artists: [],
    records: [],
    albums: [],
    year: AWARD_YEAR
  };
  
  tracks
    .convertToArray()
    // .map(str => JSON.parse(str))
    // .map(obj => { console.log(obj.name); return obj; })
    .forEach((trackID, index) => {
      let track = trackMap.get(trackID);
      if (!isEligible(track)) {
        // TODO: check if valid length? i.e., don't allow intros?
        return;
      }
      // console.log(track.name);
      // Nominate track if it's an unseen artist
      if (nominations.records.length < numNominations && !artistSet.has(track.artists[0].id) && track.duration_ms >= 60000) { // TODO: look at all artists?
        nominations.records.push(track); // TODO: update for 6 month tracks?
        artistSet.add(track.artists[0].id);
      }
      
      // if (track.album.album_type != "single") { // TODO: also exclude compilations?
      if (track.album.total_tracks > 4) {
        albumQueue.insert(JSON.stringify(track.album), 1 / track.album.total_tracks);
      }
      
      artistQueue.insert(JSON.stringify(track.artists[0]), 1);
    })
    
    artistSet.clear();
    const albums = albumQueue.convertToArray().map(str => JSON.parse(str));
    
    for (let i = 0; i < albums.length; i++) {
      if (nominations.albums.length == numNominations) {
        break;
      }
      if (!artistSet.has(albums[i].artists[0].id)) {
        nominations.albums.push(albums[i]);
        artistSet.add(albums[i].artists[0].id);
      }
    }
    
    nominations.artists = artistQueue.convertToArray().slice(0, numNominations).map(str => JSON.parse(str));
    
    // return nominations;
    
    return {
      albums: nominations.albums.map((album, rank) => {
        return {
          name: album.name,
          image: (album.images.length > 1) ? album.images[1].url : album.images[0].url,
          imageAlt: album.name + " album cover",
          details: album.artists.map(artist => artist.name).join(", "),
          isWinner: rank == 0,
          releaseDate: album.release_date
        };
      }).sort((a, b) => { return new Date(a.releaseDate) - new Date(b.releaseDate); }),
      records: nominations.records.map((record, rank) => {
        return {
          name: record.name,
          image: (record.album.images.length > 1) ? record.album.images[1].url : record.album.images[0].url,
          imageAlt: record.album.name + " album cover",
          details: record.artists.map(artist => artist.name).join(", "),
          isWinner: rank == 0,
          releaseDate: record.album.release_date
        };
      }).sort((a, b) => { return new Date(a.releaseDate) - new Date(b.releaseDate); }),
      artists: nominations.artists.map((artist, rank) => {
        return {
          name: artist.name,
          id: artist.id,
          imageAlt: artist.name + " profile image",
          details: null,
          isWinner: rank == 0
        };
      }).sort((a, b) => a.name.localeCompare(b.name)),
    };
  
    
    // TODO: if is_local
  }
