const express = require(`express`);
const DB = require(`./src/db_firebase`);
const router = express.Router();

const _assertAPIAuthorized = (req) => {
  if (!req.session) {
    return false;
  }

  if (!req.session.loggedIn) {
    return false;
  }

  return true;
};

const _assertEditAuthorized = async (artworkID, req) => {
  if (artworkID === null || artworkID === undefined) {
    // Intention is to create a new one
    return true;
  }

  // Intention is to update, need to check if authorized
  const dbEntry = await DB.GetArtwork(artworkID);
  if (dbEntry === null || dbEntry === undefined) {
    // Wanted to update, but passed incorrect ID. Treat as new artwork creation
    return true;
  }

  // Confirm whether logged in user is the same user associated with the entry
  return req.session.userId === dbEntry.user;
};

const _assertDownloadAuthorized = async (artworkID, req) => {
  if (artworkID === null || artworkID === undefined) {
    // Id is invalid, no artwork to download
    return false;
  }

  const dbEntry = await DB.GetArtwork(artworkID);
  if (dbEntry === null || dbEntry === undefined) {
    // No associated artwork entry with id
    return false;
  }

  if (dbEntry.public) {
    // Public artworks are available to all logged in users
    return true;
  }

  // If artwork is private, only allow download to users who create the artwork
  return req.session.userId === dbEntry.user;
};

router.get(`/uploaded`, async (req, res) => {
  if (!_assertAPIAuthorized(req)) {
    res.status(401).send("Not authorized");
    return;
  }

  let uploadedArtworks = await DB.GetArtworks(DB.access.UPLOADED_ONLY);
  res.json(uploadedArtworks);
});

router.get(`/local`, async (req, res) => {
  if (!_assertAPIAuthorized(req)) {
    res.status(401).send("Not authorized");
    return;
  }

  const loggedUserId = req.session.userId;
  let localArtworks = await DB.GetArtworks(DB.access.ALL, loggedUserId);
  res.json(localArtworks);
});

router.post(`/save`, async (req, res) => {
  if (!_assertAPIAuthorized(req)) {
    res.status(401).send("Not authorized");
    return;
  }

  // we need to make sure that if we push updates to the artwork - we are authorized to do so.
  // this can only happen if we pass in ID we want to update but we are not the creator.
  const editAuthorized = await _assertEditAuthorized(req.body.meta.id, req);
  if (!editAuthorized) {
    res.status(401).send("Not authorized to edit the artwork");
    return;
  }

  //Force the user field to be the current logged in user
  req.body.meta.user = req.session.userId;

  //update DB
  const dbEntry = await DB.UpdateArtwork(req.body.meta);

  res.json(dbEntry);
});

// Access particular artwork data.
router.get(`/:artwork`, async (req, res) => {
  if (!_assertAPIAuthorized(req)) {
    res.status(401).send("Not authorized");
    return;
  }

  // Artwork id is guaranteed to be there by construction
  const artworkId = req.params.artwork;

  const downloadAuthorized = await _assertDownloadAuthorized(artworkId, req);
  if (!downloadAuthorized) {
    res.status(401).send("Not authorized to download artwork");
    return;
  }

  const artworkMeta = await DB.GetArtwork(artworkId);

  const response = { meta: artworkMeta };
  res.send(response);
});

module.exports = router;
