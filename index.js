fetch("./info.json")
    .then(response => response.json())
    .then(productos => principal(productos))
    .catch(error => error(error))

function principal (productos){
    let buscador = document.getElementById("buscador")
    let botonBuscar = document.getElementById("botonBuscar")
    let botonHombres = document.getElementById("hombres")
    let botonMujeres = document.getElementById("mujeres")
    let botonTodos = document.getElementById("botonTodos")
    let botonInicio = document.getElementById("inicio")
    let cesta = crearCesta ()
    renderCesta(cesta)

    let verCesta = document.getElementById("verCesta")
    verCesta.addEventListener("click", ocultarCesta)
    botonBuscar.addEventListener("click", () => filtrarProductos(productos, buscador.value.toLowerCase()))
    buscador.addEventListener("keydown", function(tecla){
        tecla.key == "Enter" && filtrarProductos(productos,buscador.value.toLowerCase())
        }
    )
    botonInicio.addEventListener("click", paginaInicio)
    botonTodos.addEventListener("click", () => creadorElementos(productos))
    botonHombres.addEventListener("click", () => filtroGenero(productos, "hombre"))
    botonMujeres.addEventListener("click", () => filtroGenero(productos, "mujer"))
    // filtrarProductos(productos,buscador.value)
    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", () => comprar(crearCesta()))
    console.log(cesta.length)
}

function ocultarCesta (e) {
    let inicio = document.getElementById("paginaInicio")
    let contenedorProductos = document.getElementById("contenedor")
    let cajaCesta = document.getElementById("paginaCesta")

    e.target.innerText == "Ver cesta" ? e.target.innerText = "Seguir comprando" : e.target.innerText = "Ver cesta"

    inicio.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")
    cajaCesta.removeAttribute("style")
    cajaCesta.classList.toggle("oculto")
}

function creadorElementos (productos){
    let inicio = document.getElementById("paginaInicio")
    inicio.innerHTML=`
    `
    let contenedorProductos = document.getElementById("contenedor")
    contenedorProductos.removeAttribute("style")
    contenedorProductos.innerHTML= ""
    productos.forEach(producto => {
        contenedorProductos.innerHTML += `
            <div class=producto>
                <img src=${producto.imagen} class=imagenProducto>
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <button id="${producto.id}">Agregar a la cesta</button>
            </div>
        `
    })

    productos.forEach(producto => {
        let botonAgregarCesta = document.getElementById(producto.id)
        botonAgregarCesta.addEventListener("click", (e) => agregarCesta(e,productos))
    })
}

function comprar (cesta){
    if(cesta.length != 0){
        localStorage.removeItem("cesta")
        renderCesta([])
        compraFinalizada("Gracias por tu compra")
    } else {
        compraErronea("No has añadido nada a la cesta")
    }
}

function filtrarProductos (productos, valor){
    let contenedorProductos = document.getElementById("contenedor")
    contenedorProductos.removeAttribute("style", "display:none")
    let inicio = document.getElementById("paginaInicio")
    inicio.setAttribute("stye", "none")
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(valor))
    creadorElementos(productosFiltrados)

    if (productosFiltrados.length === 0) {
        let contenedorProductos = document.getElementById("contenedor");
        contenedorProductos.innerHTML = `
            <h3>¡Ups! No encontramos lo que buscas</h3>
        `;
    }
}

function filtroGenero (productos,genero){
    let productosFiltrados = productos.filter(producto => producto.genero.toLowerCase() == genero || producto.genero.toLowerCase() == "ambos")
    creadorElementos(productosFiltrados)

    if (productosFiltrados.length === 0) {
        let contenedorProductos = document.getElementById("contenedor");
        contenedorProductos.innerHTML = `
            <h3>¡Ups! No encontramos lo que buscas</h3>
        `;
    }
}

function crearCesta () {
    let cesta = []
    if(localStorage.getItem("cesta")){
        cesta = JSON.parse(localStorage.getItem("cesta"))
    }
    return cesta
}

function agregarCesta (e, productos) {
    let cesta = crearCesta ()
    let idProducto = String(e.target.id)
    let productoEncontrado = productos.find(producto => producto.id == idProducto)
    let indiceProductoEncontrado = cesta.findIndex(producto => producto.id == idProducto)

    let contenedorPopups = document.getElementById("contenedorPopups")

    popupCesto(productoEncontrado)

    if (indiceProductoEncontrado != -1) {
        cesta[indiceProductoEncontrado].cantidad ++
        cesta[indiceProductoEncontrado].subtotal = cesta[indiceProductoEncontrado].precio * cesta[indiceProductoEncontrado].cantidad
    } else {
        cesta.push ({
            id: productoEncontrado.id,
            nombre: productoEncontrado.nombre,
            precio: productoEncontrado.precio,
            cantidad: 1,
            subtotal: productoEncontrado.precio,
        })
    }

    guardarCesta(cesta)
    renderCesta(cesta)
}

function renderCesta (cesta){
    let cajaCesta = document.getElementById("cajaCesta")
    cajaCesta.innerHTML = ""

    cesta.forEach(producto => {

        cajaCesta.innerHTML += `
            <div class=articuloCesta id=${producto.id}>
                <p>${producto.nombre}</p>
                <p>${producto.precio}</p>
                <p>${producto.cantidad}</p>
                <p>${producto.subtotal}</p>
                <button id=eliminar${producto.id}>Eliminar</button>
            </div>
        `
    })

    cesta.forEach(producto => {
        let botonEliminar = document.getElementById("eliminar" + producto.id)
        botonEliminar.addEventListener("click", (e) => eliminarProducto(e))
    })

    let sumaSubtotal = cesta.reduce((total, producto) => total + producto.subtotal, 0 )

    let totalCesta = document.getElementById("totalCesta")
    totalCesta.innerHTML=`
            <p>Total: ${sumaSubtotal}</p>
        `

}

function eliminarProducto(e){
    let id = e.target.id.substring(8)
    let cesta = crearCesta()

    cesta = cesta.filter(producto => producto.id !== id)

    guardarCesta(cesta)

    renderCesta(cesta)
}

function guardarCesta(cesta) {
    let cestaJSON = JSON.stringify(cesta)
    localStorage.setItem("cesta", cestaJSON)
}

function popupCesto (producto){
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Añadiste " + producto.nombre + " a la cesta.",
        showConfirmButton: false,
        timer: 1500
      });
}

function compraFinalizada (mensaje){
    Swal.fire({
        position: "center",
        icon: "success",
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
      });
}

function compraErronea (mensaje){
    Swal.fire({
        icon: "error",
        title: "No has añadido nada a la cesta",
        text: "Sigue comprando",
      });
}

function error (mensaje){
    Swal.fire({
        icon: "error",
        title: mensaje,
        text: "Inténtalo de nuevo",
      });
}

function paginaInicio () {
    let inicio = document.getElementById("paginaInicio")
    inicio.innerHTML=`
        <div>
            <h1>Dunkel</h1>
            <h2>El deporte es vida. Vívelo bien equipado.</h2>
            <img src="assets/inicio.jpg" alt="Hombre nadando" id="imagenInicio">
        </div>
    `
    let contenedorProductos = document.getElementById("contenedor")
    contenedorProductos.setAttribute("style", "display:none")
}