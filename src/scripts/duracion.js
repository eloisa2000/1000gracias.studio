/*
  Lee una duración de una variable CSS y la devuelve en milisegundos.

  No alcanza con parseFloat: en tokens.css dice `420ms`, pero el build
  minifica el CSS y lo deja en `.42s`. parseFloat leía 0.42 y los scripts lo
  tomaban por milisegundos, así que en el sitio publicado los cierres se
  cortaban y las animaciones hechas desde JavaScript duraban nada.
*/
export const duracionCss = (nombre, el = document.documentElement) => {
  const valor = getComputedStyle(el).getPropertyValue(nombre).trim();
  const numero = parseFloat(valor);
  if (!Number.isFinite(numero)) return 0;
  return valor.endsWith('ms') ? numero : valor.endsWith('s') ? numero * 1000 : numero;
};
