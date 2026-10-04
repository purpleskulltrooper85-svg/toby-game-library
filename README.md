# Dill's Games

A static game gallery. `index.html` is the entry page: selecting a bundled game opens it in the full-screen player inside this same page. The game itself still needs its files in the matching `games/` folder; an HTML page cannot contain the separate game data unless it is repackaged as one enormous file.

## Add a game

Add a game entry to `games.json` with a title, image path, and playable page path. Chapter entries use the same `games/deltarune/chapterN/` layout. The hosted site reads `games.json`; `config.js` supplies a small offline fallback catalog when the page is opened directly. Keep the fallback in sync if you change the catalog and need offline-file use.

Example:

```json
{
  "title": "My Game",
  "image": "assets/my-game.webp",
  "description": "A short description",
  "tags": "adventure puzzle",
  "url": "games/my-game/index.html"
}
```

## GitHub CDN launcher

`github-cdn.html` is a single-page launcher shell. It loads the stylesheet, app, catalog, and game files from this public repository through jsDelivr. It fetches each game's HTML and renders it with the correct CDN base URL because jsDelivr serves game HTML as plain text. After pushing the repository changes to `main`, open it at `https://cdn.jsdelivr.net/gh/purpleskulltrooper85-svg/toby-game-library@main/github-cdn.html`. This is one launcher document, not one HTML containing the entire roughly 2 GB library. FNF Freeplay uses the supplied launcher's existing UGS CDN for its individual mods.

`game.svg` is a full-window SVG wrapper around `github-cdn.html`. After pushing to `main`, it can be opened at `https://cdn.jsdelivr.net/gh/purpleskulltrooper85-svg/toby-game-library@main/game.svg`.

## Bundled games

UNDERTALE, DELTARUNE Chapters 1–5, Classic Knight, Crownfall, and the FNF Freeplay launcher are listed in the hub. Deltarune chapters include their split game data and music under `games/deltarune/chapterN/`. Classic Knight's page and 1,227 required image/audio assets are under `games/classic-knight/`. Crownfall is a standalone HTML page with its game assets embedded in it. The FNF launcher is under `games/fnf/`.

The full library is about 2 GB, exceeding GitHub Pages' 1 GB published-site limit; use hosting with enough storage if deploying all game files together. GitHub CDN hosting also requires pushing these local changes to the linked repository first.

If you already have the `Toby-Web` sparse checkout at `C:\Users\purpl\Toby-Web`, run this from PowerShell:

```powershell
& 'C:\Users\purpl\OneDrive\Documents\New project\toby-game-library\download-missing-assets.ps1'
```

It adds `files/chapter1` through `files/chapter5`, `files/undertale`, `files/vendor`, and the shared `files/mobile-controls.js` to that checkout, then merges them into the matching `games/` folders here. It preserves the existing Chapter 1 and Undertale launchers and does not delete existing files.

For offline/local copies, you can fetch just selected folders from `Camzzz-vrgt/Toby-Web` without cloning all file contents. Install Git and run this in PowerShell:

```powershell
git clone --depth 1 --filter=blob:none --sparse https://github.com/Camzzz-vrgt/Toby-Web.git
cd Toby-Web
git sparse-checkout set files/chapter1 files/chapter2 files/chapter3 files/chapter4 files/chapter5 files/undertale files/vendor
git sparse-checkout add --skip-checks files/mobile-controls.js
```

Run the sync script after the checkout has the selected folders. `git sparse-checkout set` replaces the selected folder list; include all desired paths in that one command.

## Audio and font

The supplied `audio_drone.ogg` loops on the home screen after the first interaction; `AUDIO_ANOTHERHIM.ogg` loops on the Deltarune chapter selector. Hover and selection sounds are included. The chapter row lettering and UNDERTALE/DELTARUNE card names are raster images from the supplied Undertale Deltarune Extended (Fixed) typeface because its license does not allow webfont embedding. The selector uses the PNGs in `assets/Deltarune Icons/`. Credit: [Viika's FontStruct typeface](https://fontstruct.com/fontstructions/show/2008226).
