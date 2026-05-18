/**
 * Load published CMS content from Supabase onto the public site.
 */
(function () {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || !window.supabase) return;

  const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s ?? '';
    return d.innerHTML;
  }

  function observeReveal(root) {
    if (!root) return;
    root.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      if (typeof IntersectionObserver !== 'undefined') {
        const obs = new IntersectionObserver(
          (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
          { threshold: 0.1 }
        );
        obs.observe(el);
      } else {
        el.classList.add('visible');
      }
    });
  }

  function renderCars(cars, grid) {
    if (!grid || !cars.length) return;
    grid.innerHTML = cars.map((c) => {
      const tags = [c.year, c.fuel_type, c.mileage].filter(Boolean).join(' · ');
      const img = c.image_url
        ? '<img src="' + esc(c.image_url) + '" alt="' + esc(c.title) + '" loading="lazy" />'
        : '';
      return (
        '<article class="listing-card reveal">' +
        '<div class="listing-img">' + img + '</div>' +
        '<div class="listing-body">' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p class="listing-tags">' + esc(tags) + '</p>' +
        '<p class="listing-price">' + esc(c.price_display) + '</p>' +
        '<a href="#contact" class="btn btn-orange" style="width:100%;justify-content:center;display:flex">Enquire Now</a>' +
        '</div></article>'
      );
    }).join('');
    observeReveal(grid);
  }

  function stripHtml(html) {
    const d = document.createElement('div');
    d.innerHTML = html || '';
    return (d.textContent || '').trim();
  }

  function blogPostUrl(slug) {
    return 'blog.html?slug=' + encodeURIComponent(slug);
  }

  function renderBlogs(posts, grid) {
    if (!grid || !posts.length) return;
    grid.innerHTML = posts.map((b, i) => {
      const img = b.image_url
        ? '<div class="blog-img" style="background-image:url(\'' + esc(b.image_url) + '\');background-size:cover;background-position:center"></div>'
        : '<div class="blog-img"><i class="fas fa-newspaper"></i></div>';
      return (
        '<article class="blog-card reveal">' + img +
        '<div class="blog-body">' +
        '<h3>' + esc(b.title) + '</h3>' +
        (function () {
          const excerpt = (b.excerpt || '').trim();
          const content = (b.content || '').trim();
          let html = excerpt ? '<p class="blog-excerpt">' + esc(excerpt) + '</p>' : '';
          const plain = stripHtml(content);
          if (plain.length > 0 && plain !== excerpt) {
            html += '<div class="blog-full blog-full-content" hidden data-post-idx="' + i + '"></div>';
            html += '<button type="button" class="blog-read-more" aria-expanded="false">Read More \u2192</button>';
          }
          if (b.slug) {
            html += '<a href="' + blogPostUrl(b.slug) + '" class="blog-view-link" style="color:var(--orange);font-size:.78rem;font-weight:700;display:inline-block;margin-top:.35rem">View full article \u2192</a>';
          }
          return html;
        })() +
        '</div></article>'
      );
    }).join('');
    posts.forEach((b, i) => {
      const el = grid.querySelector('.blog-full[data-post-idx="' + i + '"]');
      if (el && b.content) el.innerHTML = b.content;
    });
    observeReveal(grid);
    if (window.SpeedgateBlogExpand) window.SpeedgateBlogExpand.bindBlogGrid(grid);
  }

  function renderServices(items, grid) {
    if (!grid || !items.length) return;
    grid.innerHTML = items.map((s) => (
      '<div class="service-card reveal">' +
      '<div class="svc-icon">' + (s.icon_html || '<i class="fas fa-car"></i>') + '</div>' +
      '<h3>' + esc(s.title) + '</h3><p>' + esc(s.description || '') + '</p></div>'
    )).join('');
    observeReveal(grid);
  }

  function renderFeatures(items, grid) {
    if (!grid || !items.length) return;
    grid.innerHTML = items.map((f) => (
      '<div class="feature-item reveal">' +
      '<div class="icon"><i class="' + esc(f.icon_class || 'fas fa-star') + '"></i></div>' +
      '<h3>' + esc(f.title) + '</h3><p>' + esc(f.description || '') + '</p></div>'
    )).join('');
    observeReveal(grid);
  }

  function renderProcess(steps, flow) {
    if (!flow || !steps.length) return;
    flow.innerHTML = steps.map((s) => (
      '<div class="process-step reveal">' +
      '<div class="num-circle">' + esc(String(s.step_number)) + '</div>' +
      '<h4>' + esc(s.title) + '</h4></div>'
    )).join('');
    observeReveal(flow);
  }

  function renderWhy(items, grid) {
    if (!grid || !items.length) return;
    grid.innerHTML = items.map((w) => (
      '<div class="why-card reveal">' +
      '<h3><i class="' + esc(w.icon_class || 'fas fa-check') + '" style="margin-right:.5rem"></i>' + esc(w.title) + '</h3>' +
      '<p>' + esc(w.description || '') + '</p></div>'
    )).join('');
    observeReveal(grid);
  }

  function applySettings(settings) {
    const map = {};
    (settings || []).forEach((s) => { map[s.key] = s.value; });
    const heroH1 = document.querySelector('#home.hero h1, #home .hero h1');
    const heroP = document.querySelector('#home.hero p, #home .hero p');
    if (map.hero_title && heroH1) {
      const idx = map.hero_title.toLowerCase().indexOf('kenya');
      if (idx >= 0) {
        heroH1.innerHTML = esc(map.hero_title.slice(0, idx)) + '<em>Kenya</em>' + esc(map.hero_title.slice(idx + 5));
      } else {
        heroH1.textContent = map.hero_title;
      }
    }
    if (map.hero_subtitle && heroP) heroP.textContent = map.hero_subtitle;
    const aboutP = document.querySelector('#about .about-text p, #about p');
    if (map.about_body && aboutP) aboutP.textContent = map.about_body;
  }

  async function init() {
    const [cars, blogs, services, features, steps, why, settings] = await Promise.all([
      sb.from('cars').select('*').eq('is_published', true).order('sort_order'),
      sb.from('blog_posts').select('*').eq('is_published', true).order('sort_order'),
      sb.from('import_services').select('*').eq('is_published', true).order('sort_order'),
      sb.from('site_features').select('*').eq('is_published', true).order('sort_order'),
      sb.from('process_steps').select('*').eq('is_published', true).order('sort_order'),
      sb.from('why_choose_items').select('*').eq('is_published', true).order('sort_order'),
      sb.from('site_settings').select('key, value')
    ]);

    if (!cars.error && cars.data && cars.data.length) renderCars(cars.data, document.getElementById('carsGrid'));
    if (!blogs.error && blogs.data && blogs.data.length) renderBlogs(blogs.data, document.getElementById('blogGrid'));
    if (!services.error && services.data && services.data.length) renderServices(services.data, document.getElementById('servicesGrid'));
    if (!features.error && features.data && features.data.length) renderFeatures(features.data, document.getElementById('featuresGrid'));
    if (!steps.error && steps.data && steps.data.length) renderProcess(steps.data, document.getElementById('processFlow'));
    if (!why.error && why.data && why.data.length) renderWhy(why.data, document.getElementById('whyGrid'));
    if (!settings.error) applySettings(settings.data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
