/**
 * Expand/collapse blog post full content (Read More / Read Less).
 */
(function () {
  function bindBlogGrid(grid) {
    if (!grid || grid.dataset.blogExpandBound) return;
    grid.dataset.blogExpandBound = '1';
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.blog-read-more');
      if (!btn) return;
      e.preventDefault();
      const card = btn.closest('.blog-card');
      const full = card && card.querySelector('.blog-full');
      if (!full) return;
      const expanded = card.classList.toggle('is-expanded');
      full.hidden = !expanded;
      btn.textContent = expanded ? 'Read Less' : 'Read More \u2192';
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  function init() {
    bindBlogGrid(document.getElementById('blogGrid'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SpeedgateBlogExpand = { bindBlogGrid };
})();
