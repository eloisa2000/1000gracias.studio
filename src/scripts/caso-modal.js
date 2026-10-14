/*
  Páginas de caso. En la home cada caso es un <dialog> (ver CaseModal.astro)
  y los proyectos de la lista son enlaces a /caso/<slug>/: el script los
  intercepta, abre el diálogo y empuja la URL al historial, así el enlace se
  puede copiar y el botón de atrás cierra. Sin JavaScript los enlaces navegan
  a la página de verdad, que tiene el mismo marcado ya abierto.

  El recorrido es el mismo que el del contacto: la clase `is-abierto` lo
  dispara entero y el CSS hace el resto. En escritorio el azul y el crema se
  cierran sobre la imagen del hero; en móvil la hoja sube desde abajo.

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
  // El barrido dura 1.5 veces la entrada, y el contenido llega a la mitad.
  const recorrido = () => duracion() * 1.5;

  /* La X del caso ocupa el lugar de «Conversemos»: parte con su ancho y se
     anima hasta el suyo, igual que la del contacto. */
  const conversemos = () =>
    [...document.querySelectorAll('.pildora[data-contacto="abrir"]')].find((p) => p.offsetWidth > 0);
  const cruzDe = (dialogo) => dialogo.querySelector('[data-cierra-caso]');
  const rotulos = (pildora) => [...pildora.querySelectorAll('.pildora__etiqueta')];

  const limpiar = (pildora) => {
    if (!pildora) return;
    pildora.style.width = '';
    for (const e of rotulos(pildora)) e.style.opacity = '';
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

  // La lista de proyectos vuelve a apilarse al cerrar, como con el contacto.
  const reapilar = () => {
    for (const el of document.querySelectorAll('[data-apila]')) {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    }
  };

  const abrir = (slug, { empujar = true } = {}) => {
    const dialogo = dialogos.get(slug);
    if (!dialogo) return false;

    if (cerrando && abierto === dialogo) {
      window.clearTimeout(cierreProgramado);
      cerrando = false;
    } else if (abierto) {
      return true;
    }

    abierto = dialogo;
    html.classList.add('is-caso');
    if (!dialogo.open) dialogo.showModal();

    // Siempre desde arriba, aunque se haya leído hasta el final la vez anterior.
    dialogo.scrollTop = 0;
    const contenido = dialogo.querySelector('[data-caso-contenido]');
    if (contenido) contenido.scrollTop = 0;

    if (empujar) {
      history.pushState({ caso: slug }, '', `/caso/${slug}/`);
      empujado = true;
    }

    const origen = conversemos();
    const cruz = cruzDe(dialogo);
    let anchoFinal = 0;
    if (cruz && origen && !enMovil.matches) {
      anchoFinal = cruz.offsetWidth;
      cruz.style.width = `${origen.offsetWidth}px`;
      for (const e of rotulos(cruz)) e.style.opacity = '0';
    }

    void dialogo.offsetWidth;

    enElSiguienteCuadro(() => {
      dialogo.classList.add('is-abierto');
      if (anchoFinal) {
        cruz.style.width = `${anchoFinal}px`;
        for (const e of rotulos(cruz)) e.style.opacity = '1';
      }
    });

    window.setTimeout(() => limpiar(cruz), recorrido() + 120);
    return true;
  };

  const cerrar = ({ volver = true } = {}) => {
    const dialogo = abierto;
    if (!dialogo || cerrando) return;
    cerrando = true;

    const cruz = cruzDe(dialogo);

    const terminar = () => {
      if (volver) {
        if (empujado) history.back();
        else history.replaceState({}, '', '/');
      }
      empujado = false;
      dialogo.close();
      dialogo.classList.remove('is-abierto');
      html.classList.remove('is-caso');
      limpiar(cruz);
      abierto = null;
      cerrando = false;
      reapilar();
    };

    if (duracion() === 0) {
      terminar();
      return;
    }

    dialogo.classList.remove('is-abierto');

    const origen = conversemos();
    if (cruz && origen && !enMovil.matches) {
      cruz.style.width = `${cruz.offsetWidth}px`;
      void cruz.offsetWidth;
      enElSiguienteCuadro(() => {
        cruz.style.width = `${origen.offsetWidth}px`;
        for (const e of rotulos(cruz)) e.style.opacity = '0';
      });
    }

    cierreProgramado = window.setTimeout(terminar, recorrido() + 80);
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
