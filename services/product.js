const numFormatter = require("../helpers/numberFormats");
const { PageManager } = require("./pagemanager");
const models = require("../models/articulos.model")
const { modelValidation } = require("../services/modelStrictValidation");
const { conWeb } = require("../database/connection");

class ProductManager {
  products = [];
  queue = {};
  queueModel = {
    portal: null,
    pageManager: null,
    lastTimeRequest: 0,
  };
  rowModel = `<div data-index="[indexKey]" data-referenceId="[refer]" class="tr">
    <div class="td selector">
      <div class="selector-min">
        <button>-</button>
      </div>
      <div class="selector-input">
        <input type="text" value="0" step="1" min="0" max="[max]" />
      </div>
      <div class="selector-plus">
        <button>+</button>
      </div>
    </div>
    <div class="td description">
      <p>[productId]</p>
      <p>[descripcion]</p>
    </div>
    <div class="td">
      <p>[principal]</p>
    </div>
    <div class="td">
      <p>[here]</p>
    </div>
    <div class="td">
      <p>[suplidor]</p>
    </div>
    <div class="td">
      <p><small>$</small> [costo]</p>
    </div>
  </div>`;
  rebuild({products}){
    if (!(products instanceof Array))
      throw new Error("Type of products is invalid.");
    this.products = products;
    this.readyState = "WORKING";
    const result = products.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / this.maxPerPage);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);
    this.pages = null;
    this.pages = new Array(this.max)
      .fill({
        //working || uptodate ||
        state: "working",
        pageNumber: 1,
        pageContent: [],
        dataRelated: [],
        lastUpdate: new Date().getTime(),
      })
      .map((page, i) => {
        page = { ...page };
        let [...resul] = result;
        page.state = "uptodate";
        page.pageNumber = i + 1;
        page.dataRelated = resul[i];

        page.pageContent = [];
        for (let is = 0; is < resul[i].length; is++) {
          let newItem = new String(this.rowModel);
          newItem = newItem.replace("[indexKey]", is);
          newItem = newItem.replace("[refer]", resul[i][is].Codigo);
          newItem = newItem.replace("[productId]", resul[i][is].CodigoBarra);
          newItem = newItem.replace("[descripcion]", resul[i][is].Descripcion);
          newItem = newItem.replace(
            "[max]",
            resul[i][is].ExistenciaRemota
          );
          newItem = newItem.replace(
            "[principal]",
            resul[i][is].ExistenciaRemota
          );
          newItem = newItem.replace("[suplidor]", resul[i][is].Suplidor);
          newItem = newItem.replace("[here]", resul[i][is].Existencia);
          newItem = newItem.replace(
            "[costo]",
            numFormatter.format(resul[i][is].Costo)
          );
          page.pageContent.push(newItem);
        }

        return page;
      });

    this.readyState = "READY";
    return true;
  }
  addToQueue(id) {
    let pm = new PageManager(id, this.max);
    this.queue[pm.pageManagerId] = { ...this.queueModel };
    let res = this.queue[pm.pageManagerId];

    res.pageManager = pm;
    res.portal = `/api/product/${res.pageManager.pageManagerId}/`;
    res.lastTimeRequest = new Date().getTime();

    return this.queue[pm.pageManagerId];
  }
  async find(descripcion){
    
    const SucursalDestinoId = 1
    let pool = await conWeb;

    let resultado = await pool
    .request()
    .input("SucursalDestino", SucursalDestinoId)
    .input("descripcion", descripcion)
    .execute("pedidoWeb.Usp_FiltroProductoDatos");

    let dto = modelValidation(models.emptyArticulo, resultado.recordset);
    
    let res = []
    for (let iff = 0; iff < dto.length; iff++) {
      let newItem = new String(this.rowModel);
      newItem = newItem.replace("[indexKey]", iff);
      newItem = newItem.replace("[refer]", dto[iff].Codigo);
      newItem = newItem.replace("[productId]", dto[iff].CodigoBarra);
      newItem = newItem.replace("[descripcion]", dto[iff].Descripcion);
      newItem = newItem.replace(
        "[max]",
        dto[iff].ExistenciaRemota
      );
      newItem = newItem.replace(
        "[principal]",
        dto[iff].ExistenciaRemota
      );
      newItem = newItem.replace("[suplidor]", dto[iff].Suplidor);
      newItem = newItem.replace("[here]", dto[iff].Existencia);
      newItem = newItem.replace(
        "[costo]",
        numFormatter.format(dto[iff].Costo)
      );
      res.push(newItem);
    }

    return {dataRelated: dto,page:res}
  }
  constructor({ products, maxPerPage, min }) {
    if (!(products instanceof Array))
      throw new Error("Type of products is invalid.");
    //WORKING || READY
    this.readyState = "WORKING";
    this.products = products;
    this.maxPerPage = maxPerPage || 20;
    // console.log(products.length)
    this.max = Math.ceil(Number(products.length) / this.maxPerPage);
    // console.log(this.max)
    this.min = min || 1;
    this.currentPage = 0;
    
    const result = products.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / this.maxPerPage);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);
    // console.log(result)
    this.pages = new Array(this.max)
      .fill({
        //working || uptodate ||
        state: "working",
        pageNumber: 1,
        pageContent: [],
        dataRelated: [],
        lastUpdate: new Date().getTime(),
      })
      .map((page, i) => {
        page = { ...page };
        let [...resul] = result;
        page.state = "uptodate";
        page.pageNumber = i + 1;
        page.dataRelated = resul[i];

        page.pageContent = [];
        for (let is = 0; is < resul[i].length; is++) {
          let newItem = new String(this.rowModel);
          newItem = newItem.replace("[indexKey]", is);
          newItem = newItem.replace("[refer]", resul[i][is].Codigo);
          newItem = newItem.replace("[productId]", resul[i][is].CodigoBarra);
          newItem = newItem.replace("[descripcion]", resul[i][is].Descripcion);
          newItem = newItem.replace(
            "[max]",
            resul[i][is].ExistenciaRemota
          );
          newItem = newItem.replace(
            "[principal]",
            resul[i][is].ExistenciaRemota
          );
          newItem = newItem.replace("[suplidor]", resul[i][is].Suplidor);
          newItem = newItem.replace("[here]", resul[i][is].Existencia);
          newItem = newItem.replace(
            "[costo]",
            numFormatter.format(resul[i][is].Costo)
          );
          page.pageContent.push(newItem);
        }

        return page;
      });

    this.readyState = "READY";
  }
  get Pages() {
    if (this.readyState == "READY") {
      return this.pages.map((page) => {
        return page;
      });
    }
    return false;
  }
}

module.exports = ProductManager;
