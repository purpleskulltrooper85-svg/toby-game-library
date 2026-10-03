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

Undertale and Deltarune Chapter 1 are included in `games/`. Chapter 2–5 selector rows are present, but their game files are not in this repository yet. The `drsim-launcher-1.1.0` folder supplied for DR&UT Battles is a Tauri desktop launcher, not a browser game build, so it cannot run inside this page.

To fetch just selected folders from `Camzzz-vrgt/Toby-Web` without cloning all file contents, install Git and run this in PowerShell:

```powershell
git clone --depth 1 --filter=blob:none --sparse https://github.com/Camzzz-vrgt/Toby-Web.git
cd Toby-Web
git sparse-checkout set files/chapter2 files/chapter3 files/chapter4 files/chapter5
```

Then copy each selected `files/chapterN` folder's contents into this project's `games/deltarune/chapterN/` folder, and change that chapter's `available` to `true` in `games.json` and `config.js`. To fetch only Undertale, use `git sparse-checkout set files/undertale` instead.

The four selected chapter folders total about 1.55 GB, so adding all of them to this GitHub Pages site is not a practical deployment. Fetch only the chapter(s) you need. `git sparse-checkout set` replaces the selected folder list; include all desired paths in that one command.

## Audio and font

The supplied `audio_drone.ogg` loops on the home screen after the first interaction; `AUDIO_ANOTHERHIM.ogg` loops on the Deltarune chapter selector. Hover and selection sounds are included. The chapter row lettering is rendered into small PNG images from the supplied Undertale Deltarune Extended (Fixed) typeface because its license does not allow webfont embedding. Credit: [Viika's FontStruct typeface](https://fontstruct.com/fontstructions/show/2008226).
