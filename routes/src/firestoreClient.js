const Firestore = require('@google-cloud/firestore');
const { clear } = require('console');
const path = require('path');

// DB Helpers
//https://firebase.google.com/docs/firestore/manage-data/delete-data
async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath)
    const query = collectionRef.orderBy('__name__').limit(batchSize)

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    })
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get()

    const batchSize = snapshot.size;
    if (batchSize === 0){
        //we are done
        resolve();
        return;
    }

    // Delete docs in a batch
    const batch = db.batch()
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
    });
    await batch.commit()

    // Recurse on the next process tick to avoid exploding the stack
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve)
    })
}


class FirestoreClient {

    constructor() {
        this.firestore = new Firestore({
            projectId: 'decades',
            keyFilename: path.join(__dirname, './service-account.json')
        })
    }

    async GetArtworks (access, user) {
        let filtered = []
        let artworkRef = await this.firestore.collection('artworks')

        // Check to ensure that we don't filter over empty set
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

        artworkRef = await artworkRef.orderBy('date', 'desc')

        artworkRef = await artworkRef.get()
        artworkRef.forEach(art => {
            filtered.push(art.data());
        });

        return filtered;
    }

    async save(data) {
        const docRef = await this.firestore.collection('artworks').add(data);
        const theid = docRef.id;

        // date is an absolute timestamp in seconds
        await docRef.update({id: theid, date: Date.now()});
        return theid
    }

    async updatePossibleFields(id, data) {
        const ref = this.firestore.collection('artworks').doc(id);

        // date is an absolute timestamp in seconds
        data.date = Date.now()

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

    async clear() {
        await deleteCollection(this.firestore, 'artworks', 50)
    }
}

module.exports = new FirestoreClient();