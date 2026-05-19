/* ─────────────────────────────────────────
   Tocadiscos Virtual — script.js
───────────────────────────────────────── */

// ── Playlist data ──────────────────────────
// Agregá o quitá canciones acá. src y cover son rutas relativas a index.html
const SONGS = [
  {
    title: "Sera",
    artist: "Las Pelotas",
    cover: "assets/portadas/sera.png",
    src: "assets/canciones/sera.mp3",
    duration: "3:02"
  },
  {
    title: "Aun Estas En Mis Sueños",
    artist: "Rata Blanca",
    cover: "assets/portadas/aun estas en mis suenios.png",
    src: "assets/canciones/aun estas en mis suenios.mp3",
    duration: "5:03"
  },
  {
    title: "Vine Hasta Aqui",
    artist: "Los Piojos",
    cover: "assets/portadas/vine hasta aqui.png",
    src: "assets/canciones/vine hasta aqui.mp3",
    duration: "4:00"
  },
  {
    title: "Un Poco De Amor Frances",
    artist: "Patricio Rey y sus Redonditos de Ricota",
    cover: "assets/portadas/un poco de amor frances.png",
    src: "assets/canciones/un poco de amor frances.mp3",
    duration: "4:05"
  },
  {
    title: "Salando Las Heridas",
    artist: "Patricio Rey y sus Redonditos de Ricota",
    cover: "assets/portadas/un poco de amor frances.png",
    src: "assets/canciones/salando las heridas.mp3",
    duration: "5:03"
  },
  {
    title: "La Doctora II",
    artist: "Las Pastillas Del Abuelo",
    cover: "assets/portadas/la doctora ii.png",
    src: "assets/canciones/la doctora ii.mp3",
    duration: "4:00"
  },
  {
    title: "Cancion Para Mi Muerte",
    artist: "Sui Generis",
    cover: "assets/portadas/cancion para mi muerte.png",
    src: "assets/canciones/cancion para mi muerte.mp3",
    duration: "4:00"
  }
  
];

// ── State ──────────────────────────────────
const state = {
  currentIndex: 0,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  liked: new Set()
};

// ── DOM refs ───────────────────────────────
const audio         = document.getElementById('audio');
const vinyl         = document.getElementById('vinyl');
const tonearm       = document.querySelector('.tonearm-wrapper');
const labelImg      = document.getElementById('label-img');
const songTitle     = document.getElementById('song-title');
const songArtist    = document.getElementById('song-artist');
const playIcon      = document.getElementById('play-icon');
const progressFill  = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');
const progressWrap  = document.getElementById('progress-wrap');
const timeCurrent   = document.getElementById('time-current');
const timeTotal     = document.getElementById('time-total');
const playlistEl    = document.getElementById('playlist');
const coverStrip    = document.getElementById('cover-strip');
const btnPlay       = document.getElementById('btn-play');
const btnPrev       = document.getElementById('btn-prev');
const btnNext       = document.getElementById('btn-next');
const btnShuffle    = document.getElementById('btn-shuffle');
const btnRepeat     = document.getElementById('btn-repeat');
const btnHeart      = document.getElementById('btn-heart');
const volumeSlider  = document.getElementById('volume-slider');

// ── Helpers ────────────────────────────────
function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ── Load song ──────────────────────────────
function loadSong(index) {
  state.currentIndex = index;
  const song = SONGS[index];

  audio.src    = song.src;
  audio.volume = volumeSlider.value;
  audio.load();

  songTitle.textContent  = song.title;
  songArtist.textContent = song.artist;
  labelImg.src           = song.cover;
  labelImg.alt           = song.title;

  btnHeart.classList.toggle('liked', state.liked.has(index));
  btnHeart.querySelector('i').className = state.liked.has(index)
    ? 'fa-solid fa-heart'
    : 'fa-regular fa-heart';

  updatePlaylistUI();
  updateCoverStrip();

  progressFill.style.width = '0%';
  progressThumb.style.left  = '0%';
  timeCurrent.textContent   = '0:00';
  timeTotal.textContent     = song.duration;

  if (state.isPlaying) playSong();
}

// ── Play / Pause ───────────────────────────
function playSong() {
  const p = audio.play();
  if (p !== undefined) p.catch(() => {});
  state.isPlaying = true;
  playIcon.className = 'fa-solid fa-pause';
  vinyl.classList.add('spinning');
  tonearm.classList.add('playing');
}

function pauseSong() {
  audio.pause();
  state.isPlaying = false;
  playIcon.className = 'fa-solid fa-play';
  vinyl.classList.remove('spinning');
  tonearm.classList.remove('playing');
}

function togglePlay() {
  state.isPlaying ? pauseSong() : playSong();
}

// ── Prev / Next ────────────────────────────
function prevSong() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  let idx = state.isShuffle
    ? randomIndex()
    : (state.currentIndex - 1 + SONGS.length) % SONGS.length;
  loadSong(idx);
}

function nextSong() {
  let idx = state.isShuffle
    ? randomIndex()
    : (state.currentIndex + 1) % SONGS.length;
  loadSong(idx);
}

function randomIndex() {
  let r;
  do { r = Math.floor(Math.random() * SONGS.length); }
  while (r === state.currentIndex && SONGS.length > 1);
  return r;
}

// ── Progress bar ───────────────────────────
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  progressThumb.style.left  = pct + '%';
  timeCurrent.textContent   = formatTime(audio.currentTime);
  timeTotal.textContent     = formatTime(audio.duration);
});

progressWrap.addEventListener('click', (e) => {
  const rect = progressWrap.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  if (audio.duration) audio.currentTime = pct * audio.duration;
});

let dragging = false;
progressWrap.addEventListener('mousedown', () => { dragging = true; });
document.addEventListener('mousemove', (e) => {
  if (!dragging || !audio.duration) return;
  const rect = progressWrap.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
});
document.addEventListener('mouseup', () => { dragging = false; });

// ── Song ended ─────────────────────────────
audio.addEventListener('ended', () => {
  if (state.isRepeat) { audio.currentTime = 0; playSong(); }
  else nextSong();
});

// ── Volume ─────────────────────────────────
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  updateVolumeFill();
});

function updateVolumeFill() {
  const pct = volumeSlider.value * 100;
  volumeSlider.style.background =
    `linear-gradient(90deg, #8b5cf6 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}
updateVolumeFill();

// ── Shuffle & Repeat ───────────────────────
btnShuffle.addEventListener('click', () => {
  state.isShuffle = !state.isShuffle;
  btnShuffle.classList.toggle('active', state.isShuffle);
});

btnRepeat.addEventListener('click', () => {
  state.isRepeat = !state.isRepeat;
  btnRepeat.classList.toggle('active', state.isRepeat);
});

// ── Heart ──────────────────────────────────
btnHeart.addEventListener('click', () => {
  const i = state.currentIndex;
  if (state.liked.has(i)) {
    state.liked.delete(i);
    btnHeart.classList.remove('liked');
    btnHeart.querySelector('i').className = 'fa-regular fa-heart';
  } else {
    state.liked.add(i);
    btnHeart.classList.add('liked');
    btnHeart.querySelector('i').className = 'fa-solid fa-heart';
    btnHeart.style.animation = 'none';
    btnHeart.offsetHeight;
    btnHeart.style.animation = 'heartPop .3s ease';
  }
});

// ── Playlist UI ────────────────────────────
function buildPlaylist() {
  playlistEl.innerHTML = '';
  SONGS.forEach((song, idx) => {
    const li = document.createElement('li');
    li.dataset.index = idx;
    li.className = idx === state.currentIndex ? 'active' : '';
    li.innerHTML = `
      <img class="pl-thumb" src="${song.cover}" alt="${song.title}">
      <div class="pl-info">
        <p class="pl-title">${song.title}</p>
        <p class="pl-artist">${song.artist}</p>
      </div>
      <span class="pl-duration">${song.duration}</span>
    `;
    li.addEventListener('click', () => {
      state.isPlaying = true;
      loadSong(idx);
    });
    playlistEl.appendChild(li);
  });
}

function updatePlaylistUI() {
  playlistEl.querySelectorAll('li').forEach((li, idx) => {
    li.classList.toggle('active', idx === state.currentIndex);
  });
}

// ── Cover strip ────────────────────────────
function updateCoverStrip() {
  const n    = SONGS.length;
  const prev = (state.currentIndex - 1 + n) % n;
  const cur  = state.currentIndex;
  const next = (state.currentIndex + 1) % n;

  coverStrip.innerHTML = '';
  [
    { song: SONGS[prev], cls: 'prev',    idx: prev },
    { song: SONGS[cur],  cls: 'current', idx: cur  },
    { song: SONGS[next], cls: 'next',    idx: next }
  ].forEach(({ song, cls, idx }) => {
    const img = document.createElement('img');
    img.src       = song.cover;
    img.alt       = song.title;
    img.className = `cover-item ${cls}`;
    img.addEventListener('click', () => {
      state.isPlaying = true;
      loadSong(idx);
    });
    coverStrip.appendChild(img);
  });
}

// ── Playlist toggle ────────────────────────
document.getElementById('btn-playlist-toggle').addEventListener('click', () => {
  document.querySelector('.playlist-panel').classList.toggle('hidden');
});

// ── Keyboard shortcuts ─────────────────────
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  switch (e.code) {
    case 'Space':      e.preventDefault(); togglePlay(); break;
    case 'ArrowRight': nextSong(); break;
    case 'ArrowLeft':  prevSong(); break;
  }
});

// ── Heart pop animation ────────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes heartPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.5); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

// ── Controls listeners ─────────────────────
btnPlay.addEventListener('click', togglePlay);
btnPrev.addEventListener('click', prevSong);
btnNext.addEventListener('click', nextSong);

// ── Init ───────────────────────────────────
buildPlaylist();
loadSong(0);