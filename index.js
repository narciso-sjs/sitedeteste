const carousel = document.querySelector('.rotativus-interior');
const slides = document.querySelectorAll('.scheda');
const dots = document.querySelectorAll('.orb');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentIndex = 0;
let animationID = 0;
let autoplayInterval;

// Função para iniciar o autoplay
function startAutoplay() {
    stopAutoplay(); // Para evitar múltiplos intervalos
    autoplayInterval = setInterval(() => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }, 7000); // 5 segundos
}

// Função para parar o autoplay
function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

// Função para atualizar o carrossel
function updateCarousel() {
    currentTranslate = currentIndex * -100;
    prevTranslate = currentTranslate;
    setSlidePosition();
    updateDots();
}

// Touch events
carousel.addEventListener('touchstart', (e) => {
    stopAutoplay();
    touchStart(e);
});
carousel.addEventListener('touchmove', touchMove);
carousel.addEventListener('touchend', () => {
    touchEnd();
    startAutoplay();
});

// Mouse events
carousel.addEventListener('mousedown', (e) => {
    e.preventDefault();
    stopAutoplay();
    touchStart(e);
});
carousel.addEventListener('mousemove', touchMove);
carousel.addEventListener('mouseup', () => {
    touchEnd();
    startAutoplay();
});
carousel.addEventListener('mouseleave', () => {
    touchEnd();
    startAutoplay();
});

function touchStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    carousel.style.cursor = 'grabbing';
}

function touchMove(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const moveBy = currentTranslate - prevTranslate;
    const threshold = window.innerWidth * 0.2; // 20% da largura da tela

    if (Math.abs(moveBy) > threshold) {
        if (moveBy > 0 && currentIndex > 0) {
            currentIndex--;
        } else if (moveBy < 0 && currentIndex < slides.length - 1) {
            currentIndex++;
        }
    }

    updateCarousel();
    carousel.style.cursor = 'grab';
}

function animation() {
    setSlidePosition();
    if (isDragging) {
        requestAnimationFrame(animation);
    }
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function setSlidePosition() {
    // Limita o arrasto para não ultrapassar os limites
    const minTranslate = -(slides.length - 1) * 100;
    const maxTranslate = 0;
    
    currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
    carousel.style.transform = `translateX(${currentTranslate}%)`;
}

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Navegação pelos pontos
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopAutoplay();
        currentIndex = index;
        updateCarousel();
        startAutoplay();
    });
});

// Prevenir menu de contexto
window.oncontextmenu = function(event) {
    if (event.target === carousel) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}

// Iniciar o autoplay quando a página carregar
startAutoplay();

// Reiniciar autoplay quando a aba voltar a ficar visível
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        startAutoplay();
    } else {
        stopAutoplay();
    }
});




let sections = document.querySelectorAll('#product-cards, #section_2, #section_5');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });
};

ScrollReveal({
    // reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('#product-cards', { origin: 'bottom' });
ScrollReveal().reveal('#section_2', { origin: 'right' });
ScrollReveal().reveal('#section_5', { origin: 'left' });
