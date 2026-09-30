// Navegación móvil, pestañas accesibles, parallax y animaciones de entrada.
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  mainNav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
  mainNav.classList.toggle('is-open', opening);
  document.body.classList.toggle('menu-open', opening);
});

mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 640) closeMenu(); });

// Los datos mantienen el contenido de cada panel en un único lugar.
const styles = {
  swordmaster: { name: 'Swordmaster', kicker: 'ESTILO 01 / OFENSIVA', copy: 'Amplía el repertorio de movimientos con armas cuerpo a cuerpo. Cada golpe abre nuevas posibilidades para mantener el ritmo.', caption: 'DOMINIO DE LA ESPADA', image: 'img/swordmaster.jpg.jpg', alt: 'Representación del estilo Swordmaster', numeral: 'I' },
  trickster: { name: 'Trickster', kicker: 'ESTILO 02 / MOVILIDAD', copy: 'Esquiva, corre y acorta distancias con movimientos ágiles. La velocidad convierte el campo de batalla en tu terreno.', caption: 'AGILIDAD IMPARABLE', image: 'img/trickster.jpg.jpg', alt: 'Representación del estilo Trickster', numeral: 'II' },
  gunslinger: { name: 'Gunslinger', kicker: 'ESTILO 03 / DISTANCIA', copy: 'Desata nuevas técnicas con tus armas de fuego y mantén la presión desde cualquier punto del combate.', caption: 'PRECISIÓN A DISTANCIA', image: 'img/gunslinger.jpg.jpg', alt: 'Representación del estilo Gunslinger', numeral: 'III' },
  royalguard: { name: 'Royal Guard', kicker: 'ESTILO 04 / DEFENSA', copy: 'Lee los movimientos del rival, bloquea en el momento justo y transforma la defensa en una respuesta devastadora.', caption: 'DEFENSA CON ESTILO', image: 'img/royalguard.jpg.jpg', alt: 'Representación del estilo Royal Guard', numeral: 'IV' }
};

const tabs = [...document.querySelectorAll('.style-tab')];
const display = document.querySelector('.style-display');
const styleImage = document.querySelector('#style-image');
const styleVisual = document.querySelector('#style-visual');
const progress = document.querySelector('#style-progress');

function selectStyle(tab, moveFocus = false) {
  const key = tab.dataset.style;
  const style = styles[key];
  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });

  // Atenúa el panel antes de actualizarlo para que el cambio se perciba suave.
  display.classList.add('is-changing');
  window.setTimeout(() => {
    document.querySelector('#style-display').setAttribute('aria-labelledby', tab.id);
    document.querySelector('#style-kicker').textContent = style.kicker;
    document.querySelector('#style-name').textContent = style.name;
    document.querySelector('#style-copy').textContent = style.copy;
    document.querySelector('#visual-caption').textContent = style.caption;
    document.querySelector('.style-visual-mark').textContent = style.numeral;
    styleImage.alt = style.alt;
    styleImage.src = style.image;
    styleImage.hidden = false;
    styleVisual.style.background = '';
    document.querySelector('#style-count').innerHTML = `${String(tabs.indexOf(tab) + 1).padStart(2, '0')} <i>/</i> 04`;
    progress.style.width = `${(tabs.indexOf(tab) + 1) * 25}%`;
    display.classList.remove('is-changing');
    if (moveFocus) tab.focus();
  }, 150);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStyle(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    selectStyle(tabs[nextIndex], true);
  });
});

// Las imágenes faltantes dejan visible el fondo degradado definido en CSS.
document.querySelectorAll('img[onerror]').forEach((image) => {
  image.addEventListener('error', () => { image.hidden = true; });
});
styleImage.addEventListener('error', () => { styleImage.hidden = true; });

// Anima las secciones al entrar en pantalla; sin observer, todo queda visible.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Parallax pequeño y acotado para evitar movimiento excesivo en dispositivos táctiles.
const hero = document.querySelector('.hero-image');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking || reduceMotion.matches || window.innerWidth < 700) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    const offset = Math.min(window.scrollY, window.innerHeight) * 0.18;
    hero.style.transform = `translate3d(0, ${offset}px, 0)`;
    ticking = false;
  });
}, { passive: true });

