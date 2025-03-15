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

// Función para cargar las cantidades al iniciar la página
function cargarCantidades() {
    Object.keys(productos).forEach(categoria => {
        const cantidad = productos[categoria].reduce((sum, p) => sum + p.cantidad, 0);
        document.getElementById(`cantidad${categoria}`).textContent = cantidad;
    });
}

// Cargar las cantidades y el total acumulado al iniciar la página
cargarCantidades();
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
// Función para mostrar la lista completa de productos
function mostrarListaCompleta() {
    const contenidoListaCompleta = document.getElementById('contenidoListaCompleta');
    contenidoListaCompleta.innerHTML = Object.keys(productos).map(categoria => `
        <div class="categoria-lista">
            <h3>${categoria}</h3>
            <ul>
                ${productos[categoria].map(producto => `
                    <li>
                        ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${formatearNumero(producto.precio)}
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
    document.getElementById('modalListaCompleta').style.display = 'flex';
}

// Función para cerrar el modal de la lista completa
function cerrarModalListaCompleta() {
    document.getElementById('modalListaCompleta').style.display = 'none';
}

// Función para mostrar productos por categoría
function mostrarProductos(categoria) {
    document.getElementById('tituloProductos').textContent = `Productos de ${categoria}`;
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = productos[categoria].map((producto, index) => `
        <li class="producto-item">
            <input type="checkbox" id="check-${categoria}-${index}" 
                   onchange="marcarProducto('${categoria}', ${index})" 
                   ${producto.comprado ? 'checked' : ''}>
            <label for="check-${categoria}-${index}">${producto.nombre}</label>
            <div class="cantidad-control">
                <button onclick="modificarCantidad('${categoria}', ${index}, -1)">-</button>
                <span>${producto.cantidad}</span>
                <button onclick="modificarCantidad('${categoria}', ${index}, 1)">+</button>
            </div>
            <input type="number" id="precio-${categoria}-${index}" 
                   step="0.01" min="0" 
                   placeholder="Precio" 
                   onchange="actualizarPrecio('${categoria}', ${index})" 
                   ${producto.comprado ? '' : 'disabled'}>
            <button onclick="confirmarPrecio('${categoria}', ${index})">Confirmar</button>
            <button class="eliminar" onclick="eliminarProducto('${categoria}', ${index})">X</button>
        </li>
    `).join('');
    document.getElementById('modalProductos').style.display = 'flex';
}

// Función para modificar la cantidad de un producto
function modificarCantidad(categoria, index, cambio) {
    const producto = productos[categoria][index];
    const nuevaCantidad = producto.cantidad + cambio;

    // Validar que la cantidad no sea menor que 1
    if (nuevaCantidad < 1) {
        alert('La cantidad no puede ser menor que 1.');
        return;
    }

    // Si el producto ya tenía un precio confirmado, ajustar el total acumulado
    if (producto.comprado && producto.precio > 0) {
        const subtotalAnterior = producto.precio * producto.cantidad;
        const subtotalNuevo = producto.precio * nuevaCantidad;
        totalAcumulado += (subtotalNuevo - subtotalAnterior);
        actualizarTotalAcumulado();
    }

    // Actualizar la cantidad del producto
    producto.cantidad = nuevaCantidad;

    // Actualizar la cantidad en el span correspondiente
    const spanCantidad = document.getElementById(`cantidad${categoria}`);
    spanCantidad.textContent = productos[categoria].reduce((sum, p) => sum + p.cantidad, 0);

    // Guardar los datos en el localStorage
    guardarDatos();

    // Volver a mostrar la lista de productos actualizada
    mostrarProductos(categoria);
}

// Función para marcar un producto como comprado
function marcarProducto(categoria, index) {
    const checkbox = document.getElementById(`check-${categoria}-${index}`);
    const precioInput = document.getElementById(`precio-${categoria}-${index}`);
    productos[categoria][index].comprado = checkbox.checked;
    precioInput.disabled = !checkbox.checked;
    guardarDatos();
}

// Función para confirmar el precio y sumarlo al total general
function confirmarPrecio(categoria, index) {
    const precioInput = document.getElementById(`precio-${categoria}-${index}`);
    const precio = parseFloat(precioInput.value);

    if (isNaN(precio) || precio <= 0) {
        alert('Por favor, ingrese un precio válido.');
        return;
    }

    // Multiplicar el precio por la cantidad del producto
    const producto = productos[categoria][index];
    const subtotal = precio * producto.cantidad;

    // Guardar el precio en el objeto del producto
    producto.precio = precio;

    // Sumar el subtotal al total acumulado
    totalAcumulado += subtotal;
    actualizarTotalAcumulado();

    // Guardar los datos en el localStorage
    guardarDatos();

    // Cerrar el modal
    cerrarModalProductos();
}

// Función para cerrar el modal de productos por categoría
function cerrarModalProductos() {
    document.getElementById('modalProductos').style.display = 'none';
}

// Función para eliminar un producto de la lista
function eliminarProducto(categoria, index) {
    const producto = productos[categoria][index];

    // Si el producto tenía un precio confirmado, restar el subtotal del total acumulado
    if (producto.comprado && producto.precio > 0) {
        const subtotal = producto.precio * producto.cantidad;
        totalAcumulado -= subtotal;
        actualizarTotalAcumulado();
    }

    // Eliminar el producto de la lista
    productos[categoria].splice(index, 1);

    // Actualizar la cantidad en el span correspondiente
    const spanCantidad = document.getElementById(`cantidad${categoria}`);
    spanCantidad.textContent = productos[categoria].reduce((sum, p) => sum + p.cantidad, 0);

    // Guardar los datos en el localStorage
    guardarDatos();

    // Volver a mostrar la lista de productos actualizada
    mostrarProductos(categoria);
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