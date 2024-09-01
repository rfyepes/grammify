// fetchData.js
// Contains async functions called in AwardsPage.js that fetch data from the
// Spotify API

import { AWARD_YEAR } from "./Constants"

export async function retrieveTopTracks(timeRange, accessToken) {
  
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`, {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });
    // if (response.status === 401) {
    //   throw 401;
    // }
    // TODO: alter message w/ instructions to user?
    if (!response.ok) {
      throw new Error(`HTTP error - status ${response.status}: ${response.message}`);
    }
    
    var data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
  return data.items;  
}

export async function getArtistImages(artists, accessToken) {
  
  const images = await artists.map(async (artist) => {
    if (artist.empty) {
      return null;
    }
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        });
        const data = await response.json();
        // TODO: error check
        if (data.images.length === 0) {
          return null;
        }
        return (data.images.length === 1) ? data.images[0].url : data.images[1].url;
    } catch (error) {
      return null;
    }
  })
  return await Promise.all(images);
}

// This is needed to download the graphic using html2canvas
export async function replaceImages(nominations) {
  
  const fetchImage = (elem, index) => {
    if (!elem.image) {
      return null;
    }
    return new Promise((resolve, reject) => {
      fetch(elem.image)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataURL = reader.result;
            resolve(dataURL);
          };
          reader.readAsDataURL(blob);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
      
  const makeReplaceImage = (images) => {
    return (elem, index) => {
      let newElem = elem;
      newElem.image = images[index];
      return newElem;
    };
  }
  
  let songImages = await nominations.songs.map(fetchImage);
  let albumImages = await nominations.albums.map(fetchImage);
  let artistImages = await nominations.artists.map(fetchImage);
  
  nominations.songs = nominations.songs.map(makeReplaceImage(await Promise.all(songImages)));
  nominations.albums = nominations.albums.map(makeReplaceImage(await Promise.all(albumImages)));
  nominations.artists = nominations.artists.map(makeReplaceImage(await Promise.all(artistImages)));
  
  return nominations;
}

export async function replaceImage(imageURL) {
  if (!imageURL) {
    return null;
  }
  try {
      const response = await fetch(imageURL);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
      });
  } catch (error) {
      throw new Error('Error converting image to base64: ' + error.message);
      return null;
  }
};


export async function spotifySearch(query, type, accessToken) {
  //TODO: add limit??? rn tehre are 100
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?${new URLSearchParams({
      q: `${type}:${query}${type === "artist" ? "" : ` year:${AWARD_YEAR - 2}-${AWARD_YEAR - 1}`}`,
      type: type,
    })}`, {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });
    if (response.status === 401) {
      throw 401;
    }
    // TODO: alter message w/ instructions to user?
    if (!response.ok) {
      // TODO: search api may be affected and return nothing
      console.log(`HERE - HTTP error - status ${response.status}: ${response.message}`);
      throw new Error(`HTTP error - status ${response.status}: ${response.message}`);
    }
    
    var data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
  return data[type + "s"].items;  
}

export async function getAlbumPopularity(id, accessToken) {

  try {
    const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });
    if (response.status === 401) {
      throw 401;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error - status ${response.status}: ${response.message}`);
    }
    
    var data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return 0;
  }
  // console.log("FETCH DONE!!!!!!!");
  // console.log(data);
  return data.popularity;  
}
