const express = require(`express`)
const DB = require(`./src/db_firebase`)
const uploader = require(`./src/upload_artwork`)
const Artwork = require(`./src/artwork_dt`)

const router = express.Router()

//DEBUG API
router.get(`/all`, async (req, res) => {
    let allArtworks = await DB.GetArtworks(DB.access.ALL)
    res.json(allArtworks)
})

router.get(`/user/:user`, async (req, res) => {
    let allArtworks = await DB.GetArtworks(DB.access.ALL, req.params.user)
    res.json(allArtworks)
})

//Randomly generate artworks for testing
router.post(`/reset/:amount`, async (req, res) => {
    // This is a debug command and for ease of testing it does multiple things

    // 1. Clear the DB
    await DB.Clear()

    // 2. Clear the Store
    await uploader.clearStore()

    // 3. Generate random artworks
    const randomArtworks = Artwork.generateRandomArtworks(req.params.amount)

    // 4. Generate a blue bitmap for all these test artworks
    const whiteBitmap = Artwork.generateBlueBitmap(640, 640)

    // 5. For each artwork: first, create entry in the database. 
    // When that is done, then upload a bitmap to the storage
    let resultArtworks = []
    console.log(`Generating debug entries!`)
    for (let i = 0; i<randomArtworks.length; i++){
        console.log(`Generating ${i+1} out of ${randomArtworks.length}...`)
        const dbEntry = await DB.UpdateArtwork(randomArtworks[i])
        resultArtworks.push(dbEntry)
        await uploader.uploadArtwork(dbEntry.id, whiteBitmap)
    }
    console.log(`Done!`)

    res.json(resultArtworks)
})

//downloads the artwork data.
router.get(`/:artwork`, async (req, res) => {
    // Artwork id is guaranteed to be there by construction
    const artworkId = req.params.artwork

    const bitmap = await uploader.downloadArtwork(artworkId)
    const artworkMeta = await DB.GetArtwork(artworkId)

    const response = {meta: artworkMeta, bitmap: bitmap}
    res.send(response)
})

module.exports = router