$ErrorActionPreference = 'Stop'

$TobyWebRoot = 'C:\Users\purpl\Toby-Web'
$HubRoot = $PSScriptRoot
$ChapterMusicSource = Join-Path $TobyWebRoot 'files\chapter1\mus'
$UndertaleSource = Join-Path $TobyWebRoot 'files\undertale'
$ChapterMusicTarget = Join-Path $HubRoot 'games\deltarune\chapter1\mus'
$UndertaleTarget = Join-Path $HubRoot 'games\undertale'

if (-not (Test-Path -LiteralPath (Join-Path $TobyWebRoot '.git'))) {
  throw "I couldn't find the Toby-Web Git checkout at $TobyWebRoot."
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw 'Git is required. Install Git for Windows, then run this script again.'
}

Write-Host 'Fetching only Chapter 1 music and Undertale from the existing Toby-Web checkout...'
& git -C $TobyWebRoot sparse-checkout add files/chapter1/mus files/undertale
if ($LASTEXITCODE -ne 0) { throw 'Git could not fetch the selected folders.' }

if (-not (Test-Path -LiteralPath $ChapterMusicSource)) {
  throw "Chapter 1 music folder was not found at $ChapterMusicSource."
}
if (-not (Test-Path -LiteralPath $UndertaleSource)) {
  throw "Undertale folder was not found at $UndertaleSource."
}

New-Item -ItemType Directory -Force -Path $ChapterMusicTarget, $UndertaleTarget | Out-Null
Write-Host 'Copying Chapter 1 music into the game hub...'
& robocopy $ChapterMusicSource $ChapterMusicTarget /E /R:2 /W:2
if ($LASTEXITCODE -ge 8) { throw "Chapter 1 music copy failed (robocopy exit code $LASTEXITCODE)." }

Write-Host 'Copying Undertale into the game hub...'
& robocopy $UndertaleSource $UndertaleTarget /E /R:2 /W:2
if ($LASTEXITCODE -ge 8) { throw "Undertale copy failed (robocopy exit code $LASTEXITCODE)." }

Write-Host ''
Write-Host 'Done. The selected files are now in this hub:'
Write-Host "  $ChapterMusicTarget"
Write-Host "  $UndertaleTarget"
Write-Host 'The copy merges files and does not delete anything already in those folders.'
