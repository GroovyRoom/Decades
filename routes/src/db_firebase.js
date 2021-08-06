const FirestoreClient = require("./firestoreClient");
const Artwork = require("./artwork_dt");

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
    return FirestoreClient.searchById(artworkId);
  },

  UpdateArtwork: async function (artwork) {
    // Ensure that it is a regular object
    let artworkObject = { ...artwork };

    //TODO: quick and dirty solution for missing id
    if (artworkObject.id === undefined || artworkObject.id === null) {
      artworkObject.id = "id";
    }

    let dbArtwork = await FirestoreClient.searchById(artworkObject.id);
    if (dbArtwork === undefined) {
      //Create new
      let newDBEntry = { ...new Artwork() };
      artworkObject.id = await FirestoreClient.save(newDBEntry);
    }

    return await FirestoreClient.updatePossibleFields(
      artworkObject.id,
      artworkObject
    );
  },

  Clear: async function () {
    return await FirestoreClient.clear();
  },

  getAllSessions: async function () {
    return FirestoreClient.getAllSessions();
  },
};

module.exports = db;
