/*
  Páginas de caso. En la home cada caso es un <dialog> (ver CaseModal.astro)
  y los proyectos de la lista son enlaces a /caso/<slug>/: el script los
  intercepta, abre el diálogo y empuja la URL al historial, así el enlace se
  puede copiar y el botón de atrás cierra. Sin JavaScript los enlaces navegan
  a la página de verdad, que tiene el mismo marcado ya abierto.

  El script solo pone y saca dos clases y el CSS hace todo el recorrido:
  `is-caso` en <html> apaga lo que hay encima del azul y del crema de la home
  (global.css), e `is-abierto` en el diálogo corre el borde y trae la
  información (CaseModal.astro). En móvil la hoja sube desde abajo.

  También corre en /caso/<slug>/, donde no hay diálogos: ahí solo enciende los
  videos.
*/

const html = document.documentElement;
const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Videos: suenan solo mientras se ven. Con movimiento reducido se queda el
   póster. Dentro de un diálogo cerrado no se ven nunca, así que no cargan. */
const videos = document.querySelectorAll('[data-caso-video]');
if (videos.length && 'IntersectionObserver' in window) {
  const vigia = new IntersectionObserver((entradas) => {
    for (const { target, isIntersecting } of entradas) {
      if (isIntersecting && !quieto.matches) target.play().catch(() => {});
      else target.pause();
    }
  });
  for (const v of videos) vigia.observe(v);
}

const dialogos = new Map(
  [...document.querySelectorAll('dialog[data-caso]')].map((d) => [d.dataset.caso, d])
);

if (dialogos.size) {
  const RUTA = /^\/caso\/([^/]+)\/?$/;
  const enMovil = window.matchMedia('(max-width: 1024px)');
  let abierto = null;
  let empujado = false;
  let cerrando = false;
  let cierreProgramado = null;

  const duracion = () => parseFloat(getComputedStyle(html).getPropertyValue('--entrada')) || 0;
  /* Lo que tarda en cerrarse antes de poder sacar el diálogo: en escritorio
     se apaga la información (--sale) y vuelve el crema (--corre); en móvil
     baja la hoja. Las proporciones son las de CaseModal.astro. */
  const cierre = () => (enMovil.matches ? duracion() : duracion() * (0.7 + 1.7));

  // La lista de proyectos vuelve a apilarse al cerrar, como con el contacto.
  const reapilar = () => {
    for (const el of document.querySelectorAll('[data-apila]')) {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    }
  };

  // Ver contact-modal.js: sin el temporizador, en una pestaña de fondo el
  // diálogo se quedaría abierto e invisible.
  const enElSiguienteCuadro = (fn) => {
    let hecho = false;
    const unaVez = () => {
      if (hecho) return;
      hecho = true;
      fn();
    };
    requestAnimationFrame(unaVez);
    window.setTimeout(unaVez, 50);
  };

  const abrir = (slug, { empujar = true } = {}) => {
    const dialogo = dialogos.get(slug);
    if (!dialogo) return false;

    // Volver a abrir mientras se cierra cancela el cierre.
    if (cerrando && abierto === dialogo) {
      window.clearTimeout(cierreProgramado);
      cerrando = false;
    } else if (abierto) {
      return true;
    }

    abierto = dialogo;
    if (!dialogo.open) {
      dialogo.showModal();
      // Siempre desde arriba, aunque se haya leído hasta el final la vez anterior.
      dialogo.scrollTop = 0;
      const contenido = dialogo.querySelector('[data-caso-contenido]');
      if (contenido) contenido.scrollTop = 0;
    }

    if (empujar) {
      history.pushState({ caso: slug }, '', `/caso/${slug}/`);
      empujado = true;
    }

    void dialogo.offsetWidth; // fuerza el reflow antes de animar

    enElSiguienteCuadro(() => {
      html.classList.add('is-caso');
      dialogo.classList.add('is-abierto');
    });
    return true;
  };

  const cerrar = ({ volver = true } = {}) => {
    const dialogo = abierto;
    if (!dialogo || cerrando) return;
    cerrando = true;

    /* La home vuelve a encenderse recién cuando el crema terminó de volver:
       `is-caso` se saca al final, junto con el diálogo. */
    const terminar = () => {
      if (volver) {
        if (empujado) history.back();
        else history.replaceState({}, '', '/');
      }
      empujado = false;
      dialogo.close();
      html.classList.remove('is-caso');
      abierto = null;
      cerrando = false;
      reapilar();
    };

    dialogo.classList.remove('is-abierto');

    const espera = cierre();
    if (espera === 0) terminar();
    else cierreProgramado = window.setTimeout(terminar, espera + 60);
  };

  document.addEventListener('click', (evento) => {
    // En móvil el primer toque de un proyecto solo lo muestra (hover-stage.js).
    if (evento.defaultPrevented) return;
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    if (evento.button !== 0) return;

    const abre = evento.target.closest('[data-abre-caso]');
    if (abre) {
      if (abrir(abre.dataset.abreCaso)) evento.preventDefault();
      return;
    }
    if (evento.target.closest('[data-cierra-caso]')) {
      evento.preventDefault();
      cerrar();
    }
  });

  for (const dialogo of dialogos.values()) {
    dialogo.addEventListener('cancel', (evento) => {
      evento.preventDefault();
      cerrar();
    });
  }

  /* Atrás cierra sin volver a tocar el historial; adelante vuelve a abrir el
     caso que se había cerrado con atrás. */
  window.addEventListener('popstate', () => {
    empujado = false;
    const slug = location.pathname.match(RUTA)?.[1];
    if (abierto && abierto.dataset.caso !== slug) cerrar({ volver: false });
    else if (slug && !abierto) abrir(decodeURIComponent(slug), { empujar: false });
  });

  const observador = new MutationObserver(() => {
    html.style.overflow = abierto?.open ? 'hidden' : '';
  });
  for (const d of dialogos.values()) {
    observador.observe(d, { attributes: true, attributeFilter: ['open'] });
  }
}
