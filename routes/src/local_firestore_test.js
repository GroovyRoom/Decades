const FirestoreClient = require('./firestoreClient');
const db = require('./db_firebase')

const GetArtworks = async() => {
    await FirestoreClient.GetArtworks(undefined, undefined);
}

const GetArtworks2 = async() => {
    await db.GetArtworks();
}

const searchArtWorkByName = async() => {
    console.log(await FirestoreClient.searchArtWorkByName('default_name'));
}

const update = {
    name : `artwork_name_9`,
    user : `asdfasdfsadfasdfsadf`,
    date : `asdfasdfasdfasdfas`,
    songId : `aasdfasdfasdfsadf`,
    bitmap : ['sadfasdfsadfsadf'],
    link : `asdfasdfasdfasdfasdfasdf`,
    public : true
}

const updatePossibleFields = async() => {
    await FirestoreClient.updatePossibleFields('4iOIBdIZsiZ8Lxf5NLIj', update);
}

const UpdateArtwork = async() => {
    console.log(await db.UpdateArtwork(update));
}

const searchId = async() => {
    console.log(await FirestoreClient.searchById('4iOIBdIZsiZ8Lxf5j'));
}

const save = async() => {
    await FirestoreClient.save(update);
}

let artworks = [
    {
        "name": "artwork_name_0",
        "user": "user_name_0",
        "date": "01 0 2020",
        "songId": "artist0/song0",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_0",
        "public": false
    },
    {
        "name": "artwork_name_1",
        "user": "user_name_1",
        "date": "01 1 2020",
        "songId": "artist1/song1",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_1",
        "public": false
    },
    {
        "name": "artwork_name_2",
        "user": "user_name_2",
        "date": "01 2 2020",
        "songId": "artist2/song2",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_2",
        "public": false
    },
    {
        "name": "artwork_name_3",
        "user": "user_name_3",
        "date": "01 3 2020",
        "songId": "artist3/song3",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_3",
        "public": false
    },
    {
        "name": "artwork_name_4",
        "user": "user_name_4",
        "date": "01 4 2020",
        "songId": "artist4/song4",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_4",
        "public": false
    },
    {
        "name": "artwork_name_5",
        "user": "user_name_5",
        "date": "01 5 2020",
        "songId": "artist5/song5",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_5",
        "public": false
    },
    {
        "name": "artwork_name_6",
        "user": "user_name_6",
        "date": "01 6 2020",
        "songId": "artist6/song6",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_6",
        "public": false
    },
    {
        "name": "artwork_name_7",
        "user": "user_name_7",
        "date": "01 7 2020",
        "songId": "artist7/song7",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_7",
        "public": false
    },
    {
        "name": "artwork_name_8",
        "user": "user_name_8",
        "date": "01 8 2020",
        "songId": "artist8/song8",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_8",
        "public": false
    },
    {
        "name": "artwork_name_9",
        "user": "user_name_9",
        "date": "01 9 2020",
        "songId": "artist9/song9",
        "bitmap": [],
        "link": "https://storage.googleapis.com/decades_images/artwork_name_9",
        "public": false
    }
];


const save2 = async() => {
    for (const art in artworks) {
        await FirestoreClient.save(artworks[art]);
      }
}

//save();

//UpdateArtwork();

//searchId();

//searchArtWorkByName();

//GetArtworks2();

//save2();