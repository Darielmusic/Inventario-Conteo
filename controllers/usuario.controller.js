const sql = require('mssql');
const { conWeb } = require("../database/connection");
const models = require("../models/usuario.model");
const global = require("../models/global.model");
const { modelValidation } = require("../services/modelStrictValidation");
const path = require("path");
const fs = require("fs");
const express = require("express")

//MONTRO NO CIERRE CONEXIONES
module.exports = {
  getUsuarioModel: async function (_, res) {
    res.json(models.usuario);
  },
  getUsuarios: async function (req, res) {
    let pool = await conWeb;

    let resultado = await pool
      .request()
      .query(`select * from PedidoWeb.vwUsuario`);

    let dto = modelValidation(models.emptyUsuario, resultado.recordset);
    res.json(dto);
  },
  getUsuariosById: async function (req, res) {
    const { usuarioId } = req.params;
    let pool = await conWeb;

    let resultado = await pool
      .request()
      .input("usuarioId", usuarioId)
      .query(
        `select * from PedidoWeb.vwUsuario where usuarioId = ${usuarioId}`
      );

    let dto = modelValidation(models.emptyUsuario, resultado.recordset);
    res.json(dto[0]);
  },
  postUsuario: async function (req, res) {
    try {
      const {
        // sucursalId,
        tipoUsuarioId,
        estatusId,
        cedula,
        nombre,
        apellido,
        direccion,
        correo,
        usuario,
        clave,
      } = req.body;

      let pool = await conWeb;
      let transaction = new sql.Transaction(pool);


      let resultado = await pool
        .request()
        // .input("sucursalId", sucursalId)
        .input("tipoUsuarioId", tipoUsuarioId)
        .input("estatusId", estatusId)
        .input("cedula", cedula)
        .input("nombre", nombre)
        .input("apellido", apellido)
        .input("direccion", direccion)
        .input("correo", correo)
        .input("usuario", usuario)
        .input("clave", clave)
        // .input("imagen", req.body.imagen)
        .execute("pedidoWeb.usp_insertaUsuario");

      let dto = modelValidation(global.modelResponse, resultado.recordset);
      let estado = dto[0].estado;

      if (estado != 3)
        throw new Error(
          "Error desde la base de datos, verifique: " + dto.mensaje
        );

      let userId = parseInt(dto[0].mensaje);
      //inserta imagen y devuelve ruta
      let url = (() => {
        if (req.files) {
          let routeToSave = "";
          req.files.forEach((file) => {
            img = `${userId}.${file.originalname.split(".")[1]}`;
            routeToSave = `${userId}.${file.originalname.split(".")[1]}`;
            let ruta = path.join(
              __dirname,
              "../uploads/",
              `${userId}.${file.originalname.split(".")[1]}`
            );
            fs.writeFile(ruta, file.buffer, { flag: "w" }, (err) => {
              if (err) console.log(err);
            });
          });
          return routeToSave;
        } else return null;
      })();
      if (url != null) {
        let pool = await conWeb;
        let query = `update pedidoWeb.Usuario set imagen = N'${url}' where usuarioId = ${userId}`;
        await pool.request().query(query);
      }

      req.body.usuarioId = userId;
      res.json(req.body);
    } catch (error) {
      console.log(error);
      res.status(404).json(error.message);
    }
  },
  putUsuario: async function (req, res) {
    let {
      sucursalId,
      tipoUsuarioId,
      estatusId,
      cedula,
      nombre,
      apellido,
      direccion,
      correo,
      usuario,
      clave,
    } = req.body; 

    clave = clave == '' ? null : clave;

    let userId = req.params.usuarioId;

    let url = (() => {
      if (req.files) {
        let routeToSave = "";
        req.files.forEach((file) => {
          img = `${userId}.${file.originalname.split(".")[1]}`;
          routeToSave = `${userId}.${file.originalname.split(".")[1]}`;
          let ruta = path.join(
            __dirname,
            "../uploads/",
            `${userId}.${file.originalname.split(".")[1]}`
          );
          fs.writeFile(ruta, file.buffer, { flag: "w" }, (err) => {
            if (err) console.log(err);
          });
        });
        return routeToSave;
      } else return null;
    })();

    let pool = await conWeb;

    await pool
      .request()
      .input("usuarioId", userId)
      .input("sucursalId", sucursalId)
      .input("tipoUsuarioId", tipoUsuarioId)
      .input("estatusId", estatusId)
      .input("cedula", cedula)
      .input("nombre", nombre)
      .input("apellido", apellido)
      .input("direccion", direccion)
      .input("correo", correo)
      .input("usuario", usuario)
      .input("clave", clave)
      .input("imagen", url)
      .execute("pedidoWeb.usp_editaUsuario");

    return res.status(204).end();
  },
  getTipoUsuarios: async function (req, res) {
    let pool = await conWeb;

    let resultado = await pool
      .request()
      .query(`select * from PedidoWeb.TipoUsuario`);

    let dto = modelValidation(models.tipoUsuario, resultado.recordset);
    res.json(dto);
  },
  getEstatusUsuarios: async function (req, res) {
    let pool = await conWeb;

    let resultado = await pool
      .request()
      .query(`select * from PedidoWeb.EstatusUsuario`);

    let dto = modelValidation(models.estatusUsuario, resultado.recordset);
    res.json(dto);
  },
  getProfileImagen: async function (req, res) {
    res.sendFile(path.join(__dirname, `../uploads/${req.params.imagen}`));
  },
  postValidaUsuario: async function (req, res) {
    const { usuario, clave } = req.body;
    let pool = await conWeb;
    let resultado = await pool
      .request()
      .input("usuario", usuario)
      .input("clave", clave)
      .execute("PedidoWeb.Usp_IniciaSesion");
    let respuesta = modelValidation(models.modelResponseValida, resultado.recordset);

    if (respuesta[0].usuarioId != null && respuesta[0].usuarioId != 0)
      res.status(200).json({
        usuarioId: respuesta[0].usuarioId,
        tipoUsuarioId: respuesta[0].tipoUsuarioId,
        redirect: "/home"
      })

    else res.status(401).json(respuesta[0]);
  }
}
