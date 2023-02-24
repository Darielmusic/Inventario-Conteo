const {Router} = require("express")
const controller = require("../controllers/product.controller")

let router = Router()
let baseUrl = `/api/product/`

router.post(`${baseUrl}initial`,controller.getInitialData)
router.get(`${baseUrl}filter/descripcion/:desc`,controller.getFilterByDescripcion)
router.get(`${baseUrl}pages`,controller.getPages)
router.get(`${baseUrl}:token/reset`,controller.resetProductoManager)
router.get(`${baseUrl}:token/:page`,controller.getPage)
// router.post(`${baseUrl}:token/:action`,controller.getPage)


module.exports = router