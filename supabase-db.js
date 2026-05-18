/**
 * Supabase PostgREST helpers (no @supabase/supabase-js required).
 * Requires window.SUPABASE_URL and window.SUPABASE_ANON_KEY from supabase-config.js
 */
(function () {
  function configured() {
    return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && String(window.SUPABASE_ANON_KEY).length > 20);
  }

  function headers() {
    var k = window.SUPABASE_ANON_KEY;
    return {
      apikey: k,
      Authorization: 'Bearer ' + k,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    };
  }

  async function postJson(path, body) {
    var url = window.SUPABASE_URL.replace(/\/$/, '') + path;
    var res = await fetch(url, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    if (!res.ok) {
      var errText = await res.text().catch(function () { return res.statusText; });
      return { ok: false, status: res.status, error: errText };
    }
    return { ok: true };
  }

  async function insertInquiry(formEl) {
    if (!configured()) return { ok: false, reason: 'not_configured' };
    var fd = new FormData(formEl);
    var row = {
      full_name: String(fd.get('name') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      email: String(fd.get('email') || '').trim() || null,
      service: String(fd.get('service') || '').trim(),
      budget: String(fd.get('budget') || '').trim() || null,
      vehicle_preference: String(fd.get('vehicle') || '').trim() || null,
      message: String(fd.get('message') || '').trim() || null,
      source: 'speedgate-logistics'
    };
    if (!row.full_name) return { ok: false, reason: 'validation', field: 'name' };
    if (!row.phone) return { ok: false, reason: 'validation', field: 'phone' };
    if (!row.service) return { ok: false, reason: 'validation', field: 'service' };
    return postJson('/rest/v1/inquiries', row);
  }

  async function insertNewsletter(email) {
    if (!configured()) return { ok: false, reason: 'not_configured' };
    var e = String(email || '').trim().toLowerCase();
    if (!e) return { ok: false, reason: 'validation', field: 'email' };
    return postJson('/rest/v1/newsletter_subscribers', { email: e });
  }

  async function logHeroSearch(make, model) {
    if (!configured()) return { ok: false, reason: 'not_configured' };
    var row = {
      make: make ? String(make).trim() || null : null,
      model: model ? String(model).trim() || null : null,
      source: 'speedgate-logistics'
    };
    return postJson('/rest/v1/hero_searches', row);
  }

  var api = {
    configured: configured,
    insertInquiry: insertInquiry,
    insertNewsletter: insertNewsletter,
    logHeroSearch: logHeroSearch
  };
  window.SpeedgateSupabase = api;
  window.CarImportsSupabase = api;
})();
