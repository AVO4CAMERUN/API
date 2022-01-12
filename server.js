// https://vuex.vuejs.org/guide/
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
    
    // controllo che sia intero o trovare
    // Gestire e scrivere le regole per versione delle api
    if(typeof req.params.v === 'number'){}    
    console.log(req.params.v);
    //if(req.params.v)
    res.send("Role");   //della versione corente
});

// Rest-api interface v1 (Versioni non necessiarissime anche se potrebbero essere fornite alcune per inntegrazione su altri siti)
app.use('/api/v1', v1);

// Start http-server port 80
app.listen(80); 