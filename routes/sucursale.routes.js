const { Router } = require("express");
const controller = require("../controllers/sucursale.controller");

const router = Router();
const base = "/api/sucursales/";

router.get(`${base}model`, controller.getSucursalesModel);
router.get(`${base}`, controller.getSucursales);

module.exports = router;