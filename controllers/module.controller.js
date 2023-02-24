const fs = require("fs");
const path = require("path");

module.exports = {
  getModule: async function (req, res) {
    let resolved = false;
    switch (req.params.module) {
      case "home":
        break;
      case "crear-usuarios":
        resolved = true;
        res.setHeader("Content-Type", "text/html");
        res.sendFile(
          path.join(__dirname, "../public/views/vw_creacion-usuarios.html")
        );
        break;
      case "crear-pedido-principal":
        resolved = true;
        res.setHeader("Content-Type", "text/html");
        res.sendFile(path.join(__dirname, "../public/views/vw_pedidos.html"));

        break;
      case "despacho":
        resolved = true;
        res.setHeader("Content-Type", "text/html");
        res.sendFile(
          path.join(__dirname, "../public/views/vw_tablaDespacho.html")
        );

        break;
      case "tienda":
        resolved = true;
        res.setHeader("Content-Type", "text/html");
        res.sendFile(path.join(__dirname, "../public/views/vw_table.html"));
        break;
      case "Recepcion":
        break;
      case "logs":
        break;
      case "recibir-pedido":
        resolved = true;
        res.setHeader("Content-Type", "text/html");
        res.sendFile(path.join(__dirname, "../public/views/vw_recibir_pedido_desktop.html"));
        break;
      case "imprimir":
        resolved = true;
        res.setHeader("Content-Type", "text/html");
        res.sendFile(path.join(__dirname, "../public/views/vw_seleccionar-pedidos.html"));
        break;
      case "despachar-pedido":
        resolved = true;
        res.setHeader("Content-Type", "text/html");
        res.sendFile(path.join(__dirname, "../public/views/vw-despachar-pedido-desktop.html"));
        break;
    }

    if (!resolved) {
      res.sendStatus(404);
    }
  },
  getLogin: async function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.sendFile(path.join(__dirname, "../public/views/login.html"));
  },
  getHome: async function (req, res) {
    function getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(req.headers.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    let userToken = getCookie("userToken");
    let userType = getCookie("userType");
    if (userToken && userType) {
      switch (userType) {
        case "1":
          res.setHeader("Content-Type", "text/html");
          res.sendFile(path.join(__dirname, "../public/home_pedido.html"));
          break;
        case "2":
          res.setHeader("Content-Type", "text/html");
          res.sendFile(path.join(__dirname, "../public/home_despacho.html"));
          break;
        case "3":
          res.setHeader("Content-Type", "text/html");
          res.sendFile(path.join(__dirname, "../public/home.html"));
          break;
        case "4":
          res.setHeader("Content-Type", "text/html");
          res.sendFile(path.join(__dirname, "../public/views/vw_confi_pedido.html"));
          break;
        case "5":
          res.setHeader("Content-Type", "text/html");
          res.sendFile(path.join(__dirname, "../public/views/vw_confi_despacho.html"));
          break;
      }
    }
  },
};
