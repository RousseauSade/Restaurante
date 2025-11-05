// ===== FUNCIONES DE UTILIDAD =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function animateElement(element, keyframes, options) {
    return element.animate(keyframes, {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
        ...options
    }).finished;
}

function triggerVibration(duration) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    } else if ('webkitVibrate' in navigator) {
        navigator.webkitVibrate(duration);
    }
}

// Función removida de speakFeedback para mejorar la experiencia de usuario

// ===== FUNCIONES DE CONFIGURACIÓN =====
function setupAccessibilityTools() {
    const highContrastBtn = document.getElementById('high-contrast');
    if (highContrastBtn) {
        highContrastBtn.addEventListener('click', toggleHighContrast);
    }
}

function initializeSavedPreferences() {
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isActive);
    // speakFeedback removido
}

function setupMenuFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const subcategoryBtns = document.querySelectorAll('.subcategory-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    let currentCategory = 'all';
    let currentRegion = 'all';

    function filterItems() {
        menuItems.forEach(item => {
            const matchesCategory = currentCategory === 'all' || item.dataset.category === currentCategory;
            const matchesRegion = currentRegion === 'all' || item.dataset.region === currentRegion;
            
            if (matchesCategory && matchesRegion) {
                item.style.display = 'block';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            filterItems();

            if (window.innerWidth <= 768) {
                menuFilters.classList.remove('show');
            }

            speakFeedback(`Mostrando ${currentCategory === 'all' ? 'todos los platos' : 'platos ' + currentCategory}`);
        });
    });

    subcategoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            subcategoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentRegion = this.dataset.region;
            filterItems();

            speakFeedback(`Filtrando por región: ${this.textContent.trim()}`);
        });
    });

    filterItems();
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuFilters = document.querySelector('.menu-filters');
    const menuSubcategories = document.querySelector('.menu-subcategories');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuFilters.classList.toggle('show');
            menuSubcategories.classList.toggle('show');
            const isExpanded = menuFilters.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            
            const toggleText = menuToggle.querySelector('span');
            if (toggleText) {
                toggleText.textContent = isExpanded ? 'Ocultar Filtros' : 'Explorar Menú Completo';
            }
            
            speakFeedback(isExpanded ? 'Filtros expandidos' : 'Filtros ocultados');
        });
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                const sectionName = target.getAttribute('aria-label') || 
                                target.getAttribute('aria-labelledby') || 
                                target.querySelector('h1,h2,h3')?.textContent || 
                                'sección';
                
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
                
                speakFeedback(`Navegando a ${sectionName}`);
                
                if (target.getAttribute('tabindex') === null) {
                    target.setAttribute('tabindex', '-1');
                }
                target.focus();
            }
        });
    });
}

function setupHoverEffects() {
    document.querySelectorAll('.menu-item').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-5px)';
            element.style.borderColor = 'var(--accent)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.borderColor = 'rgba(200, 164, 86, 0.1)';
        });
        
        element.addEventListener('focus', () => {
            element.style.transform = 'translateY(-5px)';
            element.style.borderColor = 'var(--accent)';
        });
        
        element.addEventListener('blur', () => {
            element.style.transform = '';
            element.style.borderColor = 'rgba(200, 164, 86, 0.1)';
        });
    });

    document.querySelectorAll('.btn, .filter-btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

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

function setupAnimations() {
    const menuSection = document.querySelector('.section-menu');
    if (menuSection) {
        document.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.15;
            requestAnimationFrame(() => {
                menuSection.style.backgroundPositionY = `${rate}px`;
            });
        }, 10));

        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializar preferencias y accesibilidad
    initializeSavedPreferences();
    setupAccessibilityTools();
    
    // 2. Configurar navegación y efectos
    setupSmoothScrolling();
    setupHoverEffects();
    
    // 3. Configurar menú y filtros
    setupMenuFilters();
    setupMobileMenu();
    
    // 4. Configurar formularios y contacto
    setupReservationForm();
    setupContactButtons();
    
    // 5. Configurar animaciones
    setupAnimations();
});

    // ===== FUNCIONALIDADES PRINCIPALES =====
// ===== RESPONSIVE HANDLERS =====
function setupResponsiveHandlers() {
    const menuFilters = document.querySelector('.menu-filters');
    const menuSubcategories = document.querySelector('.menu-subcategories');
    
    // Manejar cambios de tamaño de ventana
    const handleResize = debounce(() => {
        if (window.innerWidth > 768) {
            menuFilters.classList.remove('show');
            menuSubcategories.classList.remove('show');
            menuFilters.style.display = 'flex';
            menuSubcategories.style.display = 'flex';
        } else {
            menuFilters.style.display = menuFilters.classList.contains('show') ? 'flex' : 'none';
            menuSubcategories.style.display = menuSubcategories.classList.contains('show') ? 'flex' : 'none';
        }
    }, 250);

    window.addEventListener('resize', handleResize);
    handleResize();
}

// ===== INICIALIZACIÓN =====
function initializeMenu() {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        // Añadir efecto parallax sutil al fondo
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.15;
            requestAnimationFrame(() => {
                menuSection.style.backgroundPositionY = `${rate}px`;
            });
        }, 10));

        // Inicializar animaciones de items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializar preferencias guardadas
    initializeSavedPreferences();

    // 2. Configurar componentes principales
    setupAccessibilityTools();
    setupMenuFilters();
    setupReservationForm();
    setupContactButtons();
    
    // 3. Configurar navegación y efectos
    setupSmoothScrolling();
    setupHoverEffects();
    
    // 4. Configurar funcionalidades responsive
    setupResponsiveHandlers();
    
    // 5. Inicializar efectos del menú
    initializeMenu();
});

// ===== ACCESIBILIDAD =====
function setupAccessibilityTools() {
  // Modo alto contraste
  const highContrastBtn = document.getElementById('high-contrast');
  if (highContrastBtn) {
    highContrastBtn.addEventListener('click', toggleHighContrast);
  }


}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  const isActive = document.body.classList.contains('high-contrast');
  localStorage.setItem('highContrast', isActive);
}



// ===== MENÚ INTERACTIVO =====
function setupMenuFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const subcategoryBtns = document.querySelectorAll('.subcategory-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuFilters = document.querySelector('.menu-filters');
    const menuSubcategories = document.querySelector('.menu-subcategories');

    let currentCategory = 'all';
    let currentRegion = 'all';

    function filterItems() {
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category') || 'all';
            const itemRegion = item.getAttribute('data-region') || 'all';
            const categoryMatch = (currentCategory === 'all' || itemCategory === currentCategory);
            const regionMatch = (currentRegion === 'all' || itemRegion === currentRegion);
            if (categoryMatch && regionMatch) {
                item.style.display = '';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
            }
        });
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuFilters.classList.toggle('show');
            menuSubcategories.classList.toggle('show');
            const isExpanded = menuFilters.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            const toggleText = menuToggle.querySelector('span');
            if (toggleText) {
                toggleText.textContent = isExpanded ? 'Ocultar Filtros' : 'Explorar Menú Completo';
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-category');
            filterItems();
            if (window.innerWidth <= 768) {
                menuFilters.classList.remove('show');
            }
        });
    });

    subcategoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            subcategoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentRegion = this.getAttribute('data-region');
            filterItems();
        });
    });

    filterItems();
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
    // speakFeedback removido
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
  
    // speakFeedback removido
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
    // Efectos para items del menú
    document.querySelectorAll('.menu-item').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-5px)';
            element.style.borderColor = 'var(--accent)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.borderColor = 'rgba(200, 164, 86, 0.1)';
        });
        
        element.addEventListener('focus', () => {
            element.style.transform = 'translateY(-5px)';
            element.style.borderColor = 'var(--accent)';
        });
        
        element.addEventListener('blur', () => {
            element.style.transform = '';
            element.style.borderColor = 'rgba(200, 164, 86, 0.1)';
        });
    });

    // Efectos para botones
    document.querySelectorAll('.btn, .filter-btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    // Efectos para subcategorías
    document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const line = btn.querySelector('.line');
            if (line) line.style.width = '80%';
        });
        
        btn.addEventListener('mouseleave', () => {
            const line = btn.querySelector('.line');
            if (line && !btn.classList.contains('active')) {
                line.style.width = '0';
            }
        });
    });
}

// ===== FUNCIONES DE UTILIDAD =====
function animateElement(element, keyframes, options) {
    return element.animate(keyframes, {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
        ...options
    }).finished;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== FUNCIONES AUXILIARES =====
function initializeSavedPreferences() {
  if (localStorage.getItem('highContrast') === 'true') {
    document.body.classList.add('high-contrast');
  }
}

// speakFeedback removido

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
});

document.getElementById('email-btn')?.addEventListener('click', () => {
    window.open('mailto:info@blindspot.com');
});

document.getElementById('whatsapp-btn')?.addEventListener('click', () => {
    window.open('https://wa.me/573115243775?text=Hola%20BlindSpot%20quisiera%20información');
});