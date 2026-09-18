# ALAIA — Web fusionada (Carrito + WhatsApp + Nosotras)

Este paquete une las 3 funciones en una sola página funcional:

1. **Carrito de compras** (drawer lateral, sumar/restar cantidad, quitar producto, total en COP).
2. **Checkout por WhatsApp** (botón "Comprar por WhatsApp" arma el mensaje con el pedido y lo envía a un número de WhatsApp).
3. **Página "Nosotras"** (`nosotras.html`) con carrusel de diapositivas sobre la historia, misión y visión de ALAIA.

## Antes de publicar

Abre `js/app.js` y cambia esta línea por el número de WhatsApp real del negocio (código de país, sin `+`, espacios ni guiones):

```js
const WHATSAPP_NUMBER = "573001234567";
```

## Estructura

```
index.html          -> pagina principal (tienda + carrito)
nosotras.html        -> pagina "Nosotras" (carrusel + carrito accesible tambien aqui)
css/styles.css       -> estilos combinados (tienda, carrito y nosotras)
js/app.js            -> logica del carrito y WhatsApp (usado en ambas paginas)
js/nosotras.js        -> logica del carrusel de la pagina Nosotras
assets/              -> imagenes del sitio y del carrusel de Nosotras
```

## Como probar

Abre `index.html` en el navegador (doble clic) o subelo a cualquier hosting estatico. El carrito se guarda en `localStorage`, asi que persiste entre `index.html` y `nosotras.html`.
