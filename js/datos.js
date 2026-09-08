/* ==========================================================================
   EL CLOSET DE JULI - Datos del catalogo
   --------------------------------------------------------------------------
   ARCHIVO GENERADO DESDE panel-9f3a2c.html el 2026-09-08.

   Para actualizar el catalogo: abrir panel-9f3a2c.html, hacer los cambios y
   generar este archivo de nuevo. Editarlo a mano funciona, pero una coma
   fuera de lugar deja el sitio en blanco.
   ========================================================================== */


const CONFIG = {
  // Numero de WhatsApp en formato internacional, solo digitos.
  whatsapp: "50672688481",

  negocio: "El Closet de Juli",

  // Frase corta bajo el titulo. Es lo que se ve al compartir el enlace.
  lema: "Ropa con historia, elegida a mano",

  // Direccion publica del sitio, sin barra al final.
  sitio: "https://el-closet-de-juli.github.io",

  // "CRC" = colones, "USD" = dolares.
  moneda: "CRC"
};


/* El orden de esta lista define el orden de los filtros en pantalla.
   Una categoria sin prendas no genera filtro. */

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


/* situacion:  "nuevo" | "disponible" | "apartado" | "vendido"
   precio:     numero sin simbolos, o null para "Consultar por WhatsApp" */

const PRENDAS = [

  {
    ref: "001",
    nombre: "Chaqueta de mezclilla",
    categoria: "Abrigos",
    talla: "M",
    medidas: "Busto 96 cm · Largo 62 cm",
    estado: "Muy buen estado",
    descripcion: "Corte clasico, botones metalicos. Mezclilla firme, sin desgaste en codos ni cuello.",
    precio: 18000,
    situacion: "nuevo",
    fotos: [
      "img/productos/001-1.webp",
      "img/productos/001-2.webp"
    ],
    ingreso: "2026-09-06"
  },

  {
    ref: "005",
    nombre: "Botines de cuero",
    categoria: "Zapatos",
    talla: "37",
    medidas: "Plantilla 23.5 cm · Tacon 4 cm",
    estado: "Muy buen estado",
    descripcion: "Cuero genuino cafe, suela con poco uso. Cierre lateral en buen estado.",
    precio: 22000,
    situacion: "disponible",
    fotos: [
      "img/productos/005-1.webp",
      "img/productos/005-2.webp",
      "img/productos/005-3.webp"
    ],
    ingreso: "2026-09-02"
  },

  {
    ref: "002",
    nombre: "Pantalon de lino",
    categoria: "Pantalones",
    talla: "S",
    medidas: "Cintura 68 cm · Largo 98 cm",
    estado: "Buen estado",
    descripcion: "Lino natural color arena, tiro alto, caida suelta. Una arruga permanente en el ruedo derecho.",
    precio: null,
    situacion: "apartado",
    fotos: [
      "img/productos/002-1.webp",
      "img/productos/002-2.webp",
      "img/productos/002-3.webp"
    ],
    ingreso: "2026-09-05"
  },

  {
    ref: "004",
    nombre: "Falda midi plisada",
    categoria: "Faldas",
    talla: "L",
    medidas: "Cintura 76 cm · Largo 72 cm",
    estado: "Buen estado",
    descripcion: "Plisado permanente color terracota. Elastico en la cintura, comoda para el diario.",
    precio: null,
    situacion: "apartado",
    fotos: [
      "img/productos/004-1.webp"
    ],
    ingreso: "2026-09-03"
  },

  {
    ref: "003",
    nombre: "Vestido floral manga corta",
    categoria: "Vestidos",
    talla: "M",
    medidas: "Busto 92 cm · Largo 108 cm",
    estado: "Muy buen estado",
    descripcion: "Estampado floral pequeno sobre fondo crema. Forro completo, cierre invisible lateral.",
    precio: 12500,
    situacion: "vendido",
    fotos: [
      "img/productos/003-1.webp",
      "img/productos/003-2.webp"
    ],
    ingreso: "2026-09-04"
  },

  {
    ref: "006",
    nombre: "Blusa de seda",
    categoria: "Blusas",
    talla: "S",
    medidas: "",
    estado: "Buen estado",
    descripcion: "Seda color hueso, cuello redondo. Se vendio la semana pasada.",
    precio: null,
    situacion: "vendido",
    fotos: [
      "img/productos/006-1.webp"
    ],
    ingreso: "2026-08-28"
  }

];
