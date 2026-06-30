(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.querySelector('#progressBar');
  const current = document.querySelector('#currentSlide');
  const total = document.querySelector('#totalSlides');
  let index = 0;

  if (total) total.textContent = String(slides.length).padStart(2, '0');

  function setCounter() {
    if (current) current.textContent = String(index + 1).padStart(2, '0');
    if (progress) progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  }

  function resetAnimations(slide) {
    slide.querySelectorAll('[data-animate]').forEach((el) => {
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = '';
    });
  }

  function show(target) {
    if (document.body.classList.contains('site-mode')) return;
    index = Math.max(0, Math.min(slides.length - 1, target));
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    resetAnimations(slides[index]);
    setCounter();
    history.replaceState(null, '', `#slide-${String(index + 1).padStart(2, '0')}`);
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }
  function first() { show(0); }
  function last() { show(slides.length - 1); }

  function fullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  function overview() {
    document.body.classList.toggle('overview-mode');
    document.body.classList.remove('site-mode');
    if (document.body.classList.contains('overview-mode')) {
      slides.forEach((slide, i) => {
        slide.classList.add('is-active');
        slide.onclick = () => {
          document.body.classList.remove('overview-mode');
          slides.forEach((s) => { s.onclick = null; s.classList.remove('is-active'); });
          show(i);
        };
      });
    } else {
      slides.forEach((s) => { s.onclick = null; s.classList.remove('is-active'); });
      show(index);
    }
  }

  function siteMode() {
    document.body.classList.toggle('site-mode');
    document.body.classList.remove('overview-mode');
    if (document.body.classList.contains('site-mode')) {
      slides.forEach((s) => { s.classList.add('is-active'); s.onclick = null; s.setAttribute('aria-hidden', 'false'); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      slides.forEach((s) => s.classList.remove('is-active'));
      show(index);
    }
  }

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowright', 'pagedown', ' '].includes(key)) { event.preventDefault(); next(); }
    if (['arrowleft', 'pageup'].includes(key)) { event.preventDefault(); prev(); }
    if (key === 'home') first();
    if (key === 'end') last();
    if (key === 'f') fullscreen();
    if (key === 'o') overview();
    if (key === 'r') siteMode();
    if (key === 'p') window.print();
  });

  document.querySelectorAll('[data-next]').forEach((btn) => btn.addEventListener('click', next));
  document.querySelectorAll('[data-prev]').forEach((btn) => btn.addEventListener('click', prev));
  document.querySelectorAll('[data-fullscreen]').forEach((btn) => btn.addEventListener('click', fullscreen));
  document.querySelectorAll('[data-overview]').forEach((btn) => btn.addEventListener('click', overview));
  document.querySelectorAll('[data-site-mode]').forEach((btn) => btn.addEventListener('click', siteMode));

  const start = (location.hash.match(/slide-(\d+)/) || [])[1];
  if (start) index = Math.max(0, Math.min(slides.length - 1, Number(start) - 1));
  show(index);
  window.SagaDeck = { show, next, prev, overview, siteMode, fullscreen };
})();
