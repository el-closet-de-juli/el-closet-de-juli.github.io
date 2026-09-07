# ============================================================================
# publicar.ps1 - Sube los cambios del catalogo a GitHub Pages.
# ----------------------------------------------------------------------------
# Uso:   .\publicar.ps1 "Agrega 8 prendas nuevas"
#
# Hace, en orden: mostrar cambios, pedir confirmacion, commit, sincronizar
# con el remoto y publicar. El sitio se actualiza solo 1-3 minutos despues.
#
# ADVERTENCIA DE SEGURIDAD
# Este script sube TODO lo que este en la carpeta y el repositorio es
# PUBLICO. Lo que se sube queda en el historial aunque despues se borre.
# Por eso muestra la lista y pide confirmacion antes de actuar: leerla es
# la unica barrera entre este disco y el internet. Los archivos que nunca
# deben subirse van en .gitignore.
# ============================================================================

param(
  [Parameter(Mandatory = $true)]
  [string]$Mensaje
)

$ErrorActionPreference = "Stop"

# Confirma que estamos dentro de un repositorio Git antes de tocar nada.
if (-not (Test-Path ".git")) {
  Write-Host "Esta carpeta no es un repositorio Git." -ForegroundColor Red
  Write-Host "Moverse a la carpeta del repositorio y volver a intentar."
  exit 1
}

Write-Host "`n1/4  Cambios detectados:" -ForegroundColor Cyan
git status --short

if (-not (git status --porcelain)) {
  Write-Host "`nNo hay nada que publicar." -ForegroundColor Yellow
  exit 0
}

$respuesta = Read-Host "`nContinuar? (s/n)"
if ($respuesta -ne "s") {
  Write-Host "Cancelado. No se subio nada." -ForegroundColor Yellow
  exit 0
}

Write-Host "`n2/4  Guardando el commit..." -ForegroundColor Cyan
git add -A
git commit -m $Mensaje

# El pull va DESPUES del commit, no antes: 'git pull --rebase' se niega a
# correr si quedan cambios sin confirmar en el directorio de trabajo.
Write-Host "`n3/4  Sincronizando con el remoto..." -ForegroundColor Cyan
git pull --rebase

Write-Host "`n4/4  Publicando..." -ForegroundColor Cyan
git push

Write-Host "`nListo. El sitio se actualiza en 1-3 minutos:" -ForegroundColor Green
Write-Host "https://el-closet-de-juli.github.io/`n"
