/*
  El muro. La carita lo abre; adentro va un iframe con /contacto/, que también
  existe como página suelta y compartible.

  Sin JavaScript la carita es un enlace normal a /contacto/ y todo funciona: se
  navega, y la X de esa página vuelve al inicio.
*/

const dialogo = document.getElementById('muro');
const carita = document.querySelector('.carita--enlace');

if (dialogo && carita) {
  const html = document.documentElement;
  const marco = dialogo.querySelector('.muro__marco');
  const RUTA = '/contacto';
  const sinHover = window.matchMedia('(hover: none)');

  let empujado = false;
  let cerrando = false;
  let cierreProgramado = null;

  const duracion = () => parseFloat(getComputedStyle(html).getPropertyValue('--entrada')) || 0;

  /* Ver la nota en contact-modal.js: sin cuadros, requestAnimationFrame no
     corre nunca y el modal se quedaría en su estado de partida. */
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

  /*
    Los 350 KB del muro no se piden junto con la home: se piden cuando el
    navegador queda desocupado, y antes si alguien roza la carita. Así el hilo
    principal y la red se los quedan primero las imágenes de la portada, que
    son las que se ven.

    Y el muro no se descubre hasta que el iframe avisa que terminó. Antes se
    descubría a los 420 ms pasara lo que pasara: con la red lenta el fundido
    se gastaba sobre un documento a medio armar y quedaba la trama sola.
  */
  const listo = () => dialogo.classList.add('is-cargado');

  let reserva = null;
  const cargar = () => {
    if (marco.getAttribute('src')) return;
    marco.setAttribute('src', marco.dataset.src);
    /* Red de seguridad: si algo de adentro nunca termina de cargar —una
       imagen que no llega, una fuente que se cuelga— el evento `load` no
       llega nunca y la estrella se quedaría dando vueltas para siempre. A los
       10 segundos se muestra lo que haya, que es mejor que nada. */
    reserva = window.setTimeout(listo, 10000);
  };

  /* Un iframe sin `src` dispara un `load` por su about:blank inicial. Ese no
     cuenta: solo el del documento que pedimos. */
  marco.addEventListener('load', () => {
    if (!marco.getAttribute('src')) return;
    window.clearTimeout(reserva);
    listo();
  });

  carita.addEventListener('pointerenter', cargar);
  carita.addEventListener('focus', cargar);

  /* En táctil no hay hover, así que sin esto el muro empezaba a bajarse recién
     al tocar. `requestIdleCallback` todavía no está en todos los Safari. */
  const cuandoSobre = (fn) =>
    'requestIdleCallback' in window
      ? window.requestIdleCallback(fn, { timeout: 3000 })
      : window.setTimeout(fn, 1200);

  if (document.readyState === 'complete') cuandoSobre(cargar);
  else window.addEventListener('load', () => cuandoSobre(cargar), { once: true });

  /* La copia de la carita se coloca justo encima de la de la página, para que
     al abrir el modal no se mueva ni un píxel. En móvil la de la página va en
     el flujo y depende del scroll, así que hay que medirla cada vez. */
  const copia = dialogo.querySelector('[data-muro-carita]');
  const calzarLaCarita = () => {
    if (!copia) return;
    /* `getBoundingClientRect` devuelve la caja ya transformada. Si alguien
       hace clic durante la animación de entrada, la carita está escalada y la
       copia quedaría corrida, así que primero se la damos por terminada — que
       es lo que iba a pasar de todas formas. El giro no se toca: es infinito y
       vive en la imagen, no en la caja. */
    for (const a of carita.getAnimations()) {
      try {
        a.finish();
      } catch {
        /* animación infinita: se deja correr */
      }
    }
    const c = carita.getBoundingClientRect();
    copia.style.left = `${c.left}px`;
    copia.style.top = `${c.top}px`;
  };

  /* Y en el mismo ángulo. Las animaciones no corren en `display: none`, así
     que el giro de la copia arranca recién al abrirse el diálogo: sin esto
     las dos caritas quedan desfasadas y se ven dobles mientras se cierra. */
  const sincronizarElGiro = () => {
    const giroDe = (raiz) =>
      raiz
        ?.querySelector('.brandmark img')
        ?.getAnimations()
        .find((a) => a.animationName === 'gira');

    const original = giroDe(carita);
    const clon = giroDe(copia);
    if (original && clon) clon.currentTime = original.currentTime;
  };

  /* La estrella de la espera morfa con SMIL, que no entiende de media queries:
     con movimiento reducido hay que pararla a mano. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dialogo.querySelector('.muro__estrella')?.pauseAnimations();
  }

  const abrir = () => {
    if (dialogo.open && !cerrando) return;

    if (cerrando) {
      window.clearTimeout(cierreProgramado);
      cerrando = false;
    }

    cargar();
    calzarLaCarita();
    carita.classList.remove('is-activa');
    if (!dialogo.open) dialogo.showModal();
    sincronizarElGiro();
    html.classList.add('is-muro');
    html.style.overflow = 'hidden';

    if (!location.pathname.startsWith(RUTA)) {
      history.pushState({ muro: true }, '', `${RUTA}/`);
      empujado = true;
    }

    void dialogo.offsetWidth;
    enElSiguienteCuadro(() => dialogo.classList.add('is-abierto'));
  };

  const cerrar = ({ volver = true } = {}) => {
    if (!dialogo.open || cerrando) return;
    cerrando = true;

    const terminar = () => {
      if (volver) {
        if (empujado) {
          empujado = false;
          history.back();
        } else {
          history.replaceState({}, '', '/');
        }
      }
      dialogo.close();
      dialogo.classList.remove('is-abierto');
      html.classList.remove('is-muro');
      html.style.overflow = '';
      cerrando = false;
    };

    dialogo.classList.remove('is-abierto');

    /* El recorrido son dos tramos seguidos: primero se va el afiche y después
       el fondo. Hay que esperarlos enteros antes de cerrar el diálogo. */
    const espera = duracion() * 2;
    if (espera === 0) {
      terminar();
      return;
    }
    cierreProgramado = window.setTimeout(terminar, espera + 60);
  };

  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-muro], .carita--enlace');
    if (!boton) return;
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    if (evento.button !== 0) return;

    evento.preventDefault();

    if (boton.dataset.muro === 'cerrar') {
      cerrar();
      return;
    }

    /* Sin hover no hay forma de asomar el globo, así que el primer toque lo
       saca y recién el segundo abre el muro. */
    if (sinHover.matches && !carita.classList.contains('is-activa')) {
      carita.classList.add('is-activa');
      return;
    }

    abrir();
  });

  // Tocar en cualquier otra parte guarda el globo de la carita.
  document.addEventListener('click', (evento) => {
    if (evento.target.closest('.carita--enlace')) return;
    carita.classList.remove('is-activa');
  });

  dialogo.addEventListener('cancel', (evento) => {
    evento.preventDefault();
    cerrar();
  });

  window.addEventListener('popstate', () => {
    empujado = false;
    if (dialogo.open) cerrar({ volver: false });
  });

  /* La X que trae la propia página del muro navega a la home. Dentro del
     modal eso sería un recargón, así que —al ser el mismo origen— se le
     engancha el cierre. Si el navegador lo impidiera, sigue navegando, que es
     un final razonable. */
  marco.addEventListener('load', () => {
    try {
      const salida = marco.contentDocument?.querySelector('[data-cerrar-muro]');
      salida?.addEventListener('click', (evento) => {
        evento.preventDefault();
        cerrar();
      });
    } catch {
      /* otro origen: se deja el enlace como está */
    }
  });

  /* La carita del modal repone los papelitos del cartel. Esa función la tenía
     un botón dentro de la página, que ahí sigue para cuando se visita suelta;
     enmarcada se esconde y la hace la carita. */
  const caritaDelMuro = copia?.querySelector('[data-carita-accion]');
  caritaDelMuro?.addEventListener('click', () => {
    // Sin hover, el primer toque saca el globo y el segundo repone, igual que
    // en la home: si no, nadie sabría qué hace.
    if (sinHover.matches && !caritaDelMuro.classList.contains('is-activa')) {
      caritaDelMuro.classList.add('is-activa');
      return;
    }
    marco.contentDocument?.getElementById('reponer')?.click();
  });
}
