/* Speedgate Logistics — site interactions */
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

const revealObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  const m = document.getElementById('toastMsg');
  if (!t || !m) return;
  m.textContent = msg;
  t.className = 'toast ' + type;
  const icon = t.querySelector('i');
  if (icon) {
    icon.className = type === 'success' ? 'fas fa-check-circle'
      : type === 'error' ? 'fas fa-times-circle' : 'fas fa-info-circle';
  }
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

const db = window.SpeedgateSupabase || window.CarImportsSupabase;

const heroSearchForm = document.getElementById('heroSearchForm');
if (heroSearchForm) {
  heroSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const make = document.getElementById('searchMake')?.value;
    const model = document.getElementById('searchModel')?.value;
    if (db && db.configured()) db.logHeroSearch(make, model);
    showToast(make ? `Searching ${make} — see sample cars below or request a quote.` : 'Browse sample cars or contact us for live stock.', 'info');
    document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' });
  });
}

const inquiryForm = document.getElementById('inquiryForm');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = inquiryForm.name.value.trim();
    const phone = inquiryForm.phone.value.trim();
    if (!name) { showToast('Please enter your name.', 'error'); return; }
    if (!phone) { showToast('Please enter your phone.', 'error'); return; }
    if (db && db.configured()) {
      const r = await db.insertInquiry(inquiryForm);
      if (r.ok) {
        showToast(`Thanks ${name}! Speedgate Logistics will contact you within 24 hours.`, 'success');
        inquiryForm.reset();
      } else {
        showToast('Could not save enquiry. Please WhatsApp us.', 'error');
      }
    } else {
      showToast(`Thanks ${name}! We will contact you soon.`, 'success');
      inquiryForm.reset();
    }
  });
}
