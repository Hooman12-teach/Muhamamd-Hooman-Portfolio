// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navbar = document.querySelector('.navbar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.navbar a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.navbar a').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Statistics Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const numElement = entry.target.querySelector('.num');
            const target = parseInt(numElement.getAttribute('data-target'));
            animateCounter(numElement, target);
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// Dynamic Project Rendering
function renderProjects() {
    const projects = window.projectManager ? window.projectManager.getAllProjects() : [];
    const worksGrid = document.getElementById('worksGrid');
    
    if (!worksGrid) return;

    if (projects.length === 0) {
        // Keep default projects if no custom ones
        return;
    }

    const imageTypeMap = {
        'purple': 'work-purple',
        'laptop': 'work-laptop',
        'mobile': 'work-mobile',
        'web': 'work-web',
        'dashboard': 'work-dashboard',
        'landing': 'work-landing'
    };

    const badgeMap = {
        'purple': 'UI Design',
        'laptop': 'UX Design',
        'mobile': 'Mobile UI',
        'web': 'Web Design',
        'dashboard': 'Dashboard',
        'landing': 'Landing Page'
    };

    worksGrid.innerHTML = projects.map((project, index) => {
        const imageClass = imageTypeMap[project.imageType] || 'work-purple';
        const badgeText = badgeMap[project.imageType] || 'Project';
        const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        return `
            <div class="work-item" data-category="${project.category}" data-id="${project.id}">
                <div class="work-image">
                    <div class="work-3d-container" id="work-3d-${project.id}"></div>
                    ${project.imageData ? `
                        <div class="work-placeholder work-custom">
                            <img src="${project.imageData}" alt="${project.title}" class="work-custom-image">
                        </div>
                        <div class="work-badge">Custom Image</div>
                    ` : `
                        <div class="work-placeholder ${imageClass}">
                            <div class="gradient-overlay"></div>
                            ${getImageContent(project.imageType)}
                        </div>
                        <div class="work-badge">${badgeText}</div>
                    `}
                </div>
                <div class="work-overlay">
                    <div class="work-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="work-tags">${tagsHTML}</div>
                        <a href="${project.link}" class="work-link" target="_blank">View Project <i class='bx bx-right-arrow-alt'></i></a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Re-initialize 3D models for new projects
    if (typeof initWork3D === 'function') {
        projects.forEach((project, index) => {
            const category = project.category.includes('ui') ? 'ui' : 
                           project.category.includes('ux') ? 'ux' : 'web';
            setTimeout(() => {
                initWork3D(`work-3d-${project.id}`, category);
            }, index * 100);
        });
    }

    // Re-attach filter functionality (disabled — filters removed)
    // setupWorkFilter();
}

function getImageContent(imageType) {
    const contents = {
        'purple': `
            <div class="placeholder-content">
                <div class="placeholder-element"></div>
                <div class="placeholder-element"></div>
                <div class="placeholder-element"></div>
            </div>
        `,
        'laptop': `
            <div class="laptop-screen">
                <div class="screen-content">
                    <div class="screen-element"></div>
                    <div class="screen-element"></div>
                </div>
            </div>
            <div class="floating-cards">
                <div class="card card-1"></div>
                <div class="card card-2"></div>
                <div class="card card-3"></div>
            </div>
        `,
        'mobile': `
            <div class="phone phone-1">
                <div class="phone-screen">
                    <div class="mobile-element"></div>
                </div>
            </div>
            <div class="phone phone-2">
                <div class="phone-screen">
                    <div class="mobile-element"></div>
                </div>
            </div>
            <div class="phone phone-3">
                <div class="phone-screen">
                    <div class="mobile-element"></div>
                </div>
            </div>
        `,
        'web': `
            <div class="web-preview">
                <div class="browser-bar">
                    <div class="browser-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="web-content">
                    <div class="web-element"></div>
                    <div class="web-element"></div>
                </div>
            </div>
        `,
        'dashboard': `
            <div class="dashboard-grid">
                <div class="dashboard-card"></div>
                <div class="dashboard-card"></div>
                <div class="dashboard-card"></div>
                <div class="dashboard-card"></div>
            </div>
        `,
        'landing': `
            <div class="landing-preview">
                <div class="landing-header"></div>
                <div class="landing-content">
                    <div class="landing-element"></div>
                    <div class="landing-element"></div>
                </div>
            </div>
        `
    };
    return contents[imageType] || contents['purple'];
}

// Work Filter Functionality
function setupWorkFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    filterButtons.forEach(button => {
        // Remove old listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            newButton.classList.add('active');

            const filterValue = newButton.getAttribute('data-filter');

            workItems.forEach((item, index) => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for projectManager to be ready
    setTimeout(() => {
        if (window.projectManager) {
            renderProjects();
        }
    }, 500);
});

// Make renderProjects globally available
window.renderProjects = renderProjects;

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal, .service-card, .work-item, .stat-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    if (type === 'success') {
        toastIcon.className = 'toast-icon bx bx-check-circle';
        toast.style.backgroundColor = 'rgba(1, 238, 254, 0.9)';
    } else {
        toastIcon.className = 'toast-icon bx bx-error-circle';
        toast.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Contact Form Submission (Simple version - Firebase will be added after hosting)
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn?.querySelector('.btn-text');
const btnLoader = submitBtn?.querySelector('.btn-loader');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        // Validate form
        if (!name || !email || !subject || !message) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        if (submitBtn && btnText && btnLoader) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
        }
        
        // Simulate form submission (replace with actual backend/Firebase after hosting)
        setTimeout(() => {
            // Store in localStorage as temporary solution
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(formData);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            // Show success message
            showToast('Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button state
            if (submitBtn && btnText && btnLoader) {
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
            
            console.log('Message saved to localStorage. Will be connected to Firebase after hosting.');
        }, 1000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to top on page load (optional)
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Initialize ScrollReveal if available
if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal().reveal('.home-content', {
        delay: 200,
        distance: '50px',
        origin: 'left'
    });
    
    ScrollReveal().reveal('.home-img', {
        delay: 400,
        distance: '50px',
        origin: 'right'
    });
    
    ScrollReveal().reveal('.about-text', {
        delay: 200,
        distance: '50px',
        origin: 'left'
    });
    
    ScrollReveal().reveal('.about-img', {
        delay: 400,
        distance: '50px',
        origin: 'right'
    });
    
    ScrollReveal().reveal('.service-card', {
        delay: 200,
        distance: '50px',
        origin: 'bottom',
        interval: 200
    });
    
    ScrollReveal().reveal('.work-item', {
        delay: 200,
        distance: '50px',
        origin: 'bottom',
        interval: 200
    });
}

// Add typing animation if Typed.js is available
document.addEventListener('DOMContentLoaded', function () {
    if (typeof Typed !== 'undefined') {
        const typedElement = document.querySelector('.hooman12');
        if (typedElement) {
            new Typed('.hooman12', {
                strings: ['Creative UI Designer', 'Frontend Developer', 'UX Designer', 'Web Designer'],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });
        }
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImg = document.querySelector('.hero-illustration');
    if (heroImg && scrolled < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Particle System for Hero Section
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(1, 238, 254, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Connect nearby particles
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(1, 238, 254, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    animate();
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
});
