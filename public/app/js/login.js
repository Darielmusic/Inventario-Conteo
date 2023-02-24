(async (d, w) => {
    let btnlogin = d.getElementById('btnlogin');
    let formlogin = d.getElementById('form-login');
    let txtuser = d.getElementById('txtuser');
    let txtpass = d.getElementById('txtpass');
    let wrongPassSpan = d.getElementById('wrongPassSpan');
    let passStatus = 'hide';

    function setCookie(nombre, valor) {
        document.cookie = nombre + "=" + valor + ";path=/";
    } 
    formlogin.addEventListener('keydown', (e) => {
        wrongPassSpan.style.opacity = 0;
    })
    formlogin.addEventListener('submit', async function (e) {
        e.preventDefault();

        let userInfo = {
            usuario: txtuser.value,
            clave: txtpass.value,

        }
        fetch('/api/usuario/valida', {
            method: 'POST',
            body: JSON.stringify(userInfo),
            headers: { "Content-Type": "application/json" }
        })
            .then(response =>{
                console.log(response);
                if(response.status == 200){
                    return response.json();
                }else{
                    wrongPassSpan.style.opacity = 1;
                    return;
                }
            })
            .then(response => {
                if (response.redirect) {
                    setCookie('userToken',response.usuarioId);
                    setCookie('userType',response.tipoUsuarioId);
                    location.assign(response.redirect);
                }
            })
    })
    formlogin.addEventListener('click', (e) => {
        if (e.target.matches('div.eye-content i')) {
            if (passStatus === 'hide') {
                txtpass.setAttribute('type', 'text');
                e.target.classList.remove('fa-eye-slash');
                e.target.classList.add('fa-eye');
                passStatus = 'show';
            } else {
                txtpass.setAttribute('type', 'password');
                e.target.classList.remove('fa-eye');
                e.target.classList.add('fa-eye-slash');
                passStatus = 'hide';
            }
        }
    })

})(document, window)