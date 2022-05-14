const express = require("express");
const authControl = require("../controllers/auth");
const router = express.Router();

router.post("/register", authControl.register);
router.post("/login", authControl.login);

module.exports = router;