(( d,w )=>{

    let btnClearAll = d.getElementById('btnClearAll');
    let btnProcesar = d.getElementById('btnProcesar'); 
    let desde = d.getElementById('desde'); 
    let hasta = d.getElementById('hasta');

    function clearAllInputs(){
        desde.value = "";
        hasta.value = "";
    }

    btnProcesar.addEventListener('click',(e)=>{
        if(hasta.value < desde.value){
            alert('PEDIDO HASTA no puede ser menor que PEDIDO DESDE');
            return
        } 
        let opened = window.open('/views/continuous-impressions.html');
        localStorage.setItem("data", JSON.stringify({
            pedidoInicial: desde.value,
            pedidoFinal: hasta.value
        }))
        
        opened.addEventListener("afterprint",e=>{
            opened.close()
        })
    })
    btnClearAll.addEventListener('click',clearAllInputs)

})( document,window )   