const KEY = 'vcv-lang';

function detect() {
  const saved = localStorage.getItem(KEY);
  if (saved === 'es' || saved === 'en') return saved;
  return (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
}

let current = detect();
const listeners = new Set();

export const getLang = () => current;
export const onLang = (fn) => listeners.add(fn);

export function setLang(l) {
  current = l;
  localStorage.setItem(KEY, l);
  applyStatic();
  listeners.forEach((fn) => fn(l));
}

export const ui = {
  es: {
    'start.kicker': 'Currículum interactivo',
    'start.explore': 'Explorar el mapa',
    'start.fast': 'Ver CV rápido',
    'start.hint': 'Mueve a tu personaje con WASD / flechas, haciendo click o con el joystick, y descubre mi perfil profesional.',
    'hint.desktop': 'WASD / flechas / click para moverte · E para interactuar · rueda para zoom',
    'hint.touch': 'Usa el joystick o toca el mapa para moverte · toca un edificio para abrirlo',
    'hud.discovered': 'Zonas',
    'hud.skills': 'Skills',
    'hud.map': 'Mapa',
    'hud.mapTitle': 'Zonas por descubrir',
    'hud.interact': 'Abrir',
    'hud.close': 'Cerrar',
    'hud.sound': 'Sonido',
    'hud.lang': 'Idioma',
    'hud.fast': 'CV rápido',
    'hud.help': 'Ayuda',
    'hud.game': 'Volver al mapa',
    'hud.print': 'Imprimir / PDF',
    'toast.zone': 'Descubriste: {0}',
    'toast.skill': 'Skill obtenida: {0}',
    'toast.allZones': '¡Exploraste todo el mapa! Escríbeme desde la oficina de contacto.',
    'toast.allSkills': '¡Coleccionaste todas las skills!',
    'help.title': 'Cómo jugar',
    'help.move': 'Moverte',
    'help.moveText': 'WASD o flechas · click/tap en el suelo · joystick en móvil',
    'help.interact': 'Interactuar',
    'help.interactText': 'Acércate a un edificio con aro brillante y pulsa E, Enter o el botón "Abrir". También puedes hacer click en el edificio.',
    'help.collect': 'Coleccionar',
    'help.collectText': 'Recoge las esferas de colores: cada una es una tecnología que domino.',
    'help.zoom': 'Zoom',
    'help.zoomText': 'Rueda del ratón o pellizco en la pantalla táctil.',
    'help.fast': '¿Sin tiempo? Usa "CV rápido" para ver todo en una sola página.',
    'cv.about': 'Sobre mí',
    'cv.career': 'Trayectoria',
    'cv.projects': 'Proyectos destacados',
    'cv.certs': 'Licencias y certificaciones',
    'cv.education': 'Educación',
    'cv.languages': 'Idiomas',
    'cv.contact': 'Contacto',
    'cv.expired': 'Vencida',
    'cv.issued': 'Expedición',
    'cv.expires': 'Vencimiento',
    'cv.credential': 'ID de la credencial',
    'cv.present': 'Actualidad',
    'cv.results': 'Resultados',
    'cv.skills': 'Tecnologías',
    'cv.cta': 'Si buscas un profesional con experiencia corporativa internacional, orientación estratégica y sólidos conocimientos en Inteligencia Artificial y desarrollo de software, estaré encantado de ayudarte.',
    'cv.linkedin': 'Conectemos en LinkedIn',
    'cv.email': 'Enviar un correo',
    'cv.copy': 'Copiar correo',
    'cv.copied': '¡Copiado!',
    'cv.items': 'elementos',
  },
  en: {
    'start.kicker': 'Interactive résumé',
    'start.explore': 'Explore the map',
    'start.fast': 'Quick CV view',
    'start.hint': 'Move your character with WASD / arrows, by clicking, or with the joystick, and discover my professional profile.',
    'hint.desktop': 'WASD / arrows / click to move · E to interact · wheel to zoom',
    'hint.touch': 'Use the joystick or tap the map to move · tap a building to open it',
    'hud.discovered': 'Zones',
    'hud.skills': 'Skills',
    'hud.map': 'Map',
    'hud.mapTitle': 'Zones to discover',
    'hud.interact': 'Open',
    'hud.close': 'Close',
    'hud.sound': 'Sound',
    'hud.lang': 'Language',
    'hud.fast': 'Quick CV',
    'hud.help': 'Help',
    'hud.game': 'Back to the map',
    'hud.print': 'Print / PDF',
    'toast.zone': 'You discovered: {0}',
    'toast.skill': 'Skill collected: {0}',
    'toast.allZones': 'You explored the whole map! Reach out from the contact office.',
    'toast.allSkills': 'You collected every skill!',
    'help.title': 'How to play',
    'help.move': 'Move',
    'help.moveText': 'WASD or arrows · click/tap the ground · joystick on mobile',
    'help.interact': 'Interact',
    'help.interactText': 'Get close to a building with a glowing ring and press E, Enter or the "Open" button. You can also click the building.',
    'help.collect': 'Collect',
    'help.collectText': 'Grab the colored orbs: each one is a technology I work with.',
    'help.zoom': 'Zoom',
    'help.zoomText': 'Mouse wheel or pinch on touch screens.',
    'help.fast': 'Short on time? Use "Quick CV" to see everything on a single page.',
    'cv.about': 'About me',
    'cv.career': 'Career',
    'cv.projects': 'Featured projects',
    'cv.certs': 'Licenses & certifications',
    'cv.education': 'Education',
    'cv.languages': 'Languages',
    'cv.contact': 'Contact',
    'cv.expired': 'Expired',
    'cv.issued': 'Issued',
    'cv.expires': 'Expires',
    'cv.credential': 'Credential ID',
    'cv.present': 'Present',
    'cv.results': 'Results',
    'cv.skills': 'Technologies',
    'cv.cta': 'If you are looking for a professional with international corporate experience, strategic orientation and solid knowledge of Artificial Intelligence and software development, I would be glad to help.',
    'cv.linkedin': "Let's connect on LinkedIn",
    'cv.email': 'Send an email',
    'cv.copy': 'Copy email',
    'cv.copied': 'Copied!',
    'cv.items': 'items',
  },
};

export function t(key, ...args) {
  let s = ui[current][key] ?? key;
  args.forEach((a, i) => (s = s.replace(`{${i}}`, a)));
  return s;
}

// Picks the current language from a { es, en } object.
export const tx = (obj) => (obj && typeof obj === 'object' && !Array.isArray(obj) ? obj[current] : obj);

export function fmtDate(ym, { short = true } = {}) {
  if (!ym) return t('cv.present');
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1, 1));
  const s = new Intl.DateTimeFormat(current, { month: short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
  return s.replace(/\./g, '');
}

export function applyStatic(root = document) {
  document.documentElement.lang = current;
  root.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const v = t(el.dataset.i18nTitle);
    el.title = v;
    el.setAttribute('aria-label', v);
  });
  root.querySelectorAll('[data-lang-label]').forEach((el) => (el.textContent = current.toUpperCase()));
}
