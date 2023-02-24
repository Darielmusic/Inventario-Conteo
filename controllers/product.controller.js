const productManager = require("../services/product");
const { conWeb } = require("../database/connection");
const models = require("../models/articulos.model");
const { modelValidation } = require("../services/modelStrictValidation");

async function createProductManager() {
  let pool = await conWeb;

  let resultado = await pool
    .request()
    .input("SucursalDestino", 1)
    .execute("pedidoWeb.Usp_ProductoDatos");

  let products = modelValidation(models.emptyArticulo, resultado.recordset);

  return new productManager({ products, maxPerPage: 100 });
}
let readyToGo = false;
let pManager;
createProductManager()
  .then((res) => (pManager = res))
  .then(() => {
    readyToGo = true;
  });

module.exports = {
  getInitialData: async function (req, res) {
    // console.log(readyToGo)
    if (!req.body.user) {
      res.sendStatus(400);
      return;
    }

    if (readyToGo) {
      let response = pManager.addToQueue(req.body.user);
      res.status(200).json(response);
    } else {
      res.sendStatus(401);
    }
  },
  getPages: async function (req, res) {
    if (readyToGo) {
      let response = pManager.Pages;
      res.status(200).json(response);
    } else {
      res.sendStatus(401);
    }
  },
  getPage: async function (req, res) {
    if (readyToGo) {
      let user = req.params.token;
      let page = req.params.page;

      if (!user) {
        res.sendStatus(400);
        return;
      }
      if (!page) {
        res.sendStatus(400);
        return;
      }
      if (!pManager.queue[user]) {
        res.sendStatus(400);
        return;
      }

      switch (typeof page) {
        case "string":
          if (page.toLocaleLowerCase() == "prev") {
          } else if (page.toLocaleLowerCase() == "current") {
            let resp = Number(pManager.queue[user].pageManager.currentPage) - 1;
            // console.log(pManager.queue[user].pageManager.currentPage)
            resp = pManager.pages[resp];
            res.status(200).json(resp);
          } else if (page.toLocaleLowerCase() == "next") {
            pManager.queue[user].pageManager.currentPage = ++pManager.queue[
              user
            ].pageManager.currentPage;
            let resp = Number(pManager.queue[user].pageManager.currentPage) - 1;
            resp = pManager.pages[resp];
            res.status(200).json(resp);
          } else {
          }
          break;
        case "number":
          break;
      }
    } else {
      res.sendStatus(401);
    }
  },
  getFilterByDescripcion: async function (req, res) {
    if (readyToGo) {
      let response = await pManager.find(req.params.desc);
      res.status(200).json(response);
    } else {
      res.sendStatus(401);
    }
  },
  resetProductoManager: async function (req, res) {
    if (readyToGo) {
      let user = req.params.token;
      if (!user) {
        res.sendStatus(400);
        return;
      }
      
      
      let pool = await conWeb;

      let resultado = await pool
        .request()
        .input("SucursalDestino", 1)
        .execute("pedidoWeb.Usp_ProductoDatos");

      let products = modelValidation(models.emptyArticulo, resultado.recordset);
      pManager.rebuild({ products });
      pManager.queue[user].pageManager.currentPage = 1;
      let resp = pManager.pages[0];
      res.status(200).json({
        ready: true,
        current: resp
      });
    } else {
      res.sendStatus(401);
    }
  },
};
