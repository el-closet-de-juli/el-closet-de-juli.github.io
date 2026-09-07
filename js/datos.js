/* ==========================================================================
   EL CLOSET DE JULI - Datos del catalogo
   --------------------------------------------------------------------------
   ESTE ARCHIVO SE GENERA DESDE admin.html.

   El camino recomendado para actualizar el catalogo es abrir admin.html,
   hacer los cambios ahi y generar este archivo de nuevo. Editarlo a mano
   funciona, pero cada coma fuera de lugar deja el sitio en blanco.

   Si aun asi se edita a mano: revisar que cada bloque { } termine en coma,
   menos el ultimo.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. CONFIGURACION GENERAL
   -------------------------------------------------------------------------- */

const CONFIG = {
  // Numero de WhatsApp en formato internacional, solo digitos.
  // 506 = Costa Rica. Sin +, sin espacios, sin guiones.
  whatsapp: "50672688481",

  // Nombre visible del negocio.
  negocio: "El Closet de Juli",

  // Frase corta bajo el titulo. Una sola linea.
  lema: "Ropa seleccionada a mano, en el Gran Area Metropolitana",

  // URL publica del sitio. Se usa para armar los enlaces que se comparten.
  // Sin barra al final.
  sitio: "https://el-closet-de-juli.github.io",

  // Moneda para formatear precios. "CRC" = colones, "USD" = dolares.
  moneda: "CRC"
};


/* --------------------------------------------------------------------------
   2. CATEGORIAS
   --------------------------------------------------------------------------
   El orden de esta lista define el orden de los filtros en pantalla.
   Una categoria sin prendas no genera filtro: no hay que borrarla.
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
   3. PRENDAS
   --------------------------------------------------------------------------
   Campos de cada prenda:

   ref          Codigo corto y unico. Es lo que la clienta menciona por
                WhatsApp ("quiero la 014"). NUNCA se reutiliza, ni siquiera
                cuando la prenda anterior ya se vendio.
   nombre       Como se llama la prenda en la tarjeta.
   categoria    Tiene que existir en la lista CATEGORIAS de arriba.
   talla        Texto libre: "M", "38", "Unica". Puede quedar vacio "".
   medidas      Medidas reales. En ropa usada la etiqueta miente entre
                marcas y decadas: esto evita devoluciones. Puede ir vacio.
   estado       "Nueva con etiqueta", "Muy buen estado", "Buen estado"...
   descripcion  Dos o tres lineas. Si hay un defecto, se menciona aqui.
   precio       Numero sin simbolos ni puntos (18000), o null para que la
                prenda muestre "Consultar por WhatsApp".
   situacion    "nuevo"       recien ingresada, se ordena de primero
                "disponible"  normal
                "apartado"    reservada, sigue visible
                "vendido"     en gris, al final, sin boton de WhatsApp
   fotos        De 1 a 3 rutas. La primera es la que se ve en la rejilla.
   ingreso      Fecha en formato AAAA-MM-DD. Define el orden por recientes.
   -------------------------------------------------------------------------- */

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
    ref: "002",
    nombre: "Pantalon de lino",
    categoria: "Pantalones",
    talla: "S",
    medidas: "Cintura 68 cm · Largo 98 cm",
    estado: "Buen estado",
    descripcion: "Lino natural color arena, tiro alto, caida suelta. Una arruga permanente en el ruedo derecho.",
    precio: null,
    situacion: "disponible",
    fotos: [
      "img/productos/002-1.webp",
      "img/productos/002-2.webp",
      "img/productos/002-3.webp"
    ],
    ingreso: "2026-09-05"
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
    situacion: "disponible",
    fotos: [
      "img/productos/003-1.webp",
      "img/productos/003-2.webp"
    ],
    ingreso: "2026-09-04"
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
