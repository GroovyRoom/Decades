const express = require(`express`)
var reactDOMServer = require('react-dom/server');
var fse = require('fs-extra')

const router = express.Router()

// Support for react router
router.get('/', async (req, res) => {
    const app = reactDOMServer.renderToString(
      `<StaticRouter location=${req.url} context={}>
        <App />
      </StaticRouter>`
    );
  
    const indexFile = './client/build/index.html';
    const data = await fse.readFile(indexFile, 'utf8')
    const reactPage =  data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    res.send(reactPage)
  });

module.exports = router