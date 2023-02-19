const Router = require('express');
const router = new Router();
const controller = require('./controller');
const { check } = require("express-validator");
const authMiddleware = require('./middleware/authMidlware');
const roleMiddleware = require('./middleware/roleMiddleware');
const checkToken = require('./middleware/checkMidlware');

router.post('/registration', [
  check("username", "The field cannot be empty").notEmpty(),
  check("password", "Password must be more than 6 and less than 20 characters").isLength({min: 6, max: 20}),
], controller.registration);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers);
router.post('/getUser', controller.getDataFromUser);
router.post('/update', controller.updateUser);
router.post('/deleteUser', controller.deleteUser);
router.post('/addIMG', controller.addIMG);
router.post('/deleteIMG', controller.deleteIMG);
router.post('/check', checkToken,  controller.check)

module.exports = router;