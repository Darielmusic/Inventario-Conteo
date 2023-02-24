(async () => {

    let addButton = document.getElementById('addButton');
    let documentContainer = document.getElementById('documentContainer');

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    let baseUrlBK = 'http://10.0.0.247:8089/inventario/getInventarioCompra?request=6';
    let baseUrl = 'http://localhost:3000/pedidosZaglul';

    let pedidos;
    await fetch(baseUrl)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            pedidos = res;
            let fragment = document.createDocumentFragment();
            for (key in pedidos) {
                let card = document.createElement('div');
                card.setAttribute('datakey', key);
                let content = ` 
                <div class="document-container" data-key="${pedidos[key].idDocumento}">
                    <div class="content"></div>
                    <div class="document-left">
                        <div class="id-document">
                            <label for=""><b>Doc:</b></label>
                            <span id="id-document">${pedidos[key].idDocumento}</span>
                        </div>
                        <div class="quantity-document">
                            <label for=""><b>Cantidad:</b></label>
                            <span id="quantity-document">${Number(pedidos[key].registrados).toLocaleString('en-us')}</span>
                        </div>
                    </div>
                    <div class="document-info">
                        <span><b>Fecha:</b><span>${pedidos[key].fecha.substring(0,10)}</span></span>
                        <span><b>Suplidor:</b><span>${pedidos[key].suplidor}</span></span> 
                    </div>
                </div> 
              `;
              card.insertAdjacentHTML('afterbegin',content);
              fragment.append(card);
            }
            documentContainer.append(fragment);
        })

    documentContainer.addEventListener('click', e => {
        let key = e.target.parentElement.getAttribute('data-key');
        if (e.target.matches('div.document-container div.content')) {
            alert(key);
        }
    })
})()


