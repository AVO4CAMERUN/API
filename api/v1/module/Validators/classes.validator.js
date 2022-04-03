// Module for validate classes input in classes router

const { validationResult, check, query } = require('express-validator');
const { customCheckArrayInGET } = require('./utils.validator');

// POST
const postClass = [
    check('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Name can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail()
        .isLength({max: 50})
        .withMessage('Maximum 3 characters required!') 
        .bail(),
    check('img_cover')
        .isBase64()
        .withMessage('Cover be must base64')
        .bail(),
    check('students')
        .custom(value => {
            if (value !== undefined && !Array.isArray(value)) 
                return Promise.reject('Teachers is not array');
            return true
        })
        .bail(),
    check('teachers')
        .custom(value => {
            if (value !== undefined && !Array.isArray(value)) 
                return Promise.reject('Teachers is not array');
            return true
        }).bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});
        next()
    }
]

// PUT
const putClass = [
    check('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Name can not be empty!')
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail()
        .isLength({max: 50})
        .withMessage('Maximum 3 characters required!') 
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});
        next()
    }
]

// GET
const getClass = [
    query('name')
        .custom(value => customCheckArrayInGET(value, 'name is not array or length is 0'))
        .bail(),
    query('id')
        .custom(value => customCheckArrayInGET(value, 'id is not array or length is 0'))
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(422).json({errors: errors.array()});
        next()
    }
]

// DELETE
const deleteClass = []

// Export validators
module.exports = {
    postClass,
    putClass,
    getClass,
    deleteClass
}