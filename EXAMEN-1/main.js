/*!
 scripts.js
 - Contiene el JavaScript separado del HTML.
 - Comentarios sencillos explican cada bloque y su propósito.
 - No se modifica la estructura del DOM, solo se añaden comportamientos accesibles.
*/

/* --- Helpers / DOM ready --- */
function onReady(fn){
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

/* --- 1) Populate service cards (keeps structure unchanged) --- */
onReady(function renderServices(){
  const cards = [
    { icon: 'bi-truck', title: 'Lavado Delicado', copy: 'Lavado especializado para prendas sensibles.', button: 'Ver servicio' },
    { icon: 'bi-droplet', title: 'Tintorería', copy: 'Tratamientos en seco y eliminación de manchas.', button: 'Reservar' },
    { icon: 'bi-speedometer2', title: 'Express 24h', copy: 'Recogida y entrega urgente en 24h cuando se requiere.', button: 'Pedir ahora' },
    { icon: 'bi-truck', title: 'Recogida & Entrega', copy: 'Recogida semanal o puntual con seguimiento.', button: 'Solicitar' }
  ];

  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  grid.innerHTML = ''; // safe replace of content
  cards.forEach((c) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-3 mb-4';
    // Keep semantic markup; just insert inner HTML
    col.innerHTML = `
      <div class="service-card card h-100 text-center" role="group" aria-label="${c.title}">
        <div class="card-body d-flex flex-column align-items-center justify-content-center">
          <i class="bi ${c.icon}" aria-hidden="true"></i>
          <h5 class="card-title mt-2">${c.title}</h5>
          <p class="card-text">${c.copy}</p>
          <button class="btn btn-primary mt-2">${c.button}</button>
        </div>
      </div>`;
    grid.appendChild(col);
  });
});

/* --- 2) Initialize Bootstrap carousels and respect prefers-reduced-motion --- */
onReady(function initCarousels(){
  // If user prefers reduced motion, do not start automatic rotation
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroEl = document.querySelector('#heroCarousel');
  if (heroEl && window.bootstrap && bootstrap.Carousel) {
    const options = { interval: prefersReduce ? false : 3000, ride: prefersReduce ? false : 'carousel', pause: 'hover', wrap: true };
    // Create instance (Bootstrap will respect options)
    new bootstrap.Carousel(heroEl, options);
  }

  const testEl = document.querySelector('#carouselTestimonios');
  if (testEl && window.bootstrap && bootstrap.Carousel) {
    const opts = { interval: prefersReduce ? false : 6000, ride: prefersReduce ? false : 'carousel', pause: 'hover', wrap: true };
    new bootstrap.Carousel(testEl, opts);
  }
});

/* --- 3) Accessibility & keyboard improvements --- */
onReady(function accessibilitySetup(){
  // 3.1 Make interactive cards focusable and allow Enter/Space activation
  function makeCardsFocusable(selector){
    document.querySelectorAll(selector).forEach(card => {
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const btn = card.querySelector('button, a');
          if (btn) {
            btn.focus();
            btn.click();
          }
        }
      });
    });
  }
  makeCardsFocusable('.service-card');
  makeCardsFocusable('.pricing-card');
  makeCardsFocusable('.hero-card');

  // 3.2 Carousel keyboard navigation: left/right keys when focused inside carousel
  function enableCarouselKeys(selector){
    const carousel = document.querySelector(selector);
    if (!carousel) return;
    // make focusable to receive key events
    if (!carousel.hasAttribute('tabindex')) carousel.setAttribute('tabindex','0');

    carousel.addEventListener('keydown', function(e){
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return; // ignore typing
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = carousel.querySelector('.carousel-control-prev');
        if (prev) prev.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = carousel.querySelector('.carousel-control-next');
        if (next) next.click();
      }
    });
  }
  enableCarouselKeys('#heroCarousel');
  enableCarouselKeys('#carouselTestimonios');

  // 3.3 Skip link focus landing
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', function(){
      const main = document.getElementById('main');
      if (main) main.focus({preventScroll:true});
    });
  }
  const main = document.getElementById('main');
  if (main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex','-1');

  // 3.4 Show outline for keyboard users (detect Tab usage)
  document.addEventListener('keydown', function(e){
    if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  }, { once: true });
});

/* --- 4) Back-to-top button behaviour --- */
onReady(function backToTop(){
  const back = document.getElementById('backToTop');
  if (!back) return;
  // toggle visibility on scroll
  window.addEventListener('scroll', function(){
    if (window.scrollY > 300) back.classList.add('show'); else back.classList.remove('show');
  });
  back.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
  // keyboard accessible by default (button element)
});

/* --- 5) Footer form demo handler (keeps behaviour from previous versions) --- */
onReady(function footerForm(){
  const form = document.getElementById('contactFormFooter');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    alert('Formulario enviado (demo). Gracias.');
    form.reset();
  });
});