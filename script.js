// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.category-section');
    
    // Check if we're on the actual tours page
    const isActualToursPage = window.location.pathname.includes('actual-tours');
    
    // Update active navigation item based on scroll position
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 200; // Увеличиваем отступ для лучшего определения
        
        // Упрощенная логика для всех страниц
        let activeSectionId = null;
        
        // Проверяем каждую секцию и находим активную
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSectionId = section.id;
            }
        });
        
        if (activeSectionId) {
            // Remove active class from all nav items
            navItems.forEach(item => item.classList.remove('active'));
            
            // Find and activate the corresponding nav item by href
            const targetNavItem = document.querySelector(`.nav-item[href="#${activeSectionId}"]`);
            

            
            if (targetNavItem) {
                targetNavItem.classList.add('active');
                
                // Auto-scroll navigation to show active item
                const navScroll = document.querySelector('.nav-scroll');
                if (navScroll) {
                    const itemLeft = targetNavItem.offsetLeft;
                    const itemWidth = targetNavItem.offsetWidth;
                    const scrollLeft = navScroll.scrollLeft;
                    const containerWidth = navScroll.offsetWidth;
                    
                    // Center the active item
                    const targetScrollLeft = Math.max(0, itemLeft - (containerWidth / 2) + (itemWidth / 2));
                    
                    // Only scroll if we need to move
                    if (Math.abs(scrollLeft - targetScrollLeft) > 10) {
                        navScroll.scrollTo({
                            left: targetScrollLeft,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }
    }
    
    // Smooth scroll to section when nav item is clicked
    navItems.forEach((item) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Smooth scroll to section
            let targetSection;
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                targetSection = document.querySelector(href);
            }
            
            if (targetSection) {
                // Вычисляем правильную позицию с учетом sticky навигации
                const navHeight = document.querySelector('.category-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 50; // Дополнительный отступ
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Auto-scroll navigation to show clicked item
            const navScroll = document.querySelector('.nav-scroll');
            if (navScroll) {
                const itemLeft = this.offsetLeft;
                const itemWidth = this.offsetWidth;
                const containerWidth = navScroll.offsetWidth;
                
                let targetScrollLeft;
                const index = Array.from(navItems).indexOf(this);
                if (index === 0) {
                    // First item - scroll to the beginning
                    targetScrollLeft = 0;
                } else {
                    // Other items - center them
                    targetScrollLeft = Math.max(0, itemLeft - (containerWidth / 2) + (itemWidth / 2));
                }
                
                navScroll.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Initialize active state
    updateActiveNav();
    
    // Add horizontal scroll support for navigation
    const navScroll = document.querySelector('.nav-scroll');
    if (navScroll) {
        navScroll.addEventListener('wheel', function(e) {
            // Prevent vertical scroll when scrolling horizontally over navigation
            e.preventDefault();
            
            // Scroll horizontally based on wheel direction
            this.scrollLeft += e.deltaY;
        });
    }
    
    // Add scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add hover effects for service cards
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add counter animation for hero stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Animate counters when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.textContent;
                if (target === '45') {
                    animateCounter(entry.target, 45);
                } else if (target === '11') {
                    animateCounter(entry.target, 11);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    let lastScrollY = window.scrollY;
    
    function updateParallax() {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;
        
        if (Math.abs(delta) > 1) {
            hero.style.transform = `translateY(${currentScrollY * 0.1}px)`;
            lastScrollY = currentScrollY;
        }
        
        requestAnimationFrame(updateParallax);
    }
    
    // Start parallax effect
    updateParallax();
    
    // Add "Back to Top" button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    document.body.appendChild(backToTopBtn);
    
    // Add back to top styles
    const backToTopStyles = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }
        
        @media (max-width: 768px) {
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 1rem;
            }
        }
    `;
    
    const backToTopStyleSheet = document.createElement('style');
    backToTopStyleSheet.textContent = backToTopStyles;
    document.head.appendChild(backToTopStyleSheet);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add loaded styles
        const loadedStyles = `
            body.loaded .service-card {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            body.loaded .hero-content {
                animation: fadeInUp 0.8s ease forwards;
            }
        `;
        
        const loadedStyleSheet = document.createElement('style');
        loadedStyleSheet.textContent = loadedStyles;
        document.head.appendChild(loadedStyleSheet);
    });
    
    // Add service card click effects
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple styles
    const rippleStyles = `
        .service-card {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    const rippleStyleSheet = document.createElement('style');
    rippleStyleSheet.textContent = rippleStyles;
    document.head.appendChild(rippleStyleSheet);
});

// Add service counter
let totalServices = 0;
const serviceCards = document.querySelectorAll('.service-card');

function updateServiceCounter() {
    totalServices = serviceCards.length;
    const counterElement = document.querySelector('.stat-number:first-child');
    if (counterElement) {
        counterElement.textContent = totalServices;
    }
}

// Update counter when DOM is loaded
document.addEventListener('DOMContentLoaded', updateServiceCounter);
