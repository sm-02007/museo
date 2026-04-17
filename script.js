// ── FLOATING PETALS ──
const petals = [
  { emoji: '🌸', left: '8%',  duration: '7s',  delay: '0s'   },
  { emoji: '🌷', left: '22%', duration: '9s',  delay: '1.5s' },
  { emoji: '✿',  left: '40%', duration: '6s',  delay: '3s'   },
  { emoji: '🌸', left: '60%', duration: '8s',  delay: '0.8s' },
  { emoji: '🌷', left: '75%', duration: '10s', delay: '2s'   },
  { emoji: '✿',  left: '90%', duration: '7s',  delay: '4s'   },
  { emoji: '🌸', left: '50%', duration: '11s', delay: '1s'   },
  { emoji: '🌷', left: '33%', duration: '8s',  delay: '5s'   },
];

petals.forEach(p => {
  const el = document.createElement('div');
  el.className = 'petal';
  el.textContent = p.emoji;
  el.style.left = p.left;
  el.style.animationDuration = p.duration;
  el.style.animationDelay = p.delay;
  el.style.top = '-60px';
  document.body.insertBefore(el, document.body.firstChild);
});
function showSection(id) {
  const sections = document.querySelectorAll(".section");
  const tabs = document.querySelectorAll(".tab");

  sections.forEach(sec => {
    sec.classList.remove("active");
  });

  tabs.forEach(tab => tab.classList.remove("active"));

  document.getElementById(id).classList.add("active");

  event.target.classList.add("active");
}

// ── VIDEO MODAL ──
function expandVideo(card) {
  const overlay = document.getElementById("videoOverlay");
  const modalVideo = document.getElementById("modalVideo");
  const sourceVideo = card.querySelector("video");
  if (!sourceVideo) return;

  modalVideo.src = sourceVideo.currentSrc || sourceVideo.src;
  modalVideo.setAttribute('controls', '');
  overlay.classList.add("active");
  overlay.style.opacity = '1';
  overlay.style.visibility = 'visible';
  overlay.style.pointerEvents = 'all';
  modalVideo.play().catch(() => {});
}

function closeVideo() {
  const overlay = document.getElementById("videoOverlay");
  const modalVideo = document.getElementById("modalVideo");

  overlay.classList.remove("active");
  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  overlay.style.pointerEvents = 'none';
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
}


const overlay = document.getElementById("videoOverlay");
if (overlay) {
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay || e.target.closest('.video-close')) {
      closeVideo();
    }
  });
}