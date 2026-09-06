/* ==========================================================================
   EL CLOSET DE JULI - Logica de la pagina
   --------------------------------------------------------------------------
   Normalmente no hace falta tocar este archivo. Para cambiar el catalogo,
   editar js/datos.js.

   NOTA DE SEGURIDAD
   Todo el contenido se inserta con createElement y textContent, nunca con
   innerHTML. Aunque hoy los datos los escribe la duena del negocio, usar
   innerHTML significa que cualquier texto con etiquetas HTML se ejecutaria
   como codigo en el navegador de quien visita (XSS almacenado). Con
   textContent, el navegador trata el texto como texto y nada mas.
   Referencia: OWASP Cross Site Scripting Prevention Cheat Sheet.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Estado
     ---------------------------------------------------------------------- */

  var categoriaActiva = "Todo";

  /* ----------------------------------------------------------------------
     Utilidades
     ---------------------------------------------------------------------- */

  /**
   * Formatea un precio segun la moneda configurada.
   * Devuelve null si no hay precio, para que la tarjeta muestre "Consultar".
   */
  function formatearPrecio(valor) {
    if (valor === null || valor === undefined || valor === "") {
      return null;
    }

    var locales = CONFIG.moneda === "USD" ? "en-US" : "es-CR";

    return new Intl.NumberFormat(locales, {
      style: "currency",
      currency: CONFIG.moneda,
      // Los colones no se manejan con decimales en precio de venta al publico.
      minimumFractionDigits: CONFIG.moneda === "CRC" ? 0 : 2,
      maximumFractionDigits: CONFIG.moneda === "CRC" ? 0 : 2
    }).format(valor);
  }

  /**
   * Construye el enlace de WhatsApp con el mensaje ya escrito.
   *
   * SEGURIDAD: encodeURIComponent es obligatorio. Sin el, un nombre de prenda
   * que contenga & o # rompe la URL y el mensaje llega cortado o vacio.
   */
  function enlaceWhatsApp(prenda) {
    var texto =
      "Hola, me interesa la referencia " + prenda.ref +
      " (" + prenda.nombre + ", talla " + prenda.talla + ").";

    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
  }

  /**
   * Atajo para crear un elemento con clase y texto.
   */
  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) { el.className = clase; }
    if (texto !== undefined && texto !== null) { el.textContent = texto; }
    return el;
  }

  /* ----------------------------------------------------------------------
     Construccion de una prenda
     ---------------------------------------------------------------------- */

  function construirPrenda(prenda) {
    var item = crear("li", "prenda");
    if (!prenda.disponible) {
      item.classList.add("prenda--vendida");
    }

    /* --- Foto --- */

    var foto = crear("div", "prenda__foto");

    var marcador = crear("div", "prenda__sin-foto");
    marcador.appendChild(crear("span", null, prenda.ref));
    marcador.appendChild(crear("span", null, "Foto pendiente"));
    foto.appendChild(marcador);

    if (prenda.imagen) {
      var img = document.createElement("img");
      img.src = prenda.imagen;
      img.alt = prenda.nombre;
      // Carga diferida: las fotos fuera de pantalla no consumen datos
      // hasta que la persona baja. Importante en conexiones moviles.
      img.loading = "lazy";
      // Si el archivo no existe todavia, se oculta y queda el marcador.
      img.addEventListener("error", function () {
        img.remove();
      });
      foto.appendChild(img);
    }

    foto.appendChild(crear("span", "prenda__ref", prenda.ref));

    if (!prenda.disponible) {
      foto.appendChild(crear("span", "prenda__vendida", "Vendida"));
    }

    item.appendChild(foto);

    /* --- Ficha --- */

    var ficha = crear("div", "prenda__ficha");
    ficha.appendChild(crear("h2", "prenda__nombre", prenda.nombre));

    var datos = [];
    if (prenda.talla)  { datos.push("Talla " + prenda.talla); }
    if (prenda.estado) { datos.push(prenda.estado); }
    if (datos.length) {
      ficha.appendChild(crear("p", "prenda__datos", datos.join("  ·  ")));
    }

    if (prenda.descripcion) {
      ficha.appendChild(crear("p", "prenda__descripcion", prenda.descripcion));
    }

    /* --- Precio y contacto --- */

    var cierre = crear("div", "prenda__cierre");
    var precio = formatearPrecio(prenda.precio);

    if (precio) {
      cierre.appendChild(crear("span", "prenda__precio", precio));
    } else {
      cierre.appendChild(
        crear("span", "prenda__precio prenda__precio--consultar", "Consultar precio")
      );
    }

    var boton = document.createElement("a");
    boton.className = "boton-wa";
    boton.href = enlaceWhatsApp(prenda);
    boton.target = "_blank";
    // SEGURIDAD: rel="noopener noreferrer" con target="_blank".
    // Sin noopener, la pagina destino recibe una referencia a esta ventana
    // (window.opener) y puede redirigirla a un sitio falso sin que la persona
    // lo note. Se conoce como reverse tabnabbing. Los navegadores actuales
    // aplican noopener por defecto, pero declararlo cubre versiones viejas.
    boton.rel = "noopener noreferrer";
    boton.textContent = prenda.disponible ? "Preguntar" : "Buscar algo similar";
    cierre.appendChild(boton);

    ficha.appendChild(cierre);
    item.appendChild(ficha);

    return item;
  }

  /* ----------------------------------------------------------------------
     Renderizado
     ---------------------------------------------------------------------- */

  function renderizar() {
    var rejilla = document.getElementById("rejilla");
    var vacio = document.getElementById("vacio");

    var visibles = categoriaActiva === "Todo"
      ? PRENDAS
      : PRENDAS.filter(function (p) { return p.categoria === categoriaActiva; });

    // Las prendas disponibles van primero; las vendidas quedan al final.
    visibles = visibles.slice().sort(function (a, b) {
      return (b.disponible === true) - (a.disponible === true);
    });

    rejilla.textContent = "";

    if (visibles.length === 0) {
      vacio.hidden = false;
      return;
    }

    vacio.hidden = true;

    var lote = document.createDocumentFragment();
    visibles.forEach(function (prenda) {
      lote.appendChild(construirPrenda(prenda));
    });
    rejilla.appendChild(lote);
  }

  /* ----------------------------------------------------------------------
     Filtros
     ---------------------------------------------------------------------- */

  function construirFiltros() {
    var contenedor = document.getElementById("filtros");

    // Solo se muestran las categorias que realmente tienen prendas.
    var conStock = CATEGORIAS.filter(function (cat) {
      return PRENDAS.some(function (p) { return p.categoria === cat; });
    });

    ["Todo"].concat(conStock).forEach(function (cat) {
      var boton = crear("button", "filtro", cat);
      boton.type = "button";
      // aria-pressed comunica el estado a lectores de pantalla,
      // no solo con color.
      boton.setAttribute("aria-pressed", String(cat === categoriaActiva));

      boton.addEventListener("click", function () {
        categoriaActiva = cat;
        contenedor.querySelectorAll(".filtro").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.textContent === cat));
        });
        renderizar();
      });

      contenedor.appendChild(boton);
    });
  }

  /* ----------------------------------------------------------------------
     Arranque
     ---------------------------------------------------------------------- */

  function iniciar() {
    document.getElementById("negocio").textContent = CONFIG.negocio;
    document.getElementById("lema").textContent = CONFIG.lema;
    document.title = CONFIG.negocio;

    var enlacePie = document.getElementById("wa-general");
    enlacePie.href = "https://wa.me/" + CONFIG.whatsapp;
    enlacePie.rel = "noopener noreferrer";

    var anio = document.getElementById("anio");
    anio.textContent = String(new Date().getFullYear());

    construirFiltros();
    renderizar();
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
