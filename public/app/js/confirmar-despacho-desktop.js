(() => {
  let numberPedido = document.getElementById("numberPedido");
  let codigoBarra = document.getElementById("codigoBarra");
  let msgBarCode = document.getElementById("err-msg-cod-barra");
  let msgCantidad = document.getElementById("err-msg-cant");
  let descripcionArticulo = document.getElementById("descripcionArticulo");
  let cantidadArticulo = document.getElementById("cantidadArticulo");
  let conteoPedido = document.getElementById("conteoPedido");
  let agregarCarrito = document.getElementById("agregarCarrito");
  let btnGuardar = document.getElementById("btnGuardar");
  let tbodyconfirmar = document.getElementById('tbodyconfirmar');

  let fisrtMessage = document.getElementById('fisrtMessage');
  let secondMessage = document.getElementById('secondMessage');
  let acceptButton = document.getElementById('acceptButton');
  let cancelButton = document.getElementById('cancelButton');
  let acceptRequest = document.getElementById('acceptRequest');
  let cancelRequest = document.getElementById('cancelRequest');

  let iconFromBanner = document.getElementById('iconFromBanner');
  let messageAlert = document.getElementById('messageAlert');
  let closeAlert = document.getElementById('closeAlert');
  let globalAlert = document.getElementById('globalAlert');

  let counter = 0;
  let orderById;
  let counterArticle;
  let currentArticle;
  let estatusPedido = "NORMAL";
  let articlesList = [];
  let articleToInsert = {};

  numberPedido.focus();

  window.userInfo;

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  fetch(`/api/usuario/${getCookie('userToken')}`)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return;
      }
    })
    .then(res => {
      userInfo = res;
    })

  let urlBaseById = "/api/pedido/despacho/ById";

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
  tbodyconfirmar
  //#region Functions
  let renderDesktopTable = (item) => {
    let div = document.createElement('div')
    div.classList.add('tr-cuerpo')
    div.setAttribute('data-barcode', currentArticle.codigoBarra)
    let td = `
        <div class="td-cuerpo">${currentArticle.codigoBarra}</div>
        <div class="td-cuerpo"><p>${currentArticle.descripcion}</p></div>
        <div class="td-cuerpo">${currentArticle.existenciaRemota}</div>
        <div class="td-cuerpo">${currentArticle.cantidad}</div>
        <div class="td-cuerpo">
            <div class="input-btn">
              <input class="valor-input" data-key"" type="text"> 
            </div> 
        </div> 
        `;
    div.insertAdjacentHTML("afterbegin", td);
    tbodyconfirmar.insertAdjacentElement('afterbegin', div);
    div.querySelector('input').value = item.insertado;
  }

  let clearAllInputs = () => {

    numberPedido.value = "";
    numberPedido.disabled = false;
    codigoBarra.value = "";
    codigoBarra.disabled = true;
    descripcionArticulo.value = "";
    descripcionArticulo.disabled = true;
    cantidadArticulo.value = '';
    cantidadArticulo.disabled = true;
    conteoPedido.value = '0/0';
    agregarCarrito.disabled = true;
    btnGuardar.disabled = true;
    tbodyconfirmar.textContent = "";

    counter = 0;
    orderById = '';
    counterArticle = '';
    currentArticle = '';
    estatusPedido = "NORMAL";
    articlesList = [];
    articleToInsert = {};
  }

  let deleteArticle = (barcode) => {
    let index = articlesList.map((item) => item.codigoBarra).indexOf(barcode);
    articlesList.splice(index, 1);
  };

  let editArticleQuantity = (barcode, cantidad) => {
    let index = articlesList.map((item) => item.codigoBarra).indexOf(barcode);
    articlesList[index].despachada = cantidad;
  };

  let quantityVerify = (e) => {

    if (cantidadArticulo.value == "") {
      msgCantidad.style.color = "orange";
      msgCantidad.textContent = "Inserte cantidad";
      return false;
    }

    if (cantidadArticulo.value < 0) {
      msgCantidad.style.color = "red";
      msgCantidad.textContent = "Cantidad menor que 0";
      return false;
    }

    if (cantidadArticulo.value > currentArticle.cantidad) {
      msgCantidad.style.color = "red";
      msgCantidad.textContent = `Cantidad ordenada: ${currentArticle.cantidad}`;
      cantidadArticulo.select();
      return false;
    }

    if (cantidadArticulo.value > currentArticle.existenciaRemota) {
      msgCantidad.style.color = "orange";
      msgCantidad.textContent = `La cantidad en almacen: ${currentArticle.existenciaLocal}`;
      cantidadArticulo.select();
      return false;
    }

    return true;
  };

  function putArticle(e) {

    try {
      window.loaderController.activate();

      fetch(`api/pedido/despachado/cantidad-articulo/${orderById.despachoInternoId}`, {
        method: "PUT",
        body: JSON.stringify(articleToInsert),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (res.status >= 400) throw new Error('Error al hacer la peticion');
          return res.json();
        })
        .then(res => {
          res = (res)[0];
          if (estatusPedido == "NORMAL") {
            renderDesktopTable(res);
          }
          if (estatusPedido == "EDIT") {
            e.target.value = res.insertado;
          }
          window.loaderController.disable();
        })
        .catch(err => {
          console.log(err);
          window.loaderController.disable();
        })

    } catch (err) {

      //TODO: Mensaje de error
      console.log(`Error: ${err}`);
      window.loaderController.disable();
    }

  }

  let hideAlertModal = () => {
    alertModal.classList.remove("show-modal");

    bannerContainer.classList.remove("bannerContainer");
    setTimeout(() => {
      alertModal.hidden = true;
    }, 400);
  };
  //#endregion Functions

  //#region Events

  cantidadArticulo.addEventListener('keydown', (e) => {
    if (e.key == 'e') e.preventDefault();
    if (e.key == '.') e.preventDefault();
    if (e.key == '*') e.preventDefault();
    if (e.key == ',') e.preventDefault();
    if (e.key == '-') e.preventDefault();
    if (e.key == '+') e.preventDefault();
    if (e.key == '0' && cantidadArticulo.value.length == 0) e.preventDefault();

    if (e.key === 'Enter') {
      let result = quantityVerify();
      if (result) {
        agregarCarrito.click();
        codigoBarra.focus();
      }
    }
  })

  document.addEventListener("change", async function (e) {

    let barcode = e.target.parentElement.parentElement.parentElement.getAttribute("data-barcode");

    if (e.target.matches(`div[data-barcode="${barcode}"] div.input-btn input`)) {

      if (e.target.value == "") {
        return;
      }
      if (e.target.value > currentArticle.cantidad) {
        articleToInsert.cantidad = currentArticle.cantidad;
        e.target.value = currentArticle.cantidad;
      }
      if (e.target.value < 0) return e.target.value = articleToInsert.cantidad = 0;
      if (e.target.value > currentArticle.existenciaRemota) articleToInsert.cantidad = currentArticle.existenciaRemota;
      articleToInsert.cantidad = e.target.value;
      estatusPedido = "EDIT";
      putArticle(e);


    }

    if (e.target.matches("input#numberPedido")) {
      try {
        await fetch(`${urlBaseById}/${numberPedido.value}`)
          .then((res) => {
            window.loaderController.activate();
            if (res.status >= 400) throw new Error("El pedido no está disponible");
            return res.json();
          })
          .then((res) => {
            orderById = res;
            counterArticle = orderById.despachoInternoDetalle.length;
            codigoBarra.value = "";
            descripcionArticulo.value = "";
            cantidadArticulo.value = "";
            conteoPedido.value = `${counter}/${counterArticle}`;
            codigoBarra.disabled = false;
            descripcionArticulo.disabled = false;
            descripcionArticulo.readOnly = true;
            codigoBarra.focus();
            window.loaderController.disable();

          })
          .catch((err) => {
            showAlerbanner("warning", err);
            window.loaderController.disable();
          });
      } catch (error) {
        showAlerbanner("danger", error);
        window.loaderController.disable ();
      }
    }

    if (e.target.matches("input#codigoBarra")) {

      currentArticle = orderById.despachoInternoDetalle.filter((article) => article.codigoBarra == e.target.value)[0];
      let repeateArticle = articlesList.filter(((article) => article.codigoBarra == e.target.value))[0];
      debugger;
      if (repeateArticle) {
        let data_barcode = document.querySelector(`div [data-barcode="${currentArticle.codigoBarra}"] div.input-btn input`);
        data_barcode.focus();
        data_barcode.select();
        codigoBarra.classList.remove("incorrect-input");
        codigoBarra.value = '';
        msgBarCode.textContent = "";
      } else if (currentArticle) {
        descripcionArticulo.value = currentArticle.descripcion;
        codigoBarra.classList.remove("incorrect-input");
        msgBarCode.textContent = "";
        cantidadArticulo.disabled = false;
        agregarCarrito.disabled = false;
        cantidadArticulo.focus();
        cantidadArticulo.value = currentArticle.cantidad;
        cantidadArticulo.select();
      } else {
        codigoBarra.classList.add("incorrect-input");
        msgBarCode.textContent = "Este articulo no esta en el pedido";
        cantidadArticulo.disabled = true;
      }
    }

  });

  agregarCarrito.addEventListener("click", (e) => {

    let result = quantityVerify(e);

    if (result) {

      estatusPedido = "NORMAL";

      msgCantidad.textContent = "";
      articleToInsert = {
        codigoBarra: currentArticle.codigoBarra,
        existenciaLocal: currentArticle.existenciaLocal,
        existenciaRemota: currentArticle.existenciaRemota,
        cantidad: Number(cantidadArticulo.value),
        sucursalDestinoId: orderById.sucursalDestinoId,
        sucursalFuenteId: orderById.sucursalFuenteId,
        usuarioId: window.userInfo.usuarioId
      };
      if (currentArticle.cantidad == cantidadArticulo.value) {
        let obj = {
          insertado: cantidadArticulo.value
        }
        renderDesktopTable(obj);
      } else {
        putArticle();
      }

      counter++;
      conteoPedido.value = `${counter} / ${counterArticle}`;
      numberPedido.disabled = true;
      codigoBarra.value = "";
      cantidadArticulo.disabled = true;
      agregarCarrito.disabled = true;
      descripcionArticulo.value = "";
      cantidadArticulo.value = "";
      articlesList.push(articleToInsert);
      btnGuardar.disabled = false;
      scrollTo(0, tbodyconfirmar.offsetTop);
    }

  });

  document.addEventListener('click', e => {
    if (e.target.matches('i.icoItem')) {
      let barcode = e.target.parentElement.parentElement.getAttribute('data-barcode');

      //eliminar de la lista
      deleteArticle(barcode);

      //elimnar el contenedor completo
      e.target.parentElement.parentElement.remove();
      counter--;
      conteoPedido.value = `${counter}/${counterArticle}`;
      codigoBarra.focus();
    }
  });

  btnGuardar.addEventListener('click', async e => {
    scrollTo(0, 0);
    let result;

    if(counter < counterArticle) result = await showAcceptButtom('ADVERTENCIA!', 'Algunos articulos no se han insertado. Seguro que desea continuar?');
    else result = await showAcceptButtom('Se guardará el pedido!', 'Esta seguro que desea guardar el pedido?');

    if (result) {
      hideAlertModal();
      window.loaderController.activate();
      clearAllInputs();

      setTimeout(() => {
        window.loaderController.disable();
        showAlerbanner('success', 'Se ha guardado el pedido con éxito!')
        numberPedido.focus();
      }, 1000);

    }
    else {
      hideAlertModal();
    }
  });

  //#endregion Events 
})();
