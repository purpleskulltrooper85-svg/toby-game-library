const state = { games: [], audio: {} };
const grid = document.querySelector('#game-grid');
const search = document.querySelector('#search');
const themeToggle = document.querySelector('#theme-toggle');
const themeOptions = document.querySelector('#theme-options');
const chapterScreen = document.querySelector('#deltarune-screen');
const chapterList = document.querySelector('#chapter-list');
const music = document.querySelector('#deltarune-music');
const musicToggle = document.querySelector('#music-toggle');
const homeMusic = document.querySelector('#home-music');
const homeMusicToggle = document.querySelector('#home-music-toggle');
const gamePlayer = document.querySelector('#game-player');
const gameFrame = document.querySelector('#game-frame');
const playerTitle = document.querySelector('#player-title');
const gameLoading = document.querySelector('#game-loading');
const gameLoadingTitle = document.querySelector('#game-loading-title');
const gameLoadingMessage = document.querySelector('#game-loading-message');
const gameLoadingProgress = document.querySelector('#game-loading-progress');
let playerReturn = 'library';
let gameLoadToken = 0;
let gameLoadingTimer = 0;
let isMusicMuted = false;
let lastMoveSound = 0;
const catalogUrl = window.GAME_LIBRARY_CATALOG || 'games.json';
const catalogBase = () => new URL(catalogUrl, location.href);
const assetUrl = value => new URL(value, catalogBase()).href;

function sound(which) {
  const source = state.audio[which];
  if (!source) return;
  if (which === 'move') {
    const now = performance.now();
    if (now - lastMoveSound < 80) return;
    lastMoveSound = now;
  }
  const audio = new Audio(assetUrl(source));
  audio.volume = 0.35;
  audio.play().catch(() => {});
}

function syncMuteButtons() {
  for (const button of [musicToggle, homeMusicToggle]) {
    button.classList.toggle('is-muted', isMusicMuted);
    button.setAttribute('aria-label', isMusicMuted ? 'Unmute music' : 'Mute music');
    button.title = isMusicMuted ? 'Unmute music' : 'Mute music';
  }
  homeMusic.muted = isMusicMuted;
  music.muted = isMusicMuted;
}

function startHomeMusic() {
  if (!homeMusic.src) homeMusic.src = assetUrl(state.audio.home || 'games/deltarune/chapter1/mus/audio_drone.ogg');
  homeMusic.volume = 0.3;
  if (!isMusicMuted) homeMusic.play().catch(() => {});
}

async function loadLibrary() {
  try {
    // Inline data lets index.html work from file:// without a local web server.
    // Keep games.json as the human-editable copy for deployments and older builds.
    let config = window.GAME_LIBRARY_CONFIG;
    try {
      const response = await fetch(catalogUrl, { cache: 'no-store' });
      if (response.ok) config = await response.json();
    } catch { /* file:// blocks fetch; use the embedded offline catalog */ }
    if (!config) throw new Error('Could not load games.json');
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
    const gameLabel = game.labelImage
      ? `<img class="game-label-image" src="${escapeHtml(assetUrl(game.labelImage))}" alt="${escapeHtml(game.title)}">`
      : escapeHtml(game.title);
    card.innerHTML = `<span class="card-art"><img class="cover" src="${escapeHtml(assetUrl(game.image))}" alt=""><span class="tag">NEW</span></span><span class="game-name">${gameLabel}</span>`;
    card.addEventListener('pointerenter', () => sound('move'));
    card.addEventListener('focus', () => sound('move'));
    card.addEventListener('click', () => {
      sound('select');
      if (game.chapters) showDeltarune(game);
      else if (game.desktopLauncher) showNotice(game.launcherMessage);
      else if (game.url) openGame(game.url, game.title, 'library');
      else showNotice(`${game.title} is in your library. Add its playable URL to games.json to enable launch.`);
    });
    grid.append(card);
  }
}

function showDeltarune(game) {
  homeMusic.pause();
  gameLoadToken++;
  stopGameLoading();
  gameLoading.hidden = true;
  gameFrame.removeAttribute('srcdoc');
  gameFrame.src = 'about:blank';
  gamePlayer.hidden = true;
  document.body.classList.add('chapters-open');
  chapterList.replaceChildren();
  for (const chapter of game.chapters) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'chapter-row';
    row.disabled = Boolean(chapter.locked);
    const icon = chapter.icon
      ? `<img src="${escapeHtml(assetUrl(chapter.icon))}" alt="">`
      : escapeHtml(chapter.suit || '');
    row.innerHTML = `<img class="chapter-number" src="assets/chapter-text/chapter-${chapter.number}.png" alt="Chapter ${chapter.number}"><span class="chapter-name"><img src="assets/chapter-text/chapter-name-${chapter.number}.png" alt="${escapeHtml(chapter.name)}"></span><span class="chapter-icon${chapter.icon ? ' has-image' : ''}" aria-hidden="true">${icon}</span>`;
    row.addEventListener('pointerenter', () => sound('move'));
    row.addEventListener('focus', () => sound('move'));
    if (!chapter.locked) {
      row.addEventListener('click', () => {
        sound('select');
        if (chapter.available && chapter.url) openGame(chapter.url, `CHAPTER ${chapter.number}`, 'chapters');
        else if (chapter.source) showNotice(`Chapter ${chapter.number}'s files aren't bundled with this site yet. Put that folder's contents in games/deltarune/chapter${chapter.number}/ to run it here. The source folder is: ${chapter.source}`);
        else showNotice(`Chapter ${chapter.number} isn't included yet.`);
      });
    }
    chapterList.append(row);
  }

  chapterScreen.hidden = false;
  music.src = assetUrl(state.audio.deltarune || 'assets/AUDIO_ANOTHERHIM.ogg');
  music.volume = 0.35;
  music.muted = isMusicMuted;
  music.play().catch(() => {});
  document.querySelector('#chapter-back').focus();
}

function openGame(url, title, returnTo) {
  const pageUrl = assetUrl(url);
  const loadToken = ++gameLoadToken;
  playerReturn = returnTo;
  playerTitle.textContent = title;
  homeMusic.pause();
  music.pause();
  if (returnTo === 'chapters') chapterScreen.hidden = true;
  else document.body.classList.add('chapters-open');
  gamePlayer.hidden = false;
  startGameLoading(title);
  gameFrame.removeAttribute('srcdoc');
  if (window.GAME_LIBRARY_CDN_MODE) {
    gameFrame.src = 'about:blank';
    loadCdnGame(pageUrl, loadToken);
  } else {
    gameFrame.src = pageUrl;
    watchGameStartup(loadToken, title, pageUrl);
  }
  document.querySelector('#player-back').focus();
}

function startGameLoading(title) {
  stopGameLoading();
  gameLoadingTitle.textContent = `Loading ${title}...`;
  gameLoadingMessage.textContent = 'Downloading game files. First load can take a while.';
  gameLoadingProgress.hidden = true;
  gameLoadingProgress.value = 0;
  gameLoading.hidden = false;
}

function stopGameLoading() {
  if (gameLoadingTimer) clearInterval(gameLoadingTimer);
  gameLoadingTimer = 0;
}

function watchGameStartup(loadToken, title, expectedUrl = '') {
  stopGameLoading();
  gameLoadingTimer = setInterval(() => {
    if (loadToken !== gameLoadToken || gamePlayer.hidden) {
      stopGameLoading();
      return;
    }

    let gameDocument;
    try { gameDocument = gameFrame.contentDocument; } catch { return; }
    if (!gameDocument?.body || gameDocument.URL === 'about:blank') return;
    if (expectedUrl && gameDocument.URL !== expectedUrl) return;

    const status = gameDocument.querySelector('#status')?.textContent.trim();
    const sourceProgress = gameDocument.querySelector('#progress');
    const sourceSpinner = gameDocument.querySelector('#spinner');
    gameLoadingMessage.textContent = status || 'Starting the game engine...';
    if (sourceProgress && Number(sourceProgress.max) > 0 && !sourceProgress.hidden) {
      gameLoadingProgress.max = 100;
      gameLoadingProgress.value = Math.max(0, Math.min(100, Number(sourceProgress.value) / Number(sourceProgress.max) * 100));
      gameLoadingProgress.hidden = false;
    }

    const canvas = gameDocument.querySelector('canvas');
    if (canvas) {
      const style = getComputedStyle(canvas);
      const bounds = canvas.getBoundingClientRect();
      if (canvas.classList.contains('active') && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.8 && bounds.width > 0 && bounds.height > 0) {
        stopGameLoading();
        gameLoading.hidden = true;
      }
    } else if (gameDocument.readyState === 'complete' && (!gameDocument.querySelector('#status') || (!status && sourceProgress?.hidden && sourceSpinner && getComputedStyle(sourceSpinner).display === 'none'))) {
      stopGameLoading();
      gameLoading.hidden = true;
    }
  }, 400);
}

function prepareCdnGameHtml(html, pageUrl) {
  const pageBase = new URL('.', pageUrl).href;
  const repositoryBase = window.GAME_LIBRARY_CDN_ROOT || new URL('.', catalogBase()).href;
  const existingBase = html.match(/<base\b[^>]*>/i);
  let baseTag = existingBase?.[0] || `<base href="${escapeHtml(pageBase)}">`;

  if (existingBase) {
    baseTag = baseTag.replace(/\bhref\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, `href="${escapeHtml(pageBase)}"`);
    if (!/\bhref\s*=/i.test(baseTag)) baseTag = baseTag.replace(/\s*\/?>$/, ` href="${escapeHtml(pageBase)}">`);
    html = html.replace(/<base\b[^>]*>/gi, '');
  }

  html = html
    .replace(/new URL\(path,\s*window\.location\.href\)\.href/g, 'new URL(path, document.baseURI).href')
    .replace(/new URL\(["']\.\/["'],\s*window\.location\.href\)\.href/g, JSON.stringify(pageBase))
    .replace(/(["'`])\/files\//g, (_, quote) => `${quote}${repositoryBase}files/`);

  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, head => `${head}${baseTag}`);
  return `<head>${baseTag}</head>${html}`;
}

async function loadCdnGame(pageUrl, loadToken) {
  try {
    const response = await fetch(pageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    if (loadToken !== gameLoadToken || gamePlayer.hidden) return;
    gameFrame.srcdoc = prepareCdnGameHtml(html, pageUrl);
    watchGameStartup(loadToken, playerTitle.textContent);
  } catch (error) {
    if (loadToken !== gameLoadToken || gamePlayer.hidden) return;
    stopGameLoading();
    gameLoading.hidden = true;
    gameFrame.srcdoc = `<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px;background:#000;color:#fff;font:16px monospace"><h2>Game could not load</h2><p>${escapeHtml(error.message || error)}</p></body>`;
  }
}

function returnFromGame() {
  gameLoadToken++;
  stopGameLoading();
  gameLoading.hidden = true;
  gameFrame.removeAttribute('srcdoc');
  gameFrame.src = 'about:blank';
  gamePlayer.hidden = true;
  if (playerReturn === 'chapters') {
    chapterScreen.hidden = false;
    music.play().catch(() => {});
  } else {
    document.body.classList.remove('chapters-open');
    startHomeMusic();
  }
}

function leaveDeltarune() {
  music.pause();
  music.currentTime = 0;
  gameLoadToken++;
  stopGameLoading();
  gameLoading.hidden = true;
  gameFrame.removeAttribute('srcdoc');
  gameFrame.src = 'about:blank';
  chapterScreen.hidden = true;
  document.body.classList.remove('chapters-open');
  startHomeMusic();
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
themeToggle.addEventListener('pointerenter', () => sound('move'));
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
document.querySelector('#chapter-back').addEventListener('click', () => {
  sound('select');
  leaveDeltarune();
});
document.querySelector('#player-back').addEventListener('click', () => {
  sound('select');
  returnFromGame();
});
for (const control of [musicToggle, homeMusicToggle, document.querySelector('#chapter-back'), document.querySelector('#player-back')]) {
  control.addEventListener('pointerenter', () => sound('move'));
}
for (const toggle of [musicToggle, homeMusicToggle]) {
  toggle.addEventListener('click', () => {
    isMusicMuted = !isMusicMuted;
    syncMuteButtons();
    sound('select');
  });
}
document.querySelector('#close-notice').addEventListener('click', () => document.querySelector('#notice').close());
document.querySelector('#notice').addEventListener('click', event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!gamePlayer.hidden) returnFromGame();
  else if (!chapterScreen.hidden) leaveDeltarune();
});
document.addEventListener('pointerdown', startHomeMusic, { once: true });
document.addEventListener('keydown', startHomeMusic, { once: true });

try {
  const savedTheme = localStorage.getItem('dills-games-theme');
  if (savedTheme && themeOptions.querySelector(`[data-theme="${savedTheme}"]`)) {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch {}
loadLibrary();
