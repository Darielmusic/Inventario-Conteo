(() => {

    //variables
    let tablaConfirmar = document.getElementById('tablaConfirmar');
    let tablaContainer = document.getElementById('tablaContainer');
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
    let refrescar = document.getElementById('refrescar');
    let recbirPedidoDestok = document.getElementById('recbirPedidoDestok');
    let tableResponsive = document.getElementById('tableResponsive');
    let warningInput = document.getElementById('warningInput');
    let inputCantidad = [];
    let cantidadPedido = 0;
    let inputRecibido;
    let statusAgregado = false;
    let codigoBarraStatus;
    let numberPedidoStatus = false;
    let allDataPut = {};
    let listObj = [];
    let key;
    let idPedido;
    numberPedido.focus();
    
    if (window.screen.width <= 768)
    tableResponsive.hidden = false;
    else{
        recbirPedidoDestok.hidden = false
    }
    
    

    let editArticleQuantity = (barcode, cantidad) => {
        let index = listObj.map((item) => item.codigoBarra).indexOf(barcode);
        listObj[index].recibida = cantidad;
    };
    
    function llenarTablaPedidos(e){
        let codigo = codigoBarra.value
        let articulo = descripcionArticulo.value
        let cantidad = cantidadArticulo.value
        let fragment = document.createDocumentFragment();
        cantidadPedido++
        conteoPedido.value = cantidadPedido + "/" + conteoArticulos
        let obj = {
            "codigoBarra": codigoBarra.value,
            "recibida": Number(cantidadArticulo.value),
            "subTotal": Number(allData[key].subTotal)
        }
        listObj.push(obj)
        if(codigo != "" && articulo != ""){
            if(cantidad != ""){
                let div = document.createElement('div')
                div.classList.add('tr-cuerpo')
                div.setAttribute('data-item', cantidadPedido)
                div.setAttribute('data-barcode', codigo)
                let td = `
                <div class="td-cuerpo">${codigo}</div>
                <div class="td-cuerpo"><p>${articulo}</p></div>
                <div class="td-cuerpo">${allData[key].despachada}</div>
                <div class="td-cuerpo">
                <div class="input-btn">
                <input class="valor-input pl-0" data-key"" value="${cantidad}" type="number"> 
                </div>
                </div>
                <div data-key="${cantidadPedido}" class="td-cuerpo">
                <div class="input-btn">
                <i id="icoItem" class="danger-color fa-regular icoItem fa-trash-can"></i>
                </div>
                </div>
                `;
                div.insertAdjacentHTML('afterbegin', td)
                tbodyconfirmar.insertAdjacentElement('afterbegin', div)
                
                fragment.append(tbodyconfirmar)
                tablaContainer.append(fragment)
                
                codigoBarra.value = '';
                descripcionArticulo.value = '';
                cantidadArticulo.value = '';
                codigoBarra.focus()
                
            }else showAlerbanner('warnig', 'Tiene que ingresar la cantidad de articulos')
        }else showAlerbanner('warnig',  'El código no coincide con ningón pedido')
        
        inputCantidad.push(tbodyconfirmar.querySelector(`div[data-item="${cantidadPedido}"]`));
        // dataTable = tbodyconfirmar.querySelectorAll(`div[data-item="${item}"]`)
        
    }
    
    function cleanInput() {
        tbodyconfirmar.textContent = '';
        codigoBarra.value = '';
        estadoPedido.value = '';
        numberPedido.value = '';
        numberPedido.disabled = false;
        descripcionArticulo.value = '';
        conteoPedido.value = 0 + '/' + 0;
        cantidadArticulo.value = '';
        cantidadPedido = 0;
        agregarCarrito.disabled = true;
        codigoBarra.readOnly = true;
        cantidadPedido.disabled = true;
    }
    let deleteArticle = (barcode) => {
        let index = listObj.map((item) => item.codigoBarra).indexOf(barcode);
        listObj.splice(index, 1);
    };

    // window.addEventListener('resize', ()=>{
    //     if (window.screen.width <= 768) {
    //         recbirPedidoDestok.hidden = true;
    //     }else recbirPedidoDestok.hidden = false;
        
    //     if (window.screen.width >= 768) {
    //         tableResponsive.hidden = true;
    //     }else tableResponsive.hidden = false;

    // })


    module_opened.addEventListener('change', function (e) {
        if (e.target.matches('input#numberPedido')) {
            idPedido = Number(numberPedido.value);
            cantidadPedido = 0;
            codigoBarra.value = '';
            cantidadArticulo.value = '';
            fetch(`/api/pedido/recibido/ById/${idPedido}`)
            .then(respuesta => {
                    if (respuesta.status === 200) {
                        return respuesta.json();
                    } else showAlerbanner('warning', 'Este pedido no está despachado o no existe')
                })
                .then(respuesta => {
                    data = respuesta.recibidoInternoDetalle;
                    for (let cont in data) {
                        if (data[cont].despachada == 0) {
                            cantidadPedido++
                        }
                    }
                    conteoArticulos = respuesta.recibidoInternoDetalle.length
                    respuesta.recibidoInternoDetalle = respuesta.recibidoInternoDetalle.filter(res => {
                        return res.despachada > 0;
                    });

                    allDataRecibido = respuesta;
                    allData = allDataRecibido.recibidoInternoDetalle
                    conteoPedido.value = cantidadPedido + "/" + conteoArticulos

                    if (numberPedido.value == allDataRecibido.pedidoInternoId) {
                        codigoBarra.readOnly = false;
                        estadoPedido.value = allDataRecibido.estatus
                        codigoBarra.focus();
                    }

                })
        }
        if (e.target.matches('input#codigoBarra')) {
            codigoBarraStatus = false;
            articulosRepetidos = (listObj.filter((item) => { return item.codigoBarra == codigoBarra.value }))[0]
            if (articulosRepetidos) {
                inputRecibido = tbodyconfirmar.querySelector(`div[data-barcode="${articulosRepetidos.codigoBarra}"] div.input-btn input`)
                codigoBarraStatus = true;
                inputRecibido.focus();
                inputRecibido.select();
                inputRecibido.classList.add('input-active');
            }

            for (key in allData) {
                if (statusAgregado) {
                    inputRecibido.classList.remove('input-active')
                }
                if (codigoBarra.value == allData[key].codigoBarra) {
                    cantidadArticulo.disabled = false;
                    cantidadArticulo.value = allData[key].despachada;
                    numeroCodigo = codigoBarra.value;
                    codigoBarraStatus = true;
                    descripcionArticulo.value = allData[key].descripcion
                    statusPedidoAgregados = true;
                    agregarCarrito.disabled = false;
                    numberPedido.disabled = true;
                    if (!articulosRepetidos) {
                        cantidadArticulo.focus();
                        cantidadArticulo.select();
                    } else{
                        inputRecibido.focus();
                        inputRecibido.select();
                    } 
                    break
                }
            }
            if (!codigoBarraStatus) {
                cantidadArticulo.disabled = true;
                showAlerbanner('warning', 'Articulo inexistente o ya recibido');
            }

        }
        let barCode = e.target.parentElement.parentElement.parentElement.getAttribute('data-barcode')
        inputRecibido = tbodyconfirmar.querySelector(`div[data-barcode="${barCode}"] div.input-btn input`)
        //  let input = e.target.matches(`div[data-barcode="${barCode}"] div.input-btn input`)
        if (e.target.matches('#cantidadArticulo')) {
            if (cantidadArticulo.value > allData[key].despachada) {
                // warningInput.hidden = false;
                cantidadArticulo.value = allData[key].despachada;
                showAlerbanner('warning', 'No puede ingresar una cantidad mayor a la recibida')
                // warningInput.textContent = 'No puede superar la cantidad despachada';
            }else agregarCarrito.click();
        }
        if (inputRecibido) {
            if (inputRecibido.value <= allData[key].despachada) {
                if(inputRecibido.value != ''){
                    showAlerbanner('success', 'Registro modificado correctamente');
                    editArticleQuantity(barCode, inputRecibido.value)
                    inputRecibido.classList.remove('input-active')
                    codigoBarra.value = '';
                    cantidadArticulo.value = '';
                    descripcionArticulo.value = '';
                    codigoBarra.focus();
                }else showAlerbanner('warning', 'Debe llenar este campo')
            } else {
                showAlerbanner('warning', 'La cantidad ingresada no puede ser mayor a la recibida');
                inputRecibido.value = allData[key].despachada;
            }
        }

    })

    agregarCarrito.addEventListener('click', function (e) {
        statusPedidoAgregados = true;
        // if(cantidadPedido < conteoArticulos){
        let articulosRepetidos = (listObj.filter((item) => { return item.codigoBarra == codigoBarra.value }))[0];
        if (!articulosRepetidos) {
            if (cantidadArticulo.value != '') {
                if(cantidadArticulo.value <= allData[key].despachada){
                        if (codigoBarra.value == allData[key].codigoBarra) {
                            if (codigoBarraStatus) {
                                cantidadArticulo.classList.remove('input-active')
                                codigoBarra.classList.remove('input-active')
                                llenarTablaPedidos();
                            }
                        } else{
                            codigoBarra.classList.add('input-active')
                            codigoBarra.focus()
                        } 
                }
            } else {
                cantidadArticulo.classList.add('input-active')
                showAlerbanner('warning', 'Debe ingresar una la cantidad')
            }

        }
        if (cantidadPedido == conteoArticulos) {
            showAlerbanner('success', 'Se han agregado todos los pedidos')
        }
        // }else showAlerbanner('warning', 'Ya no puede agregar mas articulos')

    })

    btnGuardar.addEventListener('click', async function () {
        let validate = await showAcceptButtom('Recibir el pedido', 'Precione aceptar si está seguro que quiere recibir este pedido')
        if (validate) {
            if(cantidadPedido == conteoArticulos){
                if (listObj != '') {
                    allDataPut = {
                        "recibidoInternoId": Number(idPedido),
                        "pedidoInternoId": Number(allDataRecibido.pedidoInternoId),
                        "recibidoInternoDetalle": listObj
                    }
                    console.log(allDataPut)
                    fetch(
                        `/api/pedido/recibirPedido/${idPedido}`, {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(allDataPut)
                    }
                    )
                        .then(res => {
                            if (res.status === 204) {
                                return res.json();
                            }
                            else {
                                showAlerbanner('warning', 'No se ha podido enviar la informacion');
                            }
                        })
    
                    hideAlertModal()
                    showAlerbanner('success', 'El pedido fue recibido correctamente');
                    listObj = [];
                    obj = {};
                    cleanInput();
    
                } else showAlerbanner('warning', 'No se ha podido recibir el pedido');
            }else showAlerbanner('warning', 'Aún faltan pedidos por recibir');

        }
        hideAlertModal()
    })


    tablaConfirmar.addEventListener('click', async function (e) {
        if (e.target.matches('.icoItem')) {
            let validate = await showAcceptButtom('Advertencia', 'Seguro que desea borrar este articulo?')
            if (validate) {
                let barCode = e.target.parentElement.parentElement.parentElement.getAttribute('data-barcode')
                dataTable = tbodyconfirmar.querySelector(`div[data-barcode="${barCode}"]`)
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
        let barCode = e.target.parentElement.parentElement.parentElement.getAttribute('data-barcode')
        console.log(barCode)
        inputRecibido = tbodyconfirmar.querySelector(`div[data-barcode="${barCode}"] div.input-btn input`)
        console.log(inputRecibido)
        if ((inputRecibido)) {
            if (e.key == 'e') {
                e.preventDefault();
            }
            if (e.key == 'E') {
                e.preventDefault();
            }
            if (e.key == '/') {
                e.preventDefault();
            }
            if (e.key == ' ') {
                e.preventDefault();
            }
            if (e.key == '+') {
                e.preventDefault();
            }
            if (e.key == '.') {
                e.preventDefault();
            }
            if (e.key == '-') {
                e.preventDefault();
            }
            if (e.key == ',') {
                e.preventDefault();
            }
            
            if (e.key == '*') {
                e.preventDefault();
            }
            if (e.key == '!') {
                e.preventDefault();
            }
            // if (e.key == '0' ){
            //     e.preventDefault();
            // }
        }
    })

    cantidadArticulo.addEventListener("keydown", function (event) {
        if (event.key == 'e') {
            event.preventDefault();
        }
        if (event.key == '.') {
            event.preventDefault();
        }
        if (event.key == '0' && cantidadArticulo.value.length == 0) {
            event.preventDefault();
        }
        if (event.key == ' ') {
            event.preventDefault();
        }
        if (event.key == '-') {
            event.preventDefault();
        }
        if (event.key == 'E') {
            event.preventDefault();
        }
        if (event.key == 'Enter') {
            agregarCarrito.click();
        }
    });

    // refrescar.addEventListener('click', function () {
    //     location.reload();
    // })

    let menuConteiner = document.getElementById('menuConteiner');
    let userHeader = document.getElementById('userHeader');
    let userDropdowState = false;

    document.addEventListener("mousedown", (e) => {
        if (userDropdowState) {
            e.stopPropagation();
            e.preventDefault();
            menuConteiner.classList.remove("initial-element");
            userDropdowState = false;
        }
    });
})()