// Main server file 

// Standard module import
const express = require('express');
const cors = require('cors')
const path = require('path');
require('dotenv').config();

// Create requets rooter
const app = express();
app.use(cors())

// Personal module import
const v1 = require('./api/v1/v1');

// Root web-app -> get interfaces rules 
app.get('/rules/:v', (req, res) => {
    if(+req.params.v !== 1) return res.sendStatus(404); 
    res.sendFile(path.join(__dirname, './assets/rules/ruleV' + req.params.v + '.html'));
});
// express.static('')

// Rest-api interface v1 (Versioni non necessiarissime anche se potrebbero essere fornite alcune per inntegrazione su altri siti)
app.use('/api/v1', v1);

// Start http-server port 80
app.listen(80);

// https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/