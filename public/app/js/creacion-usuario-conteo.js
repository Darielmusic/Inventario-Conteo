(async()=>{
    
    history.pushState({},"","/home");

    let txtNumero = document.getElementById('txtNumero');
    let txtName = document.getElementById('txtName');
    let txtLastname = document.getElementById('txtLastname');
    let txtUser = document.getElementById('txtUser');
    let txtPassword = document.getElementById('txtPassword');
    let txtConfirmPassword = document.getElementById('txtConfirmPassword');
    let slStatus = document.getElementById('slStatus');

    let tableUser = document.getElementById('tableUser');
    let tbodyUsuarios = document.getElementById('tbodyUsuarios');

    let btnSearchUser = document.getElementById('btnSearchUser');
    let btnSaveUser = document.getElementById('btnSaveUser');

    let passStatus = 'hide';
    let idUsuario = 0;

    // let usuarios;
    // await fetch(``)
    //     .then(res =>{
    //         if(res.status >= 400) throw new Error('Error al hacer la peticion');
    //         return res.json();
    //     })
    //     .then(res=>{
    //         console.log(res);
    //         usuarios = res;
    //         tbodyUsuarios.textContent = ""; 
    //         let fragment = document.createDocumentFragment();
    //         for (let key in usuarios) {
    //             let element = usuarios[key];
    //             let div = document.createElement('div');
    //             div.setAttribute('data-key', key);
    //             div.classList.add('tr-body');
    //             // <div class="td-body">${user[key].sucursal}</div>
    //             let td = `
    //                             <div class="td-body">${element.usuarioId}</div>
    //                             <div class="td-body">${element.nombre}</div> 
    //                             <div class="td-body">${element.usuario}</div>
    //                             <div class="td-body">${element.tipoUsuario}</div> 
    //                             <div class="td-body">${element.estatus}</div>
    //                          `;
    //             div.insertAdjacentHTML('beforeend', td);
    //             tbodyUsuarios.insertAdjacentElement('beforeend', div);
    //         }

    //         fragment.append(tbodyUsuarios);
    //         tableUser.append(fragment);
    //     })

    let validatePassword = () => {
        if (txtPassword.value != txtConfirmPassword.value) {
            txtPassword.classList.add('requeridInput');
            txtConfirmPassword.classList.add('requeridInput');
            txtPassword.focus();
            return 'Las contraseñas no coinciden';
        }
    }

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
    
    btnSearchUser.addEventListener('click', showModal);

    btnSaveUser.addEventListener('click',async e=>{
        
        let passMessage = validatePassword();
        
        if(passMessage) showAlerbanner('danger',passMessage);

        let userObj = {
            id: (idUsuario == 0) ? 0 : usuarios.id,
            nombre: txtName.value,
            apellido: txtLastname.value,
            usurio: txtUser.value,
            clave: txtPassword.value,
            estatus: (Number(slStatus.value) === 1) ? true : false,
        }

        console.log(userObj)

        // if(userObj.id == 0){
        //     await fetch('url',{
        //         method:'POST',
        //         body: JSON.stringify(userObj),
        //         Headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //         .then(res=>{
        //             if(res.status >= 400) throw new Error('Error al hacer la peticion');
        //             return res.json();
        //         })
        //         .then(res=>{
        //             console.log(res);
        //         })
        // }else{
        //     await fetch('url',{
        //         method:'PUT',
        //         body: JSON.stringify(userObj),
        //         Headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //         .then(res=>{
        //             if(res.status >= 400) throw new Error('Error al hacer la peticion');
        //             return res.json();
        //         })
        //         .then(res=>{
        //             console.log(res);
        //         })
        // }

    })


})()
 