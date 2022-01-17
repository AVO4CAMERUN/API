// https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/

// Standard module import
const express = require('express');
const path = require('path');

// Create requets rooter
const app = express();

// Personal module import
const v1 = require('./api/v1/v1');

// Root web-app -> get interfaces rules 
app.get('/rules/:v', (req, res) => {
    
    if(
        Number.isInteger(parseInt(req.params.v)) &&
        req.params.v > 0 && req.params.v < 2
    ){
        res.sendFile(path.join(__dirname, './assets/rules/ruleV' + req.params.v + '.html'));
    } else {
        res.sendStatus(404); 
    }
});

// Rest-api interface v1 (Versioni non necessiarissime anche se potrebbero essere fornite alcune per inntegrazione su altri siti)
app.use('/api/v1', v1);

// Start http-server port 80
app.listen(80); 