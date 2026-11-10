document.addEventListener("DOMContentLoaded", function () {
  const bookingForm = document.querySelector("#booking-form");
  const tripType = document.querySelector("#trip-type");
  const departureDate = document.querySelector("#flight-date");
  const returnDate = document.querySelector("#return-date");
  const returnDateError = document.querySelector("#return-date-error");
  const bookingMessage = document.querySelector("#booking-message");
  const checkboxTerminos = document.getElementById("acepto-terminos");

  if (!bookingForm || !tripType || !departureDate || !returnDate || !returnDateError) {
    return;
  }

  bookingForm.noValidate = true;

  function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function updateDates() {
    const today = getToday();
    const isRoundTrip = tripType.value === "round-trip";

    // Asegurar fecha mínima en la salida
    departureDate.min = today;

    if (departureDate.value && departureDate.value < today) {
      departureDate.value = "";
    }

    // El campo de regreso se habilita si es Round Trip y ya hay fecha de salida válida
    const canChooseRoundTripDates =
      isRoundTrip &&
      departureDate.value !== "" &&
      departureDate.value >= today;

    returnDate.disabled = !canChooseRoundTripDates;
    returnDate.style.opacity = canChooseRoundTripDates ? "1" : "0.6";

    if (canChooseRoundTripDates) {
      returnDate.min = departureDate.value;
    } else {
      returnDate.min = today;
      returnDate.value = "";
    }

    if (returnDate.value && departureDate.value && returnDate.value < departureDate.value) {
      returnDate.value = "";
    }

    if (!isRoundTrip) {
      returnDate.value = "";
      returnDateError.classList.remove("show");
    }

    if (returnDate.value !== "") {
      returnDateError.classList.remove("show");
    }
  }

  updateDates();

  tripType.addEventListener("change", updateDates);
  departureDate.addEventListener("change", updateDates);
  departureDate.addEventListener("input", updateDates);
  returnDate.addEventListener("change", updateDates);
  returnDate.addEventListener("input", updateDates);

  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    updateDates();

    const isRoundTrip = tripType.value === "round-trip";
    const today = getToday();

    // 1. Validar Términos y Condiciones primero
    if (checkboxTerminos && !checkboxTerminos.checked) {
      alert("Debes aceptar los Términos y Condiciones para enviar tu solicitud.");
      checkboxTerminos.focus();
      return;
    }

    // 2. Validar fecha de salida
    if (!departureDate.value || departureDate.value < today) {
      departureDate.focus();
      return;
    }

    // 3. Validar fecha de regreso si es Round Trip
    if (isRoundTrip && !returnDate.value) {
      returnDateError.classList.add("show");
      returnDate.focus();
      return;
    }

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    returnDateError.classList.remove("show");

    if (bookingMessage) {
      bookingMessage.style.color = "#c6a66b";
      bookingMessage.style.fontWeight = "600";
      bookingMessage.textContent =
        "Thank you! Your flight request has been successfully registered. An advisor will contact you shortly.";
    }
  });
});
/* ==========================================
   SKYTRACER — JET DORADO CON MAYOR DEFINICIÓN
   ========================================== */
(() => {
  const container = document.getElementById("skytracerLogoContainer");
  const canvas = document.getElementById("skytracerCanvas");

  if (!container || !canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Ajustes visuales
  const JET_SCALE = 1.15;
  const STOP_X = 22;
    const FLIGHT_IN = 1200;
  const PAUSE = 3000;
  const FLIGHT_OUT = 1200;

  const TRAIL_HOLD = 700;
  const TRAIL_FADE = 2000;

  const CYCLE =
    FLIGHT_IN +
    PAUSE +
    FLIGHT_OUT +
    TRAIL_HOLD +
    TRAIL_FADE;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let width = 0;
  let height = 0;
  let startedAt = null;
  let frameId = null;

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    width = rect.width;
    height = rect.height;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (reducedMotion.matches) {
      render(STOP_X, true, 0);
    }
  }

  function drawTrail(x, y, opacity) {
    const left = 2;
    const right = width - 2;

    // Parte trasera de los motores.
    const exhaustX = x - 11.4 * JET_SCALE;
    const end = Math.min(right, exhaustX);

    if (end <= left || opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.lineCap = "round";

    const gold = ctx.createLinearGradient(
      left, 0,
      end, 0
    );

    gold.addColorStop(0, "rgba(198,166,107,0)");
    gold.addColorStop(0.25, "rgba(198,166,107,0.25)");
    gold.addColorStop(0.7, "rgba(198,166,107,0.65)");
    gold.addColorStop(1, "rgba(223,193,133,0.85)");

    ctx.strokeStyle = gold;
    ctx.lineWidth = 1;
    ctx.shadowColor = "rgba(198,166,107,0.2)";
    ctx.shadowBlur = 1;

    [-1, 1].forEach((side) => {
      const exhaustY = y + side * 3.1 * JET_SCALE;

      ctx.beginPath();
      ctx.moveTo(left, exhaustY);
      ctx.lineTo(end, exhaustY);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawAircraft(x, y, paused) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(JET_SCALE, JET_SCALE);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const metal = ctx.createLinearGradient(-8, -9, 6, 9);
    metal.addColorStop(0, "#9b742e");
    metal.addColorStop(0.28, "#e8cf8d");
    metal.addColorStop(0.48, "#fff0bc");
    metal.addColorStop(0.7, "#c49a48");
    metal.addColorStop(1, "#8b6428");

    ctx.fillStyle = metal;
    ctx.strokeStyle = "#977139";
    ctx.lineWidth = 0.45;

    // Sombra discreta, sin ocultar los bordes.
    ctx.shadowColor = "rgba(155,116,46,0.25)";
    ctx.shadowBlur = paused ? 2 : 1;

    // Alas principales en flecha.
    ctx.beginPath();
    ctx.moveTo(4, -1.2);
    ctx.lineTo(-5.6, -10.2);
    ctx.quadraticCurveTo(-6, -10.7, -6.9, -10.5);
    ctx.lineTo(-8.1, -10.2);
    ctx.lineTo(-4.2, -1.1);
    ctx.lineTo(-4.2, 1.1);
    ctx.lineTo(-8.1, 10.2);
    ctx.lineTo(-6.9, 10.5);
    ctx.quadraticCurveTo(-6, 10.7, -5.6, 10.2);
    ctx.lineTo(4, 1.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Estabilizadores de la cola.
    ctx.beginPath();
    ctx.moveTo(-8.5, -0.8);
    ctx.lineTo(-13.1, -5.2);
    ctx.lineTo(-15.2, -5.2);
    ctx.lineTo(-12.9, 0);
    ctx.lineTo(-15.2, 5.2);
    ctx.lineTo(-13.1, 5.2);
    ctx.lineTo(-8.5, 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Motores traseros.
    [-1, 1].forEach((side) => {
      ctx.beginPath();
      ctx.ellipse(
        -8.2, side * 3.1,
        3.2, 1.1,
        0, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
    });

    // Fuselaje con nariz curva.
    ctx.beginPath();
    ctx.moveTo(14.2, 0);
    ctx.bezierCurveTo(12.1, -2.1, 8, -2.3, 3, -1.9);
    ctx.lineTo(-10.6, -1.2);
    ctx.quadraticCurveTo(-13.1, -0.8, -14, 0);
    ctx.quadraticCurveTo(-13.1, 0.8, -10.6, 1.2);
    ctx.lineTo(3, 1.9);
    ctx.bezierCurveTo(8, 2.3, 12.1, 2.1, 14.2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Cabina oscura.
    ctx.fillStyle = "#26323b";
    ctx.beginPath();
    ctx.moveTo(9.6, -1.25);
    ctx.quadraticCurveTo(11.2, -0.95, 11.9, 0);
    ctx.quadraticCurveTo(11.2, 0.95, 9.6, 1.25);
    ctx.lineTo(8.5, 0.85);
    ctx.quadraticCurveTo(9.2, 0, 8.5, -0.85);
    ctx.closePath();
    ctx.fill();

    // Reflejo central del fuselaje.
    ctx.strokeStyle = "rgba(255,248,222,0.8)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-10, -0.4);
    ctx.quadraticCurveTo(0, -1, 7.3, -0.5);
    ctx.stroke();

    ctx.restore();
  }

  function render(x, paused, trailOpacity) {
    ctx.clearRect(0, 0, width, height);

    const y = height / 2;

    if (trailOpacity > 0) {
      drawTrail(x, y, trailOpacity);
    }

    drawAircraft(x, y, paused);
  }

  function animate(timestamp) {
    if (startedAt === null) startedAt = timestamp;

    const flightTime = FLIGHT_IN + FLIGHT_OUT;
    const cycleTime = flightTime + TRAIL_HOLD + TRAIL_FADE;

    const elapsed = (timestamp - startedAt) % cycleTime;

    const startX = -24;
    const endX = width + 24;

    let x;
    let trailOpacity = 1;

    if (elapsed < flightTime) {
      // Una sola pasada a velocidad constante.
      const progress = elapsed / flightTime;

      x = startX + (endX - startX) * progress;
    } else {
      // El avion ya salio; su estela permanece.
      x = endX;

      const fadeElapsed =
        elapsed - flightTime - TRAIL_HOLD;

      if (fadeElapsed > 0) {
        const progress = Math.min(
          1,
          fadeElapsed / TRAIL_FADE
        );

        const smoothFade =
          progress * progress * (3 - 2 * progress);

        trailOpacity = 1 - smoothFade;
      }
    }

    render(x, false, trailOpacity);
    frameId = requestAnimationFrame(animate);
  }

  function restartAnimation() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    startedAt = null;

    if (reducedMotion.matches) {
      render(STOP_X, true, 0);
      return;
    }

    frameId = requestAnimationFrame(animate);
  }

  resizeCanvas();

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(container);

  window.addEventListener("resize", resizeCanvas);
  container.addEventListener("click", restartAnimation);
  reducedMotion.addEventListener("change", restartAnimation);

  restartAnimation();
})();