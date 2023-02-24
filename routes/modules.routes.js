const { Router } = require("express");
const controller = require("../controllers/module.controller");
const cookieMid = require("../helpers/cookieMiddleWhere")
const router = Router();
const base = "/api/module/";

router.get(`${base}:module`,controller.getModule);
router.get(`/login`, controller.getLogin);
router.get(`/home`, controller.getHome);
router.get(`/test-cooki`, controller.getHome);

module.exports = router;