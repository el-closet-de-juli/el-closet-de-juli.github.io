# El Closet de Juli — catálogo

Catálogo estático para mostrar mercadería. **No procesa compras ni pagos**: todas
las consultas salen por WhatsApp con el mensaje ya escrito.

---

## Cómo se actualiza el catálogo

**Camino normal: usar el panel.** No hay que tocar código.

1. Abrir `admin.html` con doble clic (se abre en el navegador, en la computadora).
2. Hacer los cambios: agregar prendas, editarlas, marcarlas como vendidas, borrarlas.
3. Tocar **"Generar datos.js"** y luego **"Descargar datos.js"**.
4. Subir a GitHub el archivo `datos.js` descargado, reemplazando `js/datos.js`.
5. Si se agregaron fotos, subirlas también a la carpeta `img/productos/`.
   El panel ya las descargó con el nombre correcto.
6. El sitio se actualiza solo, cerca de un minuto después.

> El panel **no publica nada**. Todo pasa dentro del navegador y ningún dato sale
> de la computadora. Publicar sigue siendo subir los archivos a GitHub.

### Lo que hace el panel

| Acción | Dónde |
|---|---|
| Agregar una prenda | Botón "Nueva prenda" |
| Editar una prenda | Botón "Editar" en la fila |
| Marcar apartada o vendida | Lista desplegable en la fila, sin abrir nada |
| Duplicar una prenda parecida | Botón "Duplicar" |
| Borrar | Botón "Borrar" (pide escribir la referencia para confirmar) |
| Cambiar el WhatsApp o el lema | Sección "Datos del negocio" |
| Agregar una categoría | Sección "Categorías" |

### Precio: unas prendas sí, otras no

En el formulario hay una casilla **"Consultar por WhatsApp"**.

- **Marcada:** la prenda muestra "Consultar por WhatsApp" y el mensaje que se le
  escribe a Juli incluye "¿Me pasás el precio?".
- **Desmarcada:** hay que poner el número (sin puntos ni símbolos: `18000`) y la
  prenda muestra ₡18 000.

Se puede mezclar libremente: unas prendas con precio y otras sin él.

### Las referencias no se reutilizan

Cada prenda tiene un código corto (`001`, `002`...). Es lo que la clienta menciona
por WhatsApp: *"quiero la 014"*. **Un código no se vuelve a usar nunca**, ni cuando
la prenda anterior ya se vendió. Si se recicla, un enlace viejo compartido meses
atrás lleva a la prenda equivocada.

### Vendida o borrada

Marcar una prenda como **vendida** la deja visible en gris al final del catálogo,
con el sello "Vendido" y sin botón de WhatsApp. Sirve de prueba de que la
mercadería se mueve. **Borrar** la elimina para siempre y no hay respaldo. Ante la
duda, marcarla como vendida.

---

## Fotos: lo que más afecta el resultado

Las fotos se preparan **antes** de subirlas. El panel avisa si algo está fuera de
norma, pero no las corrige.

| Regla | Por qué |
|---|---|
| Formato vertical, proporción 3:4 | Es la que usa la rejilla; otras se recortan |
| WebP, 1200 px de lado mayor, calidad 75 | Es el formato que menos pesa con la misma calidad visible |
| Menos de 250 KB por foto | En datos móviles, cien fotos pesadas no cargan |
| Fondo neutro y liso | Pared clara o sábana blanca. La prenda tiene que ser lo único que se vea |
| Luz de día, sin flash | El flash altera el color real de la tela y genera devoluciones |
| Mostrar el defecto si lo hay | Una foto del desgaste evita un reclamo después |
| De 2 a 3 fotos por prenda | Frente, detalle y defecto. Evita el "¿tenés más fotos?" que consume tiempo |

Para comprimir sin instalar nada: **[squoosh.app](https://squoosh.app)**. Se abre en
el navegador, no sube las fotos a ningún lado. Exportar en **WebP, calidad 75**.

Los nombres de archivo los pone el panel: `001-1.webp`, `001-2.webp`, `001-3.webp`.

### La foto de portada

`img/portada.jpg` es la imagen que aparece cuando se pega el enlace del sitio en
WhatsApp o Instagram. Debe medir **1200 × 630 px** y estar en **JPG** — no WebP,
porque varios previsualizadores todavía no lo leen. Sin esta imagen, el enlace se
comparte con un recuadro vacío.

---

## Estructura de archivos

```
el-closet-de-juli.github.io/
├── index.html          Estructura de la página. Rara vez se toca.
├── admin.html          Panel de administración. Se abre localmente.
├── css/estilos.css     Colores y tipografía.
├── js/
│   ├── datos.js        Lo genera el panel. Es el catálogo.
│   └── app.js          Renderizado, filtros y ficha. No hace falta tocarlo.
├── img/
│   ├── portada.jpg     Vista previa al compartir (1200x630, JPG).
│   └── productos/      Fotos de las prendas (WebP).
├── .nojekyll           Desactiva Jekyll en GitHub Pages. No borrar.
└── README.md           Este archivo.
```

---

## Publicar en GitHub Pages

1. Crear una organización en GitHub (gratis) con un nombre limpio:
   `el-closet-de-juli`. La URL resultante será `https://el-closet-de-juli.github.io/`.
2. Dentro de esa organización, crear un repositorio **público** llamado
   exactamente `el-closet-de-juli.github.io`.
3. Subir el contenido de esta carpeta a la raíz del repositorio.
4. En `Settings → Pages`, dejar *Source* en `Deploy from a branch`, rama `main`,
   carpeta `/ (root)`.
5. Esperar entre 1 y 3 minutos y abrir la URL.

Para actualizar después: subir el `datos.js` nuevo y las fotos. El sitio se
actualiza solo en cerca de un minuto.

---

## Compartir

- **Compartir catálogo**: botón en el encabezado. En celular abre la hoja de
  compartir del sistema; en computadora copia el enlace.
- **Compartir una prenda**: botón dentro de la ficha. Genera un enlace directo
  del tipo `https://el-closet-de-juli.github.io/?ref=014` que abre esa prenda
  ya desplegada. Es lo más útil para responder por WhatsApp o por historia.

---

## Notas de seguridad

- Todo el contenido se inserta con `textContent`, nunca con `innerHTML`, para
  evitar ejecución de HTML inyectado
  ([OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)).
- Los enlaces con `target="_blank"` llevan `rel="noopener noreferrer"` para
  evitar *reverse tabnabbing*.
- El repositorio es público y **`admin.html` se sube igual que el resto**: no
  escribir ahí contraseñas, costos de compra ni notas internas. Solo debe
  contener lo que ya es público en el catálogo.
- No subir capturas con datos de clientas, listas de contactos ni archivos de
  control interno de ventas.
- El número de WhatsApp queda expuesto a rastreadores. Es inevitable en un
  catálogo público y es el costo de que la gente pueda escribir con un toque.
- El sitio no usa cookies, ni almacenamiento local, ni analítica de terceros.

---

## Verificación antes de publicar

- [ ] Abrir `index.html` con doble clic: las prendas se ven.
- [ ] Tocar una tarjeta: abre la ficha con las fotos deslizables.
- [ ] Tocar "Preguntar por WhatsApp": abre WhatsApp con el mensaje escrito y la
      referencia correcta.
- [ ] Una prenda sin precio dice "Consultar por WhatsApp" y el mensaje pide el precio.
- [ ] Filtrar por categoría: la rejilla cambia.
- [ ] Abrir `?ref=003` en la barra de direcciones: se abre esa prenda directamente.
- [ ] "Compartir esta prenda" copia el enlace y avisa que lo copió.
- [ ] Una prenda vendida aparece en gris, al final, sin botón de WhatsApp.
- [ ] Abrir en el celular: se ven dos columnas y todo es legible.
- [ ] Navegar con la tecla Tab: se ve el recuadro de foco; dentro de la ficha el
      foco no se escapa a la página de atrás.
- [ ] Cerrar la ficha con la tecla Escape.
- [ ] En `admin.html`: crear una prenda, editarla, marcarla vendida, borrar otra,
      generar `datos.js` y comprobar que el sitio refleja los cuatro cambios.
