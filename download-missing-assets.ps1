$ErrorActionPreference = 'Stop'

$TobyWebRoot = 'C:\Users\purpl\Toby-Web'
$HubRoot = $PSScriptRoot
$ChapterNumbers = 1..5
$GameFolders = @('files/chapter1', 'files/chapter2', 'files/chapter3', 'files/chapter4', 'files/chapter5', 'files/undertale', 'files/vendor')

if (-not (Test-Path -LiteralPath (Join-Path $TobyWebRoot '.git'))) {
  throw "I couldn't find the Toby-Web Git checkout at $TobyWebRoot."
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw 'Git is required. Install Git for Windows, then run this script again.'
}

Write-Host 'Fetching Deltarune Chapters 1-5 and Undertale from the existing Toby-Web checkout...'
& git -c "safe.directory=$TobyWebRoot" -C $TobyWebRoot sparse-checkout add @GameFolders
if ($LASTEXITCODE -ne 0) { throw 'Git could not fetch the selected folders.' }
& git -c "safe.directory=$TobyWebRoot" -C $TobyWebRoot sparse-checkout add --skip-checks files/mobile-controls.js
if ($LASTEXITCODE -ne 0) { throw 'Git could not fetch the shared mobile-controls script.' }

foreach ($chapter in $ChapterNumbers) {
  $name = "chapter$chapter"
  $source = Join-Path $TobyWebRoot "files\$name"
  $target = Join-Path $HubRoot "games\deltarune\$name"
  if (-not (Test-Path -LiteralPath $source)) { throw "Chapter source folder was not found at $source." }
  New-Item -ItemType Directory -Force -Path $target | Out-Null
  Write-Host "Copying $name into the game hub..."
  if ($chapter -eq 1) {
    & robocopy $source $target /E /R:2 /W:2 /XF index.html
  } else {
    & robocopy $source $target /E /R:2 /W:2
  }
  if ($LASTEXITCODE -ge 8) { throw "$name copy failed (robocopy exit code $LASTEXITCODE)." }
}

$SharedSource = Join-Path $TobyWebRoot 'files'
$SharedTarget = Join-Path $HubRoot 'games\deltarune'
Write-Host 'Copying shared Deltarune runtime files...'
& robocopy $SharedSource $SharedTarget mobile-controls.js /R:2 /W:2
if ($LASTEXITCODE -ge 8) { throw "Mobile-controls copy failed (robocopy exit code $LASTEXITCODE)." }
& robocopy (Join-Path $SharedSource 'vendor') (Join-Path $SharedTarget 'vendor') /E /R:2 /W:2
if ($LASTEXITCODE -ge 8) { throw "Vendor-library copy failed (robocopy exit code $LASTEXITCODE)." }

$UndertaleSource = Join-Path $TobyWebRoot 'files\undertale'
$UndertaleTarget = Join-Path $HubRoot 'games\undertale'
if (-not (Test-Path -LiteralPath $UndertaleSource)) { throw "Undertale folder was not found at $UndertaleSource." }
Write-Host 'Copying Undertale into the game hub...'
& robocopy $UndertaleSource $UndertaleTarget /E /R:2 /W:2 /XF index.html
if ($LASTEXITCODE -ge 8) { throw "Undertale copy failed (robocopy exit code $LASTEXITCODE)." }

Write-Host ''
Write-Host 'Done. Deltarune Chapters 1-5 and Undertale are now in this hub:'
Write-Host "  $(Join-Path $HubRoot 'games\deltarune')"
Write-Host "  $UndertaleTarget"
Write-Host 'The copy merges files, preserves the Chapter 1 and Undertale launchers, and does not delete anything.'
