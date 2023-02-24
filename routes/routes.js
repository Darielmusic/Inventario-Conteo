const { Router } = require('express'); 
const usuario = require('./usuario.routes');
const articulo = require('./articulo.routes');
const sucursales = require('./sucursale.routes');
const productRoutes = require('./product.routes');
const pedidos = require('./pedido.routes');
const modules = require("./modules.routes")

const generalRoutes = Router(); 

generalRoutes.use(productRoutes);
generalRoutes.use(usuario);
generalRoutes.use(articulo);
generalRoutes.use(sucursales);
generalRoutes.use(pedidos);
generalRoutes.use(modules)

module.exports = generalRoutes;
