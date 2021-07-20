# decades

## Project Information

- Project GitLab URL: https://csil-git1.cs.surrey.sfu.ca/vryzhov/decades
- Project name: Decades
- Deployed App: https://decades.nn.r.appspot.com/

## Checkpoint Write-Up

### Implemented Features

- **Authentication**. Users can log in the website with their Google Account using Google single sign-on. All the production backend queries are checking against a valid authentication to proceed and some of the queries require a currently logged user information.
- **Soundcloud Integration**. When you navigate to https://decades.nn.r.appspot.com/music you can click on Play and Pause buttons to play a hard-coded track. The idea is for these buttons to exist on the View page where the user can view the artwork and listen to the track the creator has chosen.
- **Frontend Visuals**. You can see the project coming together by visiting some of the pages like `https://decades.nn.r.appspot.com/menu`. The front-end structure was set up accordingly to React canons. Each developer can easily navigate through the client part and add the necessary components to it. Moreover, the App.js file contains the fundamental styles for the whole project (logo & colour theme) and assures that project routes work properly.
- **Database for Artworks**. You can add and edit artworks to the Decades artworks database. Right now it is available only via API. We use Google Firestore for storing metadata (name, song id, etc.) and the Google Cloud Storage to store image data. We then link Google Cloud Storage image file to the artwork metadata entry. The idea is that client will first retrieve metadata and then download the image separately. If the client saves the image, then it is okay to pass an entire RGB array to our backend - we only pass it during artwork saving.
    - You can test how API works. These are non-production queries used to test the DB and bypass authentication (they all have production alternatives which respect the authentication). You can use https://reqbin.com/ to test these.
    - GET https://decades.nn.r.appspot.com/api/artworks/debug/prod/uploaded - this will return all the uploaded, public artworks. Note than you can download artworks right in the browser by pasting "link" property.
    - POST https://decades.nn.r.appspot.com/api/artworks/debug/prod/save, JSON body: `{"user": "user_343532", "name": "test_art_132435", "bitmap":[1, 2, 3, 4, 5, 6]}` - you will get back a new DB entry with the ID. You can then pass this ID to the body to _update_ the entry rather than create a new one. Note that this also assigns a link - in the backend the server takes `bitmap` field, turns it into the blob and uploads to Google Cloud Storage.
    - POST https://decades.nn.r.appspot.com/api/artworks/debug/prod/upload, JSON body : `{"id": "some_id", "user": "user_343532", "name": "test_art_132435", "bitmap":[1, 2, 3, 4, 5, 6]}` - this will either create and upload entry or upload entry if ID exists. Upload in our case means that the `public` property is set to `true`. After you uploaded, make sure to visit `/uploaded` endpoint to see the uploaded artwork.
    - There are other endpoints you can use for testing like `/api/artworks/debug/all`, `/api/artworks/debug/:user` and etc.

### Project Pipeline

- We spent quite a bit of time coming up with how to efficiently develop, test and run the project. We use Express for Backend and React for frontend. Combining the two into one appeared to be not a trivial task.
- You can see that we set up the CI/CD pipeline for this project (as per `.gitlab-ci.yml`) which automatically builds, test and even _deploys_ the project for merge requests and commits to `master` branch. We set up a GitLab runner as a GCP VM instance and right now it is off for the budget reasons. Our project building procedure is described in `build_decades.js` and testing is in `pipeline_test.js`.
- Below this you will see some of development instructions for the team. By using customly designed `npm` scripts our team can easily test and iterate on their work.

### Project Design and Team Management

- We are using Notion to monitor team's tasks, our plans for the current and upcoming sprints.
- It is also a place where we share our architecture plans and document the latest state of Design.
- Our current MVP app design is available in the following figma link: https://www.figma.com/proto/9QRXz0foYBYXoPZ4kb4nw8/Decades?page-id=122%3A2&node-id=122%3A2109&scaling=scale-down. This is used by the frontend as a reference for the UI/UX.
- Our original (bigger scope) design can be seen in this figma: https://www.figma.com/proto/9QRXz0foYBYXoPZ4kb4nw8/Decades?page-id=0%3A1&node-id=1%3A2&viewport=358%2C35%2C0.021770723164081573&scaling=scale-down&starting-point-node-id=1%3A2

### Team Contribution

- First of all, the commits history may be misleading. Sometimes team members merged the branches of their fellow team members (thus documented as commit), and we have set up the commit squish so all merge requests pass as a singular commit. I believe that the following contribution description will reflect the amount of delivered work more truthfully:
- **Albert:** primarily investigated and implemented authentication and Soundcloud integration. Thanks to Albert we have almost seamless Soundcloud functionality when the business already stopped (!) giving out project ids for API. Albert found a clever trick to use the Soundcloud widget to play publicly available music - and by hiding it, this seems like a custom Soundcloud player. 
- **Eugene:** handled most of the front-end setup and implementation. Thanks to Eugene it was very easy to add new pages for debugging even for some backend developers. Eugene took it to the next level when transferring the design from Figma prototype to the React - it appears that our frontend would be a so-called "pixel-perfect" implementation, meaning it would be extremely close to the original design intention.
- **Oleg:** extended frontend functionality together with Eugene. He was tasked with implementing the Editor and most of his work is prototypical and remained away from the sight of the repository - but we can't wait to show you how the drawing works and how it ties together with the rest of the functionality.
- **Jason:** implemented Firestore Database functionality for the backend. Thanks to Jason we now have quite a robust way to update entries in the database. Jason also helped in many different areas throughout the project - his research helped boost the productivity of the entire team.
- **Vlad:** implemented backend structure, connected endpoints with the Firestore Database. He also implemented the logic for storing the images in the Google Cloud Storage. Vlad authored CI/CD pipeline and administrative side in GCP and GAE. The design for UI/UX was also done by Vlad.  

## Installation

- Install node: https://nodejs.org/en/download/. Node is essential to develop and run the Decades.
- **[IMPORTANT]** To clone from GitLab, it is recommended to setup the SSH access. However, this did not work well for some of our teammates. In this case, clone the project using HTTPS and then enter your SFU Computing ID and corresponding password to authorize. You will need to do it only once and the credentials will be stored in the Credential Manager that your Git is using. 
- Once you pulled the repository, navigate to the master folder and run `npm run install-project` which would install all the current node modules for both server and client.
- You can now run `npm run dev` and start developing!

## Development environment

Generally speaking, Decades has two components - client and server. Client is based on React while Server is an express app. You can run both in isolation from each other as they represent independent parts of the project.

This describes purpose and usage of app's scripts defined in `package.json` at the root level. For client-specific scripts and development support check out `client/package.json`. To run the following, you need to be at the root level of the project:

- `npm run dev` - you would want to use this almost all of the time. This starts up the react app and the server app concurrently. Both server and client will auto-refresh when changes were made and React app can still make calls to the server. The only difference between this and production build is that client folder contains all the source files and it runs on its own mini-server. Server app runs on http://localhost:5000 and client app runs on http://localhost:3000

- `npm run dev-server` - use this when you just want to test the backend for the API calls. You could use Postman (https://www.postman.com/downloads/) or any other similar software. Server app runs on http://localhost:5000. Server serves the `index.html` by default from `client/build`.

- `npm run dev-client` - use this when you just want to test the React front-end. In this case, beware when testing some components of the app which rely on API calls. Client app runs on http://localhost:3000.

- `npm run build` - use this to build the app that can be deployed to Google App Engine. The process creates `deployment/` folder with React build and trimmed number of server files. This is used to GitLab CI/CD in our project.

- `npm run test` - use this to test the app in "production-like" environment - it will build the React app and run server only (as oppose to `dev` which runs client in development mode). You could use this to confirm that the app would work properly on the cloud.

## How to contribute

- Create branch for **every** task you are working on.
- One nice way to maintain branches in order is to create them under your name. An example branch name could be `john/improve_performance` where john would be like a "folder" signifying all branches of john.
- **Never** commit straight to master. Always work on a branch first and then either merge the branch or go through the merge request where someone from the team reviews the code (probably applicable during polish phase)

## Known issues

- None at the moment.
