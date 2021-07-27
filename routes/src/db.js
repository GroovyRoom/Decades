const fse = require(`fs-extra`);
const helpers = require(`./global_helpers`)

const dbPath = `routes/src/artworks_db.json`;

const db = {
  access: {
    ALL: 0,
    LOCAL_ONLY: 1,
    UPLOADED_ONLY: 2,
  },

  GetArtworks: async function (access = undefined, user = undefined) {
    const dbExists = await fse.pathExists(dbPath);
    if (!dbExists && helpers.IS_RUNNING_ON_GAE()){
      // Seems that .json is absent from the GAE. Since we can't write on GAE instance, return empty DB
      return { artworks: [] }
    }

    if (!dbExists) {
      await _writeToDatabaseFile({ artworks: [] })
    }

    let data = await fse.readJson(dbPath);
    let filtered = { artworks: [] };

    if (access === undefined) {
      access = this.access.ALL;
    }

    for (const art of data.artworks) {
      if (user !== undefined && art.user !== user) {
        continue;
      }

      if (access === this.access.ALL) {
        filtered.artworks.push(art);
        continue;
      }

      if (access === this.access.LOCAL_ONLY) {
        if (!art.public) {
          filtered.artworks.push(art);
          continue;
        }
      }

      if (access === this.access.UPLOADED_ONLY) {
        if (art.public) {
          filtered.artworks.push(art);
          continue;
        }
      }
    }

    return filtered;
  },

  UpdateArtwork: async function (artwork) {
    let data = await this.GetArtworks();

    //TODO: use ID for identification rather than name!
    let existingArtwork = data.artworks.find((a) => a.name === artwork.name);
    let exists = true
    if (existingArtwork === undefined) {
      exists = false
      existingArtwork = _generateEmptyArtworkEntry();
    }

    //Update all possible fields from the request
    for (const field in artwork) {
      existingArtwork[field] = artwork[field];
    }

    const existingArtworkIndex = data.artworks.indexOf(existingArtwork);
    if (!exists) {
      data.artworks.push(existingArtwork);
      await _writeToDatabaseFile(data)
    } else {
      data.artworks[existingArtworkIndex] = existingArtwork;
      await _writeToDatabaseFile(data)
    }

    return existingArtwork;
  },

  Clear: async function () {
    let data = await this.GetArtworks();
    data.artworks = []
    await _writeToDatabaseFile(data)
    return data;
  },

  ResetWithRandomArtworks: async function (amount) {
    let data = await this.GetArtworks();
    data.artworks = _generateRandomArtworks(amount);
    await _writeToDatabaseFile(data)
    return data;
  },
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
  let artworkObject = {};
  artworkObject.name = `default_name`;
  artworkObject.user = `default_user`;
  artworkObject.date = `01 01 2021`;
  artworkObject.songId = `default_artist/default_song`;
  artworkObject.bitmap = [];
  artworkObject.link = `www.store.com/art_default.artwork`;
  artworkObject.public = false;

  return artworkObject;
};

const _generateRandomArtworks = (amount) => {
  let artworkObjects = [];
  for (let i = 0; i < amount; i++) {
    let artworkObject = {};
    artworkObject.name = `artwork_name_${i}`;
    artworkObject.user = `user_name_${i}`;
    artworkObject.date = `01 ${i} 2020`;
    artworkObject.songId = `artist${i}/song${i}`;
    artworkObject.bitmap = [];
    artworkObject.link = `www.store.com/art_${i}.artwork`;
    artworkObject.public = false;

    artworkObjects.push(artworkObject);
  }

  return artworkObjects;
};

const _writeToDatabaseFile = async (data) => {
  //On GAE we can't write to the file system
  if (!helpers.IS_RUNNING_ON_GAE()) {
    await fse.writeJSON(dbPath, data, { spaces: 4 });
  }
}

module.exports = db;
