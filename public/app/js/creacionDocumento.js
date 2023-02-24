(()=>{
    //variables




    //id de los input
    let noDocument = document.getElementById('noDocument');
    let userCounter = document.getElementById('userCounter');
    let department = document.getElementById('department');
    let dateInput = document.getElementById('dateInput');
    let branch = document.getElementById('branch');
    let condition = document.getElementById('condition');
    let statusId = document.getElementById('statusId');

    //Id de los botones 
    let btnGuardar = document.getElementById('btnGuardar');
    let btnRegresar = document.getElementById('btnRegresar');


    //Guardar documento
    btnGuardar.addEventListener('click', function(){
        if(userCounter.options.selectedIndex != 0){
            if(department.options.selectedIndex !=0){
                if(branch.options.selectedIndex != 0){
                    if(condition.options.selectedIndex != 0){
                        alert('bien')
                    }else condition.focus();
                }else branch.focus();
            }else department.focus();
        }else userCounter.focus();
    })
})()