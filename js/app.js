/* ==========================================================================
   EL CLOSET DE JULI - Logica del catalogo
   --------------------------------------------------------------------------
   Este archivo NO se edita para actualizar el catalogo. Todo lo que cambia
   a diario vive en datos.js.

   Notas de seguridad (OWASP XSS Prevention Cheat Sheet):
   - Todo el contenido de datos.js se inserta con textContent o con
     createElement/setAttribute. En ningun punto se usa innerHTML, para que
     un texto con HTML dentro de datos.js se muestre como texto y no se
     ejecute.
   - Los enlaces externos llevan rel="noopener noreferrer" para evitar
     reverse tabnabbing.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     0. GUARDA: si datos.js no cargo, avisar en pantalla y no seguir.
     ------------------------------------------------------------------------ */

  if (typeof CONFIG === "undefined" || typeof PRENDAS === "undefined") {
    document.addEventListener("DOMContentLoaded", function () {
      var main = document.querySelector("main .contenedor");
      if (!main) { return; }
      var aviso = document.createElement("p");
      aviso.className = "aviso-error";
      aviso.textContent =
        "No se pudo cargar el catalogo. Revisar que el archivo js/datos.js " +
        "exista y no tenga errores de sintaxis.";
      main.appendChild(aviso);
    });
    return;
  }


  /* ------------------------------------------------------------------------
     1. CONSTANTES Y ESTADO
     ------------------------------------------------------------------------ */

  var SELLOS = {
    nuevo:      "Recien llegado",
    apartado:   "Apartado",
    vendido:    "Vendido",
    disponible: null              // sin sello
  };

  // Peso de cada situacion para el orden. Menor = mas arriba.
  var PESO_SITUACION = {
    nuevo: 0,
    disponible: 1,
    apartado: 2,
    vendido: 3
  };

  var estado = {
    categoriaActiva: null,   // null = "Todo"
    prendas: [],
    prendaAbierta: null,
    fotoActiva: 0,
    elementoQueAbrioModal: null
  };

  var dom = {};


  /* ------------------------------------------------------------------------
     2. VALIDACION DE DATOS
     --------------------------------------------------------------------------
     No detiene el sitio: avisa por consola y dibuja igual. Un error de datos
     no puede dejar el catalogo en blanco un sabado por la tarde.
     ------------------------------------------------------------------------ */

  function validarPrendas(lista) {
    var vistas = {};
    var validas = [];

    lista.forEach(function (p, indice) {
      if (!p || typeof p !== "object") {
        console.warn("[datos.js] El elemento " + indice + " no es una prenda valida. Se omite.");
        return;
      }
      if (!p.ref) {
        console.warn("[datos.js] Prenda sin referencia en la posicion " + indice + ". Se omite.");
        return;
      }
      if (vistas[p.ref]) {
        console.warn("[datos.js] Referencia repetida: " + p.ref + ". Se dibuja igual, pero los enlaces directos van a apuntar a la primera.");
      }
      vistas[p.ref] = true;

      if (CATEGORIAS.indexOf(p.categoria) === -1) {
        console.warn("[datos.js] La prenda " + p.ref + " usa la categoria \"" + p.categoria + "\", que no esta en la lista CATEGORIAS. No va a aparecer en ningun filtro.");
      }
      if (!Array.isArray(p.fotos) || p.fotos.length === 0) {
        console.warn("[datos.js] La prenda " + p.ref + " no tiene fotos.");
        p.fotos = [];
      }
      if (p.fotos.length > 3) {
        console.warn("[datos.js] La prenda " + p.ref + " tiene mas de 3 fotos. Solo se usan las primeras 3.");
        p.fotos = p.fotos.slice(0, 3);
      }
      if (!PESO_SITUACION.hasOwnProperty(p.situacion)) {
        console.warn("[datos.js] La prenda " + p.ref + " tiene la situacion \"" + p.situacion + "\", que no existe. Se trata como disponible.");
        p.situacion = "disponible";
      }
      validas.push(p);
    });

    return validas;
  }


  /* ------------------------------------------------------------------------
     3. HELPERS
     ------------------------------------------------------------------------ */

  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) { el.className = clase; }
    if (texto !== undefined && texto !== null) { el.textContent = texto; }
    return el;
  }

  /* Formato de precio. Si es null, el catalogo muestra "Consultar". */
  function formatearPrecio(precio) {
    if (precio === null || precio === undefined || precio === "") { return null; }
    var n = Number(precio);
    if (isNaN(n)) { return null; }
    try {
      return new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: CONFIG.moneda,
        maximumFractionDigits: 0
      }).format(n);
    } catch (e) {
      // Si la moneda de CONFIG no es valida, se degrada a numero simple.
      return n.toLocaleString("es-CR");
    }
  }

  /* Mensaje de WhatsApp. Cambia segun haya precio o la prenda este apartada:
     es exactamente lo que la clienta iba a escribir de todos modos. */
  function mensajeWhatsApp(prenda) {
    var talla = prenda.talla ? " (talla " + prenda.talla + ")" : "";
    var base;

    if (prenda.situacion === "apartado") {
      base = "Hola Juli, la referencia " + prenda.ref + " — " + prenda.nombre +
             talla + " esta apartada. Si se libera, me avisas?";
    } else {
      base = "Hola Juli, me interesa la referencia " + prenda.ref + " — " +
             prenda.nombre + talla + ". Sigue disponible?";
      if (prenda.precio === null || prenda.precio === undefined) {
        base += " Me pasas el precio?";
      }
    }
    return base;
  }

  function enlaceWhatsApp(texto) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
  }

  function enlacePrenda(ref) {
    return CONFIG.sitio + "/?ref=" + encodeURIComponent(ref);
  }

  /* Orden: recien llegados, luego por fecha de ingreso descendente,
     vendidos siempre al final. */
  function ordenar(a, b) {
    var pa = PESO_SITUACION[a.situacion];
    var pb = PESO_SITUACION[b.situacion];
    if (pa !== pb) { return pa - pb; }
    var fa = a.ingreso || "";
    var fb = b.ingreso || "";
    if (fa !== fb) { return fa < fb ? 1 : -1; }
    return a.ref < b.ref ? 1 : -1;
  }

  /* La imagen puede no existir todavia (carpeta img/productos vacia).
     En vez de un icono roto, se muestra un recuadro con la referencia. */
  function manejarFotoRota(img, ref) {
    img.addEventListener("error", function () {
      var hueco = crear("div", "foto-ausente");
      hueco.appendChild(crear("span", "foto-ausente__ref", ref));
      hueco.appendChild(crear("span", "foto-ausente__texto", "Foto pendiente"));
      if (img.parentNode) { img.parentNode.replaceChild(hueco, img); }
    });
  }


  /* ------------------------------------------------------------------------
     4. FILTROS
     ------------------------------------------------------------------------ */

  function categoriasConPrendas() {
    return CATEGORIAS.filter(function (cat) {
      return estado.prendas.some(function (p) { return p.categoria === cat; });
    });
  }

  function dibujarFiltros() {
    dom.filtros.textContent = "";

    var lista = [null].concat(categoriasConPrendas());

    lista.forEach(function (cat) {
      var boton = crear("button", "chip", cat === null ? "Todo" : cat);
      boton.type = "button";
      boton.setAttribute("aria-pressed", String(estado.categoriaActiva === cat));
      if (estado.categoriaActiva === cat) { boton.classList.add("chip--activo"); }

      boton.addEventListener("click", function () {
        estado.categoriaActiva = cat;
        dibujarFiltros();
        dibujarRejilla();
      });

      dom.filtros.appendChild(boton);
    });
  }


  /* ------------------------------------------------------------------------
     5. REJILLA
     ------------------------------------------------------------------------ */

  function prendasVisibles() {
    var lista = estado.prendas.slice();
    if (estado.categoriaActiva !== null) {
      lista = lista.filter(function (p) { return p.categoria === estado.categoriaActiva; });
    }
    return lista.sort(ordenar);
  }

  function crearTarjeta(prenda, indice) {
    var li = crear("li", "tarjeta");
    if (prenda.situacion === "vendido") { li.classList.add("tarjeta--vendida"); }

    var boton = crear("button", "tarjeta__boton");
    boton.type = "button";
    boton.setAttribute("aria-label", "Ver detalle de " + prenda.nombre + ", referencia " + prenda.ref);
    boton.dataset.ref = prenda.ref;

    /* --- Foto --- */
    var marco = crear("div", "tarjeta__marco");

    if (prenda.fotos.length > 0) {
      var img = document.createElement("img");
      img.src = prenda.fotos[0];
      img.alt = prenda.nombre;
      img.width = 600;
      img.height = 800;
      // Las primeras cuatro se cargan de una: son las que el visitante ve
      // antes de hacer scroll. El resto se difiere.
      img.loading = indice < 4 ? "eager" : "lazy";
      img.decoding = "async";
      manejarFotoRota(img, prenda.ref);
      marco.appendChild(img);
    } else {
      var hueco = crear("div", "foto-ausente");
      hueco.appendChild(crear("span", "foto-ausente__ref", prenda.ref));
      hueco.appendChild(crear("span", "foto-ausente__texto", "Foto pendiente"));
      marco.appendChild(hueco);
    }

    var sello = SELLOS[prenda.situacion];
    if (sello) {
      marco.appendChild(crear("span", "sello sello--" + prenda.situacion, sello));
    }

    if (prenda.fotos.length > 1) {
      marco.appendChild(crear("span", "contador-fotos", prenda.fotos.length + " fotos"));
    }

    boton.appendChild(marco);

    /* --- Texto --- */
    var cuerpo = crear("div", "tarjeta__cuerpo");
    cuerpo.appendChild(crear("h2", "tarjeta__nombre", prenda.nombre));

    var meta = crear("p", "tarjeta__meta");
    meta.textContent = "Ref. " + prenda.ref + (prenda.talla ? " · Talla " + prenda.talla : "");
    cuerpo.appendChild(meta);

    // La linea de precio nunca queda vacia: o el monto, o "Consultar".
    var precioTexto = formatearPrecio(prenda.precio);
    var precio = crear("p", "tarjeta__precio", precioTexto || "Consultar");
    if (!precioTexto) { precio.classList.add("tarjeta__precio--consultar"); }
    cuerpo.appendChild(precio);

    boton.appendChild(cuerpo);
    li.appendChild(boton);

    boton.addEventListener("click", function () { abrirFicha(prenda, boton); });

    return li;
  }

  function dibujarRejilla() {
    var lista = prendasVisibles();
    dom.rejilla.textContent = "";

    if (lista.length === 0) {
      dom.rejilla.hidden = true;
      dom.vacio.hidden = false;
      return;
    }

    dom.rejilla.hidden = false;
    dom.vacio.hidden = true;

    lista.forEach(function (prenda, i) {
      dom.rejilla.appendChild(crearTarjeta(prenda, i));
    });
  }


  /* ------------------------------------------------------------------------
     6. FICHA (MODAL)
     ------------------------------------------------------------------------ */

  function dibujarGaleria(prenda) {
    var galeria = dom.ficha.querySelector(".ficha__galeria");
    var puntos = dom.ficha.querySelector(".ficha__puntos");
    galeria.textContent = "";
    puntos.textContent = "";
    estado.fotoActiva = 0;

    var fotos = prenda.fotos.length > 0 ? prenda.fotos : [null];

    fotos.forEach(function (ruta, i) {
      var lamina = crear("div", "lamina");
      if (ruta) {
        var img = document.createElement("img");
        img.src = ruta;
        img.alt = prenda.nombre + ", foto " + (i + 1) + " de " + fotos.length;
        img.decoding = "async";
        manejarFotoRota(img, prenda.ref);
        lamina.appendChild(img);
      } else {
        var hueco = crear("div", "foto-ausente");
        hueco.appendChild(crear("span", "foto-ausente__ref", prenda.ref));
        hueco.appendChild(crear("span", "foto-ausente__texto", "Foto pendiente"));
        lamina.appendChild(hueco);
      }
      galeria.appendChild(lamina);
    });

    var hayVarias = fotos.length > 1;
    dom.ficha.querySelector(".ficha__flecha--previa").hidden = !hayVarias;
    dom.ficha.querySelector(".ficha__flecha--siguiente").hidden = !hayVarias;

    if (hayVarias) {
      fotos.forEach(function (_, i) {
        var punto = crear("button", "punto");
        punto.type = "button";
        punto.setAttribute("aria-label", "Ver foto " + (i + 1));
        if (i === 0) { punto.classList.add("punto--activo"); }
        punto.addEventListener("click", function () { irAFoto(i); });
        puntos.appendChild(punto);
      });
    }
  }

  function irAFoto(indice) {
    var galeria = dom.ficha.querySelector(".ficha__galeria");
    var laminas = galeria.querySelectorAll(".lamina");
    if (laminas.length === 0) { return; }

    indice = Math.max(0, Math.min(indice, laminas.length - 1));
    estado.fotoActiva = indice;

    galeria.scrollTo({
      left: laminas[indice].offsetLeft - galeria.offsetLeft,
      behavior: prefiereMenosMovimiento() ? "auto" : "smooth"
    });

    var puntos = dom.ficha.querySelectorAll(".punto");
    puntos.forEach(function (p, i) {
      p.classList.toggle("punto--activo", i === indice);
    });
  }

  function prefiereMenosMovimiento() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function dibujarDatos(prenda) {
    dom.ficha.querySelector(".ficha__nombre").textContent = prenda.nombre;

    var precioTexto = formatearPrecio(prenda.precio);
    var elPrecio = dom.ficha.querySelector(".ficha__precio");
    elPrecio.textContent = precioTexto || "Consultar por WhatsApp";
    elPrecio.classList.toggle("ficha__precio--consultar", !precioTexto);

    var elSello = dom.ficha.querySelector(".ficha__sello");
    var sello = SELLOS[prenda.situacion];
    elSello.textContent = sello || "";
    elSello.hidden = !sello;
    elSello.className = "ficha__sello" + (sello ? " sello sello--" + prenda.situacion : "");

    /* Tabla de atributos: solo se dibujan los campos con contenido. */
    var datos = dom.ficha.querySelector(".ficha__datos");
    datos.textContent = "";

    var campos = [
      ["Referencia", prenda.ref],
      ["Categoria", prenda.categoria],
      ["Talla", prenda.talla],
      ["Medidas", prenda.medidas],
      ["Estado", prenda.estado]
    ];

    campos.forEach(function (par) {
      if (!par[1]) { return; }
      var fila = crear("div", "ficha__fila");
      fila.appendChild(crear("dt", null, par[0]));
      fila.appendChild(crear("dd", null, par[1]));
      datos.appendChild(fila);
    });

    var desc = dom.ficha.querySelector(".ficha__descripcion");
    desc.textContent = prenda.descripcion || "";
    desc.hidden = !prenda.descripcion;

    /* Boton de WhatsApp: la prenda vendida no lo lleva. */
    var wa = dom.ficha.querySelector(".ficha__wa");
    if (prenda.situacion === "vendido") {
      wa.hidden = true;
    } else {
      wa.hidden = false;
      wa.href = enlaceWhatsApp(mensajeWhatsApp(prenda));
      wa.textContent = prenda.situacion === "apartado"
        ? "Consultar si se libera"
        : "Preguntar por WhatsApp";
    }

    var nota = dom.ficha.querySelector(".ficha__nota-vendida");
    nota.hidden = prenda.situacion !== "vendido";
  }

  function abrirFicha(prenda, origen) {
    estado.prendaAbierta = prenda;
    estado.elementoQueAbrioModal = origen || document.activeElement;

    dibujarGaleria(prenda);
    dibujarDatos(prenda);

    dom.ficha.setAttribute("aria-label", prenda.nombre + ", referencia " + prenda.ref);
    dom.fondo.hidden = false;
    dom.ficha.hidden = false;
    document.body.classList.add("sin-scroll");

    // La URL pasa a apuntar a esta prenda, para que se pueda compartir
    // en cualquier momento sin tener que tocar "compartir" primero.
    actualizarURL(prenda.ref);

    // El foco entra al modal. Requisito de accesibilidad, no adorno.
    var cerrar = dom.ficha.querySelector(".ficha__cerrar");
    if (cerrar) { cerrar.focus(); }
  }

  function cerrarFicha() {
    dom.ficha.hidden = true;
    dom.fondo.hidden = true;
    document.body.classList.remove("sin-scroll");
    estado.prendaAbierta = null;
    actualizarURL(null);

    if (estado.elementoQueAbrioModal && document.contains(estado.elementoQueAbrioModal)) {
      estado.elementoQueAbrioModal.focus();
    }
    estado.elementoQueAbrioModal = null;
  }

  /* history.replaceState lanza SecurityError cuando la pagina se abre con
     doble clic (protocolo file://). Se ignora: el catalogo tiene que
     funcionar igual al revisarlo antes de publicar. */
  function actualizarURL(ref) {
    try {
      var destino = ref
        ? window.location.pathname + "?ref=" + encodeURIComponent(ref)
        : window.location.pathname;
      window.history.replaceState(null, "", destino);
    } catch (e) { /* file:// */ }
  }

  /* Foco atrapado dentro del modal mientras esta abierto (WCAG 2.1, 2.4.3). */
  function atraparFoco(evento) {
    if (dom.ficha.hidden || evento.key !== "Tab") { return; }

    var focoables = dom.ficha.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    var visibles = Array.prototype.filter.call(focoables, function (el) {
      return el.offsetParent !== null && !el.hidden;
    });
    if (visibles.length === 0) { return; }

    var primero = visibles[0];
    var ultimo = visibles[visibles.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }


  /* ------------------------------------------------------------------------
     7. COMPARTIR
     --------------------------------------------------------------------------
     navigator.share existe en moviles y en algunos navegadores de escritorio.
     Cuando no esta, se copia al portapapeles. Cuando tampoco se puede copiar
     (file://, permisos), se muestra el enlace para copiarlo a mano: nunca se
     deja al visitante sin salida.
     ------------------------------------------------------------------------ */

  function avisar(mensaje) {
    dom.aviso.textContent = mensaje;
    dom.aviso.hidden = false;
    clearTimeout(dom.aviso._temporizador);
    dom.aviso._temporizador = setTimeout(function () {
      dom.aviso.hidden = true;
    }, 2600);
  }

  function copiarAlPortapapeles(texto) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(
        function () { avisar("Enlace copiado"); },
        function () { copiarRespaldo(texto); }
      );
    } else {
      copiarRespaldo(texto);
    }
  }

  function copiarRespaldo(texto) {
    var caja = document.createElement("textarea");
    caja.value = texto;
    caja.setAttribute("readonly", "");
    caja.style.position = "fixed";
    caja.style.opacity = "0";
    document.body.appendChild(caja);
    caja.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(caja);
    avisar(ok ? "Enlace copiado" : "Copiar a mano: " + texto);
  }

  function compartir(titulo, texto, url) {
    if (navigator.share) {
      navigator.share({ title: titulo, text: texto, url: url }).catch(function () {
        // El usuario cancelo la hoja de compartir. No es un error.
      });
    } else {
      copiarAlPortapapeles(url);
    }
  }


  /* ------------------------------------------------------------------------
     8. ENLACES PROFUNDOS
     ------------------------------------------------------------------------ */

  function abrirDesdeURL() {
    var ref;
    try {
      ref = new URLSearchParams(window.location.search).get("ref");
    } catch (e) {
      ref = null;
    }
    if (!ref) { return; }

    var prenda = estado.prendas.filter(function (p) { return p.ref === ref; })[0];
    // Referencia inexistente: carga normal, sin mensaje de error. La prenda
    // pudo haberse vendido y borrado; no es culpa de quien abre el enlace.
    if (prenda) { abrirFicha(prenda, null); }
  }


  /* ------------------------------------------------------------------------
     9. ARRANQUE
     ------------------------------------------------------------------------ */

  function init() {
    dom.filtros = document.getElementById("filtros");
    dom.rejilla = document.getElementById("rejilla");
    dom.vacio   = document.getElementById("vacio");
    dom.ficha   = document.getElementById("ficha");
    dom.fondo   = document.getElementById("fondo");
    dom.aviso   = document.getElementById("aviso");

    estado.prendas = validarPrendas(PRENDAS);

    /* --- Textos que vienen de CONFIG --- */
    document.getElementById("negocio").textContent = CONFIG.negocio;
    document.getElementById("lema").textContent = CONFIG.lema;
    document.getElementById("anio").textContent = new Date().getFullYear();
    document.title = CONFIG.negocio;

    var waGeneral = enlaceWhatsApp("Hola Juli, vi el catalogo y quiero consultar algo.");
    ["wa-general", "wa-flotante", "wa-vacio", "wa-noscript"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.href = waGeneral;
        el.setAttribute("rel", "noopener noreferrer");
      }
    });

    /* --- Render inicial --- */
    dibujarFiltros();
    dibujarRejilla();

    /* --- Compartir catalogo completo --- */
    document.getElementById("compartir-sitio").addEventListener("click", function () {
      compartir(CONFIG.negocio, CONFIG.lema, CONFIG.sitio + "/");
    });

    /* --- Controles de la ficha --- */
    dom.ficha.querySelector(".ficha__cerrar").addEventListener("click", cerrarFicha);
    dom.fondo.addEventListener("click", cerrarFicha);

    dom.ficha.querySelector(".ficha__flecha--previa").addEventListener("click", function () {
      irAFoto(estado.fotoActiva - 1);
    });
    dom.ficha.querySelector(".ficha__flecha--siguiente").addEventListener("click", function () {
      irAFoto(estado.fotoActiva + 1);
    });

    dom.ficha.querySelector(".ficha__compartir").addEventListener("click", function () {
      if (!estado.prendaAbierta) { return; }
      var p = estado.prendaAbierta;
      compartir(
        p.nombre + " — " + CONFIG.negocio,
        "Mira esta prenda: " + p.nombre + " (ref. " + p.ref + ")",
        enlacePrenda(p.ref)
      );
    });

    /* --- Teclado --- */
    document.addEventListener("keydown", function (e) {
      if (dom.ficha.hidden) { return; }
      if (e.key === "Escape") { cerrarFicha(); }
      else if (e.key === "ArrowLeft") { irAFoto(estado.fotoActiva - 1); }
      else if (e.key === "ArrowRight") { irAFoto(estado.fotoActiva + 1); }
      else { atraparFoco(e); }
    });

    /* --- Los puntos siguen el deslizamiento manual de la galeria --- */
    var galeria = dom.ficha.querySelector(".ficha__galeria");
    var temporizador = null;
    galeria.addEventListener("scroll", function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        var ancho = galeria.clientWidth;
        if (ancho === 0) { return; }
        var i = Math.round(galeria.scrollLeft / ancho);
        estado.fotoActiva = i;
        dom.ficha.querySelectorAll(".punto").forEach(function (p, j) {
          p.classList.toggle("punto--activo", j === i);
        });
      }, 90);
    });

    abrirDesdeURL();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
