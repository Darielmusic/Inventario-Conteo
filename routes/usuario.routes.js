const { Router } = require("express");
const controller = require("../controllers/usuario.controller");
const multer = require("multer");

const router = Router();
const base = "/api/usuario/";

router.get(`${base}model`, controller.getUsuarioModel); 
router.post(`${base}valida`, controller.postValidaUsuario);  
router.get(`${base}`, controller.getUsuarios);
router.get(`${base}tipoUsuario`, controller.getTipoUsuarios);
router.get(`${base}estatus`, controller.getEstatusUsuarios);
router.get(`${base}imagen/:imagen`,controller.getProfileImagen)
router.post(`${base}`, multer().any(), controller.postUsuario);
router.get(`${base}:usuarioId`, controller.getUsuariosById);
router.put(`${base}:usuarioId`, multer().any(), controller.putUsuario);

module.exports = router;
