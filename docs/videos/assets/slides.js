// Shared runtime for every video deck (docs/videos/README.md).
// - One <section> visible at a time; ?slide=N (1-based) or #N picks it, arrow keys move.
// - ?render=1 renders 1:1 for tools/video-build and leaves the clip area empty.
// - window.__deck describes the slides for the builder.
(() => {
  const params = new URLSearchParams(location.search);
  const render = params.has('render');
  const body = document.body;
  const parts = (body.dataset.parts || '').split('|').filter(Boolean);
  const sections = Array.from(document.querySelectorAll('body > section'));

  const stage = document.createElement('div');
  stage.className = 'stage' + (render ? ' render' : '');
  const header = document.createElement('header');
  header.className = 'deck-header';
  header.innerHTML =
    '<span class="brand"></span><span class="part"></span>';
  header.querySelector('.brand').textContent =
    'HairPop · Video ' + (body.dataset.videoNumber || '') + ' · ' + (body.dataset.videoTitle || '');
  const progress = document.createElement('div');
  progress.className = 'deck-progress';
  progress.setAttribute('aria-hidden', 'true');
  parts.forEach(() => progress.appendChild(document.createElement('span')));
  stage.append(header, ...sections, progress);
  body.prepend(stage);

  // Progressive builds: <template id="x"> cloned into data-template sections.
  for (const section of sections) {
    const id = section.dataset.template;
    if (!id) continue;
    const template = document.getElementById(id);
    if (!template) continue;
    section.appendChild(template.content.cloneNode(true));
    const items = Array.from(section.querySelectorAll('.item'));
    if (section.dataset.show) {
      const n = Number(section.dataset.show);
      items.forEach((item, i) => item.classList.toggle('pending', i >= n));
    }
    if (section.dataset.highlight) {
      const [from, to] = section.dataset.highlight.split('-').map(Number);
      items.forEach((item, i) =>
        item.classList.toggle('dim', i + 1 < from || i + 1 > (to || from)),
      );
    }
  }

  // Screen recordings.
  for (const section of sections) {
    const src = section.dataset.clip;
    if (!src) continue;
    const phone = section.classList.contains('phone');
    const frame = document.createElement('div');
    frame.className = 'clip-frame' + (phone ? ' phone' : '');
    const video = document.createElement('video');
    video.className = 'clip' + (phone ? ' phone' : '');
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = render ? 'none' : 'auto';
    frame.appendChild(video);
    section.prepend(frame);
  }

  let current = -1;

  function show(index) {
    index = Math.max(0, Math.min(sections.length - 1, index));
    if (index === current) return;
    sections.forEach((s, i) => s.classList.toggle('active', i === index));
    const section = sections[index];
    const part = Number(section.dataset.part || 0);
    header.querySelector('.part').textContent = parts[part] || '';
    Array.from(progress.children).forEach((bar, i) => {
      bar.className = i < part ? 'done' : i === part ? 'current' : '';
    });
    document.querySelectorAll('video.clip').forEach((v) => v.pause());
    const video = section.querySelector('video.clip');
    if (video && !render) {
      video.currentTime = 0;
      const delay = Number(section.dataset.clipDelay || 0) * 1000;
      setTimeout(() => video.play().catch(() => {}), delay);
    }
    current = index;
    if (!render) history.replaceState(null, '', '#' + (index + 1));
  }

  function fit() {
    const scale = render ? 1 : Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = 'scale(' + scale + ')';
    stage.style.left = render ? '0' : (innerWidth - 1920 * scale) / 2 + 'px';
    stage.style.top = render ? '0' : (innerHeight - 1080 * scale) / 2 + 'px';
  }

  const fromHash = Number(location.hash.slice(1));
  const fromQuery = Number(params.get('slide'));
  show((fromQuery || fromHash || 1) - 1);
  fit();
  addEventListener('resize', fit);
  addEventListener('hashchange', () => show(Number(location.hash.slice(1)) - 1));
  addEventListener('keydown', (e) => {
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) show(current + 1);
    if (['ArrowLeft', 'PageUp'].includes(e.key)) show(current - 1);
    if (e.key === 'Home') show(0);
    if (e.key === 'End') show(sections.length - 1);
  });

  window.__deck = {
    count: sections.length,
    show,
    slides: sections.map((s, i) => ({
      index: i,
      id: s.id || null,
      cue: s.dataset.cue || null,
      part: Number(s.dataset.part || 0),
      clip: s.dataset.clip || null,
      clipDelay: Number(s.dataset.clipDelay || 0),
    })),
  };
})();
