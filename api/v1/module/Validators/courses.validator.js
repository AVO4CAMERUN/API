// Module for validate courses input in courses router

const { validationResult, check, query, body } = require('express-validator');
const { customCheckArrayInGET } = require('./utils.validator');
const { getCoursesSubject } = require('../DBservises/courses.services'); // Courseservices

// POST
const postCourses = [
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
    check('description')
        .trim()
        .escape()
        .isString()
        .withMessage('Description is not a string') 
        .bail(),
    check('subject')
        .notEmpty()
        .custom(value => {
            return getCoursesSubject()
                .then((subjects) => subjects.includes(value)
            )
        })
        .withMessage('subject is not correct') 
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});
        next()
    }
]

// PUT
const putCourses = [
    body('id_course')
        .isEmpty()
        .withMessage('You don\t change id')
        .bail(),
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
    check('email_creator')
        .isEmpty()
        .withMessage('You don\t change email')
        .bail(),
    check('description')
        .trim()
        .escape()
        .isString()
        .withMessage('Description is not a string') 
        .bail(),
    check('subject')
        .custom(value => {
            if(value !== undefined)
                return [
                    'Mathematics',
                    'Electrical_engineering', 
                    'Informatics',
                    'English', 
                    'Statistics', 
                    'Chemistry'
                ].includes(value)
            return true
        })
        .withMessage('Insert one: Mathematics, Electrical engineering, Informatics, English, Statistics, Chemistry') 
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});
        next()
    }
]

// GET
const getCourses = [
    query('id_course')
        .custom(value => customCheckArrayInGET(value, 'ID: id_course is not array or length is 0'))
        .bail(),
    query('name')
        .custom(value => customCheckArrayInGET(value, 'Name is not array or length is 0'))
        .bail(),
    query('subject')
        .custom(value => customCheckArrayInGET(value, 'Subject error'))
        .bail(),
    query('creation_date')
        .custom(value => customCheckArrayInGET(value, 'Creation_date error'))
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(422).json({errors: errors.array()});
        next()
    }
]

// Export validators
module.exports = {
    postCourses,
    putCourses,
    getCourses
}