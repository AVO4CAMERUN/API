// Module for validate account input in account router

const { validationResult, check } = require('express-validator');

// POST
const register = [
    check('username')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Username can not be empty!')
        .bail()
        .isString()
        .isAscii()
        .bail()
        .isLength({min: 3})
        .withMessage('Minimum 3 characters required!')
        .bail(),
    check('email')
        .trim()
        .normalizeEmail()
        .not()
        .isEmpty()
        .withMessage('Invalid email address!')
        .bail(),
    check('firstname')
        .trim()
        .escape()
        .isString()
        .isAscii()
        .withMessage('Invalid firstname')
        .bail(),
    check('lastname')
        .trim()
        .escape()
        .isString()
        .isAscii()
        .withMessage('Invalid lastname')
        .bail(),
    check('password')
        .trim()
        .not()
        .matches('^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$')
        .withMessage('Invalid passoword')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});
        next()
    }
]

// PUT
const updateAccount = []

// GET
const getAccounts = []

// Export validators
module.exports = {
    register,
    updateAccount
}

// https://express-validator.github.io/docs/check-api.html
// https://github.com/express-validator/express-validator/issues/449
