const { Router } = require("express");
const controller = require("../controllers/articulo.controller");

const router = Router();
const base = "/api/articulo/";

router.get(`${base}model`, controller.getArticulosModel);
router.get(`${base}`, controller.getArticulos);
router.get(`${base}filtro/:descripcion`, controller.getFiltroArticulos);
router.get(`${base}byId/:articuloId`, controller.getArticulosById);
router.get(`${base}:SucursalDestinoId`, controller.getArticulos);



module.exports = router;