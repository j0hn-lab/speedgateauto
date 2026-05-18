/* Speedgate Logistics — Admin CMS */
(function () {
  const PANEL_LABELS = {
    cars: 'Cars',
    blogs: 'Blog Posts',
    services: 'Import Services',
    features: 'Features',
    process: 'Process Steps',
    why: 'Why Choose Us',
    settings: 'Site Text',
    inquiries: 'Inquiries',
    newsletter: 'Newsletter'
  };

  const READ_ONLY_PANELS = ['inquiries', 'newsletter'];

  let sb = null;
  let session = null;
  let currentPanel = 'cars';
  let editingId = null;
  let pendingImageFile = null;
  let blogQuill = null;
  let slugTouched = false;

  const $ = (id) => document.getElementById(id);

  function toast(msg, type) {
    const el = $('adminToast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'admin-toast show' + (type ? ' ' + type : '');
    setTimeout(() => el.classList.remove('show'), 3500);
  }

  function initClient() {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      toast('Missing Supabase config (js/supabase-config.js)', 'error');
      return null;
    }
    return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }

  function showLogin(err) {
    $('loginView').style.display = 'flex';
    $('adminShell').classList.remove('active');
    const errEl = $('loginError');
    if (err) {
      errEl.textContent = err;
      errEl.classList.add('show');
    } else {
      errEl.classList.remove('show');
    }
  }

  function showDashboard(user) {
    $('loginView').style.display = 'none';
    $('adminShell').classList.add('active');
    $('userEmail').textContent = user.email;
    $('addBtn').style.display = READ_ONLY_PANELS.includes(currentPanel) ? 'none' : '';
    loadPanel(currentPanel);
  }

  async function verifyAdmin() {
    const { data, error } = await sb.from('admin_users').select('email').ilike('email', session.user.email).maybeSingle();
    if (error || !data) {
      await sb.auth.signOut();
      throw new Error('This account is not authorized as admin.');
    }
  }

  async function uploadImage(file, folder) {
    if (!file) return null;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = folder + '/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
    const { error } = await sb.storage.from('website-media').upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = sb.storage.from('website-media').getPublicUrl(path);
    return data.publicUrl;
  }

  function slugify(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'post';
  }

  const CONFIGS = {
    cars: {
      table: 'cars',
      order: 'sort_order',
      columns: ['title', 'year', 'fuel_type', 'mileage', 'price_display', 'image_url', 'sort_order', 'is_published'],
      labels: { title: 'Title', year: 'Year', fuel_type: 'Fuel', mileage: 'Mileage', price_display: 'Price', image_url: 'Image URL', sort_order: 'Order', is_published: 'Published' },
      listCols: [
        { key: 'image_url', render: (r) => r.image_url ? `<img class="thumb" src="${esc(r.image_url)}" alt="" />` : '—' },
        { key: 'title' },
        { key: 'price_display' },
        { key: 'is_published', render: (r) => r.is_published ? 'Yes' : 'No' }
      ],
      imageField: true
    },
    blogs: {
      table: 'blog_posts',
      order: 'sort_order',
      columns: ['title', 'slug', 'meta_description', 'excerpt', 'content', 'image_url', 'sort_order', 'is_published'],
      labels: { title: 'Title', slug: 'URL slug', meta_description: 'Meta description (SEO)', excerpt: 'Excerpt', content: 'Content', image_url: 'Image URL', sort_order: 'Order', is_published: 'Published' },
      listCols: [
        { key: 'title' },
        { key: 'slug', render: (r) => `<code>${esc(r.slug)}</code>` },
        { key: 'meta_description', render: (r) => esc((r.meta_description || '').slice(0, 50)) + ((r.meta_description || '').length > 50 ? '…' : '') || '—' },
        { key: 'is_published', render: (r) => r.is_published ? 'Yes' : 'No' }
      ],
      imageField: true,
      richEditor: true,
      onNew: (row) => {
        if (!row.slug && row.title) row.slug = slugify(row.title);
        if (!row.meta_description && row.excerpt) row.meta_description = row.excerpt.slice(0, 160);
      }
    },
    services: {
      table: 'import_services',
      order: 'sort_order',
      columns: ['title', 'description', 'icon_html', 'sort_order', 'is_published'],
      labels: { title: 'Title', description: 'Description', icon_html: 'Icon HTML (e.g. <i class="fas fa-car"></i>)', sort_order: 'Order', is_published: 'Published' },
      listCols: [{ key: 'title' }, { key: 'description' }]
    },
    features: {
      table: 'site_features',
      order: 'sort_order',
      columns: ['title', 'description', 'icon_class', 'sort_order', 'is_published'],
      labels: { title: 'Title', description: 'Description', icon_class: 'Font Awesome class', sort_order: 'Order', is_published: 'Published' },
      listCols: [{ key: 'title' }, { key: 'icon_class' }]
    },
    process: {
      table: 'process_steps',
      order: 'sort_order',
      columns: ['step_number', 'title', 'sort_order', 'is_published'],
      labels: { step_number: 'Step #', title: 'Title', sort_order: 'Order', is_published: 'Published' },
      listCols: [{ key: 'step_number' }, { key: 'title' }]
    },
    why: {
      table: 'why_choose_items',
      order: 'sort_order',
      columns: ['title', 'description', 'icon_class', 'sort_order', 'is_published'],
      labels: { title: 'Title', description: 'Description', icon_class: 'Icon class', sort_order: 'Order', is_published: 'Published' },
      listCols: [{ key: 'title' }]
    }
  };

  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  async function loadPanel(panel) {
    currentPanel = panel;
    $('panelTitle').textContent = PANEL_LABELS[panel] || panel;
    $('addBtn').style.display = READ_ONLY_PANELS.includes(panel) ? 'none' : '';
    document.querySelectorAll('#adminNav button[data-panel]').forEach((b) => {
      b.classList.toggle('active', b.dataset.panel === panel);
    });

    const host = $('panelContent');
    host.innerHTML = '<p class="admin-empty">Loading…</p>';

    if (panel === 'settings') {
      await loadSettings(host);
      return;
    }
    if (panel === 'inquiries') {
      await loadInquiries(host);
      return;
    }
    if (panel === 'newsletter') {
      await loadNewsletter(host);
      return;
    }

    const cfg = CONFIGS[panel];
    if (!cfg) {
      host.innerHTML = '<p class="admin-empty">Unknown panel.</p>';
      return;
    }

    const { data, error } = await sb.from(cfg.table).select('*').order(cfg.order, { ascending: true });
    if (error) {
      host.innerHTML = `<p class="admin-empty">Error: ${esc(error.message)}</p>`;
      return;
    }
    if (!data.length) {
      host.innerHTML = '<p class="admin-empty">No records yet. Click Add New.</p>';
      return;
    }

    let html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>';
    cfg.listCols.forEach((c) => { html += `<th>${esc(c.key)}</th>`; });
    html += '<th>Actions</th></tr></thead><tbody>';
    data.forEach((row) => {
      html += '<tr>';
      cfg.listCols.forEach((c) => {
        const val = c.render ? c.render(row) : esc(row[c.key]);
        html += `<td>${val}</td>`;
      });
      html += `<td class="actions">
        <button type="button" class="btn btn-ghost btn-sm" data-edit="${row.id}">Edit</button>
        <button type="button" class="btn btn-danger btn-sm" data-del="${row.id}">Delete</button>
      </td></tr>`;
    });
    html += '</tbody></table></div>';
    host.innerHTML = html;

    host.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => openEdit(panel, btn.dataset.edit));
    });
    host.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => deleteRow(panel, btn.dataset.del));
    });
  }

  async function loadSettings(host) {
    const { data, error } = await sb.from('site_settings').select('*').order('key');
    if (error) {
      host.innerHTML = `<p class="admin-empty">${esc(error.message)}</p>`;
      return;
    }
    let html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Key</th><th>Value</th><th></th></tr></thead><tbody>';
    data.forEach((row) => {
      html += `<tr><td><code>${esc(row.key)}</code></td><td>${esc(row.value).slice(0, 80)}${row.value.length > 80 ? '…' : ''}</td>
        <td><button type="button" class="btn btn-ghost btn-sm" data-setting="${esc(row.key)}">Edit</button></td></tr>`;
    });
    html += '</tbody></table></div>';
    host.innerHTML = html;

    host.querySelectorAll('[data-setting]').forEach((btn) => {
      btn.addEventListener('click', () => openSettingEdit(btn.dataset.setting));
    });
    $('addBtn').style.display = 'none';
  }

  async function openSettingEdit(key) {
    const { data } = await sb.from('site_settings').select('*').eq('key', key).single();
    editingId = key;
    $('modalTitle').textContent = 'Edit: ' + key;
    $('editForm').innerHTML = `
      <label>Value</label>
      <textarea name="value" required>${esc(data?.value || '')}</textarea>
    `;
    pendingImageFile = null;
    $('editModal').classList.add('open');
  }

  async function loadInquiries(host) {
    const { data, error } = await sb.from('inquiries').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) {
      host.innerHTML = `<p class="admin-empty">${esc(error.message)}</p>`;
      return;
    }
    renderSimpleTable(host, data, [
      { key: 'created_at', render: (r) => new Date(r.created_at).toLocaleString() },
      { key: 'full_name' },
      { key: 'phone' },
      { key: 'service' }
    ], 'inquiries');
  }

  async function loadNewsletter(host) {
    const { data, error } = await sb.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).limit(200);
    if (error) {
      host.innerHTML = `<p class="admin-empty">${esc(error.message)}</p>`;
      return;
    }
    renderSimpleTable(host, data, [
      { key: 'created_at', render: (r) => new Date(r.created_at).toLocaleString() },
      { key: 'email' }
    ], 'newsletter_subscribers');
  }

  function renderSimpleTable(host, data, cols, table) {
    if (!data.length) {
      host.innerHTML = '<p class="admin-empty">No records.</p>';
      return;
    }
    let html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>';
    cols.forEach((c) => { html += `<th>${esc(c.key)}</th>`; });
    html += '<th></th></tr></thead><tbody>';
    data.forEach((row) => {
      html += '<tr>';
      cols.forEach((c) => {
        html += `<td>${c.render ? c.render(row) : esc(row[c.key])}</td>`;
      });
      html += `<td><button type="button" class="btn btn-danger btn-sm" data-del="${row.id}" data-table="${table}">Delete</button></td></tr>`;
    });
    html += '</tbody></table></div>';
    host.innerHTML = html;
    host.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this record?')) return;
        const { error } = await sb.from(btn.dataset.table).delete().eq('id', btn.dataset.del);
        if (error) toast(error.message, 'error');
        else {
          toast('Deleted', 'ok');
          loadPanel(currentPanel);
        }
      });
    });
  }

  function destroyBlogEditor() {
    blogQuill = null;
    slugTouched = false;
    const card = $('editModalCard');
    if (card) card.classList.remove('admin-modal-wide');
  }

  function updateBlogSeoPreview() {
    const titleEl = $('editForm')?.querySelector('[name="title"]');
    const slugEl = $('editForm')?.querySelector('[name="slug"]');
    const metaEl = $('editForm')?.querySelector('[name="meta_description"]');
    const slugPreview = $('slugPreview');
    const slugPreview2 = $('slugPreview2');
    const seoTitle = $('seoPreviewTitle');
    const seoUrl = $('seoPreviewUrl');
    const seoDesc = $('seoPreviewDesc');
    const metaCount = $('metaCount');
    if (!titleEl) return;
    const slug = (slugEl?.value || '').trim() || 'your-post-slug';
    if (slugPreview) slugPreview.textContent = slug;
    if (slugPreview2) slugPreview2.textContent = slug;
    if (seoTitle) seoTitle.textContent = titleEl.value.trim() || 'Blog post title';
    if (seoUrl) seoUrl.textContent = 'speedgatelogistics.co.ke/blog/' + slug;
    const meta = (metaEl?.value || '').trim();
    if (seoDesc) seoDesc.textContent = meta || 'Add a meta description for search results.';
    if (metaCount) {
      metaCount.textContent = String(meta.length);
      metaCount.className = 'char-count' + (meta.length > 160 ? ' over' : meta.length > 140 ? ' warn' : '');
    }
  }

  async function openBlogEdit(id) {
    const cfg = CONFIGS.blogs;
    editingId = id || null;
    pendingImageFile = null;
    slugTouched = false;
    let row = {};
    if (id) {
      const { data } = await sb.from(cfg.table).select('*').eq('id', id).single();
      row = data || {};
    }
    $('modalTitle').textContent = id ? 'Edit blog post' : 'New blog post';
    $('editModalCard').classList.add('admin-modal-wide');

    const title = esc(row.title || '');
    const slug = esc(row.slug || '');
    const meta = esc(row.meta_description || '');
    const excerpt = esc(row.excerpt || '');

    $('editForm').innerHTML = `
      <label>Title *</label>
      <input name="title" type="text" value="${title}" required />

      <label>URL slug *</label>
      <input name="slug" type="text" value="${slug}" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Lowercase letters, numbers, and hyphens only" />
      <p class="field-hint">Public URL: <code>blog.html?slug=<span id="slugPreview">${slug || 'your-post-slug'}</span></code> or <code>/blog/<span id="slugPreview2">${slug || 'your-post-slug'}</span></code></p>

      <label>Meta description (SEO) <span id="metaCount" class="char-count">0</span>/160</label>
      <textarea name="meta_description" rows="2" maxlength="320" placeholder="Short summary for Google search results (150–160 characters ideal)">${meta}</textarea>

      <div class="seo-preview" aria-hidden="true">
        <div class="seo-title" id="seoPreviewTitle">${title || 'Blog post title'}</div>
        <div class="seo-url" id="seoPreviewUrl">speedgatelogistics.co.ke/blog/${slug || 'your-post-slug'}</div>
        <div class="seo-desc" id="seoPreviewDesc">${meta || 'Add a meta description for search results.'}</div>
      </div>

      <label>Excerpt</label>
      <textarea name="excerpt" rows="2" placeholder="Short teaser shown on the homepage">${excerpt}</textarea>

      <label>Content</label>
      <div class="quill-wrap"><div id="blogEditor"></div></div>
      <input type="hidden" name="content" />

      <label>Featured image</label>
      <input type="file" id="imageUpload" accept="image/*" />
      ${row.image_url ? `<p class="field-hint">Current: <a href="${esc(row.image_url)}" target="_blank" rel="noopener">view image</a></p>` : ''}
      <input type="hidden" name="image_url" value="${esc(row.image_url || '')}" />

      <div class="row-2">
        <div><label>Sort order</label><input name="sort_order" type="number" value="${row.sort_order ?? 0}" /></div>
        <div class="check-row" style="margin-top:1.75rem"><input type="checkbox" name="is_published" id="f_is_published" ${row.is_published !== false ? 'checked' : ''} /><label for="f_is_published">Published</label></div>
      </div>
    `;

    const fileInput = $('imageUpload');
    if (fileInput) fileInput.addEventListener('change', (e) => { pendingImageFile = e.target.files[0] || null; });

    const titleInput = $('editForm').querySelector('[name="title"]');
    const slugInput = $('editForm').querySelector('[name="slug"]');
    const metaInput = $('editForm').querySelector('[name="meta_description"]');

    slugInput.addEventListener('input', () => { slugTouched = true; updateBlogSeoPreview(); });
    titleInput.addEventListener('input', () => {
      if (!slugTouched && !editingId) slugInput.value = slugify(titleInput.value);
      updateBlogSeoPreview();
    });
    metaInput.addEventListener('input', updateBlogSeoPreview);

    if (typeof Quill !== 'undefined') {
      blogQuill = new Quill('#blogEditor', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean']
          ]
        }
      });
      const html = row.content || '';
      if (html.trim().startsWith('<')) {
        blogQuill.clipboard.dangerouslyPasteHTML(html);
      } else if (html) {
        blogQuill.setText(html);
      }
    } else {
      toast('Rich editor failed to load. Check your connection.', 'error');
    }

    updateBlogSeoPreview();
    $('editModal').classList.add('open');
  }

  async function saveBlogPost() {
    const form = $('editForm');
    const row = {
      title: form.querySelector('[name="title"]').value.trim(),
      slug: form.querySelector('[name="slug"]').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
      meta_description: form.querySelector('[name="meta_description"]').value.trim() || null,
      excerpt: form.querySelector('[name="excerpt"]').value.trim() || null,
      content: blogQuill ? blogQuill.root.innerHTML.trim() : '',
      image_url: form.querySelector('[name="image_url"]').value.trim() || null,
      sort_order: parseInt(form.querySelector('[name="sort_order"]').value, 10) || 0,
      is_published: form.querySelector('[name="is_published"]').checked
    };
    if (!row.title) { toast('Title is required.', 'error'); return; }
    if (!row.slug) { toast('URL slug is required.', 'error'); return; }
    if (!row.content || row.content === '<p><br></p>') { toast('Content is required.', 'error'); return; }
    CONFIGS.blogs.onNew(row);

    if (pendingImageFile) {
      try {
        row.image_url = await uploadImage(pendingImageFile, 'blogs');
      } catch (e) {
        toast(e.message || 'Upload failed', 'error');
        return;
      }
    }

    let error;
    if (editingId) {
      ({ error } = await sb.from('blog_posts').update(row).eq('id', editingId));
    } else {
      ({ error } = await sb.from('blog_posts').insert(row));
    }
    if (error) {
      toast(error.message, 'error');
      return;
    }
    closeModal();
    toast('Blog post saved', 'ok');
    loadPanel('blogs');
  }

  async function openEdit(panel, id) {
    if (panel === 'blogs') {
      await openBlogEdit(id);
      return;
    }
    const cfg = CONFIGS[panel];
    editingId = id || null;
    pendingImageFile = null;
    destroyBlogEditor();
    let row = {};
    if (id) {
      const { data } = await sb.from(cfg.table).select('*').eq('id', id).single();
      row = data || {};
    }
    $('modalTitle').textContent = id ? 'Edit' : 'Add New';
    let formHtml = '';
    cfg.columns.forEach((col) => {
      const label = cfg.labels[col] || col;
      const val = row[col] ?? (col === 'is_published' ? true : col === 'sort_order' || col === 'step_number' || col === 'year' ? '' : '');
      if (col === 'is_published') {
        formHtml += `<div class="check-row"><input type="checkbox" name="${col}" id="f_${col}" ${val ? 'checked' : ''} /><label for="f_${col}">${label}</label></div>`;
      } else if (col === 'content' || col === 'description' || col === 'icon_html' || col === 'meta_description') {
        formHtml += `<label>${label}</label><textarea name="${col}">${esc(val)}</textarea>`;
      } else {
        formHtml += `<label>${label}</label><input name="${col}" value="${esc(val)}" />`;
      }
    });
    if (cfg.imageField) {
      formHtml += `<label>Upload image (optional)</label><input type="file" id="imageUpload" accept="image/*" />`;
      if (row.image_url) formHtml += `<p style="font-size:.75rem;margin-top:.35rem">Current: <a href="${esc(row.image_url)}" target="_blank">view</a></p>`;
    }
    $('editForm').innerHTML = formHtml;
    const fileInput = $('imageUpload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => { pendingImageFile = e.target.files[0] || null; });
    }
    $('editModal').classList.add('open');
  }

  async function saveModal() {
    if (currentPanel === 'blogs') {
      await saveBlogPost();
      return;
    }
    if (currentPanel === 'settings') {
      const val = $('editForm').querySelector('[name="value"]').value;
      const { error } = await sb.from('site_settings').upsert({ key: editingId, value: val, updated_at: new Date().toISOString() });
      if (error) { toast(error.message, 'error'); return; }
      closeModal();
      toast('Saved', 'ok');
      loadPanel('settings');
      return;
    }

    const cfg = CONFIGS[currentPanel];
    const form = $('editForm');
    const row = {};
    cfg.columns.forEach((col) => {
      const el = form.querySelector(`[name="${col}"]`);
      if (!el) return;
      if (col === 'is_published') row[col] = el.checked;
      else if (col === 'sort_order' || col === 'step_number' || col === 'year') row[col] = el.value === '' ? null : parseInt(el.value, 10);
      else row[col] = el.value.trim();
    });
    if (cfg.onNew) cfg.onNew(row);

    if (pendingImageFile) {
      try {
        const folder = currentPanel === 'blogs' ? 'blogs' : 'cars';
        row.image_url = await uploadImage(pendingImageFile, folder);
      } catch (e) {
        toast(e.message || 'Upload failed', 'error');
        return;
      }
    }

    let error;
    if (editingId) {
      ({ error } = await sb.from(cfg.table).update(row).eq('id', editingId));
    } else {
      ({ error } = await sb.from(cfg.table).insert(row));
    }
    if (error) {
      toast(error.message, 'error');
      return;
    }
    closeModal();
    toast('Saved', 'ok');
    loadPanel(currentPanel);
  }

  async function deleteRow(panel, id) {
    if (!confirm('Delete this item?')) return;
    const cfg = CONFIGS[panel];
    const { error } = await sb.from(cfg.table).delete().eq('id', id);
    if (error) toast(error.message, 'error');
    else {
      toast('Deleted', 'ok');
      loadPanel(panel);
    }
  }

  function closeModal() {
    $('editModal').classList.remove('open');
    editingId = null;
    pendingImageFile = null;
    destroyBlogEditor();
    $('editForm').innerHTML = '';
  }

  $('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('loginEmail').value.trim();
    const password = $('loginPassword').value;
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      showLogin(error.message);
      return;
    }
    session = data.session;
    try {
      await verifyAdmin();
      showDashboard(data.user);
    } catch (err) {
      showLogin(err.message);
    }
  });

  $('logoutBtn').addEventListener('click', async () => {
    await sb.auth.signOut();
    session = null;
    showLogin();
  });

  $('adminNav').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-panel]');
    if (!btn) return;
    loadPanel(btn.dataset.panel);
  });

  $('addBtn').addEventListener('click', () => {
    if (READ_ONLY_PANELS.includes(currentPanel)) return;
    if (currentPanel === 'settings') return;
    openEdit(currentPanel, null);
  });

  $('modalCancel').addEventListener('click', closeModal);
  $('modalSave').addEventListener('click', saveModal);
  $('editModal').addEventListener('click', (e) => {
    if (e.target === $('editModal')) closeModal();
  });

  sb = initClient();
  if (!sb) return;

  sb.auth.getSession().then(async ({ data }) => {
    if (data.session) {
      session = data.session;
      try {
        await verifyAdmin();
        showDashboard(data.session.user);
      } catch (err) {
        showLogin(err.message);
      }
    } else {
      showLogin();
    }
  });

  sb.auth.onAuthStateChange(async (_event, sess) => {
    session = sess;
  });
})();
