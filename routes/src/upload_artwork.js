const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './artwork_uploader_key.json')

const {Storage} =  Cloud
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: "decades"
})

const util = require('util')
const bucket = storage.bucket('decades_images')

//https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876
const uploadArtwork = (artworkId, bitmap) => new Promise((resolve, reject) => {
    const blob = bucket.file(artworkId)
    const blobStream = blob.createWriteStream({
        resumable: false
    })
    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        resolve(publicUrl)
    }).on('error', (err) => {
        console.error(err)
        reject('Unable to upload the artwork, something went wrong')
    }).end(Buffer.from(bitmap))
})

const downloadArtwork = async (artworkId) => {
    const remoteArtworkFile = bucket.file(artworkId)
    const artworkExists = await remoteArtworkFile.exists()
    if (!artworkExists[0]){
        console.error(`Tried to load the artwork ${artworkId} that doesn't exist in the storage`)
        return []
    }

    const data = await remoteArtworkFile.download()
    const contents = data[0]
    let bitmap32 = new Int32Array(contents)
    let bitmap = []
    bitmap = [...bitmap, ...bitmap32]
    return bitmap
}

const clearStore = async() => {
    const [files] = await bucket.getFiles()
    for (const file of files) {
        await file.delete()
    }
}

module.exports.uploadArtwork = uploadArtwork
module.exports.downloadArtwork = downloadArtwork
module.exports.clearStore = clearStore