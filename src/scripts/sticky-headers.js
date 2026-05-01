/* Make only the topmost sticky h2 visible when multiple headers stick.
   Adds `stuck` to headers whose bounding rect intersects the top, and
   `active-sticky` to the topmost stuck header. CSS will hide stacked ones.
*/
(function(){
  const selector = '.content-wrapper h2';
  const getHeaders = () => Array.from(document.querySelectorAll(selector));
  let ticking = false;

  function update() {
    const hs = getHeaders();
    if (!hs.length) return;

    const stuck = [];
    hs.forEach(h => {
      const r = h.getBoundingClientRect();
      // header considered stuck when its top is at/above viewport top and bottom still visible
      if (r.top <= 0 && r.bottom > 0) stuck.push(h);
    });

    const active = stuck.length ? stuck[stuck.length - 1] : null;

    hs.forEach(h => {
      if (stuck.includes(h)) h.classList.add('stuck'); else h.classList.remove('stuck');
      if (h === active) h.classList.add('active-sticky'); else h.classList.remove('active-sticky');
    });
  }

  function schedule() {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }

  ['scroll','resize','load','orientationchange'].forEach(evt => {
    window.addEventListener(evt, schedule, { passive: true });
  });

  document.addEventListener('DOMContentLoaded', () => { update(); });
  // run immediately in case DOM already loaded
  update();
})();
