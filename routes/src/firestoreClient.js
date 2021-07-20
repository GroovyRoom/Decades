const Firestore = require('@google-cloud/firestore');
const { clear } = require('console');
const path = require('path');

class FirestoreClient {

    constructor() {
        this.firestore = new Firestore({
            projectId: 'decades',
            keyFilename: path.join(__dirname, './service-account.json')
        })
    }

    async GetArtworks (access, user) {
        let filtered = { artworks: [] };
        let artworkRef = await this.firestore.collection('artworks')

        if (artworkRef.empty) {
            return filtered;
        } 

        if (user !== undefined) {
            artworkRef = await artworkRef.where('user', '==', user);
        }

        if (access === 1) {
            artworkRef = await artworkRef.where('public', '==', false);
        }

        if (access === 2) {
            artworkRef = await artworkRef.where('public', '==', true);
        }

        artworkRef = await artworkRef.get()
        artworkRef.forEach(art => {
            filtered.artworks.push(art.data());
        });

        return filtered;
    }

    async save(data) {
        const docRef = await this.firestore.collection('artworks').add(data);
        const theid = docRef.id;
        await docRef.update({id: theid});
        return theid
    }

    async updatePossibleFields(id, data) {
        const ref = this.firestore.collection('artworks').doc(id);
        await ref.update(data);
        const value = await ref.get()
        return value.data()
    }

    async setSongId(id, theSongId) {
        const ref = this.firestore.collection('artworks').doc(id);
        await ref.update({songId: theSongId});
    }

    async setPublicTrue(id) {
        const ref = this.firestore.collection('artworks').doc(id);
        await ref.update({public: true});
    }

    async setPublicFalse(id) {
        const ref = this.firestore.collection('artworks').doc(id);
        await ref.update({public: false});
    }

    async searchById(id) {
        const ref = await this.firestore.collection('artworks').doc(id).get();
        return ref.data();
    }

    async searchArtWorkByName(name) {
        const artWorkRef = await this.firestore.collection('artworks');
        const queryRef = await artWorkRef.where('name', '==', name).get();
        if (queryRef.empty) {
            console.log('No such document!');
            return undefined;
        } else {
            let id;
            queryRef.forEach(art => {
                id = art.id;
            });
            return id;
        }
    }
}

module.exports = new FirestoreClient();