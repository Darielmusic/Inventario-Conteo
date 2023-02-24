const { conWeb } = require("../database/connection");
const models = require("../models/pedidos.model");
const global = require("../models/global.model");
const modeloArticulos = require("../models/articulos.model");
const { modelValidation } = require("../services/modelStrictValidation");
const sql = require("mssql");

const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");
const express = require("express");
const options = require("../helpers/optionsPDF");
const { nextTick } = require("process");
// const { application } = require("express");

/*HTTP Errores utilizados
- 400 -> Error en los parametros
- 401 -> No autorizado para esa accion (Usualmente en relacionados a los usuarios)
- 404 -> Error en la ruta (Usualmente en el paginado o rutas incorrectas)
- 406 -> Error en el Servidor
- 409 -> Conflicto con los datos (Usualmente entre cabeceras y detalles)
*/

module.exports = {
  modeloPostPedidos: async function (_, res) {
    res.json(models.modelPostPedidos);
  },

  /*---------------------------------------Tienda---------------------------------------*/

  getPedidoCabecera: async function (req, res) {
    let pool = await conWeb;

    const { filtrado } = req.params;
    const { estatusId } = req.query;

    try {
      if (filtrado < 0) throw new Error("Parametros de ruta no validos");
      else {
        if (estatusId < 0 || estatusId > 7) {
          throw new Error("Valor no valido. Este estatus no esta disponible.");
        }

        if (estatusId == 0 || estatusId == undefined) {
          let resultado = await pool.request().query(`
            select * from PedidoWeb.vwPedidoInterno
            order by pedidoInternoId desc
            offset ${filtrado} rows 
            fetch next 20 rows only
          `);

          let dto = modelValidation(models.pedidoCabecera, resultado.recordset);
          res.json(dto);
        } else {
          let resultado = await pool
            .request()
            .input("estatusId", estatusId)
            .input("filtrado", filtrado)
            .execute("PedidoWeb.Usp_FiltroPedidoInterno");

          let dto = modelValidation(models.pedidoCabecera, resultado.recordset);
          res.json(dto);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  getFiltroPedido: async function (req, res) {
    let pool = await conWeb;
    const { filtrado } = req.params;

    const {
      pedidoInternoId,
      fecha
    } = req.query;

    try {

      let resultado = await pool
        .request()
        .input("pedidoInternoId", pedidoInternoId)
        .input("fecha", fecha)
        .input("filtrado", filtrado)
        .execute("PedidoWeb.Usp_BusquedaPedidoInterno")

      let dto = modelValidation(models.pedidoCabecera, resultado.recordset)
      res.json(dto);

    } catch (error) {
      console.log(error);
      res.status(400).json(error.message)
    }
  },

  getPedidoById: async function (req, res) {
    const { pedidoInternoId } = req.params;
    let pool = await conWeb;

    try {
      /*AQUI VA LA PETICION PARA LA CABECERA*/

      let resultadoCabecera = await pool.request().query(
        `select * from PedidoWeb.vwPedidoInterno 
          where pedidoInternoId = ${pedidoInternoId}`
      );

      let dtoCabecera = modelValidation(
        models.pedidoCabecera,
        resultadoCabecera.recordset[0]
      );

      /*AQUI VA LA PETICION PARA EL DETALLE*/

      let resultadoDetalle = await pool.request().query(
        `select * from PedidoWeb.PedidoInternoDetalle 
          where pedidoInternoId = ${pedidoInternoId}`
      );

      let pedidoInternoDetalle = modelValidation(
        models.pedidoInternoDetalle,
        resultadoDetalle.recordset
      );

      dtoCabecera = { ...dtoCabecera, pedidoInternoDetalle };

      res.json(dtoCabecera);
    } catch (error) {
      console.log(error);
      res.status(409).json(error.message);
    }
  },

  postPedidos: async function (req, res) {
    let pool = await conWeb;

    try {
      const {
        sucursalFuenteId,
        sucursalDestinoId,
        almacenId = 1,
        usuarioId,
        estatusId = 1,
        // pedidoNo,
        fecha,
        nota,
        total,
      } = req.body;

      let resultadoCabecera = await pool
        .request()
        .input("sucursalFuenteId", sucursalFuenteId)
        .input("sucursalDestinoId", sucursalDestinoId)
        .input("almacenId", almacenId)
        .input("usuarioId", usuarioId)
        .input("estatusId", estatusId)
        // .input("pedidoNo", pedidoNo)
        .input("fecha", fecha)
        .input("nota", nota)
        .input("total", total)
        .execute("PedidoWeb.usp_PedidoInternoInserta");

      let dto = modelValidation(
        global.modelResponseGeneral,
        resultadoCabecera.recordset
      );

      let estado = dto[0].estado;

      if (estado != 3)
        throw new Error("Error al insertar pedido, verifique: " + dto.mensaje);

      let pedidoId = parseInt(dto[0].mensaje);
      res.status(201).json(pedidoId);
    } catch (error) {
      console.log(error);
      res.status(400).json(error.menssage);
    }
  },

  putPedidos: async function (req, res) {
    const { pedidoInternoId } = req.params;
    let pool = await conWeb;

    try {
      let resultado = await pool
        .request()
        .input("pedidoId", pedidoInternoId)
        .execute(`PedidoWeb.Usp_EstatusProcesoDespachado`);

      let dto = modelValidation(
        global.modelResponseGeneral,
        resultado.recordset
      );

      let estado = dto[0].estado;

      if (estado != 3)
        throw new Error(
          "Error al cambiar estatus del pedido, verifique: " + dto[0].mensaje
        );

      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(409).json(error.message);
    }
  },

  postDetallePedido: async function (req, res) {
    let pool = await conWeb;
    const { pedidoInternoId } = req.params;
    const {
      codigoBarra,
      existenciaLocal,
      existenciaRemota,
      cantidad,
      sucursalDestinoId,
      sucursalFuenteId,
    } = req.body;

    try {
      let resultado = await pool
        .request()
        .input("pedidoInternoId", pedidoInternoId)
        .input("codigoBarra", codigoBarra)
        .input("existenciaLocal", existenciaLocal)
        .input("existenciaRemota", existenciaRemota)
        .input("cantidad", cantidad)
        .input("sucursalDestinoId", sucursalDestinoId)
        .input("sucursalFuenteId", sucursalFuenteId)
        .execute("PedidoWeb.usp_PedidoInternoDetalleInserta");

      let dto = modelValidation(global.modelResponse, resultado.recordset);

      let estado = dto[0].estado;

      switch (estado) {
        case 9:
          throw new Error(
            `Error insertando articulo ${codigoBarra}, verifique:  ${dto[0].mensaje}`
          );
          break;

        case 8:
          dto[0].mensaje = "Sin existencia";
          res.status(200).json(dto).end();

          break;

        case 7:
          dto[0].mensaje = "Existencia remota Menor a la solicitada";
          res.status(200).json(dto).end();

          break;

        case 3:
          dto[0].mensaje = "Insertado correctamente";
          res.status(200).json(dto).end();

          break;
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  deleteDetallePedido: async function (req, res) {
    let pool = await conWeb;
    const { pedidoInternoId } = req.params;
    const { codigoBarra, sucursalDestinoId, sucursalFuenteId } = req.body;

    try {
      let resultado = await pool
        .request()
        .input("pedidoInternoId", pedidoInternoId)
        .input("codigoBarra", codigoBarra)
        .input("sucursalDestinoId", sucursalDestinoId)
        .input("sucursalFuenteId", sucursalFuenteId)
        .execute("PedidoWeb.usp_PedidoInternoDetalleElimina");

      let dto = modelValidation(global.modelDelete, resultado.recordset);

      let estado = dto[0].estado;

      if (estado == 9)
        throw new Error(
          `Error eliminando articulo ${descripcion}, verifique:  ${dto[0].mensaje}`
        );

      res.status(200).json(dto);
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  putCantidadArticulos: async function (req, res) {
    let pool = await conWeb;
    const { pedidoInternoId } = req.params;

    const {
      codigoBarra,
      existenciaLocal,
      existenciaRemota,
      cantidad,
      sucursalDestinoId,
      sucursalFuenteId,
    } = req.body;

    try {
      let resultado = await pool
        .request()
        .input("pedidoInternoId", pedidoInternoId)
        .input("codigoBarra", codigoBarra)
        .input("existenciaLocal", existenciaLocal)
        .input("existenciaRemota", existenciaRemota)
        .input("cantidad", cantidad)
        .input("sucursalDestinoId", sucursalDestinoId)
        .input("sucursalFuenteId", sucursalFuenteId)
        .execute("PedidoWeb.Usp_PedidoInternoDetalleActualizar");

      let dto = modelValidation(global.modelResponse, resultado.recordset);

      let estado = dto[0].estado;

      switch (estado) {
        case 9:
          throw new Error(
            `Error insertando articulo ${codigoBarra}, verifique:  ${dto[0].mensaje}`
          );
          break;

        case 8:
          dto[0].mensaje = "Sin existencia";
          res.status(200).json(dto).end();

          break;

        case 7:
          dto[0].mensaje = "Existencia remota Menor a la solicitada";
          res.status(200).json(dto).end();

          break;

        case 3:
          dto[0].mensaje = "Insertado correctamente";
          res.status(200).json(dto).end();

          break;
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  /*---------------------------------------Despacho---------------------------------------*/

  getPedidoDespachoCabecera: async function (req, res) {
    let pool = await conWeb;

    const { filtrado } = req.params;
    const { estatusId } = req.query;

    try {
      if (filtrado < 0)
        throw new Error("Parametros de ruta no validos");
      else {
        if (estatusId < 0 || estatusId > 7) {
          throw new Error("Valor no valido. Este estatus no esta disponible.");
        }

        if (estatusId == undefined || estatusId == 0) {

          let resultado = await pool.request().query(`
            select * from PedidoWeb.vwDespachoInterno
            order by despachoInternoId desc
            offset ${filtrado} rows 
            fetch next 20 rows only
          `);

          let dto = modelValidation(
            models.pedidoDespachoCabecera,
            resultado.recordset
          );

          res.json(dto);

        } else {

          let resultado = await pool
            .request()
            .input("estatusId", estatusId)
            .input("filtrado", filtrado)
            .execute("PedidoWeb.Usp_FiltroDespachoInterno");

          let dto = modelValidation(
            models.pedidoDespachoCabecera,
            resultado.recordset
          );

          res.json(dto);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  getDespachoById: async function (req, res) {
    const { despachoInternoId } = req.params;
    let pool = await conWeb;

    try {
      /*AQUI VA LA PETICION PARA LA CABECERA*/

      let resultadoCabecera = await pool.request().query(
        `select * from PedidoWeb.vwDespachoInterno 
          where despachoInternoId = ${despachoInternoId}`
      );

      let dtoCabecera = modelValidation(
        models.pedidoDespachoCabecera,
        resultadoCabecera.recordset[0]
      );

      if (dtoCabecera.estatusId == 3 || dtoCabecera.estatusId == 4) {
        /*AQUI VA LA PETICION PARA EL DETALLE*/

        let resultadoDetalle = await pool.request().query(`
            select * from PedidoWeb.DespachoInternoDetalle 
            where despachoInternoId = ${despachoInternoId}
          `);

        let despachoInternoDetalle = modelValidation(
          models.despachoInternoDetalle,
          resultadoDetalle.recordset
        );

        dtoCabecera = { ...dtoCabecera, despachoInternoDetalle };

        res.json(dtoCabecera);
      } else {
        //Estatus => Pendiente o Impreso
        throw new Error(
          `El pedido no existe o no esta disponible para esta accion, verifique. Estatus: ${dtoCabecera.estatus}`
        );
      }
    } catch (error) {
      console.log(error);
      res.status(409).json(error.message);
    }
  },

  getFiltroDespacho: async function (req, res) {
    let pool = await conWeb;
    const { filtrado } = req.params;

    const {
      despachoInternoId,
      fecha
    } = req.query

    try {
      let resultado = await pool
        .request()
        .input("despachoInternoId", despachoInternoId)
        .input("fecha", fecha)
        .input("filtrado", filtrado)
        .execute("PedidoWeb.Usp_BusquedaDespachoInterno")

      let dto = modelValidation(models.pedidoDespachoCabecera, resultado.recordset)
      res.json(dto);

    } catch (error) {
      console.log(error);
      res.status(400).json(error.message)
    }
  },

  putImpresoPedidos: async function (req, res) {
    let pool = await conWeb;

    const { despachoInternoId } = req.params;
    const { usuarioId } = req.body;

    try {
      await pool.request().query(`
          update PedidoWeb.DespachoInterno 
          set estatusId = 4, usuarioId = ${usuarioId}
          where despachoInternoId = ${despachoInternoId}
        `);

      return res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  putDespachoPedidos: async function (req, res) {
    let pool = await conWeb;
    const { despachoInternoId } = req.params;

    try {
      let resultado = await pool
        .request()
        .input("despachoInternoId", despachoInternoId)
        .execute(`PedidoWeb.Usp_EstatusDespachadoTienda`);

      let dto = modelValidation(
        global.modelResponseGeneral,
        resultado.recordset
      );

      let estado = dto[0].estado;

      if (estado != 3)
        throw new Error(
          "Error al cambiar estatus del pedido, verifique: " + dto[0].mensaje
        );

      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  putDespachoCantidadArticulos: async function (req, res) {
    let pool = await conWeb;
    const { despachoInternoId } = req.params;

    const {
      codigoBarra,
      existenciaLocal,
      existenciaRemota,
      cantidad,
      sucursalDestinoId,
      sucursalFuenteId,
      usuarioId,
    } = req.body;

    try {
      let resultado = await pool
        .request()
        .input("despachoInternoId", despachoInternoId)
        .input("codigoBarra", codigoBarra)
        .input("existenciaLocal", existenciaLocal)
        .input("existenciaRemota", existenciaRemota)
        .input("cantidad", cantidad)
        .input("sucursalDestinoId", sucursalDestinoId)
        .input("sucursalFuenteId", sucursalFuenteId)
        .input("usuarioId", usuarioId)
        .execute("PedidoWeb.Usp_DespachoInternoDetalleActualizar");

      let dto = modelValidation(global.modelResponse, resultado.recordset);

      let estado = dto[0].estado;

      switch (estado) {
        case 9:
          throw new Error(
            `Error insertando articulo ${codigoBarra}, verifique:  ${dto[0].mensaje}`
          );
          break;

        case 8:
          dto[0].mensaje = "Sin existencia";
          res.status(200).json(dto).end();

          break;

        case 7:
          dto[0].mensaje = "Existencia remota Menor a la solicitada";
          res.status(200).json(dto).end();

          break;

        case 3:
          dto[0].mensaje = "Insertado correctamente";
          res.status(200).json(dto).end();

          break;
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  putDespachoCantidadNoModificada: async function (req, res) {
    let pool = await conWeb;

    const { despachoInternoId } = req.params;
    const {
      codigoBarra,
    } = req.body;

    try {

      await pool
        .request()
        .query(`
          update PedidoWeb.DespachoInternoDetalle
          set despachada = cantidad
          where despachoInternoId = ${despachoInternoId} and codigoBarra = '${codigoBarra}'
      `);

      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(400).json(error.menssage);
    }
  },

  /*---------------------------------------Log de Cambios---------------------------------------*/

  getLogModel: async function (_, res) {
    res.json(models.logPedido);
  },

  logPedidoInterno: async function (req, res) {
    let pool = await conWeb;

    const { pedidoInternoId } = req.params;
    const { filtrado } = req.query;

    try {
      if (filtrado < 0) {
        throw new Error("Parametros de ruta no validos");
      } else {
        let resultado = await pool.request().input("filtrado", filtrado).query(`
            select * from PedidoWeb.LogCambios 
            where pedidoInternoId = ${pedidoInternoId}
            order by cambioId desc
            offset ${filtrado} rows
            fetch next 20 rows only
          `);

        let dto = modelValidation(models.logPedido, resultado.recordset);

        res.json(dto);
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  logDespachoInterno: async function (req, res) {
    //Agregar al Servidor
    let pool = await conWeb;

    const { despachoInternoId } = req.params;
    const { filtrado } = req.query;

    try {
      if (filtrado < 0) {
        throw new Error("Parametros de ruta no validos");
      } else {
        let resultado = await pool.request().input("filtrado", filtrado).query(`
              select * from PedidoWeb.LogCambios 
              where despachoInternoId = ${despachoInternoId}
              order by cambioId desc
              offset ${filtrado} rows 
              fetch next 20 rows only
          `);

        let dto = modelValidation(models.logDespacho, resultado.recordset);

        res.json(dto);
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  /*---------------------------------------Impresion Reportes---------------------------------------*/

  getPedidoImpresion: async function (req, res) {
    const { pedidoInternoId } = req.params;
    let pool = await conWeb;

    let dtoCabecera;
    const html = fs.readFileSync(
      path.join(__dirname, "../public/print.html"),
      "utf8"
    );
    const filename = `Pedido_No_${pedidoInternoId}_${Date.now()}.pdf`;

    try {
      //#region Peticion

      /*AQUI VA LA PETICION PARA LA CABECERA*/

      let resultadoCabecera = await pool.request().query(
        `select * from PedidoWeb.vwPedidoInterno 
          where pedidoInternoId = ${pedidoInternoId}`
      );

      dtoCabecera = modelValidation(
        models.pedidoCabecera,
        resultadoCabecera.recordset[0]
      );

      /*AQUI VA LA PETICION PARA EL DETALLE*/

      let resultadoDetalle = await pool.request().query(
        `select * from PedidoWeb.PedidoInternoDetalle 
          where pedidoInternoId = ${pedidoInternoId}`
      );

      let pedidoInternoDetalle = modelValidation(
        models.pedidoInternoDetalle,
        resultadoDetalle.recordset
      );

      dtoCabecera = { ...dtoCabecera, pedidoInternoDetalle };
      //#endregion
    } catch (error) {
      console.log(error);
      res.status(400).json("Error al hacer la peticion, verifique " + error.message);
    }

    let document = {
      html: html,
      data: {
        //aqui pongo los datos
        pedidos: dtoCabecera,
      },
      // path: "../uploads/PDF_files/" + filename,
      type: "stream",
    };

    pdf
      .create(document, options.optionsMiddle)
      .then((stream) => {
        console.log("---------");
        // stream.pipe(fs.createWriteStream("../uploads/PDF_files/" + filename))
        console.log("Archivo creado correctamente");

        res.setHeader("Content-disposition", `inline;filename=${filename}`);
        res.setHeader("Content-Type", "application/pdf");

        stream.pipe(res);
        // res.end();
      })
      .catch((error) => {
        console.error(error);
      });
  },

  getPedidosComparativaImpresion: async function (req, res) {
    let pool = await conWeb;
    const { pedidoInternoId } = req.params;

    let dtoCabecera;

    const html = fs.readFileSync(
      path.join(__dirname, "../public/views/comparative-report.html"),
      "utf8"
    );
    const filename = `PedidoComparativa${Date.now()}.pdf`;

    try {
      //#region Peticion

      /*AQUI VA LA PETICION PARA LA CABECERA*/

      let resultadoCabecera = await pool.request().query(
        `select * from PedidoWeb.vwRecibidoInterno 
        where pedidoInternoId = ${pedidoInternoId}`
      );

      dtoCabecera = modelValidation(
        models.recibidoCabecera,
        resultadoCabecera.recordset[0]
      );

      /*AQUI VA LA PETICION PARA EL DETALLE*/

      let resultadoDetalle = await pool.request().query(`
        select 
          a.*
          from PedidoWeb.vwRecibidoInternoDetalle a
          join PedidoWeb.RecibidoInterno b
          on a.recibidoInternoId = b.recibidoInternoId
          where b.pedidoInternoId = ${pedidoInternoId}
      `);

      let vwRecibidoInternoDetalle = modelValidation(
        models.vwRecibidoInternoDetalle,
        resultadoDetalle.recordset
      );

      dtoCabecera = { ...dtoCabecera, vwRecibidoInternoDetalle };
      //#endregion
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json("Error al hacer la peticion, verifique " + error.message);
    }

    // let totales = [];
    // let totalDespachado = 0;
    // let totalRecibido = 0;

    // totales.forEach(i => {
    //     totalDespachado += i.dtoCabecera.recibidoInternoDetalle.despachada
    //     totalRecibido += i.dtoCabecera.recibidoInternoDetalle.recibida
    //   });

    const document = {
      html: html,
      data: {
        //aqui pongo los datos
        pedido: dtoCabecera,
      },
      // path: "./uploads/PDF_files/" + filename,
      type: "stream",
    };

    pdf
      .create(document, options.optionsLetter)
      .then((stream) => {
        console.log("--------------");

        res.setHeader("Content-disposition", `inline;filename=${filename}`);
        res.setHeader("Content-Type", "application/pdf");

        stream.pipe(res);
      })
      .catch((error) => {
        console.error(error);
      });
  },

  impresionContinuaDespacho: async function (req, res) {
    let pool = await conWeb;
    let response = [];

    const { pedidoInicial, pedidoFinal } = req.query;

    /*AQUI VA LA PETICION PARA LA CABECERA*/

    let resultadoCabecera = await pool.request().query(`
      select * from PedidoWeb.vwDespachoInterno 
      where despachoInternoId between ${pedidoInicial} and ${pedidoFinal}
    `);

    let dtoCabecera = resultadoCabecera.recordset.map((dto) =>
      modelValidation(models.pedidoDespachoCabecera, dto)
    );

    async function getDetails(element) {
      /*AQUI VA LA PETICION PARA EL DETALLE*/
      let resultadoDetalle = await pool.request().query(`
        select * from PedidoWeb.DespachoInternoDetalle 
        where despachoInternoId = ${element.despachoInternoId}
      `);

      let despachoInternoDetalle = modelValidation(
        models.despachoInternoDetalle,
        resultadoDetalle.recordset
      );

      return despachoInternoDetalle;
    }
    for (let element of dtoCabecera) {
      let details = await getDetails(element);
      response.push({ ...element, despachoInternoDetalle: details });
    }

    res.status(200).json(response);
  },

  /*---------------------------------------Recibidos---------------------------------------*/

  getRecibidosById: async function (req, res) {
    let pool = await conWeb;
    const { pedidoInternoId } = req.params;

    try {
      /*AQUI VA LA PETICION PARA LA CABECERA*/

      let resultadoCabecera = await pool.request().query(
        `select * from PedidoWeb.vwRecibidoInterno 
          where pedidoInternoId = ${pedidoInternoId}`
      );

      let dtoCabecera = modelValidation(
        models.recibidoCabecera,
        resultadoCabecera.recordset[0]
      );

      if (dtoCabecera.estatusId != 5) {
        throw new Error(
          `El pedido no existe o no esta disponible para esta accion, verifique. Estatus:  ${dtoCabecera.estatus}`
        );
      } else {
        /*AQUI VA LA PETICION PARA EL DETALLE*/

        let resultadoDetalle = await pool.request().query(`
            select 
            a.*
            from PedidoWeb.RecibidoInternoDetalle a
            join PedidoWeb.RecibidoInterno b
            on a.recibidoInternoId = b.recibidoInternoId
            where b.pedidoInternoId = ${pedidoInternoId}
          `);

        let recibidoInternoDetalle = modelValidation(
          models.recibidoInternoDetalle,
          resultadoDetalle.recordset
        );

        dtoCabecera = { ...dtoCabecera, recibidoInternoDetalle };

        res.json(dtoCabecera);
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  },

  putPedidoRecibido: async function (req, res) {
    let pool = await conWeb;
    let total = 0;

    try {
      let transaction = new sql.Transaction(pool);
      const {
        recibidoInternoId,
        pedidoInternoId,
        recibidoInternoDetalle
      } = req.body;

      await transaction.begin().then(async () => {
        recibidoInternoDetalle.forEach((element) => {
          pool.request().query(
            `update PedidoWeb.RecibidoInternoDetalle
              set recibida = ${element.recibida}
              where recibidoInternoId = ${recibidoInternoId} and codigoBarra = '${element.codigoBarra}'`
          );

          total +=  element.subTotal
        });

        await transaction.request().query(
          `update PedidoWeb.PedidoInterno
            set estatusId = 6
            where pedidoInternoId = ${pedidoInternoId} `
        );

        await transaction.request().query(
          `update PedidoWeb.RecibidoInterno
            set estatusId = 6, total = ${total}
            where pedidoInternoId = ${pedidoInternoId} `
        );
      });
      await transaction.commit();
      return res.status(204).end();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      res.status(400).json(error.message);
    }
  },
};
