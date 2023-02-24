(() => {
    history.pushState({},"","/home");
    let module_opened = document.getElementById('module_opened');

    let txtNumero = document.getElementById('txtNumero');
    let txtName = document.getElementById('txtName');
    let txtLastname = document.getElementById('txtLastname');
    let txtCedula = document.getElementById('txtCedula');
    let txtEmail = document.getElementById('txtEmail');
    let txtUser = document.getElementById('txtUser');
    let txtPassword = document.getElementById('txtPassword');
    let txtConfirmPassword = document.getElementById('txtConfirmPassword');
    let slSucursales = document.getElementById('slSucursales');
    let slTipoUsuario = document.getElementById('slTipoUsuario');
    let slStatus = document.getElementById('slStatus');

    let btnSaveUser = document.getElementById('btnSaveUser');
    let btnClearAll = document.getElementById('btnClearAll');
    let btnSearchUser = document.getElementById('btnSearchUser');

    let tableUser = document.getElementById("tableUser");
    let tbodyUsuarios = document.getElementById('tbodyUsuarios');

    let bannerContainer = document.getElementById('bannerContainer');
    let formContainer = document.getElementById('formContainer');
    let imgContainer = document.getElementById('imgContainer');
    let imgUserInput = document.getElementById('imgUserInput');
    let imgUser = document.getElementById('imgUser');

    let globalKeyTableRow;
    let passStatus = 'hide';
    let userId = 0;
    // let sucursal = 0;
    let estatusUser = 0;
    let tipoUsuario = 0;
    let imgRoot;

    let urlSucursal = '/api/sucursales/';
    let urlUser = '/api/usuario/';
    let tiposUsurios = '/api/usuario/tipoUsuario/';
    let estatusUsuarios = '/api/usuario/estatus';

    //#region Petitions
    let state = "CREATE";
    let sucursales;
    let userTypes;
    let statusUser;
    let user;

    // fetch(urlSucursal)
    //     .then(response => response.json())
    //     .then(response => {
    //         sucursales = response;
    //         let option = document.createElement('option');
    //         option.setAttribute('data-key',window.userInfo.sucursalId);
    //         option.innerText = window.userInfo.sucursal;
    //         slSucursales.append(option);
    //         slSucursales.selectedIndex = 1
    //         slSucursales.disabled = true;

    //     });

    fetch(tiposUsurios)
        .then(response => response.json())
        .then(response => {
            userTypes = response;
            let fragment = document.createDocumentFragment();

            for (let key in userTypes) {
                let option = document.createElement('option');
                option.setAttribute('data-key', key);
                option.innerText = userTypes[key].descripcion;
                fragment.append(option);
            }

            slTipoUsuario.append(fragment);
        });

    fetch(estatusUsuarios)
        .then(response => response.json())
        .then(response => {
            statusUser = response;
            let fragment = document.createDocumentFragment();

            for (let key in statusUser) {
                let option = document.createElement('option');
                option.setAttribute('data-key', key);
                option.innerText = statusUser[key].descripcion;
                fragment.append(option);
            }

            slStatus.append(fragment);
        });

    fetch(urlUser)
        .then(response => response.json())
        .then(response => {
            tbodyUsuarios.textContent = "";
            user = response;
            let fragment = document.createDocumentFragment();
            for (let key in user) {
                let div = document.createElement('div');
                div.setAttribute('data-key', key);
                div.classList.add('tr-body');
                // <div class="td-body">${user[key].sucursal}</div>
                let td = `
                                <div class="td-body">${user[key].usuarioId}</div>
                                <div class="td-body">${user[key].nombre}</div> 
                                <div class="td-body">${user[key].usuario}</div>
                                <div class="td-body">${user[key].tipoUsuario}</div> 
                                <div class="td-body">${user[key].estatus}</div>
                             `;
                div.insertAdjacentHTML('beforeend', td);
                tbodyUsuarios.insertAdjacentElement('beforeend', div);
            }

            fragment.append(tbodyUsuarios);
            tableUser.append(fragment);
        })

    //#endregion Petitions

    //#region functions
    let clearAllInputs = () => {
        userId = 0;
        imgUser.setAttribute('src', '/src/img/add_user.png');
        txtNumero.value = "Nuevo";
        txtName.value = "";
        txtLastname.value = "";
        txtCedula.value = "";
        txtEmail.value = "";
        txtUser.value = "";
        txtPassword.value = "";
        txtConfirmPassword.value = "";
        txtaddress.value = "";
        slTipoUsuario.selectedIndex = 0;
        slStatus.selectedIndex = 0;

        formContainer.querySelectorAll('input,select').forEach(input => {
            if (input.classList.contains('requeridInput')) {
                input.classList.remove('requeridInput');
            }
        });
    }

    let validatePassword = () => {
        if (txtPassword.value != txtConfirmPassword.value) {
            txtPassword.classList.add('requeridInput');
            txtConfirmPassword.classList.add('requeridInput');
            txtPassword.focus();
            return 'Las contraseñas no coinciden';
        }
    }

    let validateUserName = () => {

        let userName = user.find(username => {
            return username.usuario.toLowerCase() == txtUser.value.toLowerCase();
        })

        if (userName) {
            txtUser.classList.add('requeridInput');
            showAlerbanner('warning', 'Ya el usuario esta creado')
            return true;
        }
        return false;
    }

    let validator = () => {

        if (userId == 0) {
            userName = validateUserName()
            return;
        };

        let resultado = (validateInputs())
            ? 'Faltan Parametros'
            : (validatePassword())
                ? 'Las contraseñas no coinciden'
                : 2

        let result = (validateInputs())
            ? 'Faltan Parametros'
            : validatePassword();

        if (result) {
            showAlerbanner('warning', result);
            return;
        }
        else if (userName) {
            return;
        }
    }

    function validarEmail(email) {
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)) {
            return;
        } else {
            showAlerbanner("warning", "La dirección de email no es correcta");
            txtEmail.classList.add('requeridInput');
        }
    }
    //#endregion functions
    //#region Events
    btnSaveUser.addEventListener('click', async function (e) {

        let userName

        if (userId == 0) {
            userName = validateUserName();
        }

        let result = (validateInputs()) ? 'Faltan Parametros' : validatePassword();
        
        if (result) {
            showAlerbanner('warning', result);
            return;
        }
        else if (userName) {
            return;
        }
        else {

            let formData = new FormData();
            formData.append('files', imgUserInput.files[0]);
            formData.append('usuarioId', userId);
            formData.append('nombre', txtName.value);
            formData.append('apellido', txtLastname.value);
            formData.append('cedula', txtCedula.value);
            formData.append('usuario', txtUser.value);
            formData.append('clave', txtPassword.value);
            formData.append('direccion', txtaddress.value);
            formData.append('correo', txtEmail.value);
            // formData.append('sucursalId', sucursal);
            formData.append('tipoUsuarioId', tipoUsuario);
            formData.append('estatusId', estatusUser);

            let result = (userId === 0)
                ? await showAcceptButtom('Desea crear el usuario?', `Se creara el usuario <b>${txtName.value}</b>`)
                : await showAcceptButtom('Desea editar?', `Se editara el usuario <b>${txtName.value}</b>`)
            if (result) {
                if (userId === 0) {
                    await fetch(urlUser, {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => {
                            console.log(response);
                            if (response.status === 200) {
                                window.loaderController.activate();
                                return response.json();
                            } else {
                                showAlerbanner('danger', `Error: ${response.status} ${response.statusText}`);
                                return;
                            }
                        })
                            .then(response => {
                                console.log(response);
                                fetch(urlUser).then(response => response.json()).then(response => user = response);

                                showAlerbanner('success', `Se ha creado ${response.nombre} con exito!`);

                                let key = user.length;
                                let div = document.createElement('div');
                                div.setAttribute('data-key', key);
                                div.classList.add('tr-body');
                                // <div class="td-body">${slSucursales.value}</div>
                                let td = `
                                    <div class="td-body">${response.usuarioId}</div>
                                    <div class="td-body">${response.nombre}</div> 
                                    <div class="td-body">${response.usuario}</div>
                                    <div class="td-body">${slTipoUsuario.value}</div>
                                    <div class="td-body">${slStatus.value}</div>
                                `;

                                div.insertAdjacentHTML('beforeend', td);
                                tbodyUsuarios.insertAdjacentElement('beforeend', div);

                                clearAllInputs();
                                window.loaderController.disable();

                            })
                } else {
                    window.loaderController.activate();
                    fetch(urlUser + userId, {
                        method: 'PUT',
                        body: formData
                    })
                        .then(response => {

                            if (response.status >= 400 && response.status <= 499) {
                                showAlerbanner('danger', `Error: ${response.status} ${response.statusText}`);
                            } else {
                                console.log(response);
                                let row = document.querySelector(`div[data-key="${globalKeyTableRow}"]`);
                                let items = row.querySelectorAll('div');

                                items[1].textContent = txtName.value;
                                items[2].textContent = txtUser.value;
                                items[3].textContent = slTipoUsuario.value;
                                items[4].textContent = slStatus.value;
                                clearAllInputs();

                                showAlerbanner('success', `Se ha actualizado el usuario ${txtName.value}`);
                                window.loaderController.disable();
                            }
                        })
                }

            }
        }

    });

    btnClearAll.addEventListener('click', clearAllInputs);

    btnSearchUser.addEventListener('click', showModal);

    bannerContainer.addEventListener('click', function (e) {
        if (e.target.matches('button#hideModal')) {
            hideAlertModal();
        }
    });

    imgContainer.addEventListener('click', e => imgUserInput.click());

    tbodyUsuarios.addEventListener('click', function (e) {

        formContainer.querySelectorAll('input,select').forEach(input => {
            if (input.classList.contains('requeridInput')) {
                input.classList.remove('requeridInput');
            }
        });
        globalKeyTableRow = e.target.parentElement.getAttribute('data-key');
        key = globalKeyTableRow;
        let id = user[key].usuarioId;

        fetch(urlUser + id)
            .then(res => res.json())
            .then(res => {

                let img = `api/usuario/imagen/${res.imagen}`;
                console.log(res.imagen);
                if (res.imagen != "") {
                    imgUser.setAttribute('src', img);
                } else {
                    imgUser.setAttribute('src', 'src/img/add_user.png');
                }

                userId = res.usuarioId;
                txtNumero.value = res.usuarioId;
                txtName.value = res.nombre;
                txtLastname.value = res.apellido;
                txtaddress.value = res.direccion;
                txtCedula.value = res.cedula;
                txtEmail.value = res.correo;
                txtUser.value = res.usuario;
                slTipoUsuario.selectedIndex = res.tipoUsuarioId;
                tipoUsuario = res.tipoUsuarioId;
                slStatus.selectedIndex = res.estatusId
                estatusUser = res.estatusId
            })
            state = "EDIT";
        hideModal();

    });

    imgUserInput.addEventListener('change', function (e) {

        imgRoot = e.target.files[0];
        let fileR = new FileReader;
        fileR.readAsDataURL(imgRoot);

        fileR.addEventListener('load', function (e) {
            imgUser.setAttribute("src", e.target.result);
        })
    });

    module_opened.addEventListener('change', function (e) {

        let key = e.target.selectedIndex - 1;

        // if (e.target.matches('select#slSucursales')) {
        //     if (key < 0) return;
        //     sucursal = sucursales[key].sucursalId;
        // }

        if (e.target.matches('select#slTipoUsuario')) {
            if (key < 0) return;
            tipoUsuario = userTypes[key].tipoUsuarioId;
        }

        if (e.target.matches('select#slStatus')) {
            if (key < 0) return;
            estatusUser = statusUser[key].estatusUsuarioId;
        }

        if (e.target.matches('input#txtUser')) {

            validateUserName();

        }

        if (e.target.matches('input#txtCedula')) {
            let maxNumberCharacter = 20;
            if (txtCedula.value.length > maxNumberCharacter) {
                showAlerbanner('warning','Cantidad de digitos excede el máximo');

                txtCedula.value = "";
            }
        }

        if (e.target.matches('input#txtEmail')) {
            validarEmail(txtEmail.value);
        }
    });

    module_opened.addEventListener('click', (e) => {
        if (e.target.matches('div.eye-content i')) {
            if (passStatus === 'hide') {
                txtPassword.setAttribute('type', 'text');
                txtConfirmPassword.setAttribute('type', 'text');
                module_opened.querySelectorAll('.eye-content i').forEach(icon => {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                })
                passStatus = 'show';
            } else {
                txtPassword.setAttribute('type', 'password');
                txtConfirmPassword.setAttribute('type', 'password');
                module_opened.querySelectorAll('.eye-content i').forEach(icon => {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                })
                passStatus = 'hide';
            }
        }
    })
    //#endregion Events
})()
