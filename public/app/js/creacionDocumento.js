(()=>{
    history.pushState({},"","/home");
    //variables




    //id de los input
    let noDocument = document.getElementById('noDocument');
    let userCounter = document.getElementById('userCounter');
    let department = document.getElementById('department');
    let dateInput = document.getElementById('dateInput');
    let branch = document.getElementById('branch');
    let condition = document.getElementById('condition');
    let statusId = document.getElementById('statusId');

    dateInput.value = new Date().toISOString().substring(0,10)
    //Id de los botones 
    let btnGuardar = document.getElementById('btnGuardar');
    let btnRegresar = document.getElementById('btnRegresar');

    //Abrir modal
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

    //Guardar documento
    btnGuardar.addEventListener('click', function(){
        if(userCounter.options.selectedIndex != 0){
            if(department.options.selectedIndex !=0){
                if(branch.options.selectedIndex != 0){
                    if(condition.options.selectedIndex != 0){
                        let obj = {
                            "userCounter": userCounter.options.selectedIndex,
                            "department": department.options.selectedIndex,
                            "branch": branch.options.selectedIndex,
                            "condition": condition.options.selectedIndex,
                            "statusId": statusId.options.selectedIndex,
                            "dateInput": dateInput.value
                        }
                        showAlerbanner('success', 'El documento fue agregado correctamente')
                        console.log(obj);
                        // try {
                        //     fetch(`${baseURL}`,{
                        //         method: 'POST',
                        //         body: {}
                        //     })
                        // } catch (error) {
                            
                        // }
                    }else condition.focus();
                }else branch.focus();
            }else department.focus();
        }else userCounter.focus();
    })

    btnRegresar.addEventListener('click', function(){
        window.insertModule('tienda')
    })
})()