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
