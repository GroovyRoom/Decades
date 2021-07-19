const express = require(`express`)
const DB = require(`./src/db`)
const uploader = require(`./src/upload_artwork`)

const router = express.Router()

//TODO: this logic is not present. Right now the client can simply download the bucket files.
//Need to revise this and somehow supply the bitmaps from the server or make extra rules for who can download
//bucket files.
const _populateArtworksBitmaps = async (artworks) => {
    for (let artwork of artworks.artworks){
        const bitmap = await uploader.downloadArtwork(artwork)
        artwork.bitmap = bitmap
    }

    return artworks
}

const _uploadArtworkAndFilterRequest = async (artwork) => {
    //artwork.bitmap would have the bitmap
    const artworkURL = await uploader.uploadArtwork(artwork)

    //assign the link but unassign the bitmap
    artwork.link = artworkURL
    delete artwork.bitmap
    
    return artwork
}

const _assertAuthorized = (req) => {
    if (!req.session){
        return false
    }

    if (!req.session.loggedIn){
        return false
    }

    return true
}

//DEBUG API
router.get(`/debug/all`, async (req, res) => {
    let allArtworks = await DB.GetArtworks(DB.access.ALL)
    res.json(allArtworks)
})

router.get(`/debug/:user`, async (req, res) => {
    let allArtworks = await DB.GetArtworks(DB.access.ALL, req.params.user)
    res.json(allArtworks)
})


//Randomly generate artworks for testing
router.post(`/debug/reset/:amount`, async (req, res) => {
    const artworks = await DB.ResetWithRandomArtworks(req.params.amount)
    let defaultBitmap = []
    for (let i = 0; i<640; i++){
        for (let j = 0; j<640; j++){
            defaultBitmap.push(255);
        }
    }

    for (let artwork of artworks.artworks){
        artwork.bitmap = defaultBitmap
        artwork = await _uploadArtworkAndFilterRequest(artwork)
        await DB.UpdateArtwork(artwork)
    }

    res.json(artworks)
})

router.get(`/debug/prod/uploaded`, async (req, res) => {
    let uploadedArtworks = await DB.GetArtworks(DB.access.UPLOADED_ONLY)
    res.json(uploadedArtworks)
})

router.get(`/debug/prod/local`, async (req, res) => {
    const fakeLoggedUser = 'user_name_6'
    let localArtworks = await DB.GetArtworks(DB.access.ALL, fakeLoggedUser)
    res.json(localArtworks)
})

router.post(`/debug/prod/save`, async (req, res) => {
    const artwork = await _uploadArtworkAndFilterRequest(req.body)

    //update DB
    let updatedArtwork = await DB.UpdateArtwork(artwork)
    res.json(updatedArtwork)
})

router.post(`/debug/prod/upload`, async (req, res) => {
    //same as /save but we need to explicitly mark is as .public = true
    //SAVEs and UPLOADs
    const artwork = await _uploadArtworkAndFilterRequest(req.body)
    artwork.public = true
    
    //update DB
    let updatedArtwork = await DB.UpdateArtwork(artwork)
    res.json(updatedArtwork)
})

//PRODUCTION API
router.get(`/uploaded`, async (req, res) => {
    if (!_assertAuthorized(req)){
        res.status(401).send('Not authorized')
        return
    }

    let uploadedArtworks = await DB.GetArtworks(DB.access.UPLOADED_ONLY)
    res.json(uploadedArtworks)
})

router.get(`/local`, async (req, res) => {
    if (!_assertAuthorized(req)){
        res.status(401).send('Not authorized')
        return
    }

    const loggedUserId = req.session.userId
    let localArtworks = await DB.GetArtworks(DB.access.ALL, loggedUserId)
    res.json(localArtworks)
})

router.post(`/save`, async (req, res) => {
    if (!_assertAuthorized(req)){
        res.status(401).send('Not authorized')
        return
    }

    let artwork = await _uploadArtworkAndFilterRequest(req.body)

    //Force user id of logged user regardless of what as passed
    artwork.user = req.session.userId

    //update DB
    let updatedArtwork = await DB.UpdateArtwork(artwork)
    res.json(updatedArtwork)
})

router.post(`/upload`, async (req, res) => {
    if (!_assertAuthorized(req)){
        res.status(401).send('Not authorized')
        return
    }

    //SAVEs and UPLOADs
    let artwork = await _uploadArtworkAndFilterRequest(req.body)

    //Force public to be true regardless of what was passed
    artwork.public = true

    //Force user id of logged user regardless of what as passed
    artwork.user = req.session.userId
    
    //update DB
    let updatedArtwork = await DB.UpdateArtwork(artwork)
    res.json(updatedArtwork)
})

module.exports = router