# El Closet de Juli — catálogo

Catálogo estático para mostrar mercadería. **No procesa compras ni pagos**: todas
las consultas salen por WhatsApp con el mensaje ya escrito.

---

## Cómo se actualiza el catálogo

Todo se hace desde `panel-9f3a2c.html`. No hay que tocar código.

### Modo directo (recomendado): el panel publica solo

Funciona igual desde la computadora y desde el teléfono.

1. **Una vez por dispositivo:** en la sección "Conexión con GitHub", llenar
   usuario, repositorio, rama y token, y tocar "Probar conexión".
2. Hacer los cambios: agregar prendas, editarlas, marcarlas vendidas, borrarlas.
   Las fotos se cargan tal como salen del teléfono — el panel las comprime.
3. Tocar **Publicar**, escribir qué cambió y confirmar.
4. El sitio se actualiza en 1 a 3 minutos.

El catálogo y las fotos viajan en **un solo commit**, así el sitio nunca queda
un instante con prendas nuevas y fotos faltantes.

**El token:** GitHub → Settings → Developer settings → Personal access tokens →
*Fine-grained tokens*. Acceso **solo a este repositorio**, permiso
**Contents: Read and write** y nada más, vencimiento a 90 días. Se guarda en el
navegador de ese dispositivo y solo viaja a `api.github.com`. Nunca se escribe
en un archivo del repositorio. Si se presta o se pierde el equipo: **Olvidar
token**, y revocarlo en GitHub.

### Modo manual: sin conexión configurada

1. Abrir `panel-9f3a2c.html`, hacer los cambios.
2. **Generar datos.js** → **Descargar**. Las fotos se descargan renombradas.
3. Mover todo a su lugar: `.\importar.ps1`
4. Publicar: `.\publicar.ps1 "qué cambió"`

Sirve de respaldo si el token venció o no hay internet en el momento de editar.

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

**El panel comprime solo.** Se cargan tal como salen del teléfono: las
redimensiona a 1200 px de lado mayor, las convierte a WebP con calidad 75 y
respeta la orientación de la cámara. No hay que usar ninguna herramienta aparte,
y las fotos no se suben a ningún servicio de terceros: todo pasa en el navegador.

Lo que el panel **no** puede arreglar, y depende de cómo se tome la foto:

| Regla | Por qué |
|---|---|
| Formato vertical, proporción 3:4 | Es la que usa la rejilla; una foto horizontal se recorta |
| Fondo neutro y liso | Pared clara o sábana blanca. La prenda tiene que ser lo único que se vea |
| Luz de día, sin flash | El flash altera el color real de la tela y genera devoluciones |
| Mostrar el defecto si lo hay | Una foto del desgaste evita un reclamo después |
| De 2 a 3 fotos por prenda | Frente, detalle y defecto. Evita el "¿tenés más fotos?" que consume tiempo |

El panel avisa cuando una foto queda pesada aun comprimida o cuando es
horizontal, pero no bloquea: la decisión es de quien publica.

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
├── index.html            Estructura de la página. Rara vez se toca.
├── panel-9f3a2c.html     Panel de administración.
├── css/estilos.css       Colores y tipografía.
├── js/
│   ├── datos.js          Lo genera el panel. Es el catálogo.
│   └── app.js            Renderizado, filtros y ficha. No hace falta tocarlo.
├── img/
│   ├── portada.jpg       Vista previa al compartir (1200x630, JPG).
│   └── productos/        Fotos de las prendas (WebP).
├── importar.ps1          Mueve lo descargado a su lugar (modo manual).
├── publicar.ps1          Sube los cambios con un comando (modo manual).
├── .gitignore            Qué no subir nunca.
├── .nojekyll             Desactiva Jekyll en GitHub Pages. No borrar.
└── README.md             Este archivo.
```

**Por qué el panel tiene ese nombre.** No se llama `admin.html` a propósito: los
escáneres automáticos que recorren internet prueban rutas comunes
(`/admin`, `/admin.html`, `/wp-admin`) y un nombre así aparece en todas esas
listas. Con un nombre no adivinable, el sitio deja de figurar en ese ruido.

Que quede claro qué es y qué no es: **esto no es control de acceso.** El
repositorio es público, así que cualquiera que lo abra ve el archivo listado.
Lo único que evita es el escaneo ciego de rutas. El panel sin token no puede
modificar nada, así que la protección es proporcional al riesgo — pero no hay
que confundirla con seguridad real.

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
- El repositorio es público y **el panel se sube igual que el resto**: no escribir
  ahí contraseñas, costos de compra ni notas internas. Solo debe contener lo que
  ya es público en el catálogo.
- **El token nunca va dentro de un archivo del proyecto.** Vive en el
  almacenamiento del navegador de cada dispositivo. Si alguna vez se pega dentro
  del HTML "para no tener que configurarlo", queda publicado y hay que revocarlo
  de inmediato: el historial de Git lo conserva aunque después se borre.
- Si se pierde un dispositivo con el panel configurado: revocar el token en
  GitHub. Borrarlo del navegador no lo invalida.
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
- [ ] En `panel-9f3a2c.html`: crear una prenda, editarla, marcarla vendida, borrar otra,
      generar `datos.js` y comprobar que el sitio refleja los cuatro cambios.
