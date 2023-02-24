
(async() => {

    //variables
    let tablaConfirmar = document.getElementById('tablaConfirmar');
    let tbodyconfirmar = document.getElementById('tbodyconfirmar');
    let allData;
    let allDataRecibido;
    let agregarCarrito = document.getElementById('agregarCarrito');
    let btnGuardar = document.getElementById('btnGuardar');
    let numberPedido = document.getElementById('numberPedido');
    let estadoPedido = document.getElementById('estadoPedido');
    let codigoBarra = document.getElementById('codigoBarra');
    let descripcionArticulo = document.getElementById('descripcionArticulo');
    let cantidadArticulo = document.getElementById('cantidadArticulo');
    let conteoPedido = document.getElementById('conteoPedido');
    let rowResponsive = document.getElementById('rowResponsive');
    let refrescar = document.getElementById('refrescar');
    let recbirPedidoDestok = document.getElementById('recbirPedidoDestok');
    let tableResponsive = document.getElementById('tableResponsive');
    let inputCantidad = [];
    let conteoArticulos;
    let statusremoved = false;
    let statusPedidoAgregados = true;
    let cantidadPedido = 0;
    let codigoColection = [];
    let inputRecibido;
    let statusAgregado = false;
    let codigoBarraStatus = false;
    let numberPedidoStatus = false;
    let allDataPut = {};
    let listObj = [];
    let key;
    let userInfo;
    let sucursal = document.getElementById('sucursal');
    let nameUser = document.getElementById('nameUser');
    let initialLetter = document.getElementById('initialLetter');
    let userImg = document.getElementById('userImg');
    let imgLogOut = document.getElementById('imgLogOut');
    let num;

    if (window.screen.width <= 768)
        tableResponsive.hidden = false
    else {
        recbirPedidoDestok.hidden = false
    }

    // window.addEventListener('resize', () => {
    //     if (window.screen.width <= 768) {
    //         recbirPedidoDestok.hidden = true;
    //     } else recbirPedidoDestok.hidden = false;

    //     if (window.screen.width >= 768) {
    //         tableResponsive.hidden = true;
    //     } else tableResponsive.hidden = false;

    // })

    let editArticleQuantity = (barcode, cantidad) => {
        let index = listObj.map((item) => item.codigoBarra).indexOf(barcode);
        listObj[index].recibida = cantidad;
    };

    function cleanInput() {
        rowResponsive.textContent = '';
        codigoBarra.value = '';
        estadoPedido.value = '';
        numberPedido.value = '';
        numberPedido.disabled = false;
        descripcionArticulo.value = '';
        conteoPedido.value = 0 + '/' + 0;
        cantidadArticulo.value = '';
        cantidadArticulo.disabled = false;
        cantidadPedido = 0;
        agregarCarrito.disabled = true;
        codigoBarra.disabled = true;
        cantidadPedido.disabled = true;

    }

    let deleteArticle = (barcode) => {
        let index = listObj.map((item) => item.codigoBarra).indexOf(barcode);
        listObj.splice(index, 1);
    };

    function llenarTablaPedidos() {
        codigoBarra.classList.remove('input-active');
        cantidadArticulo.classList.remove('input-active');
        codigoColection.push(codigoBarra.value);
        if (estadoPedido.value == 'Despachado') {
            estadoPedido.value = 'Despachado'
            cantidadPedido++
            conteoPedido.value = cantidadPedido + "/" + conteoArticulos
            let obj = {
                "codigoBarra": codigoBarra.value,
                "recibida": Number(cantidadArticulo.value),
                "subTotal": Number(data[key].subTotal)
            }
            listObj.push(obj)
            let codigo = codigoBarra.value
            let articulo = descripcionArticulo.value
            let cantidad = cantidadArticulo.value
            let tableresponsiveContainer = document.getElementById('tableresponsiveContainer');
            let fragment = document.createDocumentFragment();
            let div = document.createElement('div');
            div.classList.add('tableConteiner')
            div.setAttribute('data-table', cantidadPedido)
            div.setAttribute('data-barcode', codigo)
            let table = `
                    
                        <div class="secuantialNumber"><p>${codigo}</p></div>
                            <div class="ico-eliminar"><i class="fa-regular icoItem fa-trash-can"></i></div>
                            <div class="tableResponsiveContainer">
                                <div class="headResponsive">
                                    <div>Descripcion</div>
                             
                                    <div>Despachado</div>
                                    <div>Recibido</div>
                                </div>
                                <div class="bodyResponsive" data-key="${cantidadPedido}" id="bodyResponsive">
                                    <div>${articulo}</div>
                            
                                    <div>${data[key].despachada}</div>
                                    <div class="input-btn">                            
                                      <input class="input-recibido" type="number" value="${cantidad}">
                                    </div>
                                </div>
                            </div>
                        </div>
                              
                         `;
            div.insertAdjacentHTML('afterbegin', table)
            rowResponsive.insertAdjacentElement('afterbegin', div)

            fragment.append(rowResponsive)
            tableresponsiveContainer.append(fragment)
            codigoBarra.value = '';
            descripcionArticulo.value = '';
            cantidadArticulo.value = '';
            cantidadArticulo.classList.remove('input-active');
            agregarCarrito.disabled = true;
            statusremoved = true;

        } else showAlerbanner('warning', 'El pedido no está despachado, no lo puede recibir ')
        inputCantidad.push(rowResponsive.querySelector('div[data-key] div input'));

    }
    //Alerta
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
                document.querySelector('button#acceptRequest').focus();

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

  await fetch(`/api/usuario/${getCookie('userToken')}`)
  .then(res => {
    if (res.status === 200) {
      return res.json();
    } else {
      return;
    }
  })
  .then(res => {
    userInfo = res;
     //Header
     sucursal.innerText = userInfo.sucursal;
     nameUser.innerText = userInfo.nombre + ' ' + userInfo.apellido;
     initialLetter.innerText = userInfo.nombre[0].toUpperCase()
  

  })

  fetch('/api/usuario/' + userInfo.usuarioId)
  .then(res => res.json())
  .then(res => {
    let img = `api/usuario/imagen/${res.imagen}`
    console.log(res.imagen)
    if(res.imagen){
        userImg.setAttribute('src', img)
        imgLogOut.setAttribute('src', img)
    }else{
        userImg.setAttribute('src', './src/img/add_user.png')
        imgLogOut.setAttribute('src', './src/img/add_user.png')
    }
    
  })


    tablaConfirmar.addEventListener('change', function (e) {
        if (e.target.matches('input#numberPedido')) {
            let idPedido = numberPedido.value;
            codigoBarra.value = '';
            cantidadArticulo.value = '';
            descripcionArticulo.value = '';
            try {
                fetch(`/api/pedido/recibido/ById/${idPedido}`)
                    .then(respuesta => {
                        if (respuesta.status >= 400) throw new Error('Este pedido no está despachado o no existe');
                        return respuesta.json();
                    })
                    .then(respuesta => {
                        data = respuesta.recibidoInternoDetalle;
                        cantidadPedido = 0;
                        for (let cont in data) {
                            if (data[cont].despachada == 0) {
                                cantidadPedido++
                            }
                        }
                        conteoArticulos = respuesta.recibidoInternoDetalle.length;
                        respuesta.recibidoInternoDetalle = respuesta.recibidoInternoDetalle.filter(res => {
                            return res.despachada > 0;
                        });

                        allDataRecibido = respuesta;
                        allData = allDataRecibido.recibidoInternoDetalle;
                        conteoPedido.value = cantidadPedido + "/" + conteoArticulos;

                        if (numberPedido.value == allDataRecibido.pedidoInternoId) {
                            codigoBarra.disabled = false;
                            estadoPedido.value = allDataRecibido.estatus;
                            codigoBarra.focus();
                        }
                    })
                    .catch(err => { 
               
                        showAlerbanner('warning', err);
                  
                    })
            } catch (error) { 
                showAlerbanner('danger', error);
            }

        }
        if (e.target.matches('input#codigoBarra')) {
            codigoBarraStatus = false;
            articulosRepetidos = (listObj.filter((item) => { return item.codigoBarra == codigoBarra.value }))[0]
            if (articulosRepetidos) {
                inputRecibido = rowResponsive.querySelector(`div[data-barcode="${articulosRepetidos.codigoBarra}"] div.input-btn input`)
                codigoBarraStatus = true;
                inputRecibido.classList.add('input-active');
            }

            for (key in data) {
                if (statusAgregado) {
                    inputRecibido.classList.remove('input-active')
                }
                if (codigoBarra.value == data[key].codigoBarra) {
                    cantidadArticulo.disabled = false;
                    cantidadArticulo.value = data[key].despachada;
                    numeroCodigo = codigoBarra.value;
                    codigoBarraStatus = true;
                    descripcionArticulo.value = data[key].descripcion
                    statusPedidoAgregados = true;
                    agregarCarrito.disabled = false;
                    numberPedido.disabled = true;
                    if (!articulosRepetidos) {
                        cantidadArticulo.focus();
                    } else{
                        inputRecibido.focus();
                        inputRecibido.select();
                    } 

                    break;
                }
            }
            if (!codigoBarraStatus) {
                cantidadArticulo.disabled = true;
                showAlerbanner('warning', 'El codigo del articulo no conincide con ningún articulo ya pedido');
                alertBannerContent.focus();
            }

        }
        let barCode = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-barcode');
        inputRecibido = rowResponsive.querySelector(`div[data-barcode="${barCode}"] div.input-btn input`);
        //  let input = e.target.matches(`div[data-barcode="${barCode}"] div.input-btn input`)
        if (e.target.matches('#cantidadArticulo')) {
            if (cantidadArticulo.value > allData[key].despachada) {
                showAlerbanner('warning', 'La cantidad ingresada no puede superar a la cantidad recibida')
            }
        }
        if (inputRecibido) {
            if (inputRecibido.value <= data[key].despachada) {
                if(inputRecibido.value != '') {
                    showAlerbanner('success', 'Registro modificado correctamente');
                    editArticleQuantity(barCode, inputRecibido.value)
                    inputRecibido.classList.remove('input-active');
                    codigoBarra.focus();
                }else showAlerbanner('warning', 'Debe llenar este campo')

            } else {
                showAlerbanner('warning', 'La cantidad ingresada no puede ser mayor a la recibida');
                inputRecibido.value = data[key].despachada
            }
        }

    })

    alertBannerContent.addEventListener('click', () => {
        alertBannerContent.classList.add("removeAnimation");
        setTimeout(() => {
            alertBannerContent.classList.remove("removeAnimation");
            alertBannerContent.hidden = true;
            alertBannerContent.textContent = "";
        }, 1000);
    });

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

                alertBannerContent.addEventListener('click', () => {
                    alertBannerContent.classList.add(".removeAnimation-pedido");
                        alertBannerContent.classList.remove(".removeAnimation-pedido");
                        alertBannerContent.hidden = true;
                        alertBannerContent.textContent = "";
                });
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
                alertBannerContent.addEventListener('click', () => {
                    alertBannerContent.classList.add("removeAnimation");
                    setTimeout(() => {
                        alertBannerContent.classList.remove("removeAnimation");
                        alertBannerContent.hidden = true;
                        alertBannerContent.textContent = "";
                    }, 1000);
                });

                break;
        }
    };


    agregarCarrito.addEventListener('click', function (e) {
        statusPedidoAgregados = true;
        // if(cantidadPedido < conteoArticulos){
        let articulosRepetidos = (listObj.filter((item) => { return item.codigoBarra == codigoBarra.value }))[0];
        if (!articulosRepetidos) {
            if (cantidadArticulo.value != '' && cantidadArticulo.value <= data[key].despachada) {
                    if (codigoBarra.value != '') {
                        if (codigoBarraStatus) {
                            llenarTablaPedidos();
                        }
                    } else codigoBarra.classList.add('input-active')
                } else showAlerbanner('warning', 'No puede ingresar un valor negativo o en cero')
        }
        if (cantidadPedido == conteoArticulos) {
            showAlerbanner('success', 'Se han agregado todos los pedidos')
        }
        // }else showAlerbanner('warning', 'Ya no puede agregar mas articulos')

    })


    btnGuardar.addEventListener('click', async function () {
        if (cantidadPedido == conteoArticulos) {
            let validate = await showAcceptButtom('Recibir el pedido', 'Precione aceptar si está seguro que quiere recibir este pedido')
            if (validate) {

                allDataPut = {
                    "recibidoInternoId": allDataRecibido.recibidoInternoId,
                    "pedidoInternoId": allDataRecibido.pedidoInternoId,
                    "recibidoInternoDetalle": listObj
                }
                console.log(allDataPut)
                fetch(
                    `/api/pedido/recibirPedido/${allDataRecibido.recibidoInternoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(allDataPut)
                }
                )
                    .then(res => {
                        if (res.status === 204) {
                            return res.text();
                        }
                        else {
                            showAlerbanner('warning', 'No se ha podido enviar la informacion');
                        }
                    })

                hideAlertModal()
                showAlerbanner('success', 'El pedido fue recibido correctamente')
                listObj = [];
                obj = {};
                cleanInput();
                hideAlertModal()
            }
        } else showAlerbanner('warning', 'Faltan pedidos por recibir')
    })

    tablaConfirmar.addEventListener('click', async function (e) {
        if (e.target.matches('.icoItem')) {
            let validate = await showAcceptButtom('Advertencia', 'Seguro que desea borrar este articulo?')
            if (validate) {
                let barCode = e.target.parentElement.parentElement.getAttribute('data-barcode')
                dataTable = rowResponsive.querySelector(`div[data-barcode="${barCode}"]`)
                statusremoved = true;
                cantidadPedido = cantidadPedido - 1
                conteoPedido.value = cantidadPedido + "/" + conteoArticulos
                dataTable.remove();
                deleteArticle(barCode);
                hideAlertModal();
            }
            hideAlertModal();
        }
    })

    tablaConfirmar.addEventListener('keydown', async (e) => {
        let barCode = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-barcode')
        inputRecibido = rowResponsive.querySelector(`div[data-barcode="${barCode}"] div.input-btn input`)
        if ((inputRecibido)) {
            if (e.key == 'e') {
                e.preventDefault();
            }
            if (e.key == '.') {
                e.preventDefault();
            }
            if (e.key == '-') {
                e.preventDefault();
            }
            // if (e.key == '0' ){
            //     e.preventDefault();
            // }
        }
    })


    refrescar.addEventListener('click', function () {
        location.reload();
    })

    function getFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }


    let stautsFullScrean = true;
    fullScreen.addEventListener('click', function () {
        let element = document.documentElement;
        if (stautsFullScrean) {
            getFullscreen(element);
            stautsFullScrean = false;
        } else {
            exitFullscreen();
            stautsFullScrean = true;
        }
    })

    cantidadArticulo.addEventListener("keydown", function (event) {
        if (event.key == 'e') {
            event.preventDefault();
        }
        if (event.key == '.') {
            event.preventDefault();
        }
        if (event.key === 'Enter') {
            agregarCarrito.click();
            codigoBarra.focus();
        }
    });

    let menuConteiner = document.getElementById('menuConteiner');
    let userHeader = document.getElementById('userHeader');
    let userDropdowState = false;
    tablaConfirmar.addEventListener("mousedown", (e) => {
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

    document.getElementById('cerrarSesion').addEventListener('click', ()=>{
        location.assign('/login')
    })

    topButton.addEventListener('click', e => {
        scrollTo(0, 0);
        topButton.hiddem = true;
    });
})()