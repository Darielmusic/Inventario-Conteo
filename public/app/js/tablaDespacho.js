(() => {
  let tbodyPedidos = document.getElementById("tbodyPedidos");
  let tablePedidos = document.getElementById("tablePedidos");
  let menu = document.getElementById("menu");
  let statusMenu = "off";
  let logCambioDespacho = document.getElementById("logCambioDespacho");
  let filterDespacho = document.getElementById("filterDespacho");
  let inputBuscador = document.getElementById("inputBuscador");
  let numeroPedidoBuscador = document.getElementById("numeroPedidoBuscador");
  let fechaPedidoBuscar = document.getElementById("fechaPedidoBuscar");
  let nonExistentFecha = document.getElementById("nonExistentFecha");
  let nonExistentNum = document.getElementById("nonExistentNum");
  let allData;
  let menuContenedor;
  let statusFilter = 0;
  let searchStatus = "numero";
  let statusInputBuscador = false;
  let statusScroll = false;
  let data = [];
  let atribute = 0;
  let creanTable = false;
  // fetch('/api/pedido/despacho')
  //     .then(rs => rs.json())

  filterDespacho.addEventListener("change", function () {
    tbodyPedidos
      .querySelectorAll("div[data-status]")
      .forEach((tr) => tr.classList.remove("display-none"));
    let statusApi = filterDespacho.value;
    switch (statusApi) {
      case "todos":
        statusFilter = 0;
        creanTable = true;
        allDataTablePedido(0, 0);
        break;
      case "Pendietes":
        statusFilter = 3;
        creanTable = true;
        allDataTablePedido(0, 3);
        break;
      case "Impresos":
        statusFilter = 4;
        creanTable = true;
        allDataTablePedido(0, 4);
        break;
      case "Despachado":
        statusFilter = 5;
        creanTable = true;
        allDataTablePedido(0, 5);
        break;
      case "Recibido":
        statusFilter = 6;
        creanTable = true;
        allDataTablePedido(0, 6);
        break;
    }
  });

  let cont = 0;
  window.onscroll = function () {
    y = window.scrollY;
    if (
      window.scrollY ==
      document.documentElement.scrollHeight - window.innerHeight
    ) {
      cont = cont + 20;
      creanTable = false;
      statusScroll = true;
      allDataTablePedido(cont, statusFilter, inputBuscador.value);
    }
  };

  allDataTablePedido(0, 0);
  function allDataTablePedido(numPage, estatusIdFiltro, query) {
    // try {

    if (creanTable) {
      tbodyPedidos.textContent = "";
      cont = 0;
    }

    nonExistentFecha.classList.add("display-none");
    nonExistentNum.classList.add("display-none");
    if (statusInputBuscador) {
      if (searchStatus == "numero") {
        fetch(`/api/pedido/despacho/busqueda-Filtro/${numPage}?despachoInternoId=${query}`)
          .then((respuesta) => respuesta.json())
          .then((respuesta) => {
            allData = respuesta;
            fillTable();
            if (allData.length == 0 && numPage <= 0) {
              nonExistentNum.classList.remove("display-none");
            }
          });
      }
      if (searchStatus == "fecha") {
        fetch(`/api/pedido/despacho/busqueda-Filtro/${numPage}?fecha=${query}`)
          .then((respuesta) => respuesta.json())
          .then((respuesta) => {
            allData = respuesta;
            fillTable();
          });
        if (allData.length == 0 && numPage <= 0) {
          nonExistentFecha.classList.remove("display-none");
        }
      }
    } else{;
      fetch(`/api/pedido/despacho/${numPage}?estatusId=${estatusIdFiltro}`)
        .then((respuesta) => respuesta.json())
        .then((respuesta) => {
          allData = respuesta;
          nonExistentFecha.classList.add("display-none");
          nonExistentNum.classList.add("display-none");
          fillTable();
        });
    }

    //   } catch (error) {
    // }
  }

  function fillTable() {
    let fragment = document.createDocumentFragment();
    for (let key in allData) {
      let div = document.createElement("div");
      div.classList.add("tr-cuerpo");
      const timeDate = new Date(allData[key].fecha);
      let td = `
      <div class="td-cuerpo">${allData[key].despachoInternoId}</div>
      <div class="td-cuerpo">${allData[key].pedidoInternoId}</div>
      <div class="td-cuerpo">${timeDate.toLocaleString("es-us", {
        timeZone: "UTC",
      })}</div>
            <div class="td-cuerpo">${allData[key].fuente}</div>
            
            <div class="td-cuerpo">${allData[key].total}</div>
            <div class="td-cuerpo"  class"status"><p id="">
            ${allData[key].estatus}
            </p>
            
            </div>
            <div class="td-cuerpo ico" id="icoMenu">
            <i class="fa-solid fa-ellipsis" id="iconoMenu"></i>
            </div>
            `;

      div.insertAdjacentHTML("beforeend", td);
      tbodyPedidos.insertAdjacentElement("beforeend", div);
      data.push(allData[key]);
      div.setAttribute("data-key", atribute);
      div.setAttribute("data-status", data[atribute].estatus);
      insertColorStatus(data[atribute].estatus, atribute);
      atribute = atribute + 1;
    }
    fragment.append(tbodyPedidos);
    tablePedidos.append(fragment);
  }

  function insertColorStatus(statusColor, key) {
    statusTable = tbodyPedidos.querySelector(`div[data-key="${key}"] div p`);
    for (let item in data) {
      if (statusColor == "Pendiente") {
        statusTable.classList.add("proceso");
      }
      if (statusColor == "Impreso") {
        statusTable.classList.add("impreso");
      }
      if (statusColor == "Despachado") {
        statusTable.classList.add("despachado");
      }
      if (statusColor == "Recibido") {
        statusTable.classList.add("posteado");
      }
    }
  }

  let item;
  let numParImpar = 2;
  tablePedidos.addEventListener("click", async function (e) {
    if (e.target.matches("div.table-cuerpo div.td-cuerpo i")) {
      item = e.target.parentElement.parentElement.getAttribute("data-key");
      elementIco = tbodyPedidos.querySelector(`div[data-key="${item}"] div i`);

      if (statusMenu == "on") {
        tbodyPedidos
          .querySelectorAll(`div div i`)
          .forEach((i) => i.classList.remove("active-ico-menu"));
        if (menuContenedor.querySelector("div")) {
          menuContenedor.querySelector("div").remove();
        }
        numParImpar = numParImpar + 1;
      }

      if (numParImpar % 2 == 0) {
        tbodyPedidos
          .querySelector(`div[data-key="${item}"] div i`)
          .classList.add("active-ico-menu");
        let clone = menu.cloneNode(true);
        clone = clone.content.firstElementChild;
        elementIco.insertAdjacentElement("beforeend", clone);
        menuContenedor = elementIco;
        statusMenu = "on";
        let modificarPedido = tbodyPedidos.querySelector("div.modificar");
        statusButton = menuContenedor.querySelector("div div button");
        if (data[item].estatus == "Pendiente") {
          statusButton.classList.remove("display-none");
          statusButton.innerHTML = "Imprimir";
          statusButton.classList.add("btn-enviado");
          statusButton.classList.remove("btn-recibido");
          statusButton.classList.remove("btn-posteado");
          statusIdPut = 4;
        }
        if (data[item].estatus == "Impreso") {
          statusButton.innerHTML = "Despachado";
          statusButton.classList.remove("display-none");
          statusButton.classList.add("btn-recibido");
          statusButton.classList.remove("btn-enviado");
          statusButton.classList.remove("btn-posteado");
          statusIdPut = 5;
        }
        if (data[item].estatus == "Despachado") {
          statusButton.classList.add("display-none");
          // statusButton.innerHTML = ''
          statusButton.classList.add("btn-posteado");
          statusButton.classList.remove("btn-enviado");
          statusButton.classList.remove("btn-proceso");
          // statusIdPut = 5;
        }

        if (data[item].estatus == "Recibido") {
          statusButton.classList.add("display-none");
        }
      }
    } else {
      if (numParImpar % 2 == 0 && statusMenu == "on") {
        tbodyPedidos
          .querySelectorAll(`div div i`)
          .forEach((i) => i.classList.remove("active-ico-menu"));
        menuContenedor.querySelector("div").remove();
        statusMenu = "off";
      }
    }

    if (e.target.matches('#numeroPedidoBuscador')) {
      numeroPedidoBuscador.classList.add('primaryColor-filter')
      fechaPedidoBuscar.classList.remove('primaryColor-filter')
      inputBuscador.disable = false;
      inputBuscador.type = "number"
      searchStatus = 'numero';
  }
  if (e.target.matches('#fechaPedidoBuscar')) {
      fechaPedidoBuscar.classList.add('primaryColor-filter')
      numeroPedidoBuscador.classList.remove('primaryColor-filter')
      inputBuscador.disable = true;
      inputBuscador.type = "date"
      searchStatus = 'fecha'
  }

    // Put
    if (e.target.matches("#statusId")) {
      let acceptButtonResulto = await showAcceptButtom(
        "Advertencia!",
        `Seguro que desea cambiar el estatus`
      );
      if (acceptButtonResulto) {
        if (statusIdPut == 4) {
          // location.assign(`/api/pedido/imprime/${allData[item].despachoInternoId}`);
        }
        if (statusIdPut != 0) {
          idDespacho = data[item].despachoInternoId;
          if (statusIdPut != 5) {
            fetch(`/api/pedido/estatus-Impreso/${idDespacho}`, {
              method: "PUT",
              body: JSON.stringify({
                usuarioId: window.userInfo.usuarioId,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((respuesta) => {
              if (respuesta.status === 204) {
                window.loaderController.activate();
                statusTable = tbodyPedidos.querySelector(
                  `div[data-key="${item}"] div p`
                );

                statusTable.textContent = "impreso";
                statusTable.classList.add("impreso");
                data[item].estatus = "Impreso";

                showAlerbanner(
                  "success",
                  "El estado fue correctamente modificado"
                );
              } else {
                showAlerbanner(
                  "danger",
                  "Oh oh! algo ha salido mal al cambiar el estado del pedido"
                );
                return;
              }
              setTimeout(() => {
                window.loaderController.disable();
              }, 500);
            });
          } else {
            console.log(idDespacho);
            fetch(`/api/pedido/despacho/${idDespacho}`, {
              method: "PUT",
              // body: JSON.stringify(window.userInfo.usuarioId),
              headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            }).then((respuesta) => {
              if (respuesta.status === 204) {
                window.loaderController.activate();
                showAlerbanner(
                  "success",
                  "El estado fue correctamente modificado"
                );
                statusTable = tbodyPedidos.querySelector(
                  `div[data-key="${item}"] div p`
                );
                statusTable.textContent = "Despachado";
                statusTable.classList.remove("impreso");
                statusTable.classList.add("despachado");
                data[item].estatus = "Despachado";
              } else {
                showAlerbanner(
                  "danger",
                  "Oh oh! algo ha salido mal al cambiar el estado del pedido"
                );
                return;
              }
              setTimeout(() => {
                window.loaderController.disable();
              }, 500);
            });
          }
        }
      }
    }

    if (e.target.matches("#logCambioDespacho")) {
      let fragment = document.createDocumentFragment();
      tbodyLogCambio.textContent = "";
      //TODO: cambial filtrado hardcore
      fetch(
        `/api/pedido/despacho-Log/${data[item].despachoInternoId}?filtrado=0`
      )
        .then((respuesta) => respuesta.json())
        .then((respuesta) => {
          let allDataLog = respuesta;

          for (let key in allDataLog) {
            let div = document.createElement("div");
            const timeDate = new Date(allDataLog[key].fecha);
            div.classList.add("tr-cuerpo");
            div.classList.add("tr-cuerpo-log");
            div.setAttribute("data-key", key);
            let td = `
                    <div class="td-cuerpo">${timeDate.toLocaleString("es-us", {
                      timeZone: "UTC",
                    })}</div>
                <div class="td-cuerpo descripcion">${
                  allDataLog[key].descripcion
                }</div>
                <div class="td-cuerpo">${allDataLog[key].usuario}</div>
    
                `;
            div.insertAdjacentHTML("beforeend", td);
            tbodyLogCambio.insertAdjacentElement("beforeend", div);
          }
          fragment.append(tbodyLogCambio);
          tableLogCambio.append(fragment);
        });
      showModal();
    }

    // if (e.target.matches("#imprimirDespacho")) {
    //   location.assign(`/api/pedido/imprime/${allData[item].pedidoNo}`);
    // }
  });

  //El Modal
  let modalContainer = document.getElementById("modalContainer");
  let closeModalAction = document.getElementById("closeModalAction");

  let showModal = () => {
    modalContainer.style.opacity = 1;
    modalContainer.style.pointerEvents = "unset";
  };

  let hideModal = () => {
    modalContainer.style.opacity = 0;
    modalContainer.style.pointerEvents = "none";
  };

  inputBuscador.addEventListener("keydown", async (e) => {
    if (e.key == "e") {
      e.preventDefault();
    }
    if (e.key == ".") {
      e.preventDefault();
    }
    if (e.key == "-") {
      e.preventDefault();
    }
    // if (e.key == '0' ){
    //     e.preventDefault();
    // }
  });

  inputBuscador.addEventListener("change", () => {
    statusInputBuscador = true;
    tbodyPedidos.textContent = "";
    filterDespacho.disabled = true;
    allDataTablePedido(0, 0, inputBuscador.value);
    if(inputBuscador.value == ''){
        statusInputBuscador = false;
        filterDespacho.disabled = false;
    }
  });

  topButton.addEventListener("click", (e) => {
    scrollTo(0, 0);
    topButton.hiddem = true;
  });

  closeModalAction.addEventListener("click", hideModal);

  // window.addEventListener("click", function(event){
  //     event.preventDefault();
  //     let contextElement = document.getElementById('contexMenu')
  //     contextElement.style.top = event.offsetY + "px";
  //     contextElement.style.left = event.offsetX + "px";
  // })
})();
