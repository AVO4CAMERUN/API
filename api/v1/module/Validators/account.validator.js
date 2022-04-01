// Module for validate account input in account router

// https://express-validator.github.io/docs/check-api.html
// https://github.com/express-validator/express-validator/issues/449

// CRUD

// POST
// GET
// PUT
// DELETE
exports.register = [
    check('email').isEmail(),
    (req, res, next) => { /* the rest of the existing function */ }
];