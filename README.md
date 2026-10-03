# Dill's Game Hub

A static, themeable game gallery. The first theme is a pixel inspired Undertale / Deltarune library. It uses a JSON catalog so the game list, covers, audio, and playable URLs are easy to update.

## Run it

Open `index.html` through a static web server (for example GitHub Pages). Browsers usually block `fetch("games.json")` when the page is opened directly as a `file://` URL.

## Add or change a game

Edit `games.json` and add an item to `games`. `image` can point to a file in this repository, a GitHub raw URL, or a jsDelivr CDN URL such as `https://cdn.jsdelivr.net/gh/USERNAME/REPOSITORY@main/covers/my-game.webp`. Set `url` to a playable page. For a chapter chooser, use a `chapters` array; chapters without `url` appear dimmed and locked.

The included game builds make this repository larger than jsDelivr's default 50 MB GitHub package limit. Host the complete site with GitHub Pages so the catalog, images, audio, and game files all share one working origin. The relative `games.json` setting in `config.js` is ready for that. Smaller catalog-only repositories can use a jsDelivr URL instead; relative cover, sound, and chapter paths resolve from the catalog URL.

Example game:

```json
{
  "title": "My Game",
  "image": "https://cdn.jsdelivr.net/gh/USERNAME/REPOSITORY@main/covers/my-game.webp",
  "description": "A short description",
  "tags": "adventure puzzle",
  "url": "https://example.com/play"
}
```

To set up a new library or theme, copy the site and its `assets` folder, then edit `games.json` and the theme colors in `styles.css`. The supplied selection sounds and Monster Friend font are already loaded from `assets/`.

## Included games

The supplied Deltarune Chapter 1 web build is at `games/deltarune/chapter1/`. The supplied Undertale web build is at `games/undertale/`. The Deltarune chapter selector includes Chapters 1–5; add chapter URLs in `games.json` as you add builds. The custom extended font archive is not embedded because its included license prohibits web-font use and redistribution.

## CDN links

The theme picker currently contains one theme, Undertale + Deltarune. Undertale is the first card and Deltarune is second, using the supplied heart images in `assets/`. The gallery is black; hover highlights turn yellow without scaling or shadows. The title, search field, and theme button use Monster Friend. Chapter labels are static PNG text rendered in the supplied undertale deltarune extended (Fixed) typeface; the original font file is not embedded because its license prohibits web-font use. The Deltarune chapter screen loops `assets/AUDIO_ANOTHERHIM.ogg` and includes a replaceable mute icon placeholder at `assets/mute-placeholder.svg`.
