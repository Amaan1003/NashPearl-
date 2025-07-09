document.addEventListener('DOMContentLoaded', function() {
    // Create optimized floating pearls background
    createFloatingPearls();
    
    // Animate hero title
    animateHeroTitle();
    
    // Only initialize Three.js on desktop
    if (window.innerWidth >= 768) {
        initPearlScene();
    }
    
    // Handle scroll events
    handleScrollEffects();
    
    // Mobile menu toggle
    setupMobileMenu();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
});

function handleResize() {
    // Recreate pearls on resize for proper scaling
    createFloatingPearls();
    
    // Reinitialize Three.js if crossing the mobile/desktop threshold
    const container = document.getElementById('pearls-container');
    const threeCanvas = container.querySelector('canvas');
    
    if (window.innerWidth >= 768 && !threeCanvas) {
        initPearlScene();
    } else if (window.innerWidth < 768 && threeCanvas) {
        container.removeChild(threeCanvas);
    }
}

function createFloatingPearls() {
    const container = document.getElementById('pearls-container');
    
    // Clear existing pearls but preserve Three.js canvas if it exists
    const threeCanvas = container.querySelector('canvas');
    container.innerHTML = '';
    if (threeCanvas) {
        container.appendChild(threeCanvas);
    }
    
    const pearlCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < pearlCount; i++) {
        const pearl = document.createElement('div');
        pearl.classList.add('pearl');
        
        // Adjust size based on device
        const size = window.innerWidth < 768 ? 
            Math.random() * 8 + 4 : 
            Math.random() * 10 + 5;
            
        pearl.style.width = `${size}px`;
        pearl.style.height = `${size}px`;
        
        // Random position
        pearl.style.left = `${Math.random() * 100}vw`;
        pearl.style.top = `${Math.random() * 100}vh`;
        
        // Simpler animation for mobile
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        const animationType = window.innerWidth < 768 ? 
            `floatPearlMobile ${duration}s ease-in-out ${delay}s infinite` :
            `floatPearl ${duration}s ease-in-out ${delay}s infinite`;
            
        pearl.style.animation = animationType;
        
        container.appendChild(pearl);
    }
    
    // Add optimized CSS for floating animation
    const styleId = 'pearl-animation-style';
    let style = document.getElementById(styleId);
    
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }
    
    style.textContent = `
        @keyframes floatPearl {
            0% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(${Math.random() * 90 - 45}deg);
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 180 - 90}deg);
            }
            75% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(${Math.random() * 270 - 135}deg);
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
            }
        }
        
        @keyframes floatPearlMobile {
            0%, 100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px);
            }
        }
    `;
}

function animateHeroTitle() {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        gsap.from(line, {
            y: '100%',
            opacity: 0,
            duration: window.innerWidth < 768 ? 1 : 1.2,
            delay: index * (window.innerWidth < 768 ? 0.15 : 0.2),
            ease: 'power3.out'
        });
    });
    
    // Optimized animations for mobile
    gsap.from('.hero-subtitle', {
        y: window.innerWidth < 768 ? 20 : 30,
        opacity: 0,
        delay: window.innerWidth < 768 ? 0.6 : 0.8,
        duration: window.innerWidth < 768 ? 0.8 : 1,
        ease: 'power2.out'
    });
    
    gsap.from('.hero-btn', {
        y: window.innerWidth < 768 ? 20 : 30,
        opacity: 0,
        delay: window.innerWidth < 768 ? 0.8 : 1,
        duration: window.innerWidth < 768 ? 0.8 : 1,
        ease: 'power2.out'
    });
    
    // Smoother shine animation for mobile
    gsap.to('.pearl-shine', {
        scale: window.innerWidth < 768 ? 1.1 : 1.2,
        opacity: window.innerWidth < 768 ? 0.6 : 0.8,
        duration: window.innerWidth < 768 ? 4 : 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

function initPearlScene() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') return;
    
    const container = document.getElementById('pearls-container');
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create pearl geometry
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    // Create multiple pearls
    const pearls = [];
    const pearlCount = 5;
    
    for (let i = 0; i < pearlCount; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: 0xf8f4f0,
            specular: 0xffffff,
            shininess: 100,
            transparent: true,
            opacity: 0.7
        });
        
        const pearl = new THREE.Mesh(geometry, material);
        
        // Random position
        pearl.position.x = (Math.random() - 0.5) * 10;
        pearl.position.y = (Math.random() - 0.5) * 10;
        pearl.position.z = (Math.random() - 0.5) * 10;
        
        // Random size
        const scale = Math.random() * 0.5 + 0.5;
        pearl.scale.set(scale, scale, scale);
        
        scene.add(pearl);
        pearls.push(pearl);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xf3e0dc, 1, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate pearls
        pearls.forEach((pearl, index) => {
            pearl.rotation.x += 0.005 * (index + 1);
            pearl.rotation.y += 0.01 * (index + 1);
            
            // Gentle floating motion
            pearl.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function handleScrollEffects() {
    // Navbar scroll effect - optimized for mobile
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.pearl-nav');
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > 30) {
            navbar.style.padding = window.innerWidth < 768 ? '0.8rem 5%' : '1rem 5%';
            navbar.style.background = 'rgba(250, 250, 210, 0.98)';
        } else {
            navbar.style.padding = window.innerWidth < 768 ? '1rem 5%' : '1.5rem 5%';
            navbar.style.background = 'rgba(250, 250, 210, 0.95)';
        }
    });
}

function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuLines = document.querySelectorAll('.menu-line');
    
    menuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            // Open menu
            gsap.to(menuLines[0], { y: 9, rotate: 45, duration: 0.3 });
            gsap.to(menuLines[1], { y: -9, rotate: -45, duration: 0.3 });
            document.body.style.overflow = 'hidden';
        } else {
            // Close menu
            gsap.to(menuLines, { y: 0, rotate: 0, duration: 0.3 });
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                gsap.to(menuLines, { y: 0, rotate: 0, duration: 0.3 });
                document.body.style.overflow = '';
            }
        });
    });
}



// Add this to your existing JavaScript file
function initProductCarousel() {
    const carousel = document.querySelector('.product-carousel');
    const cards = document.querySelectorAll('.product-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // 2rem gap in px
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    // Update carousel position
    function updateCarousel() {
        const scrollAmount = currentIndex * (cardWidth + gap);
        gsap.to(carousel, {
            scrollLeft: scrollAmount,
            duration: 0.7,
            ease: 'power3.out'
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Navigation functions
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function nextSlide() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 1;
        }
        updateCarousel();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Auto-advance on desktop
    if (window.innerWidth >= 768) {
        let autoSlide = setInterval(nextSlide, 5000);
        
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoSlide = setInterval(nextSlide, 5000);
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            carousel.style.overflowX = 'visible';
        } else {
            carousel.style.overflowX = 'auto';
        }
    });
}

// Initialize the carousel when DOM loads
document.addEventListener('DOMContentLoaded', initProductCarousel);