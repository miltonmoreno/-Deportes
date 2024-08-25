let productos = [
    {id: "001924" , nombre: "Camiseta de Universitario de Deportes", categoría: "ropa", precio: 80},
    {id: "001945" , nombre: "Short", categoría: "ropa", precio: 40},
    {id: "002023" , nombre: "Zapatillas", categoría: "calzado", precio: 100},
    {id: "001999" , nombre: "Pelota Eurocopa 2024", categoría: "accesorios", precio: 20},
    {id: "002024" , nombre: "Gafas de natación Arena", categoría: "accesorios", precio: 40},
    {id: "002045" , nombre: "Gafas de natación Winner", categoría: "accesorios", precio: 10},
    {id: "002019" , nombre: "Medias antideslizantes", categoría: "ropa", precio: 10},
    {id: "002015" , nombre: "Mangas de compresión", categoría: "ropa", precio: 30},
    {id: "002014" , nombre: "Montura deportiva", categoría: "accesorios", precio: 60},
]

function principal (productos){
    let buscador = document.getElementById("buscador")
    let botonBuscar = document.getElementById("botonBuscar")
    let cesta = crearCesta ()
    renderCesta(cesta)

    let verCesta = document.getElementById("verCesta")
    verCesta.addEventListener("click", ocultarCesta)
    botonBuscar.addEventListener("click", () => filtrarProductos(productos, buscador.value.toLowerCase()))
    buscador.addEventListener("keydown", function(tecla){
        if(tecla.key == "Enter"){
            filtrarProductos(productos,buscador.value.toLowerCase())
        }
    })
    creadorElementos(productos)
    filtrarProductos(productos,buscador.value)
    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", () => comprar(cesta))
}

function ocultarCesta (e) {

    let contenedorProductos = document.getElementById("contenedor")
    let cajaCesta = document.getElementById("paginaCesta")

    if(e.target.innerText == "Ver cesta"){
        e.target.innerText = "Seguir comprando"
    } else {
        e.target.innerText = "Ver cesta"
    }

    contenedorProductos.classList.toggle("oculto")
    cajaCesta.classList.toggle("oculto")
}

function creadorElementos (productos){
    let contenedorProductos = document.getElementById("contenedor")
    contenedorProductos.innerHTML = ""
    productos.forEach(producto => {
        contenedorProductos.innerHTML += `
            <div class=producto>
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
    let contenedorPopup = document.getElementById("paginaCesta")
    if(cesta.length != 0){
        localStorage.removeItem("cesta")
        renderCesta([])
        contenedorPopup.innerHTML= `
        <div class=popUp>
            <h3>Gracias por tu compra. Sigue en movimiento.</h3>
            <button id=botonCerrar>Cerrar</button>
        </div>
        `
    } else {
            contenedorPopup.innerHTML= "<h3>No has añadido nada a la cesta. Intenta de nuevo.</h3>"
    }

        function cerrarPopup (contenedorPopup) {
            contenedorPopup.innerHTML = ""
        }
    
        let botonCerrar = document.getElementById("botonCerrar")
        botonCerrar.addEventListener("click", () => cerrarPopup(contenedorPopup))
}

function filtrarProductos (productos, valor){
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(valor))
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
            <div class=articuloCesta>
                <p>${producto.nombre}</p>
                <p>${producto.precio}</p>
                <p>${producto.cantidad}</p>
                <p>${producto.subtotal}</p>
            </div>
        `
    })
}

function guardarCesta(cesta) {
    let cestaJSON = JSON.stringify(cesta)
    localStorage.setItem("cesta", cestaJSON)
}

function popupCesto (producto){
    let contenedorPopups = document.getElementById("contenedorPopups")
    contenedorPopups.innerHTML = `
    <div class=popUp>
        <h3>Agregaste ${producto.nombre} a la cesta</h3>
        <button id=botonCerrar>Cerrar</button>
    </div>
`
    function cerrarPopup () {
        contenedorPopups.innerHTML = ""
    }

    let botonCerrar = document.getElementById("botonCerrar")
    botonCerrar.addEventListener("click", cerrarPopup)
}

principal(productos)