# Dill's Game Hub

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

## Bundled games and missing chapters

Undertale and Deltarune Chapter 1 are bundled in `games/`. Chapters 2–5 run in the same full-screen player from jsDelivr URLs pointing at the corresponding `Toby-Web` folders. Their files total about 1.54 GB, so they are served from the CDN instead of being copied into this Pages site; GitHub Pages caps a published site at 1 GB. DR&UT Battles has been removed from the game list for now.

If you already have the `Toby-Web` sparse checkout at `C:\Users\purpl\Toby-Web`, run this from PowerShell:

```powershell
& 'C:\Users\purpl\OneDrive\Documents\New project\toby-game-library\download-missing-assets.ps1'
```

It adds only `files/chapter1/mus` and `files/undertale` to that checkout, then copies them into the matching `games/` folders here. It merges files without deleting existing ones.

For offline/local copies, you can fetch just selected folders from `Camzzz-vrgt/Toby-Web` without cloning all file contents. Install Git and run this in PowerShell:

```powershell
git clone --depth 1 --filter=blob:none --sparse https://github.com/Camzzz-vrgt/Toby-Web.git
cd Toby-Web
git sparse-checkout set files/chapter2 files/chapter3 files/chapter4 files/chapter5
```

The online selector already points Chapters 2–5 at the CDN, so these downloads are only needed if you want a local copy. Copy a selected `files/chapterN` folder into `games/deltarune/chapterN/` and change its catalog URL to that local `index.html` path. The missing-assets script separately fetches and copies Chapter 1 music and Undertale. To fetch only Undertale, use `git sparse-checkout set files/undertale` instead.

The four selected chapter folders total about 1.55 GB, so adding all of them to this GitHub Pages site is not a practical deployment. Fetch only the chapter(s) you need. `git sparse-checkout set` replaces the selected folder list; include all desired paths in that one command.

## Audio and font

The supplied `audio_drone.ogg` loops on the home screen after the first interaction; `AUDIO_ANOTHERHIM.ogg` loops on the Deltarune chapter selector. Hover and selection sounds are included. The chapter row lettering and UNDERTALE/DELTARUNE card names are raster images from the supplied Undertale Deltarune Extended (Fixed) typeface because its license does not allow webfont embedding. The selector uses the PNGs in `assets/Deltarune Icons/`. Credit: [Viika's FontStruct typeface](https://fontstruct.com/fontstructions/show/2008226).
