// ===== FUNCIONALIDADES PRINCIPALES =====
document.addEventListener('DOMContentLoaded', function() {
  // 1. Inicializar preferencias guardadas
  initializeSavedPreferences();

  // 2. Configurar botones de accesibilidad
  setupAccessibilityTools();

  // 3. Configurar menú interactivo
  setupMenuFilters();

  // 4. Configurar formulario de reservas
  setupReservationForm();

  // 5. Configurar botones de contacto
  setupContactButtons();

  // 6. Smooth scrolling
  setupSmoothScrolling();

  // 7. Efectos de interacción
  setupHoverEffects();
});

// ===== ACCESIBILIDAD =====
function setupAccessibilityTools() {
  // Modo alto contraste
  const highContrastBtn = document.getElementById('high-contrast');
  if (highContrastBtn) {
    highContrastBtn.addEventListener('click', toggleHighContrast);
  }

  // Lectura en voz alta
  const readAloudBtn = document.getElementById('read-aloud');
  if (readAloudBtn) {
    readAloudBtn.addEventListener('click', toggleReadAloud);
  }
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  const isActive = document.body.classList.contains('high-contrast');
  localStorage.setItem('highContrast', isActive);
  speakFeedback(isActive ? "Modo alto contraste activado" : "Modo alto contraste desactivado");
}

let speechSynthesis = window.speechSynthesis;
let isReading = false;

function toggleReadAloud() {
  if (isReading) {
    speechSynthesis.cancel();
    isReading = false;
    speakFeedback("Lectura detenida");
    return;
  }

  const mainContent = document.querySelector('main').innerText;
  const speech = new SpeechSynthesisUtterance(mainContent);
  speech.lang = 'es-ES';
  speech.rate = 0.9;
  
  speech.onend = function() {
    isReading = false;
    speakFeedback("Lectura completada");
  };
  
  speechSynthesis.speak(speech);
  isReading = true;
  speakFeedback("Comenzando lectura de la página");
}

// ===== MENÚ INTERACTIVO =====
function setupMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filtrar items
      const category = this.dataset.category;
      menuItems.forEach(item => {
        item.style.display = (category === 'all' || item.dataset.category === category) 
          ? 'block' 
          : 'none';
      });

      // Feedback accesible
      speakFeedback(`Mostrando ${category === 'all' ? 'todos los platos' : 'platos ' + category}`);
    });
  });
}

// ===== FORMULARIO DE RESERVAS =====
function setupReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      showSuccessMessage();
      form.reset();
    }
  });
}

function validateForm() {
  let isValid = true;
  const fields = [
    { id: 'name', validation: value => value.trim().length > 0, message: 'Por favor ingrese su nombre' },
    { id: 'email', validation: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Ingrese un email válido' },
    { id: 'phone', validation: value => /^\d{7,}$/.test(value), message: 'Teléfono debe tener al menos 7 dígitos' },
    { id: 'date', validation: value => !!value, message: 'Seleccione una fecha' },
    { id: 'guests', validation: value => !!value, message: 'Seleccione número de personas' }
  ];

  fields.forEach(({ id, validation, message }) => {
    const field = document.getElementById(id);
    const value = field.value;
    const formGroup = field.closest('.form-group');

    // Limpiar errores previos
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Validar campo
    if (!validation(value)) {
      showError(field, message);
      isValid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  return isValid;
}

function showError(field, message) {
  const formGroup = field.closest('.form-group');
  const errorElement = document.createElement('p');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.style.color = 'var(--primary)';
  formGroup.appendChild(errorElement);
  field.style.borderColor = 'var(--primary)';
  field.focus();
  speakFeedback(message);
}

function showSuccessMessage() {
  const successHtml = `
    <div class="success-modal">
      <div class="success-content">
        <h3>¡Reserva confirmada!</h3>
        <p>Recibirás los detalles en tu correo electrónico.</p>
        <button id="close-success">Aceptar</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', successHtml);
  
  document.getElementById('close-success').addEventListener('click', function() {
    document.querySelector('.success-modal').remove();
    speakFeedback("Mensaje de confirmación cerrado");
  });
  
  speakFeedback("Reserva confirmada con éxito. Recibirás los detalles por correo electrónico.");
}

// ===== BOTONES DE CONTACTO =====
function setupContactButtons() {
  // Teléfono
  const phoneBtn = document.getElementById('phone-btn');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      window.open('tel:+573115243775');
      speakFeedback("Llamando al restaurante");
    });
  }

  // Email
  const emailBtn = document.getElementById('email-btn');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      window.open('mailto:info@blindspot.com');
      speakFeedback("Abriendo cliente de correo");
    });
  }

  // WhatsApp
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      window.open('https://wa.me/573115243775?text=Hola%20BlindSpot%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n');
      speakFeedback("Abriendo WhatsApp");
    });
  }
}

// ===== SCROLL SUAVE =====
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        speakFeedback(`Navegando a ${target.getAttribute('aria-labelledby') || 'sección'}`);
      }
    });
  });
}

// ===== EFECTOS DE INTERACCIÓN =====
function setupHoverEffects() {
  document.querySelectorAll('.menu-item, .btn').forEach(element => {
    element.addEventListener('mouseenter', () => element.style.transform = 'scale(1.02)');
    element.addEventListener('mouseleave', () => element.style.transform = '');
    element.addEventListener('focus', () => element.style.transform = 'scale(1.02)');
    element.addEventListener('blur', () => element.style.transform = '');
  });
}

// ===== FUNCIONES AUXILIARES =====
function initializeSavedPreferences() {
  if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
  }
}

function speakFeedback(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}

// Polyfill para vibrate en algunos navegadores
function triggerVibration(duration) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  } else if ('webkitVibrate' in navigator) {
    navigator.webkitVibrate(duration);
  }
}

// En tu scripts.js
document.getElementById('call-btn')?.addEventListener('click', () => {
    window.open('tel:+573115243775'); // Reemplaza con tu número real
    speakFeedback("Llamando al restaurante");
});

document.getElementById('email-btn')?.addEventListener('click', () => {
    window.open('mailto:info@blindspot.com');
    speakFeedback("Abriendo cliente de correo");
});

document.getElementById('whatsapp-btn')?.addEventListener('click', () => {
    window.open('https://wa.me/573115243775?text=Hola%20BlindSpot%20quisiera%20información');
    speakFeedback("Abriendo WhatsApp");
});