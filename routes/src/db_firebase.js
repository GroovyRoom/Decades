const fse = require(`fs-extra`);
const helpers = require(`./global_helpers`)
const FirestoreClient = require('./firestoreClient');
const path = require('path');
const Artwork = require('./artwork_dt')

const db = {
  access: {
    ALL: 0,
    LOCAL_ONLY: 1,
    UPLOADED_ONLY: 2,
  },

  GetArtworks: async function (access = undefined, user = undefined) {
    return FirestoreClient.GetArtworks(access, user);
  },

  GetArtwork: async function (artworkId) {
    return FirestoreClient.searchById(artworkId)
  },

  UpdateArtwork: async function (artwork) {
    // Ensure that it is a regular object
    let artworkObject = {...artwork}

    //TODO: quick and dirty solution for missing id
    if (artworkObject.id === undefined || artworkObject.id === null){
      artworkObject.id = "id"
    }

    let dbArtwork = await FirestoreClient.searchById(artworkObject.id)
    if (dbArtwork === undefined){
      //Create new
      let newDBEntry = {...new Artwork()}
      artworkObject.id = await FirestoreClient.save(newDBEntry);
    }

    return await FirestoreClient.updatePossibleFields(artworkObject.id, artworkObject)
  },

  Clear: async function () {
    //remove in firestore client
    return await FirestoreClient.clear()
  },

  getAllSessions: async function() {
    return FirestoreClient.getAllSessions();
  }
};

////// HELPERS

const basicColors = [
  [0, 0, 0], //black
  [255, 255, 255], //white
  [255, 0, 0], //red
  [0, 255, 0], //green
  [0, 0, 255], //blue
  [255, 255, 0], //yellow
  [255, 0, 255], //pink
  [0, 255, 255], //cyan
];

const _generateRandomColorInt = () => {
  return [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
  ];
};

const _getRandomLinearBitmap = (width, height) => {
  const randomColorRGBInt = _generateRandomColorInt();
  let bitmap = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      bitmap.push(randomColorRGBInt[0]);
      bitmap.push(randomColorRGBInt[1]);
      bitmap.push(randomColorRGBInt[2]);
    }
  }

  return bitmap;
};

const _generateEmptyArtworkEntry = () => {

    let data = {
        name : `default_name`,
        user : `default_user`,
        date : `01 01 2021`,
        songId : `default_artist/default_song`,
        bitmap : [],
        link : `www.store.com/art_default.artwork`,
        public : false
    }

  return data;
};

module.exports = db;
