const express = require(`express`)
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {OAuth2Client} = require('google-auth-library');

//TODO: Testing App. Need to make a proper App.
const clientID = "244554015002-dq6ervkiinn5ocu3c0bkngrgnmtalfok.apps.googleusercontent.com";

const router = express.Router()
const oauth = new OAuth2Client(clientID);

// Set session cookie name to "userID"
router.use(cookieParser())
router.use(session({name: 'userID', secret: 'cat', saveUninitialized: false, resave: false}));

router.post('/login', async (req, res) => {
    const {token} = req.body;
    if (!token){
        res.status(401).send('Failed to authorize')
        return
    }

    oauth.verifyIdToken({idToken: token, audience: clientID}, (err, ticket) => {
        if (err){
            console.error(err)
            res.status(401).send('Failed to authorize')
            return
        }
        
        //User information. 
        //TODO: userId for unique identification?
        const payload = ticket.getPayload();
        const userId = payload['sub'];

        //If present then auth was successful
        if (userId){
            req.session.loggedIn = true;
            req.session.userId = userId;
            res.status(200).send('Success!')
        }
        else {
            res.status(401).send('Failed to authorize')
        }

    })
})

router.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err){
            console.error(err)
            res.status(401).send('Failed to logout')
            return
        }

        res.status(200).send('Logged out.')
    })
})


router.get(`/test`, (req, res) => {
    console.log(req.session)

    if (req.session.loggedIn){
        res.send('Client is authorized!')
    }
    else {
        res.send('Client is not authorized!')
    }
})

module.exports = router