// generateNominations.js
// Exports a single function that generates 5 nominees for each category - Song
// of the Year, Album of the Year, and Artist of the Year - given an object of 
// Spotify track data. 
//
// Notes on nominations:
//   - Songs are nominated based on the provided order of tracks.
//   - Albums are nominated based on the ratio of listened-to tracks to number 
//     of tracks.
//   - Artists are nominated based on how many of their eligible songs appear.
//   - Artists can only be nominated once per category.
//   - Tracks on the long_term field get prioritized over those in the 
//     medium_term, which get prioritized over the short_term.

import PriorityQueue from "./priorityQueue"

const NOW = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
};

const AWARD_MONTH = 2; // Assumes Grammy Awards are held in February
const AWARD_YEAR = (NOW.month > AWARD_MONTH) ? NOW.year + 1 : NOW.year;

const ELIGIBILITY_START_MONTH = 10; // Elibilility period begins October 1
const ELIGIBILITY_START_DAY = 1;
const ELIGIBILITY_END_MONTH = 9; // Elibilility period ends September 15
const ELIGIBILITY_END_DAY = 15;

const NUM_NOMINATIONS = 5; // Needs 5 nominees per category

// TODO: delete this function
// function isLessThanSixMonthsOld(track) {
//   const splitDate = track.album.release_date.split("-");
// 
//   if (splitDate.length < 2) {
//     return false;
//   }
// 
//   const releaseDate = {
//     year: parseInt(splitDate[0]),
//     month: parseInt(splitDate[1])
//   };
// 
//   switch (releaseDate.year) {
//     case NOW.year: return releaseDate.month >= (NOW.month - 6);
//     case NOW.year - 1: return releaseDate.month >= (NOW.month + 6);
//     default: return false;
//   }
// 
// }

// Returns true iff the given track was released within eligibility period
function isEligible(track) {
  
  // Assumes release date is in format "YYYY-MM" or "YYYY-MM-DD"
  // TODO: account for "YYYY" by looking at release date precision field
  const splitDate = track.album.release_date.split("-");
  
  if (splitDate.length < 2) {
    return false;
  }
  
  const releaseDate = {
    year: parseInt(splitDate[0]),
    month: parseInt(splitDate[1]),
    day: parseInt(splitDate[2] ? splitDate[2] : ELIGIBILITY_END_DAY + 1) // Disqualified if no date
  };
  
  switch (releaseDate.year) {
    case AWARD_YEAR - 2:
      if (releaseDate.month === ELIGIBILITY_START_MONTH) {
        return releaseDate.day >= ELIGIBILITY_START_DAY;
      } else {
        return releaseDate.month >= ELIGIBILITY_START_MONTH;
      }
    case AWARD_YEAR - 1: 
      if (releaseDate.month === ELIGIBILITY_END_MONTH) {
        return releaseDate.day <= ELIGIBILITY_END_DAY;
      } else {
        return releaseDate.month <= ELIGIBILITY_END_MONTH;
      }
    default: return false;
  }
}

// Data expected to be an object with three fields - short_term, medium_term, 
// and long_term - each mapping to an array of Spotify TrackObjects
export default function generateNominations(data) {
  
  // TODO: releases from past 6 months that are on long term shoudl be above 
  // older realses that are on long term but not medium term!!!!! 
  // and same for 4 weeks ig 
  
  // Ensure each data field is non-empty
  // TODO - what if 4 weeks is empty but others are not?
  // const emptyDataset = ["long_term", "medium_term", "short_term"].reduce((isEmpty, time) => 
  //   ((!(time in data) || data[time].length === 0) ? true : isEmpty)
  // , false);
  // if (emptyDataset) {
  //   throw new Error("Empty dataset");
  // }
  
  const trackMap = new Map();
  const trackQueue = new PriorityQueue(); // Ideal for track repitition
  const tracks = data.long_term.concat(data.medium_term.concat(data.short_term));
  for (let i = 0; i < tracks.length; i++) {
    trackQueue.insert(tracks[i].id, tracks.length - i);
    trackMap.set(tracks[i].id, tracks[i]);
  }
  
  let artistSet = new Set();
  let artistQueue = new PriorityQueue();
  let albumQueue = new PriorityQueue();
  let nominations = {
    songs: [],
    albums: [],
    artists: [],
    year: AWARD_YEAR
  };
  
  trackQueue.convertToArray().forEach((trackID, index) => {
    const track = trackMap.get(trackID);
    if (!isEligible(track)) {
      return;
    }
    
    // Nominate track if its primary artist has not yet been encountered
    if (nominations.songs.length < NUM_NOMINATIONS && !artistSet.has(track.artists[0].id) && track.duration_ms >= 60000) {
      nominations.songs.push(track);
      artistSet.add(track.artists[0].id);
    }
    
    // Nominate album if eligible
    if (track.album.total_tracks > 4) {
      albumQueue.insert(JSON.stringify(track.album), 1 / track.album.total_tracks);
    }
    
    // Increment priority of artist for artist award
    artistQueue.insert(JSON.stringify(track.artists[0]), 1);
  });
    
  artistSet.clear();
  const albums = albumQueue.convertToArray().map(str => JSON.parse(str));
  
  // Generate 5 album nominations with no repeat artists
  for (let i = 0; i < albums.length; i++) {
    if (nominations.albums.length === NUM_NOMINATIONS) {
      break;
    }
    if (!artistSet.has(albums[i].artists[0].id)) {
      nominations.albums.push(albums[i]);
      artistSet.add(albums[i].artists[0].id);
    }
  }
  
  // Generate 5 artist nominations
  nominations.artists = artistQueue.convertToArray().slice(0, NUM_NOMINATIONS).map(str => JSON.parse(str));
  
  return {
    songs: nominations.songs.map((song, rank) => {
      return {
        name: song.name,
        image: (song.album.images.length === 0) ? null : (song.album.images.length < 2) ? song.album.images[0].url : song.album.images[1].url,
        imageAlt: song.album.name + " album cover",
        details: song.artists.map(artist => artist.name).join(", "),
        isWinner: rank === 0,
        releaseDate: song.album.release_date
      };
    }).sort((a, b) => { return new Date(a.releaseDate) - new Date(b.releaseDate); }),
    albums: nominations.albums.map((album, rank) => {
      return {
        name: album.name,
        image: (album.images.length === 0) ? null : (album.images.length < 2) ? album.images[0].url : album.images[1].url,
        imageAlt: album.name + " album cover",
        details: album.artists.map(artist => artist.name).join(", "),
        isWinner: rank === 0,
        releaseDate: album.release_date
      };
    }).sort((a, b) => { return new Date(a.releaseDate) - new Date(b.releaseDate); }),
    artists: nominations.artists.map((artist, rank) => {
      return {
        name: artist.name,
        id: artist.id,
        image: null, // Artist images need to be retrieved separately
        imageAlt: artist.name + " profile image",
        details: null,
        isWinner: rank === 0
      };
    }).sort((a, b) => a.name.localeCompare(b.name)),
    year: nominations.year
  };
}
