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

  También corre en /caso/<slug>/, donde no hay diálogos: ahí enciende los
  videos y el desplazamiento suave.
*/

import Lenis from 'lenis';

const html = document.documentElement;
const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');
const enEscritorio = window.matchMedia('(min-width: 1025px)');

/* Desplazamiento suave (Lenis) en la columna de la derecha. Solo en
   escritorio: en móvil se desplaza la hoja entera y el dedo ya tiene su
   inercia. Con movimiento reducido se queda el desplazamiento nativo. Cada
   caso tiene el suyo, que se crea al abrir y se destruye al cerrar. */
const suaves = new Map();

const suavizar = (raiz) => {
  const contenido = raiz.querySelector('[data-caso-contenido]');
  if (!contenido || suaves.has(contenido)) return;
  if (!enEscritorio.matches || quieto.matches) return;
  suaves.set(
    contenido,
    new Lenis({
      wrapper: contenido,
      content: contenido.querySelector('[data-caso-pista]') ?? contenido,
      autoRaf: true,
    })
  );
};

const soltar = (raiz) => {
  const contenido = raiz.querySelector('[data-caso-contenido]');
  suaves.get(contenido)?.destroy();
  suaves.delete(contenido);
};

// En /caso/<slug>/ la columna ya está abierta desde el principio.
const pagina = document.querySelector('.caso--pagina');
if (pagina) suavizar(pagina);

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
  let regreso = null;

  const duracion = () => parseFloat(getComputedStyle(html).getPropertyValue('--entrada')) || 0;
  /* Lo que tarda en cerrarse antes de poder sacar el diálogo: en escritorio
     se apaga la información (--sale) y vuelve el crema (--corre); en móvil
     baja la hoja. Las proporciones son las de CaseModal.astro. */
  const cierre = () => (enMovil.matches ? duracion() : duracion() * (0.7 + 1.7));
  // Lo que tarda la home en volver a encenderse, pieza por pieza (tokens.css).
  const vuelta = () => duracion() * (0.7 + 0.2 * 2);

  /*
    La marca viaja: «1000gracias» se desliza desde el panel crema de la home
    hasta la columna azul del caso, y cambia de azul a crema en el camino. Al
    cerrar hace el viaje de vuelta.

    Lo que se mueve es una copia fija dentro del diálogo, que parte justo
    encima de una marca y termina justo encima de la otra; mientras viaja,
    las dos de verdad están escondidas. Solo en escritorio: en móvil la marca
    llega con la hoja.
  */
  const marcaHome = document.querySelector('.panel .nav .wordmark');
  const marcaDe = (dialogo) => dialogo.querySelector('[data-caso-marca] .wordmark');
  const color = (nombre) => getComputedStyle(html).getPropertyValue(nombre).trim();
  let viajero = null;

  const aterrizar = () => {
    viajero?.remove();
    viajero = null;
  };

  // Mueve la copia de `desde` a `hasta`, y llama a `alLlegar` al terminar.
  const viajar = (dialogo, desde, hasta, { retardo, dura, tono, alLlegar }) => {
    // Se mide antes de soltar la copia anterior: puede ser el punto de partida.
    const a = desde.getBoundingClientRect();
    const b = hasta.getBoundingClientRect();
    const copia = desde.cloneNode(true);
    aterrizar();
    Object.assign(copia.style, {
      visibility: 'visible',
      transform: '',
      position: 'fixed',
      left: `${a.left}px`,
      top: `${a.top}px`,
      margin: '0',
      zIndex: '5',
      pointerEvents: 'none',
    });
    // El punto entra animado la primera vez; la copia no tiene que repetirlo.
    copia.querySelector('.wordmark__punto')?.style.setProperty('animation', 'none');
    copia.setAttribute('aria-hidden', 'true');
    dialogo.append(copia);
    viajero = copia;

    const animacion = copia.animate(
      [
        { transform: 'translate(0, 0)', color: color(tono[0]) },
        { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px)`, color: color(tono[1]) },
      ],
      { delay: retardo, duration: dura, easing: 'cubic-bezier(0.2, 0.6, 0.2, 1)', fill: 'both' }
    );
    animacion.finished.then(() => {
      if (viajero === copia) alLlegar?.();
    }, () => {});
  };

  const viajaMarca = () => marcaHome && !enMovil.matches && duracion() > 0;

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
      suavizar(dialogo);
    }

    if (empujar) {
      history.pushState({ caso: slug }, '', `/caso/${slug}/`);
      empujado = true;
    }

    void dialogo.offsetWidth; // fuerza el reflow antes de animar

    /* Ida: la copia espera a que la home se apague (--sale), viaja mientras
       se corre el borde (--corre) y se queda encima de la marca del caso
       hasta que la columna azul terminó de aparecer. */
    const marcaCaso = marcaDe(dialogo);
    if (viajaMarca() && marcaCaso) {
      const e = duracion();
      marcaHome.style.visibility = 'hidden';
      marcaCaso.style.visibility = 'hidden';
      viajar(dialogo, marcaHome, marcaCaso, {
        retardo: e * 1.1,
        dura: e * 1.7,
        tono: ['--azul', '--crema'],
        alLlegar: () =>
          window.setTimeout(() => {
            if (abierto !== dialogo || cerrando) return;
            aterrizar();
            marcaCaso.style.visibility = '';
          }, e * (0.7 + 0.7)),
      });
    }

    window.clearTimeout(regreso);
    html.classList.add('con-caso');
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
      aterrizar();
      if (marcaHome) marcaHome.style.visibility = '';
      if (volver) {
        if (empujado) history.back();
        else history.replaceState({}, '', '/');
      }
      empujado = false;
      dialogo.close();
      soltar(dialogo);
      html.classList.remove('is-caso');
      regreso = window.setTimeout(() => html.classList.remove('con-caso'), vuelta() + 60);
      abierto = null;
      cerrando = false;
      reapilar();
    };

    dialogo.classList.remove('is-abierto');

    /* Vuelta: la copia parte de la marca del caso cuando la información ya
       se apagó (--apaga) y llega a la de la home junto con el crema. */
    const marcaCaso = marcaDe(dialogo);
    if (viajaMarca() && marcaCaso) {
      const e = duracion();
      const desde = viajero ?? marcaCaso;
      marcaHome.style.visibility = 'hidden';
      viajar(dialogo, desde, marcaHome, {
        retardo: viajero ? 0 : e * 0.7,
        dura: e * 1.7,
        tono: ['--crema', '--azul'],
      });
      marcaCaso.style.visibility = 'hidden';
    }

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
