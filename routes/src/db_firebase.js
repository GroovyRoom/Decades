const fse = require(`fs-extra`);
const helpers = require(`./global_helpers`)
const FirestoreClient = require('./firestoreClient');
const path = require('path');

const db = {
  access: {
    ALL: 0,
    LOCAL_ONLY: 1,
    UPLOADED_ONLY: 2,
  },

  GetArtworks: async function (access = undefined, user = undefined) {
    return FirestoreClient.GetArtworks(access, user);
  },

  UpdateArtwork: async function (artwork) {
    let artworkID = artwork.id
    //TODO: quick and dirty solution for missing id
    if (artworkID === undefined){
      artworkID = "id"
    }

    let dbArtwork = await FirestoreClient.searchById(artworkID)
    if (dbArtwork === undefined){
      //Create new
      let newArtwork = _generateEmptyArtworkEntry();
      artworkID = await FirestoreClient.save(newArtwork);
    }

    //Update all fields except artwork.id
    delete artwork.id
    return await FirestoreClient.updatePossibleFields(artworkID, artwork)
  },
};

////// HELPERS
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
