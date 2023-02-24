(async () => {
  // inputs
  //NEW - PROCESS
  window.ProductModal.setEndCallback(null);
  let cart = [];
  let num = null;
  let state = "NEW";
  let pedidoModel = {
    pedidoInternoId: 0,
    pedidoNo: 0,
    sucursalFuenteId: 1,
    fuente: "",
    sucursalDestinoId: 1,
    destino: "",
    usuarioId: 0,
    usuario: "",
    estatusId: 0,
    estatus: "",
    fecha: "",
    nota: "MODO PRUEBA",
    total: 0,
  };
  let pedidoErrorList = [];
  let allowToDelete = true;
  let current = null;
  if (!localStorage.getItem("errPed")) {
    localStorage.setItem("errPed", JSON.stringify([]));
  }
  await fetch("/api/pedido/0?estatusId=1")
    .then((res) => {
      if (res.status >= 400) {
        showAlertModal(
          "danger",
          "No se pudo verificar si hay pedidos pendientes"
        );
        return false;
      }
      return res.json();
    })
    .then((res) => {
      if (res?.length > 1 && !(res instanceof Array)) {
        showAlertModal(
          "danger",
          "Existen mas de un pedido en proceso, debe ser verificado por el soporte de sistema."
        );
        return;
      } else if (res?.length == 0) {
        current = null;
        num = null;
        return;
      } else {
        showAlerbanner(
          "warning",
          "Existe un pedido en curso: # " + res[0].pedidoInternoId
        );
        current = res[0].pedidoInternoId;
        num = res[0].pedidoInternoId;
      }
    });

  let artManualSelected = false;
  let selectedSucursal = userInfo.sucursalId;

  let numberFormatter = Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  //#region variables de elementos
  let txtDocument = document.getElementById("txtDocument");
  let txtCurrentDate = document.getElementById("txtCurrentDate");
  // =let txtCurrentStore = document.getElementById("txtCurrentStore");
  let selectCurrentStore = document.getElementById("selectCurrentStore");
  let txtOtherStore = document.getElementById("txtOtherStore");
  let txtEstatus = document.getElementById("txtEstatus");
  let txtCodigoBarra = document.getElementById("txtCodigoBarra");

  txtCurrentDate.value = new Date().toISOString().substring(0, 10);

  let txtDescripcionPanel = document.getElementById("txtDescripcionPanel");

  let txtSuplidorPanel = document.getElementById("txtSuplidorPanel");

  let txtCostoPanel = document.getElementById("txtCostoPanel");

  let txtExistenRemota = document.getElementById("txtExistenRemota");

  let txtCantidadPanel = document.getElementById("txtCantidadPanel");

  // Table
  let tablePedidos = document.getElementById("tablePedidos");
  let tbodyPedidos = document.getElementById("tbodyPedidos");
  let tfootPedidos = document.getElementById("tfootPedidos");

  history.pushState({}, "", "/home");
  // buttons
  let btnSearchArticule = document.getElementById("btnSearchArticule");
  let btnClearAll = document.getElementById("btnClearAll");
  let btnSave = document.getElementById("btnSave");
  //#endregion
  // INITIAL DATA
  selectCurrentStore.addEventListener("change", (e) => {
    if (e.target.value <= 0) return;
    selectedSucursal = e.target.value;
  });
  async function initialWithInProgress(current) {
    if (current) {
      let pedido = await fetch(`/api/pedido/pedidogeneral/${current}`).then(
        (res) => res.json()
      );

      cart = pedido.pedidoInternoDetalle;

      // selectCurrentStore.value = pedido.sucursalFuenteId;
      txtDocument.value = pedido.pedidoInternoId;
      txtEstatus.value = "EN PROCESO";
      state = "PROGRESS";
      selectCurrentStore.disabled = true;
      // selectedSucursal = pedido.sucursalFuenteId;
      window.ProductModal.result = cart;
      let fragmento = document.createDocumentFragment();
      for (let i in cart) {
        let clone = document
          .getElementById("template_tr_pedido")
          .content.firstElementChild.cloneNode(true);
        clone.setAttribute("data-index",i)
        clone.setAttribute("data-tag",cart[i].codigoBarra)
        clone.querySelector("button").setAttribute("data-target", i);
        let spans = clone.querySelectorAll("span");
        spans[0].innerText = cart[i].codigoBarra;
        spans[1].innerText = cart[i].descripcion;
        spans[2].innerText = cart[i].existenciaRemota;
        spans[3].innerText = cart[i].cantidad;
        spans[4].innerText = numberFormatter.format(cart[i].costoUnitario);

        spans[6].innerText = numberFormatter.format(
          Number(Number(cart[i].costoUnitario) * Number(cart[i].cantidad))
        );
        fragmento.append(clone);
      }
      tbodyPedidos.append(fragmento);
    }
  }
  initialWithInProgress(current);

  // fetch("/api/sucursales")
  //   .then((res) => res.json())
  //   .then((res) => {
  //     let fragment = document.createDocumentFragment();
  //     for (let sucursal of res) {
  //       if (sucursal.sucursalId == 1) continue;
  //       let option = document.createElement("option");
  //       option.value = sucursal.sucursalId;
  //       option.innerText = sucursal.descripcion;
  //       fragment.append(option);
  //     }
  //     selectCurrentStore.append(fragment);
  //   });

  // FUNCTIONS
  async function onEnd(result) {
    if (result.length < 1) return;

    if (state == "NEW") {
      let newPedido = { ...pedidoModel };
      newPedido.usuarioId = window.userInfo.usuarioId;
      newPedido.sucursalFuenteId = userInfo.sucursalId;

      try {
        num = await fetch("/api/pedido/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPedido),
        })
          .then((res) => {
            if (res.status >= 400) throw new Error("Error al crear el pedido");
            return res.text();
          })
          .catch((err) => {
            if (err) throw new Error("Error al crear pedido");
          });

        if (num) {
          
          
          txtEstatus.value = "EN PROCESO";
          txtDocument.value = num;
          selectCurrentStore.disabled = true;
          let fragmento = document.createDocumentFragment();
          let denegado = false;
          for (let i in result) {
            for(let articleCart of cart){
              if(articleCart?.CodigoBarra == result[i].CodigoBarra ||articleCart?.codigoBarra == result[i].CodigoBarra) denegado = true;
            }

            if(denegado){
              showAlerbanner("warning", `El articulo: ${result[i].CodigoBarra}, ya se encontraba en el pedido.`)
              continue;
            }
            let clone = document
              .getElementById("template_tr_pedido")
              .content.firstElementChild.cloneNode(true);

            await fetch(`/api/pedido/insertaarticulo/${num}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                codigoBarra: result[i].CodigoBarra,
                existenciaLocal: 0,
                existenciaRemota: result[i].ExistenciaRemota,
                cantidad: result[i].Quantity,
                sucursalDestinoId: 1,
                sucursalFuenteId: selectedSucursal,
              }),
            })
              .then((res) => {
                if (res.status >= 400)
                  throw new Error(
                    "Error al insertar articulos el pedido deberia ser borrar para evitar alteraciones a inventario."
                  );
                return res.json();
              })
              .then((res) => {
                if (res[0].estado == 3) {
                  result[i].Quantity = res[0].insertado;
                  cart.push(result[i]);
                  clone.setAttribute("data-index", i);
                  clone.setAttribute("data-tag",result[i].CodigoBarra);
                  clone.querySelector("button").setAttribute("data-target", i);
                  let spans = clone.querySelectorAll("span");
                  spans[0].innerText = result[i].CodigoBarra;
                  spans[1].innerText = result[i].Descripcion;
                  spans[2].innerText = result[i].ExistenciaRemota;
                  spans[3].innerText = result[i].Quantity;
                  spans[4].innerText = numberFormatter.format(result[i].Costo);
                  spans[5].innerText = result[i].Suplidor;
                  spans[6].innerText = numberFormatter.format(
                    Number(Number(result[i].Costo) * Number(result[i].Quantity))
                  );
                  fragmento.append(clone);
                  showAlerbanner(
                    "success",
                    `el articulo: ${result[i].Descripcion}, fue agregado correctamente.`
                  );
                } else if (res[0].estado == 7) {
                  result[i].Quantity = res[0].insertado;
                  cart.push(result[i]);
                  clone.setAttribute("data-index", i);
                  clone.setAttribute("data-tag",result[i].CodigoBarra);
                  clone.querySelector("button").setAttribute("data-target", i);
                  let spans = clone.querySelectorAll("span");
                  spans[0].innerText = result[i].CodigoBarra;
                  spans[1].innerText = result[i].Descripcion;
                  spans[2].innerText = result[i].ExistenciaRemota;
                  spans[3].innerText = result[i].Quantity;
                  spans[4].innerText = numberFormatter.format(result[i].Costo);
                  spans[5].innerText = result[i].Suplidor;
                  spans[6].innerText = numberFormatter.format(
                    Number(Number(result[i].Costo) * Number(result[i].Quantity))
                  );
                  fragmento.append(clone);
                  showAlerbanner(
                    "warning",
                    `el articulo: ${result[i].Descripcion}, fue agregado con diferente cantidad.`
                  );
                } else if (res[0].estado == 8) {
                  showAlerbanner(
                    "danger",
                    `el articulo: ${result[i].Descripcion}, no fue agregado al pedido.`
                  );
                }
                fragmento.append(clone);
              });
          }
          tbodyPedidos.append(fragmento);
          state = "PROGRESS";
        }
      } catch (error) {}
    } else {
      if (num && state == "PROGRESS") {
        txtEstatus.value = "EN PROCESO";
        txtDocument.value = num;
        selectCurrentStore.disabled = true;
        let fragmento = document.createDocumentFragment();
        try {
          for (let i in result) {
            let denegado = false;
            for(let articleCart of cart){
              if(articleCart?.CodigoBarra == result[i].CodigoBarra ||articleCart?.codigoBarra == result[i].CodigoBarra) denegado = true;
            }
            console.log(denegado);
            if(denegado){
              showAlerbanner("warning", `El articulo: ${result[i].CodigoBarra}, ya se encontraba en el pedido.`)
              continue;
            }
            let clone = document
              .getElementById("template_tr_pedido")
              .content.firstElementChild.cloneNode(true);

            await fetch(`/api/pedido/insertaarticulo/${num}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                codigoBarra: result[i].CodigoBarra,
                existenciaLocal: 0,
                existenciaRemota: result[i].ExistenciaRemota,
                cantidad: result[i].Quantity,
                sucursalDestinoId: 1,
                sucursalFuenteId: selectedSucursal,
              }),
            })
              .then((res) => {
                if (res.status >= 400) {
                 
                  showAlerbanner(
                    "warning",
                    `Codigo: ${result[i].CodigoBarra}, Elimine el articulo antes de cambiar la cantidad.`
                  );
                  result.splice(i, 1);
                  return [{ estado: 0 }];
                }
                return res.json();
              })
              .then((res) => {
                if (res[0].estado == 3) {
                  result[i].Quantity = res[0].insertado;
                  cart.push(result[i]);
                  clone.setAttribute("data-index", i);
                  clone.setAttribute("data-tag",result[i].CodigoBarra);
                  clone.querySelector("button").setAttribute("data-target", i);
                  let spans = clone.querySelectorAll("span");
                  spans[0].innerText = result[i].CodigoBarra;
                  spans[1].innerText = result[i].Descripcion;
                  spans[2].innerText = result[i].ExistenciaRemota;
                  spans[3].innerText = result[i].Quantity;
                  spans[4].innerText = numberFormatter.format(result[i].Costo);
                  spans[5].innerText = result[i].Suplidor;
                  spans[6].innerText = numberFormatter.format(
                    Number(Number(result[i].Costo) * Number(result[i].Quantity))
                  );
                  fragmento.append(clone);
                  showAlerbanner(
                    "success",
                    `el articulo: ${result[i].Descripcion}, fue agregado correctamente.`
                  );
                } else if (res[0].estado == 7) {
                  result[i].Quantity = res[0].insertado;
                  cart.push(result[i]);
                  clone.setAttribute("data-index", i);
                  clone.setAttribute("data-tag",result[i].CodigoBarra);
                  clone.querySelector("button").setAttribute("data-target", i);
                  let spans = clone.querySelectorAll("span");
                  spans[0].innerText = result[i].CodigoBarra;
                  spans[1].innerText = result[i].Descripcion;
                  spans[2].innerText = result[i].ExistenciaRemota;
                  spans[3].innerText = result[i].Quantity;
                  spans[4].innerText = numberFormatter.format(result[i].Costo);
                  spans[5].innerText = result[i].Suplidor;
                  spans[6].innerText = numberFormatter.format(
                    Number(Number(result[i].Costo) * Number(result[i].Quantity))
                  );
                  fragmento.append(clone);
                  showAlerbanner(
                    "warning",
                    `el articulo: ${result[i].Descripcion}, fue agregado con diferente cantidad.`
                  );
                } else if (res[0].estado == 8) {
                  showAlerbanner(
                    "danger",
                    `el articulo: ${result[i].Descripcion}, no fue agregado al pedido.`
                  );
                }
              });
          }
        } catch (error) {
          if (error) {
            showAlerbanner(
              "warning",
              `Codigo: ${result[i].CodigoBarra}, ${error.message}`
            );
            result.splice(i, 1);
          }
        }
        tbodyPedidos.append(fragmento);
        state = "PROGRESS";
      }
    }
  }

  window.ProductModal.setEndCallback(onEnd);

  //EVENTS
  txtCodigoBarra.addEventListener("change", async (e) => {
    if (e.target.value.length < 1) return;
    try {
      let articulo = await fetch(`/api/articulo/byId/${e.target.value}`)
        .then((res) => {
          if (res.status >= 400)
            throw new Error("Error al buscar el articulo por codigo de barra.");
          return res.json();
        })
        .catch((err) => {
          if (err) throw new Error(err);
        });
      if (articulo.length < 1) throw new RangeError("Articulo no encontrado");
      articulo = articulo[0];

      if (articulo) {
        if (articulo.ExistenciaRemota < 1) {
          showAlerbanner(
            "warning",
            "El articulo no tiene cantidad remota suficiente."
          );
          return;
        }
        txtDescripcionPanel.value = articulo.Descripcion;
        txtSuplidorPanel.value = articulo.Suplidor;
        txtCostoPanel.value = numberFormatter.format(articulo.Costo);
        txtExistenRemota.value = articulo.ExistenciaRemota;
        txtCantidadPanel.focus();
        artManualSelected = articulo;
      }
    } catch (err) {
      if (err.name == "RangeError") {
        showAlerbanner("danger", err.message);
      } else {
        showAlertModal("danger", err.message);
      }
    }
  });

  txtCantidadPanel.addEventListener("change", async (e) => {
    if (artManualSelected) {
      try {
        if (state == "NEW") {
          let newPedido = { ...pedidoModel };
          newPedido.usuarioId = window.userInfo.usuarioId;
          newPedido.sucursalFuenteId = selectCurrentStore.value;
          num = await fetch("/api/pedido/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPedido),
          })
            .then((res) => {
              if (res.status >= 400)
                throw new Error("Error al crear el pedido");
              return res.text();
            })
            .catch((err) => {
              if (err) throw new Error("Error al crear pedido");
            });

          if (num) {
            txtEstatus.value = "EN PROCESO";
            txtDocument.value = num;
            selectCurrentStore.disabled = true;
            let fragmento = document.createDocumentFragment();
            let clone = document
              .getElementById("template_tr_pedido")
              .content.firstElementChild.cloneNode(true);

            await fetch(`/api/pedido/insertaarticulo/${num}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                codigoBarra: artManualSelected.CodigoBarra,
                existenciaLocal: 0,
                existenciaRemota: artManualSelected.ExistenciaRemota,
                cantidad: e.target.value,
                sucursalDestinoId: 1,
                sucursalFuenteId: selectedSucursal,
              }),
            })
              .then((res) => {
                if (res.status >= 400)
                  throw new Error(
                    "Error al insertar articulos el pedido deberia ser borrar para evitar alteraciones a inventario."
                  );
                return res.json();
              })
              .then((res) => {
                if (res[0].estado == 3) {
                  artManualSelected.Quantity = res[0].insertado;

                  clone
                    .querySelector("button")
                    .setAttribute("data-target", cart.length);
                  clone.setAttribute("data-index", cart.length);
                  clone.setAttribute("data-tag", artManualSelected.CodigoBarra);
                  cart.push(artManualSelected);
                  let spans = clone.querySelectorAll("span");
                  spans[0].innerText = artManualSelected.CodigoBarra;
                  spans[1].innerText = artManualSelected.Descripcion;
                  spans[2].innerText = artManualSelected.ExistenciaRemota;
                  spans[3].innerText = artManualSelected.Quantity;
                  spans[4].innerText = numberFormatter.format(
                    artManualSelected.Costo
                  );
                  spans[5].innerText = artManualSelected.Suplidor;
                  spans[6].innerText = numberFormatter.format(
                    Number(
                      Number(artManualSelected.Costo) *
                        Number(artManualSelected.Quantity)
                    )
                  );
                  fragmento.append(clone);
                  showAlerbanner(
                    "success",
                    `el articulo: ${artManualSelected.Descripcion}, fue agregado correctamente.`
                  );
                } else if (res[0].estado == 7) {
                  artManualSelected.Quantity = artManualSelected.insertado;
                  clone
                    .querySelector("button")
                    .setAttribute("data-target", cart.length);
                  clone.setAttribute("data-index", cart.length);
                  clone.setAttribute("data-tag", artManualSelected.CodigoBarra);
                  cart.push(artManualSelected);
                  let spans = clone.querySelectorAll("span");
                  spans[0].innerText = artManualSelected.CodigoBarra;
                  spans[1].innerText = artManualSelected.Descripcion;
                  spans[2].innerText = artManualSelected.ExistenciaRemota;
                  spans[3].innerText = artManualSelected.Quantity;
                  spans[4].innerText = numberFormatter.format(
                    artManualSelected.Costo
                  );
                  spans[5].innerText = artManualSelected.Suplidor;
                  spans[6].innerText = numberFormatter.format(
                    Number(
                      Number(artManualSelected.Costo) *
                        Number(artManualSelected.Quantity)
                    )
                  );
                  fragmento.append(clone);
                  showAlerbanner(
                    "warning",
                    `el articulo: ${artManualSelected.Descripcion}, fue agregado con diferente cantidad.`
                  );
                } else if (res[0].estado == 8) {
                  showAlerbanner(
                    "danger",
                    `el articulo: ${result[i].Descripcion}, no fue agregado al pedido.`
                  );
                }
              });

            tbodyPedidos.append(fragmento);
            state = "PROGRESS";
          }
        } else {
          if (num && state == "PROGRESS") {
            let fragmento = document.createDocumentFragment();
            let clone = document
              .getElementById("template_tr_pedido")
              .content.firstElementChild.cloneNode(true);

            await fetch(`/api/pedido/insertaarticulo/${num}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                codigoBarra: artManualSelected.CodigoBarra,
                existenciaLocal: 0,
                existenciaRemota: artManualSelected.ExistenciaRemota,
                cantidad: e.target.value,
                sucursalDestinoId: 1,
                sucursalFuenteId: selectedSucursal,
              }),
            })
              .then((res) => {
                if (res.status >= 400)
                  throw new Error(
                    "Error al insertar articulos el pedido deberia ser borrar para evitar alteraciones a inventario."
                  );
                return res.json();
              })
              .then((res) => {
                if (res[0].estado == 3) {
                  artManualSelected.Quantity = res[0].insertado;
                  cart.push(artManualSelected);
                  clone
                    .querySelector("button")
                    .setAttribute("data-target", cart.length);
                    clone.setAttribute("data-index", cart.length);
                    clone.setAttribute("data-tag", artManualSelected.CodigoBarra);
                  let spans = clone.querySelectorAll("span");
                  spans[0].innerText = artManualSelected.CodigoBarra;
                  spans[1].innerText = artManualSelected.Descripcion;
                  spans[2].innerText = artManualSelected.ExistenciaRemota;
                  spans[3].innerText = artManualSelected.Quantity;
                  spans[4].innerText = numberFormatter.format(
                    artManualSelected.Costo
                  );
                  spans[5].innerText = artManualSelected.Suplidor;
                  spans[6].innerText = numberFormatter.format(
                    Number(
                      Number(artManualSelected.Costo) *
                        Number(artManualSelected.Quantity)
                    )
                  );
                  fragmento.append(clone);
                  showAlerbanner(
                    "success",
                    `el articulo: ${artManualSelected.Descripcion}, fue agregado correctamente.`
                  );
                } else if (res[0].estado == 7) {
                  artManualSelected.Quantity = res[0].insertado;
                  clone
                    .querySelector("button")
                    .setAttribute("data-target", cart.length);
                    clone.setAttribute("data-index", cart.length);
                    clone.setAttribute("data-tag", artManualSelected.CodigoBarra);
                  cart.push(artManualSelected);
                  let spans = clone.querySelectorAll("span");
                  spans[0].innerText = artManualSelected.CodigoBarra;
                  spans[1].innerText = artManualSelected.Descripcion;
                  spans[2].innerText = artManualSelected.ExistenciaRemota;
                  spans[3].innerText = artManualSelected.Quantity;
                  spans[4].innerText = numberFormatter.format(
                    artManualSelected.Costo
                  );
                  spans[5].innerText = artManualSelected.Suplidor;
                  spans[6].innerText = numberFormatter.format(
                    Number(
                      Number(artManualSelected.Costo) *
                        Number(artManualSelected.Quantity)
                    )
                  );
                  fragmento.append(clone);
                  showAlerbanner(
                    "warning",
                    `el articulo: ${artManualSelected.Descripcion}, fue agregado con diferente cantidad.`
                  );
                } else if (res[0].estado == 8) {
                  showAlerbanner(
                    "danger",
                    `el articulo: ${result[i].Descripcion}, no fue agregado al pedido.`
                  );
                }
              });

            tbodyPedidos.append(fragmento);
            state = "PROGRESS";
          }
        }
        txtCodigoBarra.value = "";
        txtDescripcionPanel.value = "";
        txtSuplidorPanel.value = "";
        txtCostoPanel.value = "";
        txtExistenRemota.value = "";
        txtCodigoBarra.focus();
        artManualSelected = false;
        txtCantidadPanel.value = "";
      } catch (error) {
        if (error) {
          let errs = JSON.parse(localStorage.getItem("errPed"));
          errs.push({
            type: "Insertar Manual",
            error: error,
          });
          localStorage.setItem("errPed",JSON.stringify(errs))
        }
      }
    }
  });

  btnSearchArticule.addEventListener("click", (e) => {
    e.preventDefault();
    if (window.ProductModal) {
      ProductModal.modalFilter.classList.add("active");
      ProductModal.handlingState = true;
    }
  });

  btnSave.addEventListener("click", (e) => {});

  document.addEventListener("click", async (e) => {
    if(!(allowToDelete) && e.target.matches(".btn-delete-item") ) {
      showAlerbanner("warning", `Aun no puede eliminar otro articulo`);
      return
    }else if(!(allowToDelete) && e.target.matches(".btn-delete-item")) {
      showAlerbanner("warning", `Aun no puede eliminar otro articulo`);
      return
    }
    if (e.target.matches(".btn-delete-item") && allowToDelete) {
      allowToDelete = false;
      try {
        let key = e.target.getAttribute("data-target");
        let result = await fetch(`/api/pedido/eliminaarticulo/${num}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            codigoBarra: cart[key]?.CodigoBarra || cart[key].codigoBarra,
            sucursalDestinoId: 1,
            sucursalFuenteId: selectedSucursal,
          }),
        }).then((res) => {
          return res.json();
        });

        if (result) {
          cart.splice(key, 1);
          e.target.parentElement.parentElement.remove();
          let found = false;
          let rows = tablePedidos.querySelectorAll(".tr-body")
          rows.forEach((art,i) => {
            let index = Number(art.getAttribute("data-index"));
            let tag = art.getAttribute("data-tag");
            if(Number.isNaN(index)) throw new Error("Error con el index del articulo");
            
            if(index > cart.length){
              for(let ind in cart){
                if(cart[ind]?.CodigoBarra == tag || cart[ind].codigoBarra == tag){
                  art.setAttribute("data-index",ind);
                  art.querySelector("button").setAttribute("data-target",ind)
                  if(i == (cart.length - 1)){
                    found = true;
                    break;
                  }
                }else{
                }
              }
            }
            else{
              for(let ind in cart){
                if(cart[ind]?.CodigoBarra == tag || cart[ind].codigoBarra == tag){
                  art.setAttribute("data-index",ind);
                  art.querySelector("button").setAttribute("data-target",ind)
                  if(i == (cart.length - 1)){
                    found = true;
                    break;
                  }
                }else{
                }
              }
            }
            
          });
          if(found){
            setTimeout(()=>{
              allowToDelete = true;
            },300)
            showAlerbanner(
              "warning",
              `El articulo fue eliminado del pedido.`
            );
          }else if(!found && cart.length == 0){
            
            setTimeout(()=>{
              allowToDelete = true;
            },300)
            showAlerbanner(
              "warning",
              `El articulo fue eliminado del pedido. el pedido no tiene items.`
            );
          }
          
        }
      } catch (err) {
        allowToDelete = true;
        let errs = JSON.parse(localStorage.getItem("errPed"));
        errs.push({
          type: "Eliminar",
          error: err,
        });
        localStorage.setItem("errPed",JSON.stringify(errs))
        showAlerbanner("danger", `Error al elminar el articulo.`);
      }
    } else if (e.target.matches(".btn-delete-item i") && allowToDelete) {
      allowToDelete = false;
      let key = e.target.parentElement.getAttribute("data-target");
      try {
        let result = await fetch(`/api/pedido/eliminaarticulo/${num}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            codigoBarra: cart[key]?.CodigoBarra || cart[key].codigoBarra,
            sucursalDestinoId: 1,
            sucursalFuenteId: selectedSucursal,
          }),
        }).then((res) => {
          return res.json();
        });
       
        if (result) {
          cart.splice(key, 1);
          e.target.parentElement.parentElement.parentElement.remove();
          let found = false;
          let rows = tablePedidos.querySelectorAll(".tr-body")
          rows.forEach((art,i) => {
            let index = Number(art.getAttribute("data-index"));
            let tag = art.getAttribute("data-tag");
            if(Number.isNaN(index)) throw new Error("Error con el index del articulo");
            
            if(index > cart.length){
              for(let ind in cart){
                if(cart[ind]?.CodigoBarra == tag || cart[ind].codigoBarra == tag){
                  art.setAttribute("data-index",ind);
                  art.querySelector("button").setAttribute("data-target",ind)
                  if(i == (cart.length - 1)){
                    found = true;
                    break;
                  }
                }else{
                }
              }
            }
            else{
              for(let ind in cart){
                if(cart[ind]?.CodigoBarra == tag || cart[ind].codigoBarra == tag){
                  art.setAttribute("data-index",ind);
                  art.querySelector("button").setAttribute("data-target",ind)
                  
                  if(i == (cart.length - 1)){
                    found = true;
                    break;
                  }
                }else{
                }
              }
            }
            
          });
          if(found){
            setTimeout(()=>{
              allowToDelete = true;
            },300)
            
            showAlerbanner(
              "warning",
              `El articulo fue eliminado del pedido.`
            );
          }else if(!found && cart.length == 0){
            e.target.parentElement.parentElement.parentElement.remove();
            setTimeout(()=>{
              allowToDelete = true;
            },300)
            showAlerbanner(
              "warning",
              `El articulo fue eliminado del pedido, el pedido no tiene items.`
            );
          }
        }
      } catch (error) {
        allowToDelete = true;
        let errs = JSON.parse(localStorage.getItem("errPed"));
        errs.push({
          type: "Eliminar",
          error: error,
        });
        localStorage.setItem("errPed",JSON.stringify(errs))
        showAlerbanner("danger", `Error al elminar el articulo.`);
      }
      
    } 
  });
  //MODO DE INICIO CON NUMERO DE DOCUMENTO
  // if (numDoc > 0) alert(numDoc);
})();
