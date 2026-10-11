import { profile, skills, zones, companies, projects, certGroups, education, languages, contact } from './data.js';
import { getLang, t, tx, fmtDate } from './i18n.js';

const base = import.meta.env.BASE_URL;
export const photoUrl = `${base}photo.jpg`;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function aboutHTML(withHero = true) {
  const l = getLang();
  return `
    ${
      withHero
        ? `<div class="about-hero">
      <img class="avatar-lg" src="${photoUrl}" alt="${esc(profile.name)}" />
      <div>
        <h3>${esc(profile.name)}</h3>
        <p class="muted">${esc(tx(profile.headline))}</p>
      </div>
    </div>`
        : ''
    }
    <div class="metrics">
      ${profile.metrics.map((m) => `<div class="metric"><strong>${esc(m.value)}</strong><span>${esc(m.label[l])}</span></div>`).join('')}
    </div>
    ${profile.about[l].map((p) => `<p>${esc(p)}</p>`).join('')}
    <h4>${t('cv.skills')}</h4>
    <div class="chips">
      ${skills.map((s) => `<span class="chip" style="--c:${s.color}">${esc(s.name)}</span>`).join('')}
    </div>
    <blockquote>${esc(tx(profile.philosophy))}</blockquote>
  `;
}

function rolesHTML(id) {
  return `<div class="timeline">
    ${companies[id].roles
      .map(
        (r) => `
      <article class="role">
        <div class="role-dot"></div>
        <header>
          <h4>${esc(r.title)}</h4>
          <div class="role-meta"><span class="company">${esc(r.company)}</span><span class="dates">${fmtDate(r.from)} – ${fmtDate(r.to)}</span></div>
        </header>
        <p>${esc(tx(r.desc))}</p>
      </article>`,
      )
      .join('')}
  </div>`;
}

function projectsHTML() {
  return `<div class="cards">
    ${projects
      .map(
        (p) => `
      <article class="card">
        <div class="card-icon">${p.icon}</div>
        <h4>${esc(tx(p.title))}</h4>
        <p>${esc(tx(p.desc))}</p>
        <div class="results-title">${t('cv.results')}</div>
        <ul class="results">${tx(p.results).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      </article>`,
      )
      .join('')}
  </div>`;
}

function isExpired(c) {
  if (!c.expires) return false;
  const [y, m] = c.expires.split('-').map(Number);
  return new Date(y, m, 1) <= new Date();
}

function certsHTML() {
  return certGroups
    .map(
      (g) => `
    <details class="cert-group" ${g.open ? 'open' : ''}>
      <summary><span>${esc(tx(g.title))}</span><em>${g.items.length}</em></summary>
      <ul class="certs">
        ${g.items
          .map(
            (c) => `
          <li class="${isExpired(c) ? 'expired' : ''}">
            <div class="cert-name">${esc(c.name)}</div>
            <div class="cert-meta">
              <span>${esc(c.issuer)}</span>
              <span>${t('cv.issued')}: ${fmtDate(c.issued)}</span>
              ${c.expires ? `<span>${t('cv.expires')}: ${fmtDate(c.expires)}</span>` : ''}
              ${isExpired(c) ? `<span class="badge">${t('cv.expired')}</span>` : ''}
              ${c.id ? `<span class="cred">${t('cv.credential')}: ${esc(c.id)}</span>` : ''}
            </div>
          </li>`,
          )
          .join('')}
      </ul>
    </details>`,
    )
    .join('');
}

function educationHTML() {
  return `
    <div class="cards">
      ${education
        .map(
          (e) => `
        <article class="card">
          <div class="card-icon">🎓</div>
          <h4>${esc(e.school)}</h4>
          <p>${esc(tx(e.degree))}</p>
          <div class="dates">${esc(e.years)}</div>
        </article>`,
        )
        .join('')}
    </div>
    <h4>${t('cv.languages')}</h4>
    <div class="langs">
      ${languages
        .map(
          (x) => `
        <div class="lang">
          <div class="lang-head"><strong>${esc(tx(x.name))}</strong><span>${esc(tx(x.level))}</span></div>
          <div class="bar"><i style="width:${x.pct}%"></i></div>
        </div>`,
        )
        .join('')}
    </div>`;
}

function contactHTML() {
  return `
    <p>${esc(t('cv.cta'))}</p>
    <div class="contact-actions">
      <a class="btn primary" href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">in&nbsp; ${t('cv.linkedin')}</a>
      <a class="btn" href="mailto:${contact.email}">✉️&nbsp; ${t('cv.email')}</a>
      <button class="btn" type="button" data-copy="${contact.email}">📋&nbsp; ${t('cv.copy')}</button>
    </div>
    <p class="muted contact-line">${esc(contact.email)}<br /><a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">${esc(contact.linkedin.replace('https://', ''))}</a></p>`;
}

export function zoneHTML(id) {
  switch (id) {
    case 'about': return aboutHTML();
    case 'early': case 'movilnet': case 'hp': case 'ms': return rolesHTML(id);
    case 'projects': return projectsHTML();
    case 'certs': return certsHTML();
    case 'education': return educationHTML();
    case 'contact': return contactHTML();
    default: return '';
  }
}

export function fullCVHTML() {
  const z = (id) => zones.find((x) => x.id === id);
  const section = (id, title, body) => `<section class="cv-section" id="cv-${id}"><h2>${title}</h2>${body}</section>`;
  const career = ['ms', 'hp', 'movilnet', 'early']
    .map((id) => `<h3 class="company-title">${z(id).icon} ${esc(tx(z(id).title))}</h3>${rolesHTML(id)}`)
    .join('');
  return `
    <header class="cv-hero">
      <img class="avatar-lg" src="${photoUrl}" alt="${esc(profile.name)}" />
      <div>
        <h1>${esc(profile.name)}</h1>
        <p class="lead">${esc(tx(profile.headline))}</p>
        <p class="muted">${esc(tx(profile.tagline))}</p>
      </div>
    </header>
    <nav class="cv-nav">
      <a href="#cv-about">${t('cv.about')}</a>
      <a href="#cv-career">${t('cv.career')}</a>
      <a href="#cv-projects">${t('cv.projects')}</a>
      <a href="#cv-certs">${t('cv.certs')}</a>
      <a href="#cv-education">${t('cv.education')}</a>
      <a href="#cv-contact">${t('cv.contact')}</a>
    </nav>
    ${section('about', t('cv.about'), aboutHTML(false))}
    ${section('career', t('cv.career'), career)}
    ${section('projects', t('cv.projects'), projectsHTML())}
    ${section('certs', t('cv.certs'), certsHTML())}
    ${section('education', t('cv.education'), educationHTML())}
    ${section('contact', t('cv.contact'), contactHTML())}
  `;
}

// Event delegation for "copy email" buttons.
export function bindCopyButtons(root) {
  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const old = btn.innerHTML;
      btn.textContent = t('cv.copied');
      setTimeout(() => (btn.innerHTML = old), 1500);
    } catch {
      /* clipboard unavailable */
    }
  });
}
