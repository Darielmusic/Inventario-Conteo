
(() => {
    history.pushState({ module: "" }, "", "/home")
    let module_opened = document.getElementById('module_opened');

    let tbodyPedidos = document.getElementById('tbodyPedidos');
    let tablePedidos = document.getElementById('tablePedidos');
    let menu = document.getElementById('menu');
    let statusMenu = 'off';
    let agregarPedido = document.getElementById('agregarPedido');
    let continualPedido = document.getElementById('continualPedido');
    let tableLogCambio = document.getElementById('tableLogCambio');
    let tbodyLogCambio = document.getElementById('tbodyLogCambio')
    let filterTienda = document.getElementById('filterTienda');
    let verDocument = document.getElementById('verDocument');
    let numeroPedidoBuscador = document.getElementById('numeroPedidoBuscador');
    let fechaPedidoBuscar = document.getElementById('fechaPedidoBuscar');
    let inputBuscador = document.getElementById('inputBuscador');
    let allData;
    let statusIdPut = 0;
    let item;
    let atribute = 0;
    let idPedido;
    let statusString;
    let statusButton;
    let menuContenedor;
    let statusTable;
    let elementIco;
    let searchStatus = 'numero';
    let statusInputBuscador = false;
    let statusFilter = 0;
    let statusScroll = false;
    let data = [];
    let creanTable = false;


    inputBuscador.value = '';
    // //filter
    // filterTienda.addEventListener('change', function (e) {

    //     tbodyPedidos.querySelectorAll('div[data-status]').forEach(tr => tr.classList.remove('display-none'))
    //     let status = filterTienda.value;
    //     switch (status) {
    //         case 'todos':
    //             statusFilter = 0;
    //             creanTable = true;
    //             allDataTablePedido(0, 0)
    //             break;
    //         case 'enviados':
    //             statusFilter = 2;
    //             creanTable = true;
    //             allDataTablePedido(0, 2);
    //             break;
    //         case 'despachado':
    //             statusFilter = 5;
    //             creanTable = true;
    //             allDataTablePedido(0, 5);
    //             break;
    //         case 'recibido':
    //             statusFilter = 6;
    //             creanTable = true;
    //             allDataTablePedido(0, 6);
    //             break;
    //         case 'posteado':
    //             statusFilter = 7;
    //             creanTable = true;
    //             allDataTablePedido(0, 7);
    //             break;

    //     }


    // })

    let cont = 0
    window.onscroll = function () {
        y = window.scrollY;

        if (Math.floor(window.scrollY) == Math.floor(document.documentElement.scrollHeight - window.innerHeight)) {
            cont = cont + 20;
            creanTable = false;
            statusScroll = true;
            allDataTablePedido(cont, statusFilter, inputBuscador.value) 
        }
    }

    allDataTablePedido(0, 0)
    function allDataTablePedido(numPage, estatusIdFiltro, query) {
        if (creanTable) {
            tbodyPedidos.textContent = "";
            cont = 0
        }
        if (statusInputBuscador) {
            if (searchStatus == 'numero') {
                fetch(`/api/pedido/busqueda-Filtro/${numPage}?pedidoInternoId=${query}`)
                    .then(respuesta => respuesta.json())
                    .then(respuesta => {
                        allData = respuesta;
                        if (allData.length == 0 && numPage <= 0) {
                        }
                        fillTable()
                    })
            }
            if (searchStatus == 'fecha') {
                fetch(`/api/pedido/busqueda-Filtro/${numPage}?fecha=${query}`)
                    .then(respuesta => respuesta.json())
                    .then(respuesta => {
                        allData = respuesta;
                        if (allData.length == 0 && numPage <= 0) {
                        }
                        fillTable()
                    })
            }

        } else {
    
            fetch(`/api/pedido/${numPage}?estatusId=${estatusIdFiltro}`)
                .then(respuesta => respuesta.json())
                .then(respuesta => {
                    allData = respuesta;
                    fillTable()
                })
        }
    }

    function insertColorStatus(statusColor, idPedidoInterno, key) {
        statusTable = tbodyPedidos.querySelector(`div[data-key="${key}"] div p`)
        // for (let item in allData) {
        if (statusColor == 'Proceso') {
            idPedido = idPedidoInterno
            statusTable.classList.add('proceso')
            agregarPedido.classList.add('display-none')
            continualPedido.classList.add('displey-initial')
        } else continualPedido.classList.add('display-none')
        if (statusColor == 'Enviado')
            statusTable.classList.add('enviado')

        if (statusColor == 'Despachado')
            statusTable.classList.add('despachado')

        if (statusColor == 'Posteado')
            statusTable.classList.add('posteado')

        if (statusColor == 'Recibido')
            statusTable.classList.add('recibido')

        if (statusColor == 'Impreso')
            statusTable.classList.add('impreso')
        // }
    }

    function fillTable() {
        let fragment = document.createDocumentFragment();
        for (let key in allData) {
            let div = document.createElement('div')
            const timeDate = new Date(allData[key].fecha);
            div.classList.add('tr-cuerpo')
            let td = `
                <div class="td-cuerpo">${allData[key].pedidoInternoId}</div>
                <div class="td-cuerpo">${allData[key].usuario}</div>
                <div class="td-cuerpo">${timeDate.toLocaleString('es-us', { timeZone: 'UTC' })}</div>
                <div class="td-cuerpo">${allData[key].fuente}</div>
                <div class="td-cuerpo"  class"status"><p id="">
                ${allData[key].estatus}
                </p>
                
                </div>
                <div class="td-cuerpo ico" id="icoMenu">
                <i class="fa-solid fa-ellipsis" id="iconoMenu"></i>
                </div>
                `;
            div.insertAdjacentHTML('beforeend', td)
            tbodyPedidos.insertAdjacentElement('beforeend', div)
            data.push(allData[key])
            div.setAttribute('data-key', atribute)
            div.setAttribute('data-status', data[atribute].estatus)
            insertColorStatus(data[atribute].estatus, data[atribute].pedidoInternoId, atribute)
            atribute = atribute + 1;
        }
        fragment.append(tbodyPedidos)
        tablePedidos.append(fragment)
    }

    let numParImpar = 2;
    module_opened.addEventListener('click', async function (e) {

        if (e.target.matches('div.table-cuerpo div.td-cuerpo i')) {
            item = e.target.parentElement.parentElement.getAttribute('data-key')
            elementIco = '';
            elementIco = tbodyPedidos.querySelector(`div[data-key="${item}"] div i`)
            elementIco.classList.add('active-ico-menu')
            if (statusMenu == 'on') {
                tbodyPedidos.querySelectorAll(`div div i`).forEach(i => i.classList.remove('active-ico-menu'));
                if (menuContenedor.querySelector('div')) {
                    menuContenedor.querySelector('div').remove()
                }
                numParImpar = numParImpar + 1
            }

            if ((numParImpar % 2) == 0) {
                tbodyPedidos.querySelector(`div[data-key="${item}"] div i`).classList.add('active-ico-menu')
                let clone = menu.cloneNode(true)
                clone = clone.content.firstElementChild
                elementIco.insertAdjacentElement('beforeend', clone)
                menuContenedor = elementIco;
                statusMenu = 'on'
                statusButton = menuContenedor.querySelector('div div button')
                if (data[item].estatus == 'Proceso') {
                    statusButton.innerHTML = 'Enviado'
                    statusButton.classList.remove('display-none')
                    statusButton.classList.add('btn-enviado')
                    statusButton.classList.remove('btn-recibido')
                    statusButton.classList.remove('btn-posteado');
                    statusString = 'Enviado'
                    statusIdPut = 2;

                    // modificarPedido.classList.remove('display-none')
                }
                if (data[item].estatus == 'Enviado') {
                    statusButton.innerHTML = 'Recibido'
                    statusButton.classList.add('display-none')
                    statusButton.classList.add('btn-recibido')
                    statusButton.classList.remove('btn-recibido')
                    statusButton.classList.remove('btn-posteado')
                    // modificarPedido.classList.add('display-none')
                    statusString = 'Recibido'
                    statusIdPut = 6;
                }
                if (data[item].estatus == 'Recibido') {
                    statusButton.innerHTML = 'Posteado'
                    statusButton.classList.add('display-none')
                    statusButton.classList.add('btn-posteado')
                    statusButton.classList.remove('btn-enviado')
                    statusButton.classList.remove('btn-proceso')
                    // modificarPedido.classList.add('display-none')
                    diferenciaPedidosFinales.classList.remove('display-none')
                    statusString = 'Posteado';
                    statusIdPut = 7
                }

                if (data[item].estatus == 'Despachado') {
                    statusButton.innerHTML = 'Recibido'
                    statusButton.classList.add('display-none')
                    statusButton.classList.add('btn-posteado')
                    statusButton.classList.remove('btn-enviado')
                    statusButton.classList.remove('btn-proceso')
                    statusString = 'Recibido'
                    statusIdPut = 6
                }

                if (data[item].estatus == 'Posteado') {
                    statusButton.classList.add('display-none')
                    // modificarPedido.classList.add('display-none')
                }


            }
        } else {
            if ((numParImpar % 2) == 0 && statusMenu == 'on') {
                tbodyPedidos.querySelectorAll(`div div i`).forEach(i => i.classList.remove('active-ico-menu'));
                menuContenedor.querySelector('div').remove()
                statusMenu = 'off'
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

        //Put
        if (e.target.matches('#statusId')) {
                let cantidadArtculo;
                fetch(`api/pedido/pedidoGeneral/${data[item].pedidoInternoId}`)
                .then(respuesta => respuesta.json())
                .then(respuesta => {
                    cantidadArtculo = respuesta.pedidoInternoDetalle.length;
                    console.log(cantidadArtculo)
              
                })

            let acceptButtonResulto = await showAcceptButtom('Advertencia!', `Seguro que desea cambiar el estatus a ${statusString}`);
            if (!acceptButtonResulto) {
                return;
            } else {
                if (statusIdPut != 0 && cantidadArtculo > 0) {

                    pedidoInternoId = data[item].pedidoInternoId;

                    fetch(`/api/pedido/estatus-ProcesoDespachado/${pedidoInternoId}`, {
                        method: 'PUT',
                        body: JSON.stringify({ pedidoId: pedidoInternoId }),
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })

                        .then(respuesta => {
                            if (respuesta.status === 204) {
                                window.loaderController.activate();
                                // allDataTablePedido();
                                showAlerbanner('success', 'El estado fue correctamente modificado');
                                continualPedido.classList.remove('displey-initial')
                                agregarPedido.classList.remove('display-none')
                                statusTable = tbodyPedidos.querySelector(`div[data-key="${item}"] div p`);
                                statusTable.textContent = 'Enviado';
                                statusTable.classList.add('enviado')
                                data[item].estatus = "Despachado";
                            } else {
                                showAlerbanner('danger', `${respuesta}`)

                                return
                            }
                            setTimeout(() => {
                                window.loaderController.disable();
                            }, 500)
                        })
                } else showAlerbanner('warning', 'No puede enviar un pedido sin articulo')
                

            }
        }
        // TODO: cambial filtrado hardcore
        if (e.target.matches('#logCambioId')) {
            let fragment = document.createDocumentFragment();
            tbodyLogCambio.textContent = '';
            fetch(`/api/pedido/log/${data[item].pedidoInternoId}?filtrado=0`)
                .then(respuesta => respuesta.json())
                .then(respuesta => {
                    let allDataLog = respuesta;

                    for (let key in allDataLog) {
                        let div = document.createElement('div')
                        const timeDate = new Date(allDataLog[key].fecha);
                        div.classList.add('tr-cuerpo')
                        div.classList.add('tr-cuerpo-log')
                        div.setAttribute('data-key', key)
                        let td = `
                    <div class="td-cuerpo">${timeDate.toLocaleString('en-GB', { timeZone: 'UTC' })}</div>
                <div class="td-cuerpo descripcion">${allDataLog[key].descripcion}</div>
                <div class="td-cuerpo">${allDataLog[key].usuario}</div>
        
                `;
                        div.insertAdjacentHTML('beforeend', td)
                        tbodyLogCambio.insertAdjacentElement('beforeend', div)
                    }
                    fragment.append(tbodyLogCambio)
                    tableLogCambio.append(fragment)
                })
            showModal()


        }

        if (e.target.matches('#diferenciaPedidosFinales')) {
            location.assign(`/api/pedido/impresion/comparativa/${allData[item].pedidoInternoId}`)
        }

        //Ver documento
        if (e.target.matches('#verDocument')) {
            showModal();
        }

        //Anular el documento
        if (e.target.matches('#anularDocumento')) {
            try {
                
            } catch (error) {
                
            }
        }
    })

    agregarPedido.addEventListener('click', function (e) {
        e.preventDefault()
        window.insertModule("crear-pedido-principal")
    })
    continualPedido.addEventListener("click", function (e) {
        e.preventDefault()
        localStorage.setItem("currentPedido", idPedido)
        window.insertModule("crear-pedido-principal")
    })

    inputBuscador.addEventListener('keydown', async (e) => {
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
    })
    inputBuscador.addEventListener('change', () => {
        statusInputBuscador = true;
        tbodyPedidos.textContent = "";
        filterTienda.disabled = true;
        allDataTablePedido(0, 0, inputBuscador.value)
        if(Number(inputBuscador.value) == 0){
            console.log(inputBuscador.value)
            statusInputBuscador = false;
            filterTienda.disabled = false;
        }

    })

    let modalContainer = document.getElementById('modalContainer');
    let closeModalAction = document.getElementById('closeModalAction')


    let showModal = () => {
        modalContainer.style.opacity = 1;
        modalContainer.style.pointerEvents = 'unset';
    }

    let hideModal = () => {
        modalContainer.style.opacity = 0;
        modalContainer.style.pointerEvents = 'none';
    }

    topButton.addEventListener('click', e => {
        scrollTo(0, 0);
        topButton.hiddem = true;
    });

    closeModalAction.addEventListener('click', hideModal)
})()