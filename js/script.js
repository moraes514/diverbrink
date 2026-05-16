// ===== Dark Mode Toggle =====
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('diverbrink-theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('diverbrink-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            localStorage.setItem('diverbrink-theme', 'dark');
        }
    });
}

// ===== Hamburger Menu =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations with stagger effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add stagger delay for sequential animation
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentGalleryImages = [];
let currentImageIndex = 0;

// Open lightbox when clicking on gallery images
document.querySelectorAll('.gallery-image, .gallery-thumb').forEach((img, index) => {
    img.addEventListener('click', function () {
        const gallery = this.getAttribute('data-gallery');

        // Get all images from the same gallery
        currentGalleryImages = Array.from(document.querySelectorAll(`[data-gallery="${gallery}"]`));
        currentImageIndex = currentGalleryImages.indexOf(this);

        showLightboxImage(currentImageIndex);
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close lightbox
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Navigate gallery
if (lightboxPrev && lightboxNext) {
    lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        showLightboxImage(currentImageIndex);
    });

    lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
        showLightboxImage(currentImageIndex);
    });
}

function showLightboxImage(index) {
    const img = currentGalleryImages[index];
    if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        preloadAdjacentImages();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    if (lightbox && lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' && lightboxPrev) {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight' && lightboxNext) {
            lightboxNext.click();
        }
    }
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (lightbox) {
    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && lightboxNext) {
            // Swipe left - next image
            lightboxNext.click();
        } else if (diff < 0 && lightboxPrev) {
            // Swipe right - previous image
            lightboxPrev.click();
        }
    }
}

// Preload adjacent images for smoother navigation
function preloadAdjacentImages() {
    if (currentGalleryImages.length > 1) {
        const prevIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        const nextIndex = (currentImageIndex + 1) % currentGalleryImages.length;

        const prevImg = new Image();
        prevImg.src = currentGalleryImages[prevIndex].src;

        const nextImg = new Image();
        nextImg.src = currentGalleryImages[nextIndex].src;
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Scroll spy - highlight active navigation item
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add subtle animation to WhatsApp button
const whatsappButton = document.querySelector('.whatsapp-float');
if (whatsappButton) {
    setInterval(() => {
        whatsappButton.style.animation = 'none';
        setTimeout(() => {
            whatsappButton.style.animation = 'pulse 2s ease-in-out';
        }, 10);
    }, 5000);
}

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        // Only add loading state for non-external links
        if (!this.hasAttribute('target')) {
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';

            setTimeout(() => {
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
            }, 1000);
        }
    });
});

// Console message for developers
console.log('%c🎨 DiverBrink - Landing Page', 'color: #10B981; font-size: 20px; font-weight: bold;');
console.log('%cTransformando espaços em experiências inesquecíveis', 'color: #6B7280; font-size: 14px;');
