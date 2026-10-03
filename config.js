// Embedded catalog allows index.html to work from file:// without fetch().
// Keep this in sync with games.json, which is the convenient editing format.
window.GAME_LIBRARY_CONFIG = {
  "audio": {
    "move": "assets/snd_menumove.mp3",
    "select": "assets/snd_select.mp3",
    "home": "games/deltarune/chapter1/mus/audio_drone.ogg",
    "deltarune": "assets/AUDIO_ANOTHERHIM.ogg"
  },
  "games": [
    { "title": "UNDERTALE", "image": "assets/undertale-icon.png", "description": "The RPG where nobody has to get hurt.", "tags": "rpg monster soul", "url": "games/undertale/index.html" },
    {
      "title": "DELTARUNE", "image": "assets/deltarune-icon.png", "description": "A parallel story to UNDERTALE.", "tags": "rpg chapters toby fox",
      "chapters": [
        { "number": 1, "name": "The Beginning", "suit": "♠", "url": "games/deltarune/chapter1/index.html", "source": "https://github.com/Camzzz-vrgt/Toby-Web/tree/main/files/chapter1", "available": true },
        { "number": 2, "name": "A Cyber's World", "suit": "♡", "url": "games/deltarune/chapter2/index.html", "source": "https://github.com/Camzzz-vrgt/Toby-Web/tree/main/files/chapter2", "available": false },
        { "number": 3, "name": "Late Night", "suit": "♣", "url": "games/deltarune/chapter3/index.html", "source": "https://github.com/Camzzz-vrgt/Toby-Web/tree/main/files/chapter3", "available": false },
        { "number": 4, "name": "Prophecy", "suit": "♢", "url": "games/deltarune/chapter4/index.html", "source": "https://github.com/Camzzz-vrgt/Toby-Web/tree/main/files/chapter4", "available": false },
        { "number": 5, "name": "Festival Day", "suit": "✿", "url": "games/deltarune/chapter5/index.html", "source": "https://github.com/Camzzz-vrgt/Toby-Web/tree/main/files/chapter5", "available": false },
        { "number": 6, "name": "--", "suit": "", "locked": true },
        { "number": 7, "name": "--", "suit": "", "locked": true }
      ]
    },
    { "title": "DR&UT BATTLES", "image": "assets/drut-battles-icon.png", "description": "Deltarune Fight Simulator, by its unofficial fan-project team.", "tags": "deltarune undertale battles fight simulator", "desktopLauncher": true, "launcherMessage": "The supplied folder is a Tauri desktop launcher, not a browser game. It cannot run inside this webpage." }
  ]
};
