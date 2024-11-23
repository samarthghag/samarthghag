// Utility Functions
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

// DOM Elements
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const typingText = document.querySelector('.typing-text');
const cursor = document.querySelector('.typing-cursor');

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
});

// Typing Animation
const words = ['Web Development', 'Java Development', 'UI/UX Design', 'Problem Solving'];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    if (!typingText) return; // Guard clause

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Cursor blinking
    if (cursor) {
        cursor.style.opacity = '1';
        setTimeout(() => {
            if (cursor) cursor.style.opacity = '0';
        }, 400);
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before starting new word
    }

    setTimeout(type, typeSpeed);
}

// Start typing animation when document is loaded
document.addEventListener('DOMContentLoaded', type);

// Mobile Menu
let scrollPosition = 0;

function toggleMenu(show) {
    if (!mobileMenu) return;

    if (show) {
        // Store current scroll position and prevent body scroll
        scrollPosition = window.pageYOffset;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('menu-open');
        
        // Show menu with animation
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
            mobileMenu.classList.add('active');
            
            // Animate nav links
            const navLinks = mobileMenu.querySelectorAll('.nav-link');
            navLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.transform = 'translateY(0)';
                    link.style.opacity = '1';
                }, index * 100);
            });
        }, 50);
    } else {
        // Hide menu with animation
        mobileMenu.classList.remove('active');
        const navLinks = mobileMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.transform = 'translateY(20px)';
            link.style.opacity = '0';
        });

        // Restore body scroll after animation
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('menu-open');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
        }, 300);
    }
}

// Event Listeners for Mobile Menu
if (menuBtn && mobileMenu && closeMenuBtn) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(true);
    });
    
    closeMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(false);
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(false);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden') && 
            !mobileMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            toggleMenu(false);
        }
    });
}

// Handle resize events
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        toggleMenu(false);
    }
});

// Navigation Highlighting
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 100;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });
});

// Scroll Event Listeners
window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    updateActiveNavLink();
    
    // Initialize fade animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    fadeElements.forEach(element => fadeObserver.observe(element));
});

// Featured Projects Data
const featuredProjects = [
    {
        title: 'Clickbait Creator',
        description: 'Flask-based web app that generates engaging clickbait content using Google AI API.',
        technologies: ['Python', 'Flask', 'Google AI API', 'JavaScript'],
        image: 'assets/clickbait.png',
        github: 'https://github.com/Sama1504/Clickbait-Creator',
        demo: '#'
    },
    {
        title: 'Financial Task Scheduler',
        description: 'A Python-based scheduler implementing OS concepts for managing financial tasks.',
        technologies: ['Python', 'Streamlit', 'Pandas', 'Matplotlib'],
        image: 'assets/financial-scheduler.jpg',
        github: 'https://github.com/Sama1504/Financial-Task-Scheduler',
        demo: 'https://financial-task-scheduler-w8r7eecgrgru2rl49g4mcb.streamlit.app/'
    },
    {
        title: 'Eco-Tech Start Website',
        description: 'Modern website showcasing eco-friendly technology solutions with responsive design.',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        image: 'assets/eco-tech.jpg',
        github: 'https://github.com/Sama1504/Eco-Tech-Start-Website',
        demo: '#https://eco-tech-start-website.vercel.app/'
    }
];

// Update project population code
const projectsContainer = document.querySelector('#projects .grid');
featuredProjects.forEach(project => {
    projectsContainer.innerHTML += `
        <div class="project-card" data-aos="fade-up">
            <div class="relative overflow-hidden rounded-t-lg">
                <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2 gradient-text">${project.title}</h3>
                <p class="text-gray-400 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${project.technologies.map(tech => `
                        <span class="skill-tag text-sm">${tech}</span>
                    `).join('')}
                </div>
                <div class="flex space-x-4">
                    <a href="${project.github}" class="social-link" target="_blank">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="${project.demo}" class="social-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
});

// Achievement Data
const achievements = [
    {
        title: 'Java Development Intern',
        description: 'CodeClause Pvt Ltd, Pune (May 2024 - June 2024)',
        icon: '💼',
        date: '2024'
    },
    {
        title: 'Web Developer',
        description: 'Christ University, Bangalore (January 2024 - May 2024)',
        icon: '💻',
        date: '2024'
    },
    {
        title: 'Graphic Design Intern',
        description: 'YouVah, Chandigarh (April 2022 - May 2022)',
        icon: '🎨',
        date: '2022'
    },
    {
        title: 'Bachelor of Computer Application',
        description: 'Christ University, Bangalore (2023 - 2027)',
        icon: '🎓',
        date: '2023-Present'
    },
    {
        title: 'High School Diploma',
        description: 'Army Public School (APS) - Art and Humanity',
        icon: '🏫',
        date: '2023'
    }
];

// Dynamically populate achievements
const achievementsContainer = document.querySelector('#achievements .grid');
achievements.forEach(achievement => {
    const achievementCard = document.createElement('div');
    achievementCard.className = 'bg-gray-800 rounded-lg p-6 transform hover:-translate-y-2 transition-transform duration-300';
    achievementCard.setAttribute('data-aos', 'fade-up');
    
    achievementCard.innerHTML = `
        <div class="text-4xl mb-4">${achievement.icon}</div>
        <h3 class="text-xl font-semibold mb-2">${achievement.title}</h3>
        <p class="text-gray-400 mb-2">${achievement.description}</p>
        <span class="text-primary text-sm">${achievement.date}</span>
    `;
    achievementsContainer.appendChild(achievementCard);
});

// Form Validation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formProps = Object.fromEntries(formData);
    
    // Basic validation
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formProps.name.trim()) {
        showError('name', 'Name is required');
        isValid = false;
    }
    
    if (!emailRegex.test(formProps.email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }
    
    if (!formProps.message.trim()) {
        showError('message', 'Message is required');
        isValid = false;
    }
    
    if (isValid) {
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formProps);
        showSuccess();
        contactForm.reset();
    }
});

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = field.parentElement.querySelector('.text-red-500');
    if (existingError) {
        existingError.remove();
    }
    
    field.parentElement.appendChild(errorDiv);
    field.classList.add('border-red-500');
}

function showSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg transform translate-y-0 opacity-100 transition-all duration-300';
    successMessage.textContent = 'Message sent successfully!';
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 3000);
}

// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.fade-in');
const fadeOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, fadeOptions);

fadeElements.forEach(element => fadeObserver.observe(element));
