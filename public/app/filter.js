class PageManager {
  currentPage = 1;
  cbScroll = null;
  cbBtn = null;
  type = "BTN";
  lastDownloadScrollPage = 1;
  cutPosition = 0;
  scrollTarget = null;

  onChange() {}

  async onScroll(e) {
    if (
      e.target.scrollTop + e.target.offsetHeight >=
      e.target.scrollHeight - 300
    ) {
      this.lastDownloadScrollPage = ++this.lastDownloadScrollPage;
      let page = await this.next();
      this.cbScroll(page);
    }
  }

  scrollMaster(target) {
    this.scrollTarget = document.getElementById(target);
    this.cutPosition = Number(this.scrollTarget.offsetHeight) / 2;
    document.getElementById(target).addEventListener("scroll", (e) => {
      this.onScroll(e);
    });
  }

  on(type, cb) {
    if (!type) throw new TypeError("Type en evento invalido");
    switch (type) {
      case "SCROLL":
        if (this.cbBtn)
          throw new Error("Manejador esta siendo utilizado por BTN");
        if (this.type == "BTN") throw new Error("Manejador esta en modo BTN");

        this.cbScroll = cb;
        break;
    }
  }
  constructor({
    portal,
    max,
    min,
    current,
    options: { type, scrollRenderTarget, scrollCb },
  }) {
    this.currentPage = current || 1;
    this.portal = portal;
    if (!max) throw new Error("Max value is not set.");
    this.max = max;
    this.min = min || 1;

    if (type == "BTN") {
    } else if (type == "SCROLL") {
      this.type = "SCROLL";
      if (!scrollRenderTarget)
        throw new Error("scrollRenderTarget is not set.");
      this.on("SCROLL", scrollCb);
      this.scrollMaster(scrollRenderTarget);
    }
  }

  async next() {
    this.currentPage = ++this.currentPage;

    let page = await fetch(`${this.portal}next`)
      .then((res) => res.json())
      .catch((err) => {
        throw new Error("PAGE NEXT HAS AN ERROR");
      });

    return page;
  }
}

class ProductsModalManager {
  pageManager = null;
  numberFormatter = Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  handlingState = false;
  // false || "SEARCHING" || "SELECTING" || "INSERTING" || "OBSERVE"
  state = false;
  currentRow = null;
  currentPage = null;
  pagesControll = [];
  modalFilter = null;
  modalCart = null;
  // D = Descripcion, C = Codebar
  lastFindMode = "D";
  lastState = null;
  cart = {
    cantidad: 0,
    articulos: [],
    costo: 0.0,
    almacenSolicita: "Principal",
    suplidor: "--",
    elements: {
      artCount: null,
      suplidor: null,
      almacen: null,
      costoTotal: null,
    },
  };
  result = null;
  cartContent = `<div data-index="[i]" data-number="[productId]" class="tr">
  <div class="article-data">
    <div><p>[descripcion]</p></div>
    <div><p>[suplidor]</p></div>
    <div><p>[code]</p></div>
  </div>
  <div class="quantity">
    <input type="number" min="0"  value="[val]" max="[max]" step="1">
  </div>
</div>`;
  //filter managment
  filter = false;
  currentRowFilter = null;

  //scroll managment
  scrollCurrentPosition = 0;
  scrollMovement = 195;
  scrollCounting = 1;

  scrollBehavior(to) {
    if (to == "down") {
      let master;
      if (this.filter) {
        master = document.getElementById("filter_table_body_filter");
      } else {
        master = document.getElementById("filter_table_body");
      }
      let m_sh = master.scrollHeight;
      let m_h = master.offsetHeight;
      let m_st = master.scrollTop;

      let selected = master.querySelector(".tr.selected");
      let s_ot = selected.offsetTop;
      // console.log(selected,master)
      let page = selected.parentElement;
      let p_h = page.offsetHeight;
      let p_ot = page.offsetTop;
      if (this.scrollCounting >= 3) {
        let to = Math.floor(Number(p_ot) + Number(s_ot) + 75);
        master.scrollTo(0, to);
        this.scrollCounting = 1;
      } else {
        this.scrollCounting = ++this.scrollCounting;
      }
    } else if (to == "up") {
      let master;
      if (this.filter) {
        master = document.getElementById("filter_table_body_filter");
      } else {
        master = document.getElementById("filter_table_body");
      }
      let m_sh = master.scrollHeight;
      let m_h = master.offsetHeight;
      let m_st = master.scrollTop;

      let selected = master.querySelector(".tr.selected");
      let s_ot = selected.offsetTop;
      // console.log(selected,master)
      let page = selected.parentElement;
      let p_h = page.offsetHeight;
      let p_ot = page.offsetTop;
      if (this.scrollCounting <= 1) {
        let to = Math.floor(Number(p_ot) - Number(s_ot));
        master.scrollTo(0, to);
        this.scrollCounting = 3;
      } else {
        this.scrollCounting = --this.scrollCounting;
      }
    }
  }
  cartManager({ mode, page, row, value }) {
    if (value < 1) return;

    if (mode == "update") {
      let { number } = page.dataset;
      let { index, referenceid } = row.dataset;
      value = Math.floor(Number(value));
      number = number - 1;

      let data = this.pagesControll[number].dataRelated[index];
      data.Quantity = value;
      if (this.cart.suplidor == "--") this.cart.suplidor = data.Suplidor;
      else {
      }
      let newOnList = true;
      let found = null;
      for (let item in this.cart.articulos) {
        if (this.cart.articulos[item].Codigo == data.Codigo) {
          found = item;
          newOnList = false;
          break;
        }
      }
      if (newOnList) {
        this.cart.cantidad = ++this.cart.cantidad;
        this.cart.costo = this.cart.costo + Number(data.Costo) * value;

        let i = this.cart.articulos.push(data) - 1;
        let newItem = String(this.cartContent);
        newItem = newItem.replace("[i]", i);
        newItem = newItem.replace("[productId]", data.Codigo);
        newItem = newItem.replace("[descripcion]", data.Descripcion);
        newItem = newItem.replace("[suplidor]", data.Suplidor);
        newItem = newItem.replace("[code]", data.CodigoBarra);
        newItem = newItem.replace("[val]", data.Quantity);
        newItem = newItem.replace("[max]", data.ExistenciaRemota);

        let div = document.createElement("div");
        div.insertAdjacentHTML("afterbegin", newItem);
        document
          .getElementById("cart_details_table")
          .append(div.firstElementChild);

        this.cart.elements.artCount.innerText = this.cart.cantidad;
        this.cart.elements.suplidor.innerText = this.cart.suplidor;
        this.cart.elements.almacen.innerText = this.cart.almacenSolicita;
        this.cart.elements.costoTotal.innerText = this.numberFormatter.format(
          this.cart.costo
        );
      } else {
        let selectedItems = document
          .getElementById("cart_details_table")
          .querySelectorAll(".tr");
        selectedItems[found].querySelector("input").value = value;
      }
      document.getElementById("lastinsert_desc").innerText = data.Descripcion;
      document.getElementById("lastinsert_code").innerText = data.CodigoBarra;
      document.getElementById("lastinsert_costo").innerText = data.Costo;
      document.getElementById("lastinsert_cantidad").innerText = data.Quantity;
    } else if (mode == "remove") {
    }
  }
  static contentLoaderManager() {
    return {
      add: function () {
        let loader = document.getElementById("content_loader");
        if (!loader) {
          loader = document
            .getElementById("template_body_content_loader")
            .content.firstElementChild.cloneNode(true);

          loader.setAttribute("id", "content_loader");
          document.getElementById("filter_table_body").append(loader);
        }
      },
      remove: function () {
        let loader = document.getElementById("content_loader");
        if (loader) {
          loader.remove();
        }
      },
      validate: function () {
        let loader = document.getElementById("content_loader");
        if (loader) {
          //   console.log(loader, "loader");

          return true;
        }
        return false;
      },
    };
  }
  async filterBy(filter) {
    if (filter.mode == "D") {
      let response = await fetch(
        `/api/product/filter/descripcion/${filter.word}`
      )
        .then((res) => res.json())
        .catch((err) => {
          alert(err);
        });

      if (response) {
        let filter_body = document.getElementById("filter_table_body_filter");

        if (filter_body) {
          filter_body.remove();
        }
        if (response.length > 0) {
          document.getElementById("filter_table_body").style.display = "none";
          // ProductsModalManager.contentLoaderManager().add();
          filter_body = document.createElement("div");
          filter_body.classList.add("tbody");
          filter_body.id = "filter_table_body_filter";
          let page = document.createElement("div");
          page.classList.add("page");
          page.setAttribute("data-number", 1);
          let pageFragment = document.createDocumentFragment();
          for (let art of response) {
            let help = document.createElement("div");

            help.insertAdjacentHTML("afterbegin", art);

            pageFragment.append(help.firstElementChild);
          }
          page.append(pageFragment);
          filter_body.append(page);
          // ProductsModalManager.contentLoaderManager().remove();
          document.getElementById("filter_content").append(filter_body);
        }
      }
    }
  }
  async initial(route) {
    // console.log(this.contentLoaderManager().validate());
    if (!ProductsModalManager.contentLoaderManager().validate()) {
      //   console.log("toy aqui");
      ProductsModalManager.contentLoaderManager().add();
    }
    if (!window.productManager) {
      let response = await fetch(`${route}`, {
        method: "POST",
        body: JSON.stringify({
          user: "2",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .catch((err) => {
          let timer = setTimeout(() => {
            clearTimeout(timer);
            this.initial(route);
          }, 1000);
          return false;
        });

      if (response) {
        window.productManager = response;
        this.result = null;
        this.scrollCounting = 1;
        let initialPage = await fetch(
          `${window.productManager.portal}current`
        ).then((res) => res.json());

        let page = document.createElement("div");
        page.classList.add("page");
        page.setAttribute("data-number", initialPage.pageNumber);
        let initialFragment = document.createDocumentFragment();
        for (let row of initialPage.pageContent) {
          let div = document.createElement("div");
          div.insertAdjacentHTML("afterbegin", row);
          initialFragment.append(div.firstElementChild);
        }
        page.append(initialFragment);
        ProductsModalManager.contentLoaderManager().remove();
        document.getElementById("filter_table_body").append(page);
        this.pagesControll.push(initialPage);
        this.pageManager = new PageManager({
          portal: window.productManager.portal,
          max: window.productManager.pageManager.max,
          options: {
            type: "SCROLL",
            scrollRenderTarget: "filter_table_body",
            scrollCb: this.fillPageContent,
          },
        });
        // this.handlingState = true;
        this.state = "SELECTING";
        this.currentPage = 0;
        this.currentRow = 0;
        document
          .querySelectorAll(".tbody .page")
          [this.currentPage].querySelectorAll(".tr")
          [this.currentRow].classList.add("selected");
        document.addEventListener("keypress", (e) => {
          this.listenToHandle(e);
        });
        document.addEventListener("keydown", (e) => {
          this.listenToHandle(e);
        });
        document
          .getElementById("search_filter")
          .addEventListener("change", (e) => {
            this.listenToHandle(e);
          });
        this.modalFilter = document.getElementById("modal_filter_products");
        this.modalCart = document.getElementById("modal_filter_cart");
        this.cart.elements.artCount = document.getElementById("cart_articulos");
        this.cart.elements.suplidor = document.getElementById("cart_suplidor");
        this.cart.elements.almacen = document.getElementById("cart_almacen");
        this.cart.elements.costoTotal = document.getElementById("cart_costo");
      }
    } else {
    }
  }

  fillPageContent(response) {
    ProductsModalManager.contentLoaderManager().add();
    let page = document.createElement("div");
    page.classList.add("page");
    page.setAttribute("data-number", response.pageNumber);
    let initialFragment = document.createDocumentFragment();
    for (let row of response.pageContent) {
      let div = document.createElement("div");
      div.insertAdjacentHTML("afterbegin", row);
      initialFragment.append(div.firstElementChild);
    }
    page.append(initialFragment);
    ProductsModalManager.contentLoaderManager().remove();
    // this.pagesControll.push(page);
    if (window.ProductModal) {
      window.ProductModal.pagesControll.push(response);
    }
    document.getElementById("filter_table_body").append(page);
  }

  listenToHandle(e) {
    if (this.handlingState) {
      if (e.type == "keydown") {
        switch (e.key) {
          case "F1":
            e.preventDefault();
            if (this.state) {
              // console.log("entramos")

              if (this.state === "SELECTING") {
                this.state = "SEARCHING";
                if (this.lastFindMode == "D") {
                  document
                    .getElementById("filterby_description")
                    .classList.remove("disabled");
                } else {
                  document
                    .getElementById("filterby_code")
                    .classList.remove("disabled");
                }
                document
                  .querySelectorAll(".tbody .page")
                  [this.currentPage].querySelectorAll(".tr")
                  [this.currentRow].classList.remove("selected");
                document.getElementById("search_filter").focus();
                // console.log(this)
              } else if (this.state === "SEARCHING") {
                if (this.lastFindMode == "D") {
                  document
                    .getElementById("filterby_description")
                    .classList.add("disabled");
                  document
                    .getElementById("filterby_code")
                    .classList.remove("disabled");
                  this.lastFindMode = "C";
                } else {
                  document
                    .getElementById("filterby_code")
                    .classList.add("disabled");
                  document
                    .getElementById("filterby_description")
                    .classList.remove("disabled");
                  this.lastFindMode = "D";
                }
                // this.state = "SELECTING";

                // row.querySelector("input").focus()
              }
            }

            break;
          case "F2":
            e.preventDefault();
            if (this.modalCart.classList.contains("active")) {
              this.state = this.lastState;
              this.modalCart.classList.remove("active");
            } else {
              this.lastState = this.state;
              this.state = "OBSERVE";
              this.modalCart.classList.add("active");
            }
            break;
          case "F3":
            e.preventDefault();
            break;
          case "ArrowDown":
            e.preventDefault();

            if (this.state === "SELECTING") {
              if (this.filter) {
                this.scrollBehavior("down");
                let row = document
                  .querySelectorAll(".tbody#filter_table_body_filter .page")[0]
                  .querySelectorAll(".tr")[this.currentRowFilter];
                row.classList.remove("selected");
                let input = row.querySelector("input");
                input.blur();
                this.currentRowFilter = ++this.currentRowFilter;
                row = document
                  .querySelectorAll(".tbody#filter_table_body_filter .page")[0]
                  .querySelectorAll(".tr")[this.currentRowFilter];
                row.classList.add("selected");
              } else {
                this.scrollBehavior("down");
                let row = document
                  .querySelectorAll(".tbody .page")
                  [this.currentPage].querySelectorAll(".tr")[this.currentRow];
                row.classList.remove("selected");
                let input = row.querySelector("input");
                input.blur();
                this.currentRow = ++this.currentRow;

                if (
                  this.currentRow >
                  Number(
                    document
                      .querySelectorAll(".tbody .page")
                      [this.currentPage].querySelectorAll(".tr").length
                  ) -
                    1
                ) {
                  this.currentRow = 0;
                  this.currentPage = ++this.currentPage;
                }
                if (
                  document.querySelectorAll(".tbody .page")[this.currentPage]
                ) {
                  row = document
                    .querySelectorAll(".tbody .page")
                    [this.currentPage].querySelectorAll(".tr")[this.currentRow];
                  row.classList.add("selected");
                } else {
                  row.classList.add("selected");
                }
              }
            }
            break;
          case "ArrowUp":
            e.preventDefault();

            if (this.state === "SELECTING") {
              if (this.filter) {
                this.scrollBehavior("up");
                let row = document
                  .querySelectorAll(".tbody#filter_table_body_filter .page")[0]
                  .querySelectorAll(".tr")[this.currentRowFilter];
                row.classList.remove("selected");
                let input = row.querySelector("input");
                input.blur();
                this.currentRowFilter = --this.currentRowFilter;
                row = document
                  .querySelectorAll(".tbody#filter_table_body_filter .page")[0]
                  .querySelectorAll(".tr")[this.currentRowFilter];
                row.classList.add("selected");
              } else {
                this.scrollBehavior("up");
                let row = document
                  .querySelectorAll(".tbody .page")
                  [this.currentPage].querySelectorAll(".tr")[this.currentRow];
                row.classList.remove("selected");
                let input = row.querySelector("input");
                input.blur();
                this.currentRow = --this.currentRow;
                row = document
                  .querySelectorAll(".tbody .page")
                  [this.currentPage].querySelectorAll(".tr")[this.currentRow];
                row.classList.add("selected");
              }
            }
            break;
          case "Escape":
            e.preventDefault();
            if (this.state) {
              // console.log("entramos")

              if (this.state === "INSERTING") {
                this.state = "SELECTING";
                let row = document
                  .querySelectorAll(".tbody .page")
                  [this.currentPage].querySelectorAll(".tr")[this.currentRow];

                let input = row.querySelector("input");
                input.blur();
              }

              if (this.state === "SEARCHING") {
                this.state = "SELECTING";
                if (this.filter) {
                  let row = document
                    .querySelectorAll(
                      ".tbody#filter_table_body_filter .page"
                    )[0]
                    .querySelectorAll(".tr")[this.currentRowFilter];
                  document.getElementById("search_filter").blur();
                  row.classList.add("selected");
                  console.log(row);
                  if (this.lastFindMode == "D") {
                    document
                      .getElementById("filterby_code")
                      .classList.add("disabled");
                  } else {
                    document
                      .getElementById("filterby_description")
                      .classList.add("disabled");
                  }
                } else {
                  let row = document
                    .querySelectorAll(".tbody .page")
                    [this.currentPage].querySelectorAll(".tr")[this.currentRow];
                  document.getElementById("search_filter").blur();
                  row.classList.add("selected");
                  document
                    .getElementById("filterby_description")
                    .classList.add("disabled");
                  document
                    .getElementById("filterby_code")
                    .classList.add("disabled");
                }
              }
            }
            break;
          case "Enter":
            if (this.state) {
              // console.log("entramos")
              if (this.state === "SELECTING") {
                e.preventDefault();
                this.state = "INSERTING";
                let row = document
                  .querySelectorAll(".tbody .page")
                  [this.currentPage].querySelectorAll(".tr")[this.currentRow];

                let input = row.querySelector("input");
                input.focus();
                input.select();
              } else if (this.state === "SEARCHING") {
                // console.log(e,"keydown")
              } else if (this.state === "INSERTING") {
                if (this.filter) {
                } else {
                  let page =
                    document.querySelectorAll(".tbody .page")[this.currentPage];
                  let row = page.querySelectorAll(".tr")[this.currentRow];

                  let input = row.querySelector("input");
                  let { value } = input;
                  value = Number(value);
                  if (Number.isNaN(value))
                    alert("El valor ingresado no es un numero");
                  else {
                    value = Math.floor(value);
                    input.value = value;
                    if (value > Number(input.max)) {
                      input.value = input.max;
                      value = Number(input.max);
                    }

                    this.cartManager({ mode: "update", page, row, value });
                    input.blur();
                    this.state = "SELECTING";
                  }
                }
              }
            }
            break;
        }
      } else if (e.type == "click") {
      } else if (e.type == "change") {
        if (this.state == "SEARCHING") {
          this.filter = true;
          this.currentRowFilter = 0;
          let filter = { mode: this.lastFindMode, word: e.target.value };
          this.filterBy(filter);
        }
      }
    } else {
      if (e.key == "F3") {
        e.preventDefault();
        this.modalFilter.classList.add("active");
        this.handlingState = true;
      }
    }
  }
  end() {
    this.result = this.cart.articulos;
    this.handlingState = false;
    // false || "SEARCHING" || "SELECTING" || "INSERTING" || "OBSERVE"
    this.state = "SELECTING";
    this.currentRow = 0;
    this.currentPage = 0;
    this.pagesControll = [];
    // D = Descripcion, C = Codebar
    this.lastFindMode = "D";
    this.lastState = null;
    this.cart = {
      cantidad: 0,
      articulos: [],
      costo: 0.0,
      almacenSolicita: "Principal",
      suplidor: "--",
      elements: {
        artCount: null,
        suplidor: null,
        almacen: null,
        costoTotal: null,
      },
    };

    this.filter = false;
    this.currentRowFilter = null;
    this.scrollCurrentPosition = 0;
    this.scrollCounting = 1;
    this.modalCart.classList.remove("active");
    this.modalFilter.classList.remove("active");
  }
  constructor(initialRoute) {
    if (!initialRoute)
      throw new Error("Ruta inicial (initialRoute) is not Defined");

    this.initial(initialRoute);
  }
}

window.ProductModal = new ProductsModalManager("/api/product/initial");
