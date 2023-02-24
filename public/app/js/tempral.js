var hideModal = document.getElementById('hideModal');
let alertModal = document.getElementById('alertModal');
let btnAbrirModal = document.getElementById('btnAbrirModal');
let bannerContainer = document.getElementById('bannerContainer');
let closeModalAction = document.getElementById('closeModalAction');
let modalContainer = document.getElementById('modalContainer');
let iconAlert = document.getElementById('iconAlert');
let alertBannerContent = document.getElementById('alertBannerContent');

var showAcceptButtom = (fistMessage, secondMessage) => {

    return new Promise((resolve, reject) => {
        alertModal.hidden = false;

        setTimeout(() => {
            bannerContainer.classList.add('bannerContainer');
            alertModal.classList.add('show-modal');
            alertModal.insertAdjacentHTML('beforeend', ` 
              <h2>${fistMessage}</h2>
              <p>${secondMessage}</p>
              <div class="modalButtons">
                <button id="acceptRequest" class="acceptButton">Aceptar</button>
                <button id="cancelRequest" class="cancelButton">Cancelar</button>
              </div>
          `);

            document.querySelector('#acceptRequest').addEventListener('click', function () {
                resolve(true);
            })

            document.querySelector('#cancelRequest').addEventListener('click', function () {
                resolve(false);
            })

        }, 200);

    })

}

var showAlertModal = (type, message) => {

    alertModal.hidden = false;
    setTimeout(() => {

        if (type.toLowerCase() == 'warning') {

            bannerContainer.classList.add('bannerContainer');
            alertModal.classList.add('show-modal');

            alertModal.insertAdjacentHTML('beforeend', `
                <img src="src/img/warning.png" alt="warning">
                <h2>Advertencia!</h2>
                <p>${message}</p>
                <button id="hideModal">Aceptar</button>
            `);
            document.querySelector('button#hideModal').focus();
        }

        if (type.toLowerCase() == 'danger') {

            bannerContainer.classList.add('bannerContainer');
            alertModal.classList.add('show-modal');

            alertModal.insertAdjacentHTML('beforeend', `
                <img src="/src/img/error.png" alt="error">
                <h2>Error!</h2>
                <p>${message}</p>
                <button id="hideModal">Aceptar</button>
            `);
            document.querySelector('button#hideModal').focus();
        }

        if (type.toLowerCase() == 'success') {

            bannerContainer.classList.add('bannerContainer');
            alertModal.classList.add('show-modal');

            alertModal.insertAdjacentHTML('beforeend', `
                <img src="/src/img/goodtick.png" alt="success">
                <h2>Exito!</h2>
                <p>${message}</p>
                <button id="hideModal" autofocus>Aceptar</button>
            `);
            document.querySelector('button#hideModal').focus();
        }

    }, 10)
}

var hideAlertModal = () => {
    alertModal.classList.remove('show-modal');

    bannerContainer.classList.remove('bannerContainer');
    setTimeout(() => {
        let arr = alertModal.children;
        arr = [...arr];
        arr.forEach(item => {
            item.remove();
        });
        alertModal.hidden = true;
    }, 400);

}

var validateInputs = () => {
    let result;
    document.querySelectorAll('.requerid').forEach(input => {
        if (input.value == "") {
            input.classList.add('requeridInput');
            result = true;
        }
    })
    return result;
}

alertBannerContent.addEventListener('click', function (e) {

    if (e.target.matches('span#closeAlert') || e.target.matches('span#closeAlert i')) {
        alertBannerContent.classList.add('removeAnimation');
        setTimeout(() => {
            alertBannerContent.classList.remove('removeAnimation');
            alertBannerContent.hidden = true;
            alertBannerContent.childNodes.forEach(child => child.remove());
        }, 1000);
    }
})

var showModal = () => {
    modalContainer.style.opacity = 1;
    modalContainer.style.pointerEvents = 'unset';
}

var hideModal = () => {
    modalContainer.style.opacity = 0;
    modalContainer.style.pointerEvents = 'none';
}

document.addEventListener('keydown', function (e) {
    if (e.target.matches('input')) {
        if (e.target.classList.contains('requerid')) {
            e.target.classList.remove('requeridInput');
        }
    }

    if (e.target.matches('select')) {
        if (e.target.classList.contains('requerid')) {
            e.target.classList.remove('requeridInput');
        }
    }

    if (e.target.matches('textarea')) {
        if (e.target.classList.contains('requerid')) {
            e.target.classList.remove('requeridInput');
        }
    }
})

document.addEventListener('change', function (e) {
    if (e.target.matches('select#slSucursales')) {
        e.target.classList.remove('requeridInput');
    }

    if (e.target.matches('select#slTipoUsuario')) {
        e.target.classList.remove('requeridInput');
    }

    if (e.target.matches('select#slStatus')) {
        e.target.classList.remove('requeridInput');
    }
})

closeModalAction.addEventListener('click', hideModal);

alertModal.addEventListener('click', hideAlertModal);

var showAlerbanner = (type, message) => {
    let banner;
    switch (type) {
        case 'warning':
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
            alertBannerContent.insertAdjacentHTML('beforeend', banner);
            alertBannerContent.hidden = false;
            setTimeout(() => {
                alertBannerContent.classList.add('removeAnimation');
            }, 3000);

            setTimeout(() => {
                alertBannerContent.classList.remove('removeAnimation');
                alertBannerContent.hidden = true;
                alertBannerContent.textContent = "";
            }, 4000);

            break;
        case 'danger':
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
            alertBannerContent.insertAdjacentHTML('beforeend', banner);
            alertBannerContent.hidden = false;

            setTimeout(() => {
                alertBannerContent.classList.add('removeAnimation');
            }, 3000);
            setTimeout(() => {
                alertBannerContent.hidden = true;
                alertBannerContent.classList.remove('removeAnimation');
                alertBannerContent.textContent = "";

            }, 4000);

            break;
        case 'success':
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
            alertBannerContent.insertAdjacentHTML('beforeend', banner);
            alertBannerContent.hidden = false;
            setTimeout(() => {
                alertBannerContent.classList.add('removeAnimation');
            }, 3000);

            setTimeout(() => {
                alertBannerContent.classList.remove('removeAnimation');
                alertBannerContent.hidden = true;
                alertBannerContent.textContent = "";
            }, 4000);

            break;
    }
}

var hideAliertBanner = () => {
    alertBannerContent.classList.add('removeAnimation');

    setTimeout(() => {
        alertBannerContent.classList.remove('removeAnimation');
        alertBannerContent.hidden = true;
        alertBannerContent.textContent = "";
    }, 1000);
}