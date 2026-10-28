(function () {
  var root = document.documentElement;
  var KEY = 'psymap-theme';

  function setActive(theme) {
    var btns = document.querySelectorAll('[data-theme-btn]');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-theme-btn') === theme;
      btns[i].classList.toggle('active', on);
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function apply(theme) {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
      theme = 'system';
    }
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    setActive(theme);
  }

  var saved = 'system';
  try { saved = localStorage.getItem(KEY) || 'system'; } catch (e) {}
  apply(saved);

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-theme-btn]') : null;
    if (btn) apply(btn.getAttribute('data-theme-btn'));
  });
})();
