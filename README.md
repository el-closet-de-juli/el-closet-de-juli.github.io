# El Closet de Juli — catálogo

Catálogo estático para mostrar mercadería. **No procesa compras ni pagos**: todas las
consultas salen por WhatsApp con el mensaje ya escrito.

---

## Estructura

```
el-closet-de-juli/
├── index.html          Estructura de la página. Rara vez se toca.
├── css/estilos.css     Colores y tipografía.
├── js/
│   ├── datos.js        EL ÚNICO ARCHIVO QUE SE EDITA A DIARIO.
│   └── app.js          Renderizado y filtros. No hace falta tocarlo.
├── img/productos/      Fotos de las prendas.
└── README.md           Este archivo.
```

---

## Agregar una prenda

1. Guardar la foto en `img/productos/` con el número de referencia:
   `007.jpg`, `008.jpg`, etc.
2. Abrir `js/datos.js`.
3. Copiar un bloque completo entre `{ }`, pegarlo antes del `];` final.
4. Cambiar los valores. **No repetir un número de referencia nunca**, ni
   siquiera si la prenda anterior ya se vendió.

```javascript
{
  ref: "007",
  nombre: "Chaqueta de mezclilla",
  categoria: "Abrigos",          // debe existir en la lista CATEGORIAS
  talla: "M",
  estado: "Muy buen estado",
  descripcion: "Corte clásico, botones metálicos.",
  precio: null,                  // null = "Consultar precio"
  disponible: true,
  imagen: "img/productos/007.jpg"
}
```

## Marcar una prenda como vendida

Cambiar `disponible: true` por `disponible: false`. La prenda queda visible
en gris al final de la lista, con el sello "Vendida". Sirve como muestra de
lo que se ha movido; para ocultarla del todo, borrar el bloque completo.

## Activar precios

Cambiar `precio: null` por el número sin símbolos ni puntos:

```javascript
precio: 18000     // se muestra como ₡18 000
```

La moneda se controla en `CONFIG.moneda` al inicio de `datos.js`
(`"CRC"` para colones, `"USD"` para dólares).

## Cambiar el número de WhatsApp

En `js/datos.js`, campo `CONFIG.whatsapp`. Formato internacional, sin `+`,
sin espacios ni guiones: `50672688481`.

---

## Fotos: lo que más afecta el resultado

| Regla | Por qué |
|---|---|
| Formato vertical, proporción 3:4 | Es la que usa la rejilla; otras se recortan. |
| Máximo 300 KB por foto | En datos móviles una página de 40 fotos pesadas no carga. |
| Fondo neutro y liso | Pared clara o sábana blanca. La prenda tiene que ser lo único que se vea. |
| Luz de día, sin flash | El flash altera el color real de la tela y genera devoluciones. |
| Mostrar el defecto si lo hay | Una foto del desgaste evita un reclamo después. |

Para comprimir sin instalar nada: [squoosh.app](https://squoosh.app).
Exportar en WebP o JPG con calidad 75.

---

## Publicar en GitHub Pages

1. Crear una organización en GitHub (gratis) con un nombre limpio, por ejemplo
   `el-closet-de-juli`. La URL resultante será
   `https://el-closet-de-juli.github.io/`.
2. Dentro de esa organización, crear un repositorio **público** llamado
   exactamente `el-closet-de-juli.github.io`.
3. Subir el contenido de esta carpeta a la raíz del repositorio.
4. En `Settings → Pages`, dejar *Source* en `Deploy from a branch`,
   rama `main`, carpeta `/ (root)`.
5. Esperar entre 1 y 3 minutos y abrir la URL.

Para actualizar el catálogo después: editar `js/datos.js`, hacer commit y
push. El sitio se actualiza solo en cerca de un minuto.

---

## Notas de seguridad

- Todo el contenido se inserta con `textContent`, nunca con `innerHTML`, para
  evitar ejecución de HTML inyectado
  ([OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)).
- Los enlaces con `target="_blank"` llevan `rel="noopener noreferrer"` para
  evitar *reverse tabnabbing*.
- El repositorio es público: **no subir** capturas con datos de clientas,
  listas de contactos, ni archivos de control interno de ventas.
- El número de WhatsApp queda expuesto a rastreadores. Es inevitable en un
  catálogo público y es el costo de que la gente pueda escribir con un toque.

---

## Verificación antes de publicar

- [ ] Abrir `index.html` con doble clic: las prendas se ven.
- [ ] Tocar "Preguntar": abre WhatsApp con el mensaje escrito y la referencia correcta.
- [ ] Filtrar por categoría: la rejilla cambia.
- [ ] Abrir en el celular: se ven dos columnas y todo es legible.
- [ ] Marcar una prenda como `disponible: false`: aparece en gris al final.
- [ ] Navegar con la tecla Tab: se ve el recuadro de foco en botones y enlaces.
