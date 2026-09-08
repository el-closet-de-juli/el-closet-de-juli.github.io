# ============================================================================
# importar.ps1 - Mueve lo que admin.html descargo a su lugar en el proyecto.
# ----------------------------------------------------------------------------
# Uso:   .\importar.ps1
#
# El panel descarga las fotos renombradas (001-1.webp, 001-2.webp...) y el
# archivo datos.js a la carpeta de Descargas. Este script los mueve a
# img\productos\ y a js\datos.js, que es lo unico tedioso del flujo.
#
# Muestra todo lo que va a mover y pide confirmacion antes de tocar nada.
# No borra: mueve. Si algo sale mal, los archivos estan en su destino, no
# perdidos.
# ============================================================================

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".git")) {
  Write-Host "Esta carpeta no es el repositorio del sitio." -ForegroundColor Red
  Write-Host "Moverse a la carpeta del repositorio y volver a intentar."
  exit 1
}

# --- Ubicar la carpeta de Descargas ---
# Se lee del registro porque puede estar redirigida a OneDrive; asumir
# %USERPROFILE%\Downloads falla en esas maquinas.
$guidDescargas = '{374DE290-123F-4565-9164-39C4925E467B}'
try {
  $descargas = (Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders').$guidDescargas
  $descargas = [Environment]::ExpandEnvironmentVariables($descargas)
} catch {
  $descargas = Join-Path $env:USERPROFILE "Downloads"
}

if (-not (Test-Path $descargas)) {
  Write-Host "No se encontro la carpeta de Descargas en: $descargas" -ForegroundColor Red
  exit 1
}

Write-Host "`nBuscando en: $descargas" -ForegroundColor DarkGray

# --- Fotos con el patron que genera el panel: 001-1.webp, 014-3.jpg... ---
$fotos = Get-ChildItem -Path $descargas -File |
         Where-Object { $_.Name -match '^\d+-[123]\.(webp|jpg|jpeg|png)$' } |
         Sort-Object Name

# --- datos.js (el navegador puede haberlo guardado como "datos (1).js") ---
$datos = Get-ChildItem -Path $descargas -File -Filter "datos*.js" |
         Sort-Object LastWriteTime -Descending |
         Select-Object -First 1

if (-not $fotos -and -not $datos) {
  Write-Host "`nNo hay nada que importar." -ForegroundColor Yellow
  Write-Host "Esperaba fotos con nombre 001-1.webp o un archivo datos.js.`n"
  exit 0
}

Write-Host "`nSe van a mover:" -ForegroundColor Cyan

if ($fotos) {
  Write-Host "`n  Fotos -> img\productos\" -ForegroundColor White
  foreach ($f in $fotos) {
    $kb = [math]::Round($f.Length / 1KB)
    $alerta = if ($kb -gt 250) { "  <-- pesa mas de 250 KB" } else { "" }
    $color = if ($kb -gt 250) { "Yellow" } else { "Gray" }
    Write-Host ("    {0,-20} {1,5} KB{2}" -f $f.Name, $kb, $alerta) -ForegroundColor $color
  }
}

if ($datos) {
  Write-Host "`n  Catalogo -> js\datos.js" -ForegroundColor White
  Write-Host ("    {0,-20} descargado {1}" -f $datos.Name, $datos.LastWriteTime) -ForegroundColor Gray

  if ($datos.Name -ne "datos.js") {
    Write-Host "    Nota: el navegador lo guardo con otro nombre. Se toma el mas reciente." -ForegroundColor Yellow
  }
}

# Advertencia util: subir el catalogo sin las fotos deja huecos en el sitio.
if ($datos -and -not $fotos) {
  Write-Host "`n  Aviso: hay catalogo pero no fotos nuevas. Si las prendas" -ForegroundColor Yellow
  Write-Host "  agregadas esperan fotos, van a salir como 'Foto pendiente'." -ForegroundColor Yellow
}

$respuesta = Read-Host "`nContinuar? (s/n)"
if ($respuesta -ne "s") {
  Write-Host "Cancelado. No se movio nada.`n" -ForegroundColor Yellow
  exit 0
}

# --- Mover ---
if ($fotos) {
  if (-not (Test-Path "img\productos")) {
    New-Item -ItemType Directory -Path "img\productos" -Force | Out-Null
  }
  foreach ($f in $fotos) {
    Move-Item -Path $f.FullName -Destination "img\productos\$($f.Name)" -Force
  }
  Write-Host "`n$($fotos.Count) foto(s) movida(s) a img\productos\" -ForegroundColor Green
}

if ($datos) {
  Move-Item -Path $datos.FullName -Destination "js\datos.js" -Force
  Write-Host "Catalogo actualizado en js\datos.js" -ForegroundColor Green
}

Write-Host "`nSiguiente paso: abrir index.html y revisar que se vea bien." -ForegroundColor Cyan
Write-Host "Si esta correcto:  .\publicar.ps1 `"Agrega prendas nuevas`"`n"
