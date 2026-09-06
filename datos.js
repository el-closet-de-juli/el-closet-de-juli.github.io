/* ==========================================================================
   EL CLOSET DE JULI - Datos del catalogo
   --------------------------------------------------------------------------
   ESTE ES EL UNICO ARCHIVO QUE HAY QUE EDITAR PARA ACTUALIZAR EL CATALOGO.
   No hace falta tocar HTML ni CSS.

   Como agregar una prenda: copiar un bloque completo entre llaves { },
   pegarlo antes del corchete final ] y cambiar los valores.
   Ojo con la coma al final de cada bloque.
   ========================================================================== */


/* --------------------------------------------------------------------------
   CONFIGURACION GENERAL
   -------------------------------------------------------------------------- */

const CONFIG = {
  // Numero de WhatsApp en formato internacional, sin espacios ni signos.
  // 506 = Costa Rica. TODO: confirmar si se usa este numero o uno aparte
  // para el emprendimiento de ropa.
  whatsapp: "50672688481",

  // Nombre visible del negocio.
  negocio: "El Closet de Juli",

  // Frase corta bajo el titulo. Maximo una linea.
  lema: "Ropa seleccionada a mano, en el Gran Area Metropolitana",

  // Moneda para formatear precios cuando se activen.
  // "CRC" = colones costarricenses. "USD" = dolares.
  moneda: "CRC"
};


/* --------------------------------------------------------------------------
   CATEGORIAS
   --------------------------------------------------------------------------
   El orden de esta lista define el orden de los filtros en pantalla.
   Si una categoria no tiene prendas, no aparece: el filtro se genera solo.
   -------------------------------------------------------------------------- */

const CATEGORIAS = [
  "Pantalones",
  "Abrigos",
  "Faldas",
  "Blusas",
  "Vestidos",
  "Zapatos",
  "Hombre",
  "Accesorios"
];


/* --------------------------------------------------------------------------
   PRENDAS
   --------------------------------------------------------------------------
   Campos de cada prenda:

   ref         Codigo corto y unico. Es lo que la clienta menciona por
               WhatsApp ("quiero la 014"). Nunca reutilizar un codigo,
               aunque la prenda ya se haya vendido.
   nombre      Nombre corto y descriptivo. Va como titulo.
   categoria   Debe coincidir EXACTAMENTE con una de CATEGORIAS.
   talla       Texto libre: "S", "38", "Talla 8", "Unica".
   estado      Texto libre y honesto: "Nuevo con etiqueta", "Como nuevo",
               "Muy buen estado", "Buen estado, uso leve".
   descripcion Una o dos frases. Material, corte, detalle relevante.
   precio      Numero sin simbolos (35000) o null para "Consultar precio".
   disponible  true si sigue a la venta, false si ya se vendio.
   imagen      Ruta al archivo dentro de img/productos/.
               Si el archivo no existe, se muestra un marcador con la ref.
   -------------------------------------------------------------------------- */

const PRENDAS = [

  /* ---- EJEMPLOS: reemplazar por inventario real ---- */

  {
    ref: "001",
    nombre: "Abrigo de lana camel",
    categoria: "Abrigos",
    talla: "M",
    estado: "Como nuevo",
    descripcion: "Corte largo con cinturon de la misma tela. Forro interno completo.",
    precio: null,
    disponible: true,
    imagen: "img/productos/001.jpg"
  },

  {
    ref: "002",
    nombre: "Pantalon de mezclilla tiro alto",
    categoria: "Pantalones",
    talla: "28",
    estado: "Muy buen estado",
    descripcion: "Corte recto, mezclilla rigida sin elastano.",
    precio: null,
    disponible: true,
    imagen: "img/productos/002.jpg"
  },

  {
    ref: "003",
    nombre: "Falda midi plisada",
    categoria: "Faldas",
    talla: "S",
    estado: "Nuevo con etiqueta",
    descripcion: "Caida fluida, pretina elastica. Combina con botas o sandalia baja.",
    precio: null,
    disponible: true,
    imagen: "img/productos/003.jpg"
  },

  {
    ref: "004",
    nombre: "Botines de cuero cafe",
    categoria: "Zapatos",
    talla: "37",
    estado: "Buen estado, uso leve",
    descripcion: "Cuero genuino, tacon bajo de bloque. Suela con desgaste minimo.",
    precio: null,
    disponible: true,
    imagen: "img/productos/004.jpg"
  },

  {
    ref: "005",
    nombre: "Camisa de lino manga larga",
    categoria: "Hombre",
    talla: "L",
    estado: "Como nuevo",
    descripcion: "Lino puro, corte regular. Ideal para clima calido.",
    precio: null,
    disponible: true,
    imagen: "img/productos/005.jpg"
  },

  {
    ref: "006",
    nombre: "Blusa de seda estampada",
    categoria: "Blusas",
    talla: "M",
    estado: "Muy buen estado",
    descripcion: "Estampado floral pequeno sobre fondo claro. Botones forrados.",
    precio: null,
    disponible: false,
    imagen: "img/productos/006.jpg"
  }

];
