/*
  Las imágenes de los proyectos — que en la práctica son videos.

  En escritorio, pasar por un nombre cambia lo que se ve en el escenario. En
  móvil no hay hover, así que tocar el nombre hace aparecer el proyecto
  flotando sobre el ítem; se queda hasta que toques otro o fuera de la lista.

  Todo está en el DOM desde el principio, así que el cambio es instantáneo:
  solo se mueve una clase. Los videos van con `preload="none"` y empiezan a
  cargar recién al pedirlos, para no descargar cuatro archivos que nadie miró.
*/

const escenario = document.querySelector('[data-escenario]');
const lista = document.querySelector('[data-lista-proyectos]');
const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');

/* El marco del escenario —imagen y capas de tratamiento— aparece cuando la
   imagen por defecto termina de cargar; hasta entonces se ve el azul limpio.
   La imagen puede estar lista antes de que corra este script, así que hay que
   preguntarlo además de escuchar el evento. En el error también se marca: más
   vale mostrar el hueco que dejar el escenario vacío para siempre. */
const marco = escenario?.querySelector('.escenario__marco');
const inicio = escenario?.querySelector('[data-imagen="inicio"]');
if (marco && inicio) {
  const marcar = () => marco.classList.add('is-cargada');
  if (inicio.complete && inicio.naturalWidth > 0) marcar();
  else {
    inicio.addEventListener('load', marcar, { once: true });
    inicio.addEventListener('error', marcar, { once: true });
  }
}

/* Con movimiento reducido el video no se reproduce: queda el póster, que es
   la imagen del proyecto. */
const reproducir = (el) => {
  if (!el || el.tagName !== 'VIDEO' || quieto.matches) return;
  // Puede rechazarse (política de reproducción del navegador); no es grave,
  // se queda el póster.
  el.play().catch(() => {});
};

const detener = (el) => {
  if (!el || el.tagName !== 'VIDEO') return;
  el.pause();
  el.currentTime = 0;
};

/* Móvil: proyecto flotante al tocar */

if (lista) {
  const enMovil = window.matchMedia('(max-width: 1024px)');
  const items = [...lista.querySelectorAll('[data-item]')];
  const activar = (item) => {
    for (const otro of items) {
      const encendido = otro === item;
      otro.classList.toggle('is-activa', encendido);
      const video = otro.querySelector('.item__flotante video');
      if (encendido) reproducir(video);
      else detener(video);
    }
  };

  lista.addEventListener('click', (evento) => {
    if (!enMovil.matches) return;
    const accion = evento.target.closest('[data-proyecto]');
    if (!accion) return;
    const item = accion.closest('[data-item]');
    // En un enlace, el primer toque muestra el proyecto y el segundo navega.
    if (accion.tagName === 'A' && !item.classList.contains('is-activa')) {
      evento.preventDefault();
    }
    activar(item);
  });

  document.addEventListener('click', (evento) => {
    if (!enMovil.matches) return;
    if (evento.target.closest('[data-lista-proyectos]')) return;
    activar(null);
  });

  enMovil.addEventListener('change', () => activar(null));
}

/* Escritorio: cambio en el escenario */

if (escenario && lista) {
  const medios = new Map();
  for (const el of escenario.querySelectorAll('[data-imagen]')) {
    medios.set(el.dataset.imagen, el);
  }

  let activa = 'inicio';

  const mostrar = (clave) => {
    const destino = medios.has(clave) ? clave : 'inicio';
    if (destino === activa) return;
    const sale = medios.get(activa);
    const entra = medios.get(destino);
    sale?.classList.remove('is-activa');
    entra?.classList.add('is-activa');
    detener(sale);
    reproducir(entra);
    activa = destino;
  };

  const desde = (evento) => evento.target.closest('[data-proyecto]')?.dataset.proyecto;

  if (window.matchMedia('(hover: hover)').matches) {
    lista.addEventListener('pointerover', (evento) => {
      const slug = desde(evento);
      if (slug) mostrar(slug);
    });
    lista.addEventListener('pointerleave', () => mostrar('inicio'));
  }

  lista.addEventListener('focusin', (evento) => {
    const slug = desde(evento);
    if (slug) mostrar(slug);
  });

  lista.addEventListener('focusout', (evento) => {
    if (!lista.contains(evento.relatedTarget)) mostrar('inicio');
  });
}
