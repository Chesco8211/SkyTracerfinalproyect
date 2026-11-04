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
     1. ANIMACIÓN DEL LOGO (TAMAÑO PERFECTO, APUNTA A LA DERECHA, FRENA EN LA "S")
     ========================================== */
  const container = document.getElementById("skytracerLogoContainer");
  const canvas = document.getElementById("skytracerCanvas");
  
  if (canvas && container) {
    const ctx = canvas.getContext("2d");
    
    function resizeCanvas() {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeCanvas();

    let progress = 0;
    const flightDuration = 70;
    const pauseDuration = 180; // 3 segundos de pausa en la "S"
    const totalDuration = flightDuration * 2 + pauseDuration;

    function drawJet() {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, width, height);

      progress++;
      if (progress > totalDuration) {
        progress = 0; 
      }

      // Coordenadas ajustadas para entrar desde la izquierda y frenar exactamente en la "S"
      const startX = -30;
      const targetX = 22; // Posición exacta de la primera "S" de SKY
      const endX = width + 40;

      let x = startX;
      let isPaused = false;

      if (progress <= flightDuration) {
        // Fase 1: Entra volando de izquierda a la "S"
        const p = progress / flightDuration;
        x = startX + p * (targetX - startX);
      } else if (progress <= flightDuration + pauseDuration) {
        // Fase 2: SE ESTACIONA exactamente sobre la "S" durante 3 segundos
        x = targetX;
        isPaused = true;
      } else {
        // Fase 3: Sale volando hacia la derecha
        const p = (progress - flightDuration - pauseDuration) / flightDuration;
        x = targetX + p * (endX - targetX);
      }

      const y = height / 2;

      // Dibujar la estela dorada (atrás del jet, apuntando hacia la izquierda)
      if (!isPaused && x > startX + 5) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(x - 12, y);
        const gradient = ctx.createLinearGradient(x, y, startX, y);
        gradient.addColorStop(0, "rgba(198, 166, 107, 0.8)");
        gradient.addColorStop(1, "rgba(198, 166, 107, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Destellos mágicos saliendo por la parte trasera
        for (let i = 0; i < 3; i++) {
          const particleX = x - 12 - (i * 5) - (Math.random() * 3);
          const particleY = y + (Math.random() * 6 - 3);
          ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#dfc185";
          ctx.beginPath();
          ctx.arc(particleX, particleY, Math.random() * 1.5 + 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Dibujar la silueta elegante del Jet Privado en tamaño compacto y apuntando a la DERECHA
      ctx.save();
      ctx.translate(x, y);
      
      ctx.fillStyle = "#dfc185"; 
      ctx.shadowColor = "#c6a66b";
      ctx.shadowBlur = isPaused ? 10 : 4; 

      ctx.beginPath();
      // Silueta escalada a la mitad de tamaño y orientada hacia la derecha
      ctx.moveTo(10, 0);   // Nariz afilada a la derecha
      ctx.lineTo(4, -2);   
      ctx.lineTo(-2, -8);  // Ala superior
      ctx.lineTo(-4, -8);
      ctx.lineTo(-3, -2);
      ctx.lineTo(-8, -3.5); // Estabilizador trasero
      ctx.lineTo(-9, -2);
      ctx.lineTo(-6, 0);   // Cola
      ctx.lineTo(-9, 2);
      ctx.lineTo(-8, 3.5); 
      ctx.lineTo(-3, 2);
      ctx.lineTo(-4, 8);   // Ala inferior
      ctx.lineTo(-2, 8);
      ctx.lineTo(4, 2);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();

      requestAnimationFrame(drawJet);
    }

    drawJet();
  }