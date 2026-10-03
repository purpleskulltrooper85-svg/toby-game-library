const state = { games: [], audio: {} };
const grid = document.querySelector('#game-grid');
const search = document.querySelector('#search');
const themeToggle = document.querySelector('#theme-toggle');
const themeOptions = document.querySelector('#theme-options');
const chapterScreen = document.querySelector('#deltarune-screen');
const chapterList = document.querySelector('#chapter-list');
const music = document.querySelector('#deltarune-music');
const musicToggle = document.querySelector('#music-toggle');
const catalogUrl = window.GAME_LIBRARY_CATALOG || 'games.json';
const catalogBase = () => new URL(catalogUrl, location.href);
const assetUrl = value => new URL(value, catalogBase()).href;

function sound(which) {
  const source = state.audio[which];
  if (!source) return;
  const audio = new Audio(assetUrl(source));
  audio.volume = 0.35;
  audio.play().catch(() => {});
}

async function loadLibrary() {
  try {
    const response = await fetch(catalogUrl);
    if (!response.ok) throw new Error('Could not load games.json');
    const config = await response.json();
    state.games = config.games || [];
    state.audio = config.audio || {};
    renderGames();
  } catch {
    grid.innerHTML = '<p class="empty">Could not load the game list. Check games.json.</p>';
  }
}

function renderGames() {
  const term = search.value.trim().toLowerCase();
  const matches = state.games.filter(game =>
    `${game.title} ${game.description || ''} ${game.tags || ''}`.toLowerCase().includes(term)
  );
  grid.replaceChildren();
  document.querySelector('#empty').hidden = matches.length > 0;

  for (const game of matches) {
    const card = document.createElement('button');
    card.className = 'game-card';
    card.type = 'button';
    card.setAttribute('aria-label', `Open ${game.title}`);
    card.innerHTML = `<span class="card-art"><img class="cover" src="${escapeHtml(assetUrl(game.image))}" alt=""><span class="tag">NEW</span></span><span class="game-name">${escapeHtml(game.title)}</span>`;
    card.addEventListener('pointerenter', () => sound('move'));
    card.addEventListener('focus', () => sound('move'));
    card.addEventListener('click', () => {
      sound('select');
      if (game.chapters) showDeltarune(game);
      else if (game.url) window.open(assetUrl(game.url), '_blank', 'noopener');
      else showNotice(`${game.title} is in your library. Add its playable URL to games.json to enable launch.`);
    });
    grid.append(card);
  }
}

function showDeltarune(game) {
  chapterList.replaceChildren();
  for (const chapter of game.chapters) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'chapter-row';
    row.disabled = Boolean(chapter.locked);
    row.innerHTML = `<img class="chapter-number" src="assets/chapter-text/chapter-${chapter.number}.png" alt="Chapter ${chapter.number}"><span class="chapter-name"><img src="assets/chapter-text/chapter-name-${chapter.number}.png" alt="${escapeHtml(chapter.name)}"></span><span class="chapter-icon" aria-hidden="true">${escapeHtml(chapter.suit || '')}</span>`;
    if (!chapter.locked) {
      row.addEventListener('click', () => {
        sound('select');
        if (chapter.url) window.location.href = assetUrl(chapter.url);
        else showNotice(`Chapter ${chapter.number} isn't included yet.`);
      });
    }
    chapterList.append(row);
  }

  chapterScreen.hidden = false;
  music.src = assetUrl(state.audio.deltarune || 'assets/AUDIO_ANOTHERHIM.ogg');
  music.volume = 0.35;
  music.play().catch(() => {});
  document.querySelector('#chapter-back').focus();
}

function leaveDeltarune() {
  music.pause();
  music.currentTime = 0;
  chapterScreen.hidden = true;
}

function showNotice(message) {
  document.querySelector('#notice-copy').textContent = message;
  document.querySelector('#notice').showModal();
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

search.addEventListener('input', renderGames);
themeToggle.addEventListener('click', () => {
  themeOptions.hidden = !themeOptions.hidden;
  themeToggle.setAttribute('aria-expanded', String(!themeOptions.hidden));
  sound('move');
});
themeOptions.addEventListener('click', event => {
  const choice = event.target.closest('[data-theme]');
  if (!choice) return;
  document.documentElement.dataset.theme = choice.dataset.theme;
  try { localStorage.setItem('dills-games-theme', choice.dataset.theme); } catch {}
  themeOptions.querySelectorAll('[data-theme]').forEach(item =>
    item.setAttribute('aria-checked', String(item === choice))
  );
  themeOptions.hidden = true;
  themeToggle.setAttribute('aria-expanded', 'false');
  sound('select');
});
document.addEventListener('click', event => {
  if (!event.target.closest('.theme-menu')) {
    themeOptions.hidden = true;
    themeToggle.setAttribute('aria-expanded', 'false');
  }
});
document.querySelector('#chapter-back').addEventListener('click', leaveDeltarune);
musicToggle.addEventListener('click', () => {
  music.muted = !music.muted;
  musicToggle.classList.toggle('is-muted', music.muted);
  musicToggle.setAttribute('aria-label', music.muted ? 'Unmute music' : 'Mute music');
  musicToggle.title = music.muted ? 'Unmute music' : 'Mute music';
});
document.querySelector('#close-notice').addEventListener('click', () => document.querySelector('#notice').close());
document.querySelector('#notice').addEventListener('click', event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !chapterScreen.hidden) leaveDeltarune();
});

try {
  const savedTheme = localStorage.getItem('dills-games-theme');
  if (savedTheme && themeOptions.querySelector(`[data-theme="${savedTheme}"]`)) {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch {}
loadLibrary();
