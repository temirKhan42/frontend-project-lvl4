const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8000;

app
  .use(express.static(path.join(__dirname, 'dist')))
  .set('views', path.join(__dirname, 'dist'))
  .set('view engine', 'html')
  .get('/', (req, res) => res.render('index'))
  .get('/login', (req, res) => res.render('index'))
  .listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
