/*
  Modal de contacto. Usa <dialog> nativo, así que el atrapado de foco, la
  tecla Escape y la devolución del foco al botón que lo abrió los resuelve el
  navegador.

  El diálogo es transparente y arranca en su estado de partida: el bloque rojo
  y la imagen invisibles, las estrellas encima de las de la home, el
  formulario abajo. La clase `is-abierto` dispara todo el recorrido de una
  vez, así que no hay ningún parpadeo: lo único que cambia de golpe es el
  panel crema, que queda justo encima del de la home.
*/

const dialogo = document.getElementById('contacto');

if (dialogo) {
  const html = document.documentElement;

  /* El contacto tiene su propia URL. En la home el modal la empuja al
     historial sin recargar, así el enlace se puede copiar y compartir y el
     botón de atrás cierra. Si alguien entra directo a /conversemos, esa página
     existe de verdad (ver src/pages/conversemos.astro) y este script no corre. */
  const RUTA = '/conversemos';
  const enMovil = window.matchMedia('(max-width: 1024px)');
  // El retardo escalonado más largo del modal: la segunda estrella y la figura
  // del perro, en escritorio. Hay que sumarlo a la duración antes de cerrar el
  // diálogo o se corta el último tramo.
  const RETARDO_MAX = 140;
  const recorrido = () => duracion() + RETARDO_MAX;
  let empujado = false;
  let cerrando = false;
  let cierreProgramado = null;

  const duracion = () => parseFloat(getComputedStyle(html).getPropertyValue('--entrada')) || 0;

  /* La píldora «Conversemos» y la «X» ocupan el mismo lugar y están ancladas
     a la derecha: la del modal parte con el ancho de la otra y se anima hasta
     el suyo. Hay dos de cada tipo (escritorio y móvil) y solo una visible. */
  const pildoraVisible = (raiz, tipo) =>
    [...raiz.querySelectorAll(`.pildora[data-contacto="${tipo}"]`)].find((p) => p.offsetWidth > 0);

  /* Al cerrar el contacto, la lista de proyectos vuelve a apilarse: es lo
     primero que se ve al volver. Quitar y devolver `animation` reinicia la
     animación desde cero, retardos incluidos. Con movimiento reducido no hay
     ninguna animación declarada y esto no hace nada. */
  const reapilar = () => {
    for (const el of document.querySelectorAll('[data-apila]')) {
      el.style.animation = 'none';
      void el.offsetWidth; // fuerza el reflow entre el quitar y el devolver
      el.style.animation = '';
    }
  };

  // Hay dos etiquetas por píldora: la normal y la del relleno del hover.
  const etiquetas = (pildora) => [...pildora.querySelectorAll('.pildora__etiqueta')];

  const limpiar = (pildora) => {
    if (!pildora) return;
    pildora.style.width = '';
    for (const e of etiquetas(pildora)) e.style.opacity = '';
  };

  /* El siguiente cuadro dispara el recorrido. Si la pestaña está en segundo
     plano no hay cuadros y requestAnimationFrame no corre nunca, así que el
     temporizador lo garantiza igual: sin esto el modal se abriría y se
     quedaría en su estado de partida, o sea invisible. La función tiene que
     poder ejecutarse dos veces sin efectos. */
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

  const abrir = () => {
    if (dialogo.open && !cerrando) return;

    /* Si veníamos cerrando, cancelamos el cierre y volvemos a abrir sobre el
       mismo diálogo. Sin esto, apretar «Conversemos» durante los ~640 ms que
       dura el cierre no hacía nada y el modal terminaba de cerrarse igual. */
    if (cerrando) {
      window.clearTimeout(cierreProgramado);
      cerrando = false;
    }

    const origen = pildoraVisible(document, 'abrir');
    const ancho = origen ? origen.offsetWidth : 0;

    html.classList.add('is-contacto');
    if (!dialogo.open) dialogo.showModal();

    /* La hoja abre desplazada al formulario, esté donde esté el scroll de la
       página. El navegador topa solo cuando no hay más contenido abajo, y ahí
       queda la franja de rojo arriba. */
    if (enMovil.matches) {
      const panel = dialogo.querySelector('.contacto__panel');
      if (panel) dialogo.scrollTop = panel.offsetTop;
    }

    if (!location.pathname.startsWith(RUTA)) {
      history.pushState({ contacto: true }, '', RUTA);
      empujado = true;
    }

    const destino = pildoraVisible(dialogo, 'cerrar');
    const rotulos = destino ? etiquetas(destino) : [];
    let anchoFinal = 0;

    if (destino && ancho) {
      anchoFinal = destino.offsetWidth;
      destino.style.width = `${ancho}px`;
      for (const e of rotulos) e.style.opacity = '0';
    }

    void dialogo.offsetWidth; // fuerza el reflow antes de animar

    enElSiguienteCuadro(() => {
      dialogo.classList.add('is-abierto');
      if (anchoFinal) {
        destino.style.width = `${anchoFinal}px`;
        for (const e of rotulos) e.style.opacity = '1';
      }
    });

    window.setTimeout(() => limpiar(destino), recorrido() + 120);
  };

  const cerrar = ({ volver = true } = {}) => {
    if (!dialogo.open || cerrando) return;
    cerrando = true;

    const destino = pildoraVisible(dialogo, 'cerrar');
    const origen = pildoraVisible(document, 'abrir');
    const espera = duracion();

    /* El historial se toca al final, no al empezar: así cancelar el cierre
       cancela también el cambio de URL. */
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
      html.classList.remove('is-contacto');
      limpiar(destino);
      cerrando = false;
      reapilar();
    };

    if (espera === 0) {
      terminar();
      return;
    }

    dialogo.classList.remove('is-abierto');

    if (destino && origen) {
      const rotulos = etiquetas(destino);
      destino.style.width = `${destino.offsetWidth}px`;
      void destino.offsetWidth;
      enElSiguienteCuadro(() => {
        destino.style.width = `${origen.offsetWidth}px`;
        for (const e of rotulos) e.style.opacity = '0';
      });
    }

    cierreProgramado = window.setTimeout(terminar, recorrido() + 80);
  };

  document.addEventListener('click', (evento) => {
    const enlace = evento.target.closest('[data-contacto]');
    if (!enlace) return;
    // Cmd/Ctrl/Shift-clic y botón del medio siguen abriendo en otra pestaña.
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    if (evento.button !== 0) return;

    evento.preventDefault();
    if (enlace.dataset.contacto === 'abrir') abrir();
    else cerrar();
  });

  // Click fuera del contenido (solo se ve si el modal no cubre todo).
  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) cerrar();
  });

  // Escape: el navegador cerraría de golpe, así que animamos igual.
  dialogo.addEventListener('cancel', (evento) => {
    evento.preventDefault();
    cerrar();
  });

  // Botón de atrás: cierra sin volver a tocar el historial.
  window.addEventListener('popstate', () => {
    empujado = false;
    if (dialogo.open) cerrar({ volver: false });
  });

  const observador = new MutationObserver(() => {
    html.style.overflow = dialogo.open ? 'hidden' : '';
  });
  observador.observe(dialogo, { attributes: true, attributeFilter: ['open'] });
}

/* Formulario */

const form = document.querySelector('[data-form-contacto]');

if (form) {
  const estado = form.querySelector('[data-estado]');
  const correo = form.dataset.correo;

  const decir = (texto, tono = 'ok') => {
    if (!estado) return;
    estado.textContent = texto;
    estado.dataset.tono = tono;
  };

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (!form.reportValidity()) return;
    if (form.elements._gotcha?.value) return; // trampa para bots

    const endpoint = form.getAttribute('action');
    if (!endpoint) {
      decir(`El formulario todavía no está conectado. Escríbenos a ${correo}.`, 'error');
      return;
    }

    const boton = form.querySelector('[type="submit"]');
    boton.disabled = true;
    decir('Enviando…');

    try {
      const respuesta = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!respuesta.ok) {
        /* Formspree contesta en JSON cuando se le pide con Accept, y explica
           qué pasó: el formulario sin confirmar, el dominio no permitido, un
           campo rechazado. Vale más eso que un «algo salió mal». */
        const detalle = await respuesta
          .json()
          .then((d) => d?.errors?.map((e) => e.message).filter(Boolean).join('. '))
          .catch(() => null);
        throw new Error(detalle || `Error ${respuesta.status}`);
      }
      form.reset();
      decir('Listo, nos llegó tu mensaje. Te escribimos pronto.');
    } catch (error) {
      decir(`${error.message}. Si sigue fallando, escríbenos a ${correo}.`, 'error');
    } finally {
      boton.disabled = false;
    }
  });
}
