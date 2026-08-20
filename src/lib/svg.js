/*
  Los dibujos de la portada van dentro del HTML, no como <img src>.

  Cada uno era una petición aparte, y llegaban después del primer pintado: la
  animación de entrada ya se había gastado sobre el hueco y el dibujo aparecía
  de golpe cuando por fin bajaba. Entre los cuatro son unos 8 KB, así que
  meterlos en el documento sale más barato que pedirlos.

  Se les quitan los `id`: vienen del Figma, no los usa nadie y al repetir el
  mismo dibujo —la carita está tres veces— quedaban duplicados.
*/
export const enLinea = (svg) => svg.replace(/\s+id="[^"]*"/g, '');
