const express = require("express");
const validate = require("../middlewares/validateToken");
const router = express.Router();
const AuthController = require("../controlers/user.controller");

router.post("/register", AuthController.Registration);
router.post("/login", AuthController.login);
router.post("/generate_id_token", AuthController.generateIdToken);
router.post("/login_with_id_token", AuthController.veryfyIdToken);
module.exports = router;