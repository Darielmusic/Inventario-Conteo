const { Router } = require("express");
const controller = require("../controllers/pedido.controller");

const router = Router();
const base = "/api/pedido/";

//Listas
router.get(`${base}model`, controller.modeloPostPedidos);
router.get(`${base}log/model`, controller.getLogModel);
router.get(`${base}impresion-continua/`, controller.impresionContinuaDespacho);


/*---------------------------------------Tienda---------------------------------------*/
//#region Rutas Tienda
router.get(`${base}:filtrado`, controller.getPedidoCabecera);
router.get(`${base}pedidoGeneral/:pedidoInternoId`, controller.getPedidoById);
router.get(`${base}busqueda-Filtro/:filtrado`, controller.getFiltroPedido);

router.post(`${base}`, controller.postPedidos);
router.post(`${base}insertaArticulo/:pedidoInternoId`, controller.postDetallePedido);

router.put(`${base}estatus-ProcesoDespachado/:pedidoInternoId`, controller.putPedidos);
router.put(`${base}cantidad-articulo/:pedidoInternoId`, controller.putCantidadArticulos);

router.delete(`${base}eliminaArticulo/:pedidoInternoId`, controller.deleteDetallePedido);
//#endregion

/*---------------------------------------Despacho---------------------------------------*/
//#region Rutas Despacho
router.get(`${base}despacho/:filtrado`, controller.getPedidoDespachoCabecera);
router.get(`${base}despacho/ById/:despachoInternoId`, controller.getDespachoById);
router.get(`${base}despacho/busqueda-Filtro/:filtrado`, controller.getFiltroDespacho);

router.put(`${base}estatus-Impreso/:despachoInternoId`, controller.putImpresoPedidos);
router.put(`${base}despacho/:despachoInternoId`, controller.putDespachoPedidos);
router.put(`${base}despachado/cantidad-articulo/:despachoInternoId`, controller.putDespachoCantidadArticulos);
router.put(`${base}despachado/articulo-fijo/:despachoInternoId`, controller.putDespachoCantidadNoModificada);

//#endregion

/*---------------------------------------Log de Cambios---------------------------------------*/
//#region Rutas Log
router.get(`${base}log/:pedidoInternoId`, controller.logPedidoInterno);
router.get(`${base}despacho-Log/:despachoInternoId`, controller.logDespachoInterno);
//#endregion

/*---------------------------------------Impresion Reportes---------------------------------------*/
//#region Rutas Reportes
router.get(`${base}imprime/:pedidoInternoId`, controller.getPedidoImpresion);
router.get(`${base}impresion/comparativa/:pedidoInternoId`, controller.getPedidosComparativaImpresion);
//#endregion

/*---------------------------------------Recibidos---------------------------------------*/
//#region Rutas Recibidos
router.get(`${base}recibido/ById/:pedidoInternoId`, controller.getRecibidosById);

router.put(`${base}recibirPedido/:recibidoInternoId`, controller.putPedidoRecibido);
//#endregion


module.exports = router;
