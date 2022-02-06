// Lessons mini-router

// Utils Module
const express = require('express');
const bodyParser = require('body-parser');

const DBS = require('./utils/DBservices');
const BlobConvert = require('./utils/BlobConvert');
const authJWT = require('./utils/Auth');

const router = express.Router();    //Create router Object
    
/*{
	"name": "....",
	"description": "....",
	"subject": [...],
	"img_cover": [...]	
}*/
router.route('/lessons')

    // Create new lessons 
    .post(authJWT.authenticateJWT, (req, res) => {})

    // Get courses data by filter
    .get((req, res) => {})

router.route('/lessons/:id')

    // Get courses data by id
    .get((req, res) => {})
    
    // Update courses data by id
    .put(authJWT.authenticateJWT, (req, res) =>{})

    // Delete courses by id
    .delete(authJWT.authenticateJWT, (req, res) => {})


module.exports = router