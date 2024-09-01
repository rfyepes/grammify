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
import { AWARD_YEAR, ELIGIBILITY, NUM_NOMINATIONS } from "./Constants"

// const NOW = {
//   year: new Date().getFullYear(),
//   month: new Date().getMonth() + 1
// };

// const AWARD_MONTH = 2; // Assumes Grammy Awards are held in February
// const AWARD_YEAR = (NOW.month > AWARD_MONTH) ? NOW.year + 1 : NOW.year;
// 
// const ELIGIBILITY_START_MONTH = 10; // Elibilility period begins October 1
// const ELIGIBILITY_START_DAY = 1;
// const ELIGIBILITY_END_MONTH = 9; // Elibilility period ends September 15
// const ELIGIBILITY_END_DAY = 15;
// 
// const NUM_NOMINATIONS = 5; // Needs 5 nominees per category

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
export function isEligible(dateString) {
  
  // Assumes release date is in format "YYYY-MM" or "YYYY-MM-DD"
  // TODO: account for "YYYY" by looking at release date precision field
  const splitDate = dateString.split("-");
  
  if (splitDate.length < 2) {
    return false;
  }
  
  const releaseDate = {
    year: parseInt(splitDate[0]),
    month: parseInt(splitDate[1]),
    day: parseInt(splitDate[2] ? splitDate[2].substring(0, 2) : ELIGIBILITY.end_day + 1) // Disqualified if no date
  };
  
  switch (releaseDate.year) {
    case AWARD_YEAR - 2:
      if (releaseDate.month === ELIGIBILITY.start_month) {
        return releaseDate.day >= ELIGIBILITY.start_day;
      } else {
        return releaseDate.month >= ELIGIBILITY.start_month;
      }
    case AWARD_YEAR - 1: 
      if (releaseDate.month === ELIGIBILITY.end_month) {
        return releaseDate.day <= ELIGIBILITY.end_day;
      } else {
        return releaseDate.month <= ELIGIBILITY.end_month;
      }
    default: return false;
  }
}

// Data expected to be an object with three fields - short_term, medium_term, 
// and long_term - each mapping to an array of Spotify TrackObjects
export function generateNominations(data) {
  
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
    // console.log(parseInt(i + 1) + " - " + tracks[i].name + " by " + tracks[i].artists[0].name);

    trackQueue.insert(tracks[i].id, tracks.length - i); // TODO: improve track priority, esp with recent release dates
    trackMap.set(tracks[i].id, tracks[i]);
  }
  
  let artistSet = new Set();
  let artistQueue = new PriorityQueue();
  let albumQueue = new PriorityQueue();
  let nominations = {
    songs: [],
    albums: [],
    artists: []
  };
  
  trackQueue.convertToArray().forEach((trackID, index) => {
    const track = trackMap.get(trackID);
    // console.log("TRACK - " + track.name + " by " + track.artists[0].name + ", " + track.album.release_date);
    if (!isEligible(track.album.release_date)) {
      return;
    }
    // console.log("ELIGIBLE TRACK - " + track.name + ", by: " + track.artists.map(a => a.name));
    // Nominate track if its primary artist has not yet been encountered
    if (nominations.songs.length < NUM_NOMINATIONS && !artistSet.has(track.artists[0].id) && track.duration_ms >= 60000) {
      nominations.songs.push(track);
      artistSet.add(track.artists[0].id);
    }
    
    // Nominate album if eligible
    // TODO: album can only be nominated if user listened to at least 3 tracks?
    if (track.album.total_tracks > 4) {
      albumQueue.insert(JSON.stringify(track.album), 1);
    } 
    
    // Increment priority of artist for artist award
    for (let i = 0; i < track.artists.length; i++) {
      artistQueue.insert(JSON.stringify(track.artists[i]), i === 0 ? 2 : 1);
    }
  });
    
  artistSet.clear();
  const albums = albumQueue.convertToArray(2).map(str => JSON.parse(str));
  // console.log("albums:")
  // console.log(albums);
  // Generate 5 album nominations with no repeat artists (TODO: unless <5 noms?)
  for (let i = 0; i < albums.length; i++) {
    if (nominations.albums.length === NUM_NOMINATIONS) {
      break;
    }
    if (!artistSet.has(albums[i].artists[0].id)) {
      nominations.albums.push(albums[i]);
      artistSet.add(albums[i].artists[0].id);
    }
  }
  // console.log(nominations.songs);
  // Generate 5 artist nominations
  // console.log(artistQueue.convertToArray().map(str => JSON.parse(str)).map(a => a.name));
  nominations.artists = artistQueue.convertToArray(3).slice(0, NUM_NOMINATIONS).map(str => JSON.parse(str));
  // console.log("artist queue:")
  return {
    songs: nominations.songs.map((song, rank) => {
      return {
        name: song.name,
        image: (song.album.images.length === 0) ? null : (song.album.images.length < 2) ? song.album.images[0].url : song.album.images[1].url,
        imageAlt: song.album.name + " album cover",
        details: song.artists.map(artist => artist.name).join(", "),
        isWinner: rank === 0,
        releaseDate: song.album.release_date,
        empty: false,
        popularity: rank === 0 ? 101 : 100,
        id: song.id
      };
    }).sort((a, b) => { return new Date(a.releaseDate) - new Date(b.releaseDate); }),
    albums: nominations.albums.map((album, rank) => {
      return {
        name: album.name,
        image: (album.images.length === 0) ? null : (album.images.length < 2) ? album.images[0].url : album.images[1].url,
        imageAlt: album.name + " album cover",
        details: album.artists.map(artist => artist.name).join(", "),
        isWinner: rank === 0,
        releaseDate: album.release_date,
        empty: false,
        popularity: rank === 0 ? 101 : 100,
        id: album.id
      };
    }).sort((a, b) => { return new Date(a.releaseDate) - new Date(b.releaseDate); }),
    artists: nominations.artists.map((artist, rank) => {
      return {
        name: artist.name,
        id: artist.id,
        image: null, // Artist images need to be retrieved separately
        imageAlt: artist.name + " profile image",
        details: null,
        isWinner: rank === 0,
        empty: false,
        popularity: rank === 0 ? 101 : 100
      };
    }).sort((a, b) => a.name.localeCompare(b.name))
  };
}
