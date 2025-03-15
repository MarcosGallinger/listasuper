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
    const categoriaProducto = document.getElementById('categoriaProducto').value;

    // Agregar el producto a la categoría correspondiente
    productos[categoriaProducto].push({ 
        nombre: nombreProducto, 
        cantidad: cantidadProducto,
        precio: 0, // Precio inicial
        comprado: false // Estado inicial del checkbox
    });

    // Actualizar la cantidad en el span correspondiente
    const spanCantidad = document.getElementById(`cantidad${categoriaProducto}`);
    spanCantidad.textContent = parseInt(spanCantidad.textContent) + cantidadProducto;

    // Guardar los datos en el localStorage
    guardarDatos();

    // Cerrar el modal y limpiar el formulario
    cerrarModalAgregar();
    document.getElementById('formularioProducto').reset();
});

// Función para mostrar productos por categoría
function mostrarProductos(categoria) {
    document.getElementById('tituloProductos').textContent = `Productos de ${categoria}`;
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = productos[categoria].map((producto, index) => `
        <li class="producto-item">
            <input type="checkbox" id="check-${categoria}-${index}" 
                   onchange="marcarProducto('${categoria}', ${index})" 
                   ${producto.comprado ? 'checked' : ''}>
            <label for="check-${categoria}-${index}">${producto.nombre} - Cantidad: ${producto.cantidad}</label>
            <input type="number" id="precio-${categoria}-${index}" 
                   step="0.01" min="0" 
                   placeholder="Precio" 
                   onchange="actualizarPrecio('${categoria}', ${index})" 
                   ${producto.comprado ? '' : 'disabled'}>
        </li>
    `).join('');
    document.getElementById('modalProductos').style.display = 'flex';
}

// Función para marcar un producto como comprado
function marcarProducto(categoria, index) {
    const checkbox = document.getElementById(`check-${categoria}-${index}`);
    const precioInput = document.getElementById(`precio-${categoria}-${index}`);
    productos[categoria][index].comprado = checkbox.checked;
    precioInput.disabled = !checkbox.checked;
    guardarDatos();
}

// Función para actualizar el precio de un producto
function actualizarPrecio(categoria, index) {
    const precioInput = document.getElementById(`precio-${categoria}-${index}`);
    productos[categoria][index].precio = parseFloat(precioInput.value);
    guardarDatos();
}

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