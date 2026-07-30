// 1000gracias — interacciones de la home

(function () {
  "use strict";

  // ---- 1. Hover en proyectos cambia la imagen del escenario ----
  var stageImg = document.getElementById("stage-img");
  var defaultSrc = stageImg ? stageImg.getAttribute("src") : "";
  var projects = document.querySelectorAll(".project");

  projects.forEach(function (p) {
    var img = p.getAttribute("data-img");

    // precarga para que el cambio sea instantáneo
    if (img) { var pre = new Image(); pre.src = img; }

    // miniatura para la vista móvil (usa la misma imagen)
    if (img) { p.style.setProperty("--thumb", "url('" + img + "')"); }

    function show() { if (img && stageImg) stageImg.setAttribute("src", img); }
    function reset() { if (stageImg) stageImg.setAttribute("src", defaultSrc); }

    p.addEventListener("mouseenter", show);
    p.addEventListener("mouseleave", reset);
    p.addEventListener("focus", show);
    p.addEventListener("blur", reset);
  });

  // ---- 2. Modal de contacto ----
  var contact = document.getElementById("contact");
  var lastFocused = null;

  function openContact() {
    lastFocused = document.activeElement;
    contact.classList.add("is-open");
    contact.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var first = contact.querySelector("input, select, textarea, button");
    if (first) first.focus();
  }

  function closeContact() {
    contact.classList.remove("is-open");
    contact.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-contact]").forEach(function (b) {
    b.addEventListener("click", openContact);
  });
  document.querySelectorAll("[data-close-contact]").forEach(function (b) {
    b.addEventListener("click", closeContact);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && contact.classList.contains("is-open")) closeContact();
  });

  // ---- 3. Envío del formulario (placeholder) ----
  var form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // TODO: conectar a un servicio de correo/formulario (Formspree, Basin, backend propio)
      alert("¡Gracias! Te responderemos con una propuesta.");
      form.reset();
      closeContact();
    });
  }
})();
