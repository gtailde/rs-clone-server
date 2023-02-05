const Router = require('express');
const router = new Router();
const controller = require('./authController');
const { check } = require("express-validator");
const authMiddleware = require('./middleware/authMidlware');
const roleMiddleware = require('./middleware/roleMiddleware');


router.post('/registration', [
  check("username", "The field cannot be empty").notEmpty(),
  check("password", "Password must be more than 6 and less than 20 characters").isLength({min: 6, max: 20}),
], controller.registration);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers);

module.exports = router;