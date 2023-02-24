let userHeader = document.getElementById("userHeader");
let menuConteiner = document.getElementById("menuConteiner");
let sucursalHeader = document.getElementById("sucursal-header");
let sucursalFecha = document.getElementById("fecha-header");
let imgUserHeader = document.getElementById("imgUserHeader");
let nameUserHeader = document.getElementById("nameUserHeader");
let secondNameUserHeader = document.getElementById("secondNameUserHeader");

let userDropdowState = false;
window.userInfo = null;
let nowDate = new Date().toISOString().substring(0, 10);
sucursalFecha.value = nowDate;

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
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
localStorage.removeItem("currentPedido");

fetch(`/api/usuario/${getCookie("userToken")}`)
  .then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      return;
    }
  })
  .then((res) => {
    userInfo = res;
    nameUserHeader.textContent = userInfo.nombre;
    secondNameUserHeader.textContent = userInfo.apellido;
    sucursalHeader.value = userInfo.sucursal;
    let img = `api/usuario/imagen/${res.imagen}`;
    if (res.imagen != "") {
      imgUserHeader.setAttribute("src", img);
    } else {
      imgUserHeader.setAttribute("src", "./src/img/add_user.png");
    }
  });

document.addEventListener("mousedown", (e) => {
  if (userDropdowState) {
    e.stopPropagation();
    e.preventDefault();
    menuConteiner.classList.remove("initial-element");
    userDropdowState = false;
  }
});
userHeader.addEventListener("mousedown", function (e) {
  if (!userDropdowState) {
    e.stopPropagation();
    e.preventDefault();
    userDropdowState = true;
    menuConteiner.classList.add("initial-element");
  }
});

//Loader controller
window.loaderController = {
  activate: function () {
    let loader = document.getElementById("loader");
    if (loader.classList.contains("disable")) {
      loader.classList.remove("disable");
    }
  },
  disable: function () {
    let loader = document.getElementById("loader");
    if (!loader.classList.contains("disable")) {
      loader.classList.add("disable");
    }
  },
};

var hideModal = document.getElementById("hideModal");
let alertModal = document.getElementById("alertModal");
let btnAbrirModal = document.getElementById("btnAbrirModal");
let bannerContainer = document.getElementById("bannerContainer");
let closeModalAction = document.getElementById("closeModalAction");
let modalContainer = document.getElementById("modalContainer");
let iconAlert = document.getElementById("iconAlert");
let alertBannerContent = document.getElementById("alertBannerContent");

var showAcceptButtom = (fistMessage, secondMessage) => {
  return new Promise((resolve, reject) => {
    alertModal.hidden = false;

    setTimeout(() => {
      bannerContainer.classList.add("bannerContainer");
      alertModal.classList.add("show-modal");
      alertModal.insertAdjacentHTML(
        "beforeend",
        ` 
            <h2>${fistMessage}</h2>
            <p>${secondMessage}</p>
            <div class="modalButtons">
              <button id="acceptRequest" class="acceptButton">Aceptar</button>
              <button id="cancelRequest" class="cancelButton">Cancelar</button>
            </div>
        `
      );
      document.querySelector("button#acceptRequest").focus();

      document
        .querySelector("#acceptRequest")
        .addEventListener("click", function () {
          resolve(true);
        });

      document
        .querySelector("#cancelRequest")
        .addEventListener("click", function () {
          resolve(false);
        });
    }, 200);
  });
};

var showAlertModal = (type, message) => {
  alertModal.hidden = false;
  setTimeout(() => {
    if (type.toLowerCase() == "warning") {
      bannerContainer.classList.add("bannerContainer");
      alertModal.classList.add("show-modal");

      alertModal.insertAdjacentHTML(
        "beforeend",
        `
              <img src="src/img/warning.png" alt="warning">
              <h2>Advertencia!</h2>
              <p>${message}</p>
              <button id="hideModal">Aceptar</button>
          `
      );
      document.querySelector("button#hideModal").focus();
    }

    if (type.toLowerCase() == "danger") {
      bannerContainer.classList.add("bannerContainer");
      alertModal.classList.add("show-modal");

      alertModal.insertAdjacentHTML(
        "beforeend",
        `
              <img src="/src/img/error.png" alt="error">
              <h2>Error!</h2>
              <p>${message}</p>
              <button id="hideModal">Aceptar</button>
          `
      );
      document.querySelector("button#hideModal").focus();
    }

    if (type.toLowerCase() == "success") {
      bannerContainer.classList.add("bannerContainer");
      alertModal.classList.add("show-modal");

      alertModal.insertAdjacentHTML(
        "beforeend",
        `
              <img src="/src/img/goodtick.png" alt="success">
              <h2>Exito!</h2>
              <p>${message}</p>
              <button id="hideModal" autofocus>Aceptar</button>
          `
      );
      document.querySelector("button#hideModal").focus();
    }
  }, 10);
};

var hideAlertModal = () => {
  alertModal.classList.remove("show-modal");

  bannerContainer.classList.remove("bannerContainer");
  setTimeout(() => {
    let arr = alertModal.children;
    arr = [...arr];
    arr.forEach((item) => {
      item.remove();
    });
    alertModal.hidden = true;
  }, 400);
};

var validateInputs = () => {
  let result;
  document.querySelectorAll(".requerid").forEach((input) => {
    if (input.value == "") {
      input.classList.add("requeridInput");
      result = true;
    }
  });
  return result;
};

alertBannerContent.addEventListener("click", function (e) {
  if (
    e.target.matches("span#closeAlert") ||
    e.target.matches("span#closeAlert i")
  ) {
    alertBannerContent.classList.add("removeAnimation");
    setTimeout(() => {
      alertBannerContent.classList.remove("removeAnimation");
      alertBannerContent.hidden = true;
      alertBannerContent.childNodes.forEach((child) => child.remove());
    }, 1000);
  }
});

var showModal = () => {
  modalContainer.style.opacity = 1;
  modalContainer.style.pointerEvents = "unset";
};

var hideModal = () => {
  modalContainer.style.opacity = 0;
  modalContainer.style.pointerEvents = "none";
};

document.addEventListener("keydown", function (e) {
  if (e.target.matches("input")) {
    if (
      e.target.classList.contains("requerid") ||
      e.target.classList.contains("requeridInput")
    ) {
      e.target.classList.remove("requeridInput");
    }
  }

  if (e.target.matches("select")) {
    if (e.target.classList.contains("requerid")) {
      e.target.classList.remove("requeridInput");
    }
  }

  if (e.target.matches("textarea")) {
    if (e.target.classList.contains("requerid")) {
      e.target.classList.remove("requeridInput");
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.matches("select#slSucursales")) {
    e.target.classList.remove("requeridInput");
  }

  if (e.target.matches("select#slTipoUsuario")) {
    e.target.classList.remove("requeridInput");
  }

  if (e.target.matches("select#slStatus")) {
    e.target.classList.remove("requeridInput");
  }
});

closeModalAction.addEventListener("click", hideModal);

alertModal.addEventListener("click", hideAlertModal);

var showAlerbanner = (type, message) => {
  let banner;
  switch (type) {
    case "warning":
      banner = `
                      <div class="alert-content warning-backgr-banner boder-solid-warning" id="globalAlert">
                          <div class="icon-content">
                              <i class="fa-solid fa-triangle-exclamation fa-3x warning-banner"></i>
                          </div>
                          <div class="message-content">
                              <p class="menssage warning-banner" id="messageAlert">${message}</p>
                          </div>
                          <div class="close-button-content">
                              <span class="btn-cerrar fas fa-times warning-banner" id="closeAlert"></span>
                          </div>
                      </div>
                  `;
      alertBannerContent.insertAdjacentHTML("beforeend", banner);
      alertBannerContent.hidden = false;
      setTimeout(() => {
        alertBannerContent.classList.add("removeAnimation");
      }, 3000);

      setTimeout(() => {
        alertBannerContent.classList.remove("removeAnimation");
        alertBannerContent.hidden = true;
        alertBannerContent.textContent = "";
      }, 4000);

      break;
    case "danger":
      banner = `
                      <div class="alert-content danger-backgr-banner boder-solid-danger" id="globalAlert">
                          <div class="icon-content">
                              <i class="fa-solid fa-square-xmark fa-3x danger-banner"></i>
                          </div>
                          <div class="message-content">
                              <p class="menssage danger-banner" id="messageAlert">${message}</p>
                          </div>
                          <div class="close-button-content">
                              <span class="btn-cerrar fas fa-times danger-banner" id="closeAlert"></span>
                          </div>
                      </div>
                  `;
      alertBannerContent.insertAdjacentHTML("beforeend", banner);
      alertBannerContent.hidden = false;

      setTimeout(() => {
        alertBannerContent.classList.add("removeAnimation");
      }, 3000);
      setTimeout(() => {
        alertBannerContent.hidden = true;
        alertBannerContent.classList.remove("removeAnimation");
        alertBannerContent.textContent = "";
      }, 4000);

      break;
    case "success":
      banner = `
                      <div class="alert-content success-backgr-banner boder-solid-success" id="globalAlert">
                          <div class="icon-content">
                              <i class="fa-solid fa-check fa-3x success-banner"></i>
                          </div>
                          <div class="message-content">
                              <p class="menssage success-banner" id="messageAlert">${message}</p>
                          </div>
                          <div class="close-button-content">
                              <span class="btn-cerrar fas fa-times success-banner" id="closeAlert"></span>
                          </div>
                      </div>
                   `;
      alertBannerContent.insertAdjacentHTML("beforeend", banner);
      alertBannerContent.hidden = false;
      setTimeout(() => {
        alertBannerContent.classList.add("removeAnimation");
      }, 3000);

      setTimeout(() => {
        alertBannerContent.classList.remove("removeAnimation");
        alertBannerContent.hidden = true;
        alertBannerContent.textContent = "";
      }, 4000);

      break;
  }
};

var hideAliertBanner = () => {
  alertBannerContent.classList.add("removeAnimation");

  setTimeout(() => {
    alertBannerContent.classList.remove("removeAnimation");
    alertBannerContent.hidden = true;
    alertBannerContent.textContent = "";
  }, 1000);
};

class PageManager {
  currentPage = 1;
  cbScroll = null;
  cbBtn = null;
  type = "BTN";
  lastDownloadScrollPage = 1;
  cutPosition = 0;
  scrollTarget = null;
  enable = true;
  onChange() {}

  async onScroll(e) {
    if(!(this.enable)) return
    if (
      e.target.scrollTop + e.target.offsetHeight >=
      e.target.scrollHeight - 300
    ) {
      this.lastDownloadScrollPage = ++this.lastDownloadScrollPage;
      let page = await this.next();
      window.productManager.currentPage = page.pageNumber;
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
  cartModel = {
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
  filterData = null;
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

  // calbacks
  cbOnEnd = null;
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
      let data;
      let filter_body = document.getElementById("filter_table_body_filter");

      if (!filter_body) data = this.pagesControll[number].dataRelated[index];
      else data = this.filterData.dataRelated[index];

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
        showAlerbanner("warning",`Este articulo ya se habia agregado al carro.`)
        return;
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
          let filter_body = document.getElementById("filter_table_body_filter");

          if (filter_body) {
            filter_body.append(loader);
          } else {
            document.getElementById("filter_table_body").append(loader);
          }
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
        if (response.page.length > 0) {
          this.currentRowFilter = 0;
          this.filterData = null;
          document.getElementById("filter_table_body").style.display = "none";
          ProductsModalManager.contentLoaderManager().add();
          filter_body = document.createElement("div");
          filter_body.classList.add("tbody");
          filter_body.id = "filter_table_body_filter";
          let page = document.createElement("div");
          page.classList.add("page");
          page.setAttribute("data-number", 1);
          let pageFragment = document.createDocumentFragment();
          for (let art of response.page) {
            let help = document.createElement("div");

            help.insertAdjacentHTML("afterbegin", art);

            pageFragment.append(help.firstElementChild);
          }
          page.append(pageFragment);
          filter_body.append(page);
          this.filterData = response;
          ProductsModalManager.contentLoaderManager().remove();
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
          user: userInfo && "usuarioId" in userInfo ? userInfo?.usuarioId : 0,
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
        let body = document.getElementById("filter_table_body");
        body.querySelectorAll(".page").forEach((page) => page.remove());
        body.append(page);
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
        document.addEventListener("click", (e) => {
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
  async partialInitial() {}
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
            if (this.filter) {
              let filter_body = document.getElementById(
                "filter_table_body_filter"
              );
              if (filter_body) {
                filter_body.remove();
                this.filter = false;
                document.getElementById("filter_table_body").style.display =
                  "block";
              }
            }
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
                  // console.log(row);
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
                let filter_body = document.getElementById(
                  "filter_table_body_filter"
                );
                let row;
                if (filter_body) {
                  row = document
                    .querySelectorAll(
                      "#filter_table_body_filter.tbody .page"
                    )[0]
                    .querySelectorAll(".tr")[this.currentRowFilter];
                } else {
                  row = document
                    .querySelectorAll("#filter_table_body.tbody .page")
                    [this.currentPage].querySelectorAll(".tr")[this.currentRow];
                }

                let input = row.querySelector("input");
                input.focus();
                input.select();
              } else if (this.state === "SEARCHING") {
                // console.log(e,"keydown")
              } else if (this.state === "INSERTING") {
                if (this.filter) {
                  let row;
                  let page;

                  page = document.querySelectorAll(
                    "#filter_table_body_filter.tbody .page"
                  )[0];
                  row = page.querySelectorAll(".tr")[this.currentRowFilter];

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
                } else {
                  let filter_body = document.getElementById(
                    "filter_table_body_filter"
                  );
                  let row;
                  let page;

                  if (filter_body) {
                    page = document.querySelectorAll(
                      "#filter_table_body_filter.tbody .page"
                    )[0];
                    row = page.querySelectorAll(".tr")[this.currentRowFilter];
                  } else {
                    page = document.querySelectorAll(
                      "#filter_table_body.tbody .page"
                    )[this.currentPage];
                    row = page.querySelectorAll(".tr")[this.currentRow];
                  }

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
        if (e.target.matches("#search_filter")) {
          if (this.state) {
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
            }
            e.preventDefault();
          }
        } else if (e.target.matches("#btnFinishFilter")) {
          this.end();
        } else if (this.state == "SELECTING" && e.target.matches("input")) {
          this.state = "INSERTING";
          if (this.filter) {
            let row;
            let page;

            page = document.querySelectorAll(
              "#filter_table_body_filter.tbody .page"
            )[0];
            row = document
              .querySelectorAll(".tbody#filter_table_body_filter .page")[0]
              .querySelectorAll(".tr")[this.currentRowFilter];
            row.classList.remove("selected");
            let input = row.querySelector("input");
            input.blur();
            this.currentRowFilter = Number(
              e.target.parentElement.parentElement.parentElement.getAttribute(
                "data-index"
              )
            );

            row = page.querySelectorAll(".tr")[this.currentRowFilter];
            row.classList.add("selected");
            input = row.querySelector("input");
            input.focus();
            input.select();
          } else {
            let filter_body = document.getElementById(
              "filter_table_body_filter"
            );
            let row;
            let page;

            if (filter_body) {
              page = document.querySelectorAll(
                "#filter_table_body_filter.tbody .page"
              )[0];
              row = page.querySelectorAll(".tr")[this.currentRowFilter];
            } else {
              this.currentPage =
                Number(
                  e.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
                    "data-number"
                  )
                ) - 1;
              page = document.querySelectorAll(
                "#filter_table_body.tbody .page"
              )[this.currentPage];
              row = page.querySelectorAll(".tr")[this.currentRow];
            }
            row.classList.remove("selected");
            this.currentRow = Number(
              e.target.parentElement.parentElement.parentElement.getAttribute(
                "data-index"
              )
            );
            row = page.querySelectorAll(".tr")[this.currentRow];
            row.classList.add("selected");
            let input = row.querySelector("input");
            input.focus();
            input.select();
          }
        } else if (e.target.matches("#search_filter_suplidor")) {
        } else if (e.target.matches("#search_filter_suplidor")) {
        } else if (e.target.matches("#search_filter_suplidor")) {
        } else if (e.target.matches("#search_filter_suplidor")) {
        }
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

  async end() {
    this.pageManager.enable = false;
    this.result = this.cart.articulos;
    this.handlingState = false;
    this.cart = {};
    this.cart = {...this.cartModel };
    this.cart.articulos = [];
    this.modalFilter = document.getElementById("modal_filter_products");
    this.modalCart = document.getElementById("modal_filter_cart");
    this.cart.elements.artCount = document.getElementById("cart_articulos");
    this.cart.elements.suplidor = document.getElementById("cart_suplidor");
    this.cart.elements.almacen = document.getElementById("cart_almacen");
    this.cart.elements.costoTotal = document.getElementById("cart_costo");
    this.cart.elements.artCount.innerText = this.cart.cantidad;
    this.cart.elements.suplidor.innerText = this.cart.suplidor;
    this.cart.elements.almacen.innerText = this.cart.almacenSolicita;
    this.cart.elements.costoTotal.innerText = this.numberFormatter.format(
      this.cart.costo
    );
    document.getElementById("cart_details_table").innerHTML = "";
    // false || "SEARCHING" || "SELECTING" || "INSERTING" || "OBSERVE"
    this.state = "SELECTING";

    this.modalCart.classList.remove("active");
    this.modalFilter.classList.remove("active");
    if (this.cbOnEnd) {
      this.cbOnEnd(this.result);
      this.result = null;
    }
    if (this.filter) {
      let filter_body = document.getElementById("filter_table_body_filter");
      if (filter_body) {
        filter_body.remove();
        this.filter = false;
        document.getElementById("filter_table_body").style.display = "block";
      }
    }
    document
      .getElementById("filter_table_body")
      .querySelectorAll(".page")
      .forEach((page) => page.remove());
    if (!ProductsModalManager.contentLoaderManager().validate()) {
      //   console.log("toy aqui");
      ProductsModalManager.contentLoaderManager().add();
    }
    let initialPage = await fetch(
      `/api/product/${window.productManager.pageManager.pageManagerId}/reset`
    )
      .then((res) => res.json())
      .then((res) => {
        return res.current;
      });

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
    let body = document.getElementById("filter_table_body");
    body.append(page);
    this.pagesControll = [];
    this.pagesControll.push(initialPage);
    this.scrollCounting = 1;
    this.currentPage = 0;
    this.currentRow = 0;
    body.scrollTo(0,0);
    document
      .querySelectorAll(".tbody .page")
      [this.currentPage].querySelectorAll(".tr")
      [this.currentRow].classList.add("selected");
      this.pageManager.enable = true;
  }
  setEndCallback(cb) {
    this.cbOnEnd = cb;
  }
  finish() {}

  constructor(initialRoute) {
    if (!initialRoute)
      throw new Error("Ruta inicial (initialRoute) is not Defined");

    this.initial(initialRoute);
  }
}

window.ProductModal = new ProductsModalManager("/api/product/initial");

function importModule(module) {
  return new Promise((resolve, reject) => {
    try {
      fetch(`/api/module/${module}`)
        .then((res) => {
          // console.log(res.status)
          if (res.status >= 400) reject("Error al importar el modulo");
          return res.text();
        })
        .then((html) => {
          resolve(html);
        });
    } catch (error) {
      reject(error);
    }
  });
}

window.insertModule = async function (module) {
  try {
    window.loaderController.activate();
    let result = await importModule(module);
    let toInsert = document.createElement("div");
    toInsert.insertAdjacentHTML("afterbegin", result);
    toInsert = toInsert.firstElementChild;
    let opened = document.getElementById("module_opened");

    if (opened) opened.remove();

    toInsert.id = "module_opened";
    toInsert.setAttribute("data-tag", "module");
    toInsert.setAttribute("data-module", module);
    history.pushState({ module }, "", `/${module}`);
    document
      .getElementById("hr_reference")
      .insertAdjacentElement("afterend", toInsert);

    opened = document.getElementById("module_opened");
    let scripts = opened.querySelectorAll("script");

    let importScripts = [];
    for (let script of scripts) {
      let sc = document.createElement("script");
      sc.src = script.src;
      importScripts.push(sc);
      script.remove();
    }
    for (let imported of importScripts) {
      document.getElementById("module_opened").append(imported);
    }

    window.loaderController.disable();
  } catch (err) {
    showAlertModal("danger", err);
    window.loaderController.disable();
  }
};

window.userController = {
  userData: {},
  setUserImage: function (url) {
    if (url) {
      document
        .getElementById("imgUserHeader")
        .setAttribute("src", `RUTA EN ESPERA`);
    }
  },
  setuserName: function (name) {
    document.getElementById("nameUserHeader").innerText = name;
  },
};

window.refreshModule = async function () {
  let opened = document.getElementById("module_opened");
  await window.insertModule(opened.getAttribute("data-module"));
  return true;
};

window.refreshModule = async function () {
  let opened = document.getElementById("module_opened");
  await window.insertModule(opened.getAttribute("data-module"));
  return true;
};

!(function (d, w) {
  d.addEventListener("click", (e) => {
    if (e.target.matches(".list-menu a")) {
      e.preventDefault();
      w.insertModule(e.target.getAttribute("href"));
    } else if (e.target.matches(".list-menu a i")) {
      e.preventDefault();
      w.insertModule(e.target.parentElement.getAttribute("href"));
    }
    if (
      e.target.matches("#btnActualizar") ||
      e.target.matches("#btnActualizar i")
    ) {
      window.refreshModule();
    }
    if (
      e.target.matches("#logout") ||
      e.target.matches("#logout i") ||
      e.target.matches("#logout div")
    ) {
      location.assign("/login");
    }
  });
  d.addEventListener("keydown", (e) => {
    if (e.target.matches(".txt-to-number")) {
      if (e.key == "Backspace") {
      } else if (e.key == "Enter") {
      } else if (e.code == "Space") {
        e.preventDefault();
      } else if (Number.isNaN(Number(e.key))) e.preventDefault();
    }
  });
  d.addEventListener("DOMContentLoaded", (e) => {
    window.loaderController.disable();
  });
})(document, window);
