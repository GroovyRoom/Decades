

module.exports = class Artwork {
    constructor(name = "default", user = "default", songId = "default"){
        this.id = null
        this.name = name
        this.user = user
        this.songId = songId
        this.date = "unknown"
        this.public = false
    }

    static generateRandomArtworks(amount) {
        let artworkObjects = []
        for (let i = 0; i<amount; i++){
            const artwork = new Artwork(`artwork_name_${i}`, `user_name_${i}`, `artist${i}/song${i}`)
            artworkObjects.push(artwork)
        }

        return artworkObjects
    }

    static generateWhiteBitmap(width, height) {
        let bitmap = []
        for (let i = 0; i<height; i++){
            for (let j = 0; j<width; j++){
                bitmap.push(255);
                bitmap.push(255);
                bitmap.push(255);
            }
        }

        return bitmap
    }

    static generateBlueBitmap(width, height){
        let bitmap = []
        for (let i = 0; i<height; i++){
            for (let j = 0; j<width; j++){
                bitmap.push(0);
                bitmap.push(0);
                bitmap.push(255);
            }
        }

        return bitmap
    }
}