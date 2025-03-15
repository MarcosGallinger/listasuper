// script.js

// Variables globales
let productos = JSON.parse(localStorage.getItem('productos')) || {
    FrutasyVerduras: [],
    Bebidas: [],
    Congelados: [],
    Carniceria: [],
    Perfumeria: [],
    Limpieza: [],
    Almacen: [],
    Mascotas: []
};

let totalAcumulado = parseFloat(localStorage.getItem('totalAcumulado')) || 0;

// Función para formatear números con separadores de miles y decimales
function formatearNumero(numero) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(numero);
}

// Función para actualizar el total acumulado en la interfaz
function actualizarTotalAcumulado() {
    document.getElementById('totalAcumulado').textContent = formatearNumero(totalAcumulado);
}

// Cargar el total acumulado al iniciar la página
actualizarTotalAcumulado();

// Función para guardar los productos y el total acumulado en el localStorage
function guardarDatos() {
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('totalAcumulado', totalAcumulado.toString());
}

// Función para abrir el modal de agregar producto
function abrirModalAgregar() {
    document.getElementById('modalAgregar').style.display = 'flex';
}

// Función para cerrar el modal de agregar producto
function cerrarModalAgregar() {
    document.getElementById('modalAgregar').style.display = 'none';
}

// Función para manejar el formulario de agregar producto
document.getElementById('formularioProducto').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario se envíe y recargue la página

    const nombreProducto = document.getElementById('nombreProducto').value;
    const cantidadProducto = parseInt(document.getElementById('cantidadProducto').value);
    const precioProducto = parseFloat(document.getElementById('precioProducto').value);
    const categoriaProducto = document.getElementById('categoriaProducto').value;

    // Calcular el subtotal del producto
    const subtotal = cantidadProducto * precioProducto;

    // Agregar el producto a la categoría correspondiente
    productos[categoriaProducto].push({ 
        nombre: nombreProducto, 
        cantidad: cantidadProducto, 
        precio: precioProducto 
    });

    // Actualizar la cantidad en el span correspondiente
    const spanCantidad = document.getElementById(`cantidad${categoriaProducto}`);
    spanCantidad.textContent = parseInt(spanCantidad.textContent) + cantidadProducto;

    // Actualizar el total acumulado
    totalAcumulado += subtotal;
    actualizarTotalAcumulado();

    // Guardar los datos en el localStorage
    guardarDatos();

    // Cerrar el modal y limpiar el formulario
    cerrarModalAgregar();
    document.getElementById('formularioProducto').reset();
});

// Función para limpiar la lista (solo se ejecuta al presionar "Limpiar Lista")
function limpiarLista() {
    Object.keys(productos).forEach(categoria => {
        productos[categoria] = []; // Vaciar la lista de productos
        document.getElementById(`cantidad${categoria}`).textContent = '0'; // Reiniciar la cantidad
    });

    // Reiniciar el total acumulado
    totalAcumulado = 0;
    actualizarTotalAcumulado();

    // Borrar los datos del localStorage
    localStorage.removeItem('productos');
    localStorage.removeItem('totalAcumulado');

    alert('Lista limpiada correctamente.');
}

// Función para mostrar productos por categoría
function mostrarProductos(categoria) {
    document.getElementById('tituloProductos').textContent = `Productos de ${categoria}`;
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = productos[categoria].map(producto => 
        `<li>${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${formatearNumero(producto.precio)}</li>`
    ).join('');
    document.getElementById('modalProductos').style.display = 'flex';
}

// Función para cerrar el modal de productos por categoría
function cerrarModalProductos() {
    document.getElementById('modalProductos').style.display = 'none';
}

// Función para mostrar la lista completa
function mostrarListaCompleta() {
    const contenidoListaCompleta = document.getElementById('contenidoListaCompleta');
    contenidoListaCompleta.innerHTML = Object.keys(productos).map(categoria => 
        `<div class="categoria-lista">
            <h3>${categoria}</h3>
            <ul>${productos[categoria].map(producto => 
                `<li>${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${formatearNumero(producto.precio)}</li>`
            ).join('')}</ul>
        </div>`
    ).join('');
    document.getElementById('modalListaCompleta').style.display = 'flex';
}

// Función para cerrar el modal al hacer clic fuera
function configurarCierreModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.addEventListener('click', function (event) {
        // Si el clic ocurrió fuera del contenido del modal, cerrar el modal
        if (event.target === modal) {
            cerrarModal(modalId);
        }
    });
}

// Función para cerrar un modal específico
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Configurar el cierre para todos los modales
configurarCierreModal('modalAgregar');
configurarCierreModal('modalProductos');
configurarCierreModal('modalListaCompleta');

// Función para abrir el modal de agregar producto
function abrirModalAgregar() {
    document.getElementById('modalAgregar').style.display = 'flex';
}

// Función para cerrar el modal de agregar producto
function cerrarModalAgregar() {
    cerrarModal('modalAgregar');
}

// Función para abrir el modal de productos por categoría
function abrirModalProductos(categoria) {
    document.getElementById('tituloProductos').textContent = `Productos de ${categoria}`;
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = productos[categoria].map(producto => 
        `<li>${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${formatearNumero(producto.precio)}</li>`
    ).join('');
    document.getElementById('modalProductos').style.display = 'flex';
}

// Función para cerrar el modal de productos por categoría
function cerrarModalProductos() {
    cerrarModal('modalProductos');
}

// Función para abrir el modal de la lista completa
function abrirModalListaCompleta() {
    const contenidoListaCompleta = document.getElementById('contenidoListaCompleta');
    contenidoListaCompleta.innerHTML = Object.keys(productos).map(categoria => 
        `<div class="categoria-lista">
            <h3>${categoria}</h3>
            <ul>${productos[categoria].map(producto => 
                `<li>${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${formatearNumero(producto.precio)}</li>`
            ).join('')}</ul>
        </div>`
    ).join('');
    document.getElementById('modalListaCompleta').style.display = 'flex';
}

// Función para cerrar el modal de la lista completa
function cerrarModalListaCompleta() {
    cerrarModal('modalListaCompleta');
}