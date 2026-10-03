# Dill's Game Hub

A static, themeable game gallery. The Undertale + Deltarune theme uses a JSON catalog so games, covers, audio, and launch links can be changed without rewriting the page.

## Run it

Open `index.html` through a static web server (for example GitHub Pages). Browsers usually block `fetch("games.json")` when the page is opened directly as a `file://` URL.

## Add or change a game

Edit `games.json` and add an item to `games`. `image` can point to a file in this repository or a public image URL. Set `url` to a playable page. For a chapter chooser, use a `chapters` array; chapters without a `url` stay disabled. Each chapter's `url` opens its matching page in Camzzz-vrgt/Toby-Web through a GitHub raw-content proxy; its `source` field links to the original folder on GitHub.

Example game:

```json
{
  "title": "My Game",
  "image": "assets/my-game.webp",
  "description": "A short description",
  "tags": "adventure puzzle",
  "url": "https://example.com/play"
}
```

The provided DR Simulator folder is the source for a Tauri desktop launcher; it is not a browser-ready game build. The DR&UT Battles card opens the simulator's official browser game at deltarunesim.com.

## Included games and sounds

The supplied Deltarune Chapter 1 and Undertale browser builds are in `games/`. The gallery loops the supplied `audio_drone.ogg` after the first click or key press; the Deltarune chapter menu loops `AUDIO_ANOTHERHIM.ogg`. Either music toggle mutes both tracks. Sound effects play on hover/focus and selection.

The chapter selector labels are raster images made with the supplied Undertale Deltarune Extended (Fixed) typeface. Its license prohibits embedding it as a web font and requires attribution when its rendered output is displayed publicly. The UI omits the credit line; attribution is kept here: [Viika's FontStruct typeface](https://fontstruct.com/fontstructions/show/2008226).

## Download only the Undertale folder

GitHub's **Download ZIP** button downloads the repository snapshot. To check out only `files/undertale` and avoid fetching the other file contents, use Git's sparse checkout in PowerShell:

```powershell
git clone --depth 1 --filter=blob:none --sparse https://github.com/Camzzz-vrgt/Toby-Web.git
cd Toby-Web
git sparse-checkout set files/undertale
```

This fetches the repository's small Git metadata first and then the selected folder's files. Git must be installed.
