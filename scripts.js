/* ============================================
   DVZH — Ровный Движ
   Scripts: Enhanced Animations & Interactions
   ============================================ */

// NOTE: Админ-режим включается через ?admin в URL — показывает переключатели стилей/палитр
const DVZH_IS_ADMIN = new URLSearchParams(window.location.search).has('admin');

document.addEventListener('DOMContentLoaded', () => {
    // Скрываем UI переключения стилей для обычных пользователей
    if (!DVZH_IS_ADMIN) {
        const hideIds = ['showcase', 'showcaseTrigger', 'themeSwitcher'];
        hideIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }

    initNavigation();
    initScrollAnimations();
    initCounters();
    initFAQ();
    initFormHandler();
    initSmoothScroll();
    initThemeSwitcher();
    initCursorGlow();
    initMagneticButtons();
    initParticles();
    initCardGlow();
    initParallaxOrbits();

    initNavActiveSection();
    initTiltCards();
    initShowcase();
    initFounderPhotoSwitcher();
    initScrollProgress();
    initSectionParallax();
    initHeroEntrance();
    initNumberShuffle();
    initBorderTrail();
    initMarqueeScroll();
    initScrollPipeline();
    initStickyCta();
    initTelegramFloat();
    initABTest();
    initLayoutEngines();
    initCosmicModelMonths();
    initCosmicProcessItems();
    initCosmicAbout();
    initFloatTagParallax();
    initProblemFlyIn();
    initServicesFlyIn();
    initFaqScrollReveal();
    initCasesReveal();
    initWatermarkReveal();
});


/* ── Navigation ── */
function initNavigation() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const links = document.getElementById('navLinks');

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                if (currentScroll > 50) {
                    nav.classList.add('nav--scrolled');
                } else {
                    nav.classList.remove('nav--scrolled');
                }

                // Hide/show nav on scroll direction
                if (currentScroll > 300) {
                    if (currentScroll > lastScroll + 5) {
                        nav.style.transform = 'translateY(-100%)';
                    } else if (currentScroll < lastScroll - 5) {
                        nav.style.transform = 'translateY(0)';
                    }
                } else {
                    nav.style.transform = 'translateY(0)';
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    nav.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease';

    if (burger && links) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            links.classList.toggle('active');
            document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
        });

        links.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                links.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}


/* ── Active Nav Section Tracking ── */
function initNavActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('nav__link--active',
                        link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-72px 0px -40% 0px' });

    sections.forEach(s => observer.observe(s));
}


/* ── Scroll Animations (Enhanced) ── */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay) || 0;

                setTimeout(() => {
                    el.classList.add('animated');
                    
                    // Запускаем stagger для дочерних элементов
                    if (el.classList.contains('stagger-children')) {
                        const children = el.children;
                        Array.from(children).forEach((child, i) => {
                            child.style.transitionDelay = `${i * 0.1}s`;
                        });
                    }
                }, delay);

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -80px 0px'
    });

    elements.forEach(el => observer.observe(el));
}



/* ── Counter Animation (Enhanced with slot-machine effect) ── */
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.counter);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
    const duration = 3200;
    const startTime = performance.now();
    
    // Добавляем scale-pulse при старте
    el.style.transition = 'transform 0.3s ease';
    el.style.transform = 'scale(1.1)';
    setTimeout(() => { el.style.transform = 'scale(1)'; }, 300);

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Более эффектный easing: быстрый старт, медленное окончание (elastic feel)
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Финальный pulse
            el.style.transform = 'scale(1.15)';
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
        }
    }

    requestAnimationFrame(update);
}



/* ── FAQ Accordion ── */
function initFAQ() {
    const items = document.querySelectorAll('.faq__item');

    items.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all with smooth animation
            items.forEach(i => {
                i.classList.remove('active');
                const ans = i.querySelector('.faq__answer');
                ans.style.maxHeight = '0';
                i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if was closed)
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}


/* ── Form Handler ── */
function initFormHandler() {
    const form = document.getElementById('ctaForm');
    if (!form) return;

    // Input focus animations
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement?.classList.remove('focused');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (!data.name || !data.phone) {
            showFormMessage(form, 'Пожалуйста, заполните обязательные поля.', 'error');
            shakeElement(form.querySelector('button[type="submit"]'));
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" fill="none" style="width:20px;height:20px">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-linecap="round"/>
            </svg>
            <span>Отправляем...</span>
        `;
        btn.disabled = true;
        btn.style.opacity = '0.7';

        setTimeout(() => {
            launchConfetti();
            showFormMessage(form, 'Заявка отправлена! Мы свяжемся с вами в течение 2 часов.', 'success');
            // Haptic feedback на мобильных
            if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
            form.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.animation = 'pulse-success 0.6s ease';
            setTimeout(() => btn.style.animation = '', 600);
        }, 1500);

        console.log('Form submitted:', data);
    });
}

function showFormMessage(form, message, type) {
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `form-message form-message--${type}`;
    div.setAttribute('role', 'status');
    div.setAttribute('aria-live', 'polite');
    div.textContent = message;
    div.style.cssText = `
        padding: 16px 20px;
        border-radius: 12px;
        font-size: 14px;
        text-align: center;
        margin-top: 12px;
        animation: fadeSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        background: ${type === 'success' ? 'rgba(47, 185, 179, 0.1)' : 'rgba(255, 80, 80, 0.1)'};
        border: 1px solid ${type === 'success' ? 'rgba(47, 185, 179, 0.2)' : 'rgba(255, 80, 80, 0.2)'};
        color: ${type === 'success' ? '#2FB9B3' : '#ff5050'};
    `;

    form.appendChild(div);

    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translateY(-8px)';
        div.style.transition = 'all 0.3s ease';
        setTimeout(() => div.remove(), 300);
    }, 5000);
}

function shakeElement(el) {
    el.style.animation = 'shake 0.5s ease';
    setTimeout(() => el.style.animation = '', 500);
}


/* ── Theme Switcher ── */
function initThemeSwitcher() {
    const toggle = document.getElementById('themeToggle');
    const panel = document.getElementById('themePanel');
    const swatches = document.querySelectorAll('.theme-switcher__swatch');
    const vstyleItems = document.querySelectorAll('.style-switcher__item');

    if (!toggle || !panel) return;

    // Load saved color theme + visual style
    // Обычные пользователи всегда видят vstyle-collage, админ может менять
    const savedTheme = DVZH_IS_ADMIN ? (localStorage.getItem('dvzh-color-theme') || '') : '';
    const savedVstyle = DVZH_IS_ADMIN ? (localStorage.getItem('dvzh-vstyle') || 'vstyle-collage') : 'vstyle-collage';
    applyBodyClasses(savedTheme, savedVstyle);

    if (!DVZH_IS_ADMIN) return; // Остальная логика свитчера только для админа

    swatches.forEach(s => {
        s.classList.toggle('active', s.dataset.theme === savedTheme);
    });
    vstyleItems.forEach(s => {
        s.classList.toggle('active', (s.dataset.vstyle || '') === savedVstyle);
    });

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
    });

    // Color palette swatches
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const theme = swatch.dataset.theme;
            const currentVstyle = localStorage.getItem('dvzh-vstyle') || '';
            applyBodyClasses(theme, currentVstyle);
            localStorage.setItem('dvzh-color-theme', theme);

            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');

            swatch.style.transform = 'scale(1.3)';
            setTimeout(() => swatch.style.transform = '', 200);
        });
    });

    // Visual style items
    vstyleItems.forEach(item => {
        item.addEventListener('click', () => {
            const vstyle = item.dataset.vstyle || '';
            const currentTheme = localStorage.getItem('dvzh-color-theme') || '';
            applyBodyClasses(currentTheme, vstyle);
            localStorage.setItem('dvzh-vstyle', vstyle);

            vstyleItems.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-switcher')) {
            panel.classList.remove('active');
        }
    });
}

/**
 * Apply both color theme and visual style classes to body.
 * Body gets: "theme-X vstyle-Y" or just one of them.
 */
function applyBodyClasses(theme, vstyle) {
    const classes = [theme, vstyle].filter(Boolean).join(' ');
    document.body.className = classes;
    // Activate/deactivate layout engines on style change
    if (typeof updateLayoutEngines === 'function') updateLayoutEngines(vstyle);
}

/** Get current color theme from body classes */
function getCurrentTheme() {
    const match = document.body.className.match(/theme-[\w-]+/);
    return match ? match[0] : '';
}

/** Get current vstyle from body classes */
function getCurrentVstyle() {
    const match = document.body.className.match(/vstyle-[\w-]+/);
    return match ? match[0] : '';
}


/* ── Cursor Glow (Desktop only) ── */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 1024) {
        if (glow) glow.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animate() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });
}


/* ── Magnetic Buttons ── */
function initMagneticButtons() {
    if (window.innerWidth < 1024) return;

    const buttons = document.querySelectorAll('.btn--magnetic');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}


/* ── Card Glow Follow ── */
function initCardGlow() {
    if (window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.card-glow');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let light = card.querySelector('.card-glow__light');
            if (!light) {
                light = document.createElement('div');
                light.className = 'card-glow__light';
                light.style.cssText = `
                    position: absolute;
                    width: 250px;
                    height: 250px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(47, 185, 179, 0.07) 0%, transparent 70%);
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    transition: opacity 0.3s ease;
                    z-index: 0;
                `;
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                card.appendChild(light);
            }

            light.style.left = x + 'px';
            light.style.top = y + 'px';
            light.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            const light = card.querySelector('.card-glow__light');
            if (light) light.style.opacity = '0';
        });
    });
}


/* ── Tilt Cards ── */
function initTiltCards() {
    if (window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.cases__card, .model__month');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (y - 0.5) * 6;
            const tiltY = (x - 0.5) * -6;

            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.15s ease';
        });
    });
}


/* ── Floating Particles (Enhanced — more dynamic) ── */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container || window.innerWidth < 768) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 5 + 1.5;
        const left = Math.random() * 100;
        const duration = Math.random() * 14 + 10;
        const delay = Math.random() * 12;
        const isAccent = Math.random() > 0.6;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.3 + 0.12};
            ${isAccent ? 'background: var(--accent-2);' : ''}
            ${size > 3 ? 'box-shadow: 0 0 10px var(--accent-1), 0 0 20px rgba(var(--accent-1-rgb), 0.15);' : 'box-shadow: 0 0 4px var(--accent-1);'}
        `;

        container.appendChild(particle);
    }
}


/* ── Parallax Orbits ── */
function initParallaxOrbits() {
    if (window.innerWidth < 1024) return;

    const orbits = document.querySelectorAll('.hero__orbit');
    if (!orbits.length) return;

    const hero = document.getElementById('hero');

    // Mouse parallax on hero
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            orbits.forEach((orbit, i) => {
                const factor = (i + 1) * 8;
                orbit.style.transform = `translate(calc(-50% + ${x * factor}px), calc(-50% + ${y * factor}px))`;
            });
        });
    }
}


/* ── Smooth Scroll ── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();

            const navHeight = document.getElementById('nav')?.offsetHeight || 72;
            const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}


/* ── Showcase Panel ── */
function initShowcase() {
    const showcase = document.getElementById('showcase');
    const trigger = document.getElementById('showcaseTrigger');
    const closeBtn = document.getElementById('showcaseClose');

    if (!showcase || !trigger) return;

    trigger.addEventListener('click', () => {
        showcase.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Sync active vstyle card to current state
        syncShowcaseToCurrentState();
    });

    closeBtn.addEventListener('click', () => {
        showcase.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && showcase.classList.contains('active')) {
            showcase.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function syncShowcaseToCurrentState() {
    const currentVstyle = getCurrentVstyle();
    const vstyleCards = document.querySelectorAll('.style-card[data-apply-vstyle]');
    const statusName = document.getElementById('showcaseCurrentName');

    vstyleCards.forEach(card => {
        const cardVstyle = card.dataset.applyVstyle || '';
        card.classList.toggle('style-card--active', cardVstyle === currentVstyle);
    });

    // Update status name
    const activeCard = document.querySelector('.style-card--active');
    if (activeCard && statusName) {
        const theme = getCurrentTheme() || 'Night Orbit';
        const vstyleName = activeCard.querySelector('h3')?.textContent || 'Классика';
        statusName.textContent = vstyleName;
    }
}

// Global: Apply visual style from showcase
function applyVstyleFromShowcase(card) {
    const vstyle = card.dataset.applyVstyle || '';
    const currentTheme = getCurrentTheme();
    applyBodyClasses(currentTheme, vstyle);
    localStorage.setItem('dvzh-vstyle', vstyle);

    // Update active state on cards
    document.querySelectorAll('.style-card[data-apply-vstyle]').forEach(c => {
        c.classList.remove('style-card--active');
    });
    card.classList.add('style-card--active');

    // Sync switcher list
    document.querySelectorAll('.style-switcher__item').forEach(s => {
        s.classList.toggle('active', (s.dataset.vstyle || '') === vstyle);
    });

    // Update status
    const statusName = document.getElementById('showcaseCurrentName');
    if (statusName) {
        statusName.textContent = card.querySelector('h3')?.textContent || 'Классика';
    }

    // Pulse animation
    card.style.transform = 'scale(0.97)';
    setTimeout(() => { card.style.transform = ''; }, 150);
}


/* ── CSS Keyframes (injected) ── */
const injectedStyles = document.createElement('style');
injectedStyles.textContent = `
    @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }

    @keyframes pulse-success {
        0% { box-shadow: 0 0 0 0 rgba(47, 185, 179, 0.4); }
        50% { box-shadow: 0 0 0 12px rgba(47, 185, 179, 0); }
        100% { box-shadow: 0 0 0 0 rgba(47, 185, 179, 0); }
    }

    .nav__link--active {
        color: var(--accent-1) !important;
    }

    .nav__link--active::after {
        width: 100% !important;
    }

    .spinner {
        animation: spin 1s linear infinite;
    }

    /* ── Scroll Progress Bar ── */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: var(--gradient-accent);
        z-index: 10001;
        transform-origin: left;
        transform: scaleX(0);
        transition: none;
        box-shadow: 0 0 10px var(--accent-1);
    }

    /* ── Hero Entrance Animations ── */
    .hero-pre .hero__badge {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
    }
    .hero-entered .hero__badge {
        opacity: 1;
        transform: translateY(0) scale(1);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hero-pre .hero__title {
        opacity: 0;
        transform: translateX(-120px) translateY(30px) scale(0.7) rotate(-3deg);
        filter: blur(8px);
    }
    .hero-entered .hero__title {
        opacity: 1;
        transform: translateX(0) translateY(0) scale(1) rotate(0deg);
        filter: blur(0);
        transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s,
                    opacity 1.2s ease 0.15s,
                    filter 1.4s ease 0.15s;
    }

    .hero-pre .hero__subtitle {
        opacity: 0;
        transform: translateY(30px);
    }
    .hero-entered .hero__subtitle {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
    }

    .hero-pre .hero__actions {
        opacity: 0;
        transform: translateY(20px);
    }
    .hero-entered .hero__actions {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s;
    }

    .hero-pre .hero__stats {
        opacity: 0;
        transform: translateY(20px);
    }
    .hero-entered .hero__stats {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s;
    }

    .hero-pre .hero__scroll {
        opacity: 0;
    }
    .hero-entered .hero__scroll {
        opacity: 1;
        transition: opacity 1s ease 1.2s;
    }

    /* ── Card Glow Ring ── */
    .card-glow-ring {
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
        z-index: 1;
    }

    .card-glow:hover .card-glow-ring {
        opacity: 1;
    }

    /* ── Marquee hover ── */
    .marquee:hover .marquee__track {
        animation-play-state: paused;
    }

    .marquee__item {
        transition: color 0.3s ease, -webkit-text-stroke-color 0.3s ease;
    }

    .marquee:hover .marquee__item:not(.marquee__item--accent) {
        color: var(--text-muted) !important;
        -webkit-text-stroke-color: var(--accent-1) !important;
    }

    /* ── Approach step pulse ── */
    .approach__step-num.pulse-enter {
        animation: stepPulse 0.6s ease;
    }

    @keyframes stepPulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 var(--accent-1); }
        50% { transform: scale(1.15); box-shadow: 0 0 0 10px transparent; }
        100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
    }

    /* ── Process marker ring ── */
    .process__item-marker.entered::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 1px solid var(--accent-1);
        opacity: 0;
        animation: markerRing 1.5s ease forwards;
    }

    @keyframes markerRing {
        0% { transform: scale(0.8); opacity: 0; }
        50% { opacity: 0.5; }
        100% { transform: scale(1.4); opacity: 0; }
    }

    /* ── Number shuffle pop ── */
    @keyframes numberPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    /* ── Smooth hover transitions for services cards ── */
    .services__card {
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .services__card:hover {
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--border-hover);
    }

    /* ── FAQ smooth open ── */
    .faq__item {
        transition: all 0.3s ease;
    }

    .faq__item.active {
        border-color: var(--accent-1);
        box-shadow: 0 0 20px rgba(47, 185, 179, 0.05);
    }

    /* ── CTA mid glow pulse enhanced ── */
    @keyframes border-glow-enhanced {
        0%, 100% { 
            border-color: rgba(47, 185, 179, 0.15); 
            box-shadow: 0 0 0 0 transparent;
        }
        50% { 
            border-color: rgba(47, 185, 179, 0.4); 
            box-shadow: 0 0 30px rgba(47, 185, 179, 0.08);
        }
    }

    .border-glow-anim {
        animation: border-glow-enhanced 3s ease infinite;
    }

    /* ── Not-for items stagger ── */
    .not-for__item {
        transition: all 0.3s ease;
    }

    .not-for__item:hover {
        transform: translateX(8px);
    }
`;
document.head.appendChild(injectedStyles);


/* ── Scroll Progress Bar ── */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / docHeight, 1);
        bar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
}


/* ── Section Parallax (subtle shift on scroll) ── */
function initSectionParallax() {
    if (window.innerWidth < 1024) return;

    const sections = document.querySelectorAll('.problem, .approach, .model, .services, .cases, .process, .about, .not-for, .faq');

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const vh = window.innerHeight;
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top < vh && rect.bottom > 0) {
                        const progress = (vh - rect.top) / (vh + rect.height);
                        const shift = (progress - 0.5) * 15;
                        
                        const header = section.querySelector('.section-header');
                        if (header) {
                            header.style.transform = `translateY(${shift * 0.4}px)`;
                        }
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}


/* ── Hero Entrance (cinematic staged reveal) ── */
function initHeroEntrance() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Remove data-animate from hero children to use custom entrance
    const elements = hero.querySelectorAll('[data-animate]');
    elements.forEach(el => {
        el.removeAttribute('data-animate');
        el.removeAttribute('data-delay');
    });

    // Set initial state
    hero.classList.add('hero-pre');

    // Launch entrance
    setTimeout(() => {
        hero.classList.remove('hero-pre');
        hero.classList.add('hero-entered');
    }, 300);

    // Orbit scale-in
    const orbits = document.querySelectorAll('.hero__orbit');
    orbits.forEach((orbit, i) => {
        orbit.style.opacity = '0';
        orbit.style.transform = `translate(-50%, -50%) scale(0.3)`;
        orbit.style.transition = `all ${1.8 + i * 0.4}s cubic-bezier(0.16, 1, 0.3, 1) ${0.5 + i * 0.2}s`;

        setTimeout(() => {
            orbit.style.opacity = '1';
            orbit.style.transform = `translate(-50%, -50%) scale(1)`;
        }, 100);
    });
}


/* ── Number Shuffle (slot-machine on scroll into view) ── */
function initNumberShuffle() {
    const statValues = document.querySelectorAll('.hero__stat-value, .cases__metric-value, .about__founder-stat-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.shuffled) return;
            el.dataset.shuffled = '1';

            const original = el.textContent;
            const numMatch = original.match(/[\d.]+/);
            if (!numMatch) return;

            const target = parseFloat(numMatch[0]);
            const prefix = original.substring(0, original.indexOf(numMatch[0]));
            const suffix = original.substring(original.indexOf(numMatch[0]) + numMatch[0].length);

            let shuffles = 0;
            const maxShuffles = 14;
            const interval = setInterval(() => {
                const rand = (Math.random() * target * 1.5).toFixed(numMatch[0].includes('.') ? 1 : 0);
                el.textContent = prefix + rand + suffix;
                shuffles++;
                if (shuffles >= maxShuffles) {
                    clearInterval(interval);
                    el.textContent = original;
                    el.style.animation = 'numberPop 0.3s ease';
                    setTimeout(() => { el.style.animation = ''; }, 300);
                }
            }, 80);
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => observer.observe(el));
}


/* ── Border Trail (glowing conic gradient on card edges) ── */
function initBorderTrail() {
    if (window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.services__card, .cases__card, .model__month');

    cards.forEach(card => {
        const ring = document.createElement('div');
        ring.className = 'card-glow-ring';
        ring.style.background = 'transparent';
        card.style.position = 'relative';
        card.appendChild(ring);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
            ring.style.background = `conic-gradient(from ${angle}deg, transparent 0%, var(--accent-1) 10%, transparent 20%, transparent 100%)`;
            ring.style.mask = 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)';
            ring.style.maskComposite = 'exclude';
            ring.style.webkitMaskComposite = 'xor';
            ring.style.padding = '1px';
        });
    });

    // Approach step pulse on enter
    const steps = document.querySelectorAll('.approach__step-num');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('pulse-enter');
                stepObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    steps.forEach(s => stepObserver.observe(s));

    // Process timeline markers ring
    const markers = document.querySelectorAll('.process__item-marker');
    const markerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('entered');
                markerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    markers.forEach(m => markerObserver.observe(m));
}


/* ── Marquee Scroll-Direction Control ── */
/* Всегда вправо, при скролле ускоряется */
function initMarqueeScroll() {
    const track = document.querySelector('.marquee__track');
    if (!track) return;

    let position = 0;
    let speed = 0;
    let targetSpeed = 0.8;
    const BASE_SPEED = 0.8;
    const MAX_SPEED = 4;
    let lastScroll = window.scrollY;

    // Убираем CSS-анимацию, двигаем вручную
    track.style.animation = 'none';

    // Ширина половины трека (т.k. контент дублирован)
    const halfWidth = track.scrollWidth / 2;

    // Стартуем со сдвигом на -halfWidth чтобы было куда ехать вправо
    position = -halfWidth;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const delta = Math.abs(scrollY - lastScroll);
        lastScroll = scrollY;

        if (delta > 0) {
            targetSpeed = Math.min(MAX_SPEED, BASE_SPEED + delta * 0.15);
        }
    }, { passive: true });

    function tick() {
        // Плавно приближаемся к целевой скорости (вправо = положительная)
        speed += (targetSpeed - speed) * 0.05;
        position += speed;

        // Луп: когда ушли за 0 — перекидываем обратно
        if (position >= 0) position -= halfWidth;

        track.style.transform = `translateX(${position}px) translateZ(0)`;

        // Плавно возвращаем к базовой скорости
        targetSpeed += (BASE_SPEED - targetSpeed) * 0.02;

        requestAnimationFrame(tick);
    }
    tick();
}


/* ── Cosmic Rhythm: Механика роста (model months) ── */
/* ── Problem cards: fly-in + sway entrance ── */
/* ── Services: cosmic fly-in + sway entrance ── */
/* ── FAQ: scroll reveal — вопросы появляются поочерёдно при скролле ── */
function initFaqScrollReveal() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // NOTE: stagger delay based on dataset index to reveal sequentially
                const idx = parseInt(entry.target.dataset.faqIdx) || 0;
                setTimeout(() => {
                    entry.target.classList.add('faq-visible');
                }, idx * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach((item, i) => {
        item.dataset.faqIdx = i;
        observer.observe(item);
    });
}


/* ── Cases: sequential scroll reveal ── */
function initCasesReveal() {
    const grid = document.querySelector('.cases__grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.cases__card');
    if (!cards.length) return;

    // Set initial hidden state
    cards.forEach(card => {
        card.classList.add('case-hidden');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.remove('case-hidden');
                        card.classList.add('case-visible');
                    }, i * 250);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    observer.observe(grid);
}


/**
 * Watermark easter-egg reveal + parallax.
 * IntersectionObserver fades in `.dvzh-watermark` elements,
 * scroll handler adds subtle parallax translateY.
 */
function initWatermarkReveal() {
    const marks = document.querySelectorAll('.dvzh-watermark');
    if (!marks.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll-driven reveal via IntersectionObserver
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('wm-visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

    marks.forEach(m => revealObs.observe(m));

    // Parallax on scroll (skip if reduced-motion)
    if (prefersReduced) return;

    // Cache base transforms per watermark variant (must match CSS exactly)
    function getBaseTransform(el, offset) {
        if (el.classList.contains('dvzh-watermark--center'))
            return `translate(-50%, -50%) rotate(0deg) translateY(${offset}px)`;
        if (el.classList.contains('dvzh-watermark--right'))
            return `translateY(-50%) rotate(90deg) translateX(${offset}px)`;
        return `translateY(-50%) rotate(-90deg) translateX(${-offset}px)`;
    }

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            marks.forEach(m => {
                const rect = m.parentElement.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                // Parallax factor: subtle shift proportional to distance from viewport center
                const offset = (sectionCenter - window.innerHeight / 2) * -0.04;
                m.style.transform = getBaseTransform(m, offset);
            });
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial position
}


function initServicesFlyIn() {
    // NOTE: В collage-режиме fly-in не нужен — трансформы управляются CSS/engine
    if (document.body.classList.contains('vstyle-collage') || document.body.classList.contains('vstyle-collage-old')) return;

    const grid = document.querySelector('.services__grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.services__card');
    if (!cards.length) return;

    // Hide cards initially
    cards.forEach(c => {
        c.classList.add('service-cosmic-hidden');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.remove('service-cosmic-hidden');
                        card.classList.add('service-flew-in');
                        // After entrance + sway, clear animation for normal hover behavior
                        card.addEventListener('animationend', () => {
                            card.style.animation = 'none';
                            card.style.opacity = '1';
                            card.style.transform = '';
                        }, { once: true });
                    }, i * 300);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    observer.observe(grid);
}


function initProblemFlyIn() {
    // NOTE: В collage-режиме fly-in не нужен — трансформы управляются CSS/engine
    if (document.body.classList.contains('vstyle-collage') || document.body.classList.contains('vstyle-collage-old')) return;

    const grid = document.querySelector('.problem__grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.problem__card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.add('problem-flew-in');
                    }, i * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    observer.observe(grid);
}


function initCosmicModelMonths() {
    const months = document.querySelectorAll('.model__month');
    if (!months.length) return;

    // NOTE: В collage-режиме пропускаем cosmic entrance, но scroll-glow оставляем
    if (document.body.classList.contains('vstyle-collage') || document.body.classList.contains('vstyle-collage-old')) {
        initModelScrollGlow();
        return;
    }

    // Скрываем элементы до появления
    months.forEach(m => m.classList.add('cosmic-hidden'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const container = entry.target.closest('.model__months') || entry.target.parentElement;
            const items = container ? container.querySelectorAll('.model__month') : [entry.target];

            // NOTE: Ритмичная задержка — каждый месяц влетает с пульсирующим интервалом
            items.forEach((item, i) => {
                if (item.classList.contains('cosmic-pulse-enter')) return;
                setTimeout(() => {
                    item.classList.remove('cosmic-hidden');
                    item.classList.add('cosmic-pulse-enter');
                    // Пульсация свечения после влёта
                    setTimeout(() => item.classList.add('cosmic-glow'), 800);
                }, i * 400); // ритмичный интервал — плавная поочерёдная подача
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    // Наблюдаем за первым месяцем как триггером
    if (months[0]) observer.observe(months[0]);

    // Скролл-свечение + прогресс-линия
    initModelScrollGlow();
}


/* ── Model: scroll-driven glow + progress line ── */
function initModelScrollGlow() {
    const section = document.querySelector('.model');
    const monthsContainer = document.querySelector('.model__months');
    const months = document.querySelectorAll('.model__month');
    if (!section || !monthsContainer || !months.length) return;

    // Создаём прогресс-линию
    const lineWrap = document.createElement('div');
    lineWrap.className = 'model__scroll-line';
    const lineFill = document.createElement('div');
    lineFill.className = 'model__scroll-line-fill';
    lineWrap.appendChild(lineFill);
    monthsContainer.prepend(lineWrap);

    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const sRect = section.getBoundingClientRect();
            const wh = window.innerHeight;

            // Прогресс секции: 0 = верх секции вошёл в видимость, 1 = низ секции вышел
            const totalTravel = sRect.height + wh * 0.3;
            const scrolled = wh - sRect.top;
            const progress = Math.max(0, Math.min(1, scrolled / totalTravel));

            // Линия движется с прогрессом
            lineFill.style.width = (progress * 100) + '%';

            // Свечение карточек: каждая загорается когда скролл проходит мимо
            months.forEach(card => {
                const cRect = card.getBoundingClientRect();
                const cardCenter = cRect.top + cRect.height / 2;
                // Карточка светится когда её центр попадает в верхнюю 70% вьюпорта
                const inGlowZone = cardCenter < wh * 0.75 && cardCenter > 0;
                if (inGlowZone) {
                    card.classList.add('scroll-glow');
                } else {
                    card.classList.remove('scroll-glow');
                }
            });

            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Первый просчёт
    onScroll();
}


/* ── Cosmic Rhythm: Как мы работаем (process items) ── */
function initCosmicProcessItems() {
    const items = document.querySelectorAll('.process__item');
    if (!items.length) return;

    items.forEach(item => item.classList.add('cosmic-hidden'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const timeline = entry.target.closest('.process__timeline') || entry.target.parentElement;
            const steps = timeline ? timeline.querySelectorAll('.process__item') : [entry.target];

            steps.forEach((step, i) => {
                if (step.classList.contains('cosmic-step-enter')) return;
                // NOTE: Увеличенная задержка для ритмичного «сердцебиения»
                setTimeout(() => {
                    step.classList.remove('cosmic-hidden');
                    step.classList.add('cosmic-step-enter');
                }, i * 200);
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    if (items[0]) observer.observe(items[0]);

    // Рек.4: Динамическая линия прогресса timeline
    const timeline = document.querySelector('.process__timeline');
    if (timeline) {
        const fill = document.createElement('div');
        fill.className = 'process__timeline-fill';
        fill.style.cssText = `
            position: absolute;
            left: 20px;
            top: 0;
            width: 1px;
            height: 0;
            background: var(--accent-1);
            z-index: 1;
            transition: height 0.3s ease;
            box-shadow: 0 0 6px var(--accent-1);
        `;
        timeline.style.position = 'relative';
        timeline.appendChild(fill);

        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const rect = timeline.getBoundingClientRect();
                const vh = window.innerHeight;
                if (rect.top > vh || rect.bottom < 0) return;
                const scrolled = vh * 0.5 - rect.top;
                const total = rect.height;
                const progress = Math.max(0, Math.min(1, scrolled / total));
                fill.style.height = `${progress * 100}%`;
            });
        }, { passive: true });
    }
}


/* ── Cosmic Fly-in: О нас карточки + Founder pulse ── */
function initCosmicAbout() {
    const values = document.querySelectorAll('.about__value');
    const founder = document.querySelector('.about__founder');

    // Карточки: скрыть и влететь при скролле
    if (values.length) {
        values.forEach(v => v.classList.add('cosmic-hidden'));

        const valObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const container = entry.target.closest('.about__values');
                const cards = container ? container.querySelectorAll('.about__value') : [entry.target];

                cards.forEach((card, i) => {
                    if (card.classList.contains('cosmic-fly-in')) return;
                    setTimeout(() => {
                        card.classList.remove('cosmic-hidden');
                        card.classList.add('cosmic-fly-in');
                    }, i * 200);
                });

                valObserver.unobserve(entry.target);
            });
        }, { threshold: 0.2 });

        if (values[0]) valObserver.observe(values[0]);
    }

    // Founder: fly-in фото (без орбиты и пульсации)
    if (founder) {
        const founderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Fly-in анимация для фото
                    const img = founder.querySelector('.about__founder-img');
                    if (img && !img.classList.contains('founder-flew-in')) {
                        img.classList.add('founder-flew-in');
                    }
                }
            });
        }, { threshold: 0.3 });

        founderObserver.observe(founder);
    }
}


/* ── Рек.2: Float-tag parallax на mousemove ── */
function initFloatTagParallax() {
    const tags = document.querySelectorAll('.hero__float-tag');
    if (!tags.length || window.innerWidth < 768) return;

    const hero = document.getElementById('hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        tags.forEach((tag, i) => {
            const depth = 8 + i * 4; // разная глубина для каждого тега
            const tx = x * depth;
            const ty = y * depth;
            tag.style.transform = `translate(${tx}px, ${ty}px)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        tags.forEach(tag => {
            tag.style.transition = 'transform 0.6s ease';
            tag.style.transform = 'translate(0, 0)';
            setTimeout(() => { tag.style.transition = ''; }, 600);
        });
    });
}


/* ── Рек.3: Numbers bounce при завершении shuffle ── */
// Уже интегрировано в initNumberShuffle — scale pop после shuffle


/* ── Scroll-triggered Pipeline Fill ── */
function initScrollPipeline() {
    const pipeline = document.querySelector('.approach__pipeline');
    const lineFill = document.querySelector('.approach__line-fill');
    if (!pipeline || !lineFill) return;

    // Override the CSS transition-based fill with scroll-driven fill
    lineFill.style.transition = 'none';

    function updateFill() {
        const rect = pipeline.getBoundingClientRect();
        const viewH = window.innerHeight;

        // Pipeline visible area
        const pipelineTop = rect.top;
        const pipelineHeight = rect.height;

        // Calculate how much of the pipeline has been scrolled past
        // Start filling when pipeline top reaches 80% of viewport
        // Complete when pipeline bottom reaches 30% of viewport
        const startTrigger = viewH * 0.8;
        const endTrigger = viewH * 0.3;

        const scrolledPast = startTrigger - pipelineTop;
        const totalRange = pipelineHeight - (endTrigger - (viewH - startTrigger));

        let progress = scrolledPast / totalRange;
        progress = Math.max(0, Math.min(1, progress));

        lineFill.style.height = `${progress * 100}%`;

        // Add glow effect at the tip of the fill
        if (progress > 0 && progress < 1) {
            lineFill.style.boxShadow = `0 2px 12px var(--accent-1), 0 0 4px var(--accent-1)`;
        } else {
            lineFill.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateFill);
    }, { passive: true });

    updateFill();
}


/* ── Sticky CTA Button ── */
function initStickyCta() {
    const stickyCta = document.getElementById('stickyCta');
    const hero = document.getElementById('hero');
    const ctaFinal = document.getElementById('cta-final');
    if (!stickyCta || !hero) return;

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show sticky CTA when hero is NOT visible
            if (!entry.isIntersecting) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    heroObserver.observe(hero);

    // Also hide when near the final CTA form, re-show when scrolling away
    if (ctaFinal) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyCta.classList.remove('visible');
                } else {
                    // Re-show sticky CTA when scrolling away from cta-final
                    // (only if hero is also not visible)
                    const heroRect = hero.getBoundingClientRect();
                    if (heroRect.bottom < 0) {
                        stickyCta.classList.add('visible');
                    }
                }
            });
        }, { threshold: 0.2 });

        ctaObserver.observe(ctaFinal);
    }

    // Smooth scroll when clicked
    stickyCta.querySelector('a')?.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(e.currentTarget.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}


/* ── Mature Cosmic Effect — monochrome, elegant ── */
function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const style = getComputedStyle(document.body);
    const accent = style.getPropertyValue('--accent-1').trim() || '#2FB9B3';
    // NOTE: Монохромная палитра — только accent + белый/серый, без разноцветных элементов
    const palette = [accent, 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.15)'];

    // Shockwave кольца — одноцветные
    const rings = [];
    for (let i = 0; i < 3; i++) {
        rings.push({
            r: 0,
            maxR: Math.max(canvas.width, canvas.height) * 0.6,
            speed: 3 + i * 1.2,
            delay: i * 15,
            opacity: 0.35 - i * 0.08,
            lineWidth: 1.5 - i * 0.3
        });
    }

    // Частицы — только точки и тонкие линии, никаких цветных фигур
    const particles = [];
    const PARTICLE_COUNT = 40;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 2.5;
        particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5,
            size: Math.random() * 3 + 1,
            opacity: 0.3 + Math.random() * 0.5,
            drag: 0.988 + Math.random() * 0.008,
            // Хвост — линия
            tail: 6 + Math.random() * 10,
            prevX: cx, prevY: cy
        });
    }

    // Центральная вспышка
    let flashOpacity = 1;

    let frame = 0;
    const MAX_FRAMES = 160;

    function animate() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const progress = frame / MAX_FRAMES;

        // Центральная вспышка (быстро затухает)
        if (flashOpacity > 0) {
            flashOpacity = Math.max(0, 1 - progress * 5);
            const flashR = 30 + progress * 120;
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
            gradient.addColorStop(0, `rgba(255,255,255,${flashOpacity * 0.6})`);
            gradient.addColorStop(0.3, accent.replace(')', `,${flashOpacity * 0.3})`).replace('rgb', 'rgba'));
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(cx - flashR, cy - flashR, flashR * 2, flashR * 2);
        }

        // Shockwave кольца — accent цвет
        rings.forEach(ring => {
            if (frame < ring.delay) return;
            ring.r += ring.speed;
            const rProgress = ring.r / ring.maxR;
            const a = ring.opacity * (1 - rProgress * rProgress);
            if (a <= 0) return;
            ctx.save();
            ctx.strokeStyle = accent;
            ctx.globalAlpha = a;
            ctx.lineWidth = ring.lineWidth;
            ctx.beginPath();
            ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        });

        // Частицы с хвостами
        let alive = false;
        particles.forEach(p => {
            p.prevX = p.x;
            p.prevY = p.y;
            p.x += p.vx;
            p.y += p.vy;
            p.vy -= 0.008;
            p.vx *= p.drag;
            p.vy *= p.drag;
            const pOpacity = p.opacity * Math.max(0, 1 - progress * 1.3);

            if (pOpacity <= 0.01) return;
            alive = true;

            // Хвост-линия
            ctx.save();
            ctx.globalAlpha = pOpacity * 0.5;
            ctx.strokeStyle = accent;
            ctx.lineWidth = p.size * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.prevX, p.prevY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            ctx.restore();

            // Точка
            ctx.save();
            ctx.globalAlpha = pOpacity;
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.shadowColor = accent;
            ctx.shadowBlur = 6 * pOpacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Тонкие пылевые кольца (nebula dust)
        if (progress < 0.7) {
            const dustAlpha = 0.08 * (1 - progress / 0.7);
            for (let d = 0; d < 2; d++) {
                const dr = 50 + progress * 200 + d * 80;
                ctx.save();
                ctx.globalAlpha = dustAlpha;
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 0.5;
                ctx.setLineDash([4, 8]);
                ctx.beginPath();
                ctx.arc(cx, cy, dr, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        if ((alive || rings.some(r => r.r < r.maxR)) && frame < MAX_FRAMES) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }

    requestAnimationFrame(animate);
}


/* ── Floating Telegram Button ── */
function initTelegramFloat() {
    const tgFloat = document.getElementById('tgFloat');
    const hero = document.getElementById('hero');
    if (!tgFloat || !hero) return;

    // NOTE: Показываем TG-кнопку с задержкой 2 сек, чтобы не отвлекать сразу
    let tgShowTimeout = null;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                tgShowTimeout = setTimeout(() => {
                    tgFloat.classList.add('visible');
                }, 2000);
            } else {
                clearTimeout(tgShowTimeout);
                tgFloat.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(hero);

    // Also hide near cta-final to avoid clutter, re-show when scrolling away
    const ctaFinal = document.getElementById('cta-final');
    if (ctaFinal) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tgFloat.classList.remove('visible');
                } else {
                    const heroRect = hero.getBoundingClientRect();
                    if (heroRect.bottom < 0) {
                        tgFloat.classList.add('visible');
                    }
                }
            });
        }, { threshold: 0.2 });
        ctaObserver.observe(ctaFinal);
    }
}


/* ── A/B Testing (H1 & CTA) ── */
function initABTest() {
    // NOTE: Simple client-side A/B test. Variant stored in localStorage for consistency.
    const STORAGE_KEY = 'dvzh_ab_variant';
    let variant = localStorage.getItem(STORAGE_KEY);

    if (!variant) {
        variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem(STORAGE_KEY, variant);
    }

    const heroTitle = document.querySelector('.hero__title');
    const ctaBtn = document.querySelector('.hero__actions .btn--primary');

    if (variant === 'B') {
        // Variant B — alternative copy
        if (heroTitle) {
            heroTitle.innerHTML = `
                Мы не «ведём рекламу».<br>
                <span class="hero__title-accent glitch" data-text="Мы растим бизнес">Мы растим бизнес</span><br>
                через платный трафик.
            `;
        }
        if (ctaBtn) {
            const arrow = ctaBtn.querySelector('svg')?.outerHTML || '';
            ctaBtn.innerHTML = `Получить стратегию ${arrow}`;
        }
    }
    // Variant A = default copy, no changes needed
}

/* ============================================
   Founder Photo Switcher
   ============================================ */
function initFounderPhotoSwitcher() {
    const photo = document.getElementById('founderPhoto');
    const buttons = document.querySelectorAll('.about__founder-photo-btn');
    if (!photo || !buttons.length) return;

    // Set first button active
    buttons[0].classList.add('active');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const src = btn.dataset.photo;
            if (!src) return;

            // Fade out
            photo.style.opacity = '0';
            photo.style.transform = 'scale(0.97)';

            setTimeout(() => {
                photo.src = src;
                photo.onload = () => {
                    photo.style.opacity = '1';
                    photo.style.transform = 'scale(1)';
                };
            }, 300);

            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}


/* ╔══════════════════════════════════════════════════════════════════╗
   ║  LAYOUT ENGINES — Orbital Layers / Street Collage / Vector     ║
   ╚══════════════════════════════════════════════════════════════════╝ */

/**
 * Инициализирует менеджер layout-движков.
 * Каждый движок создаёт и уничтожает декоративные DOM-элементы,
 * привязывает/отвязывает обработчики событий.
 */
function initLayoutEngines() {
    // Рек.4 — Crossfade wrapper for smooth transitions between engines
    if (!document.getElementById('engine-crossfade-wrapper')) {
        // Оборачиваем main-контент в wrapper для crossfade
        // NOTE: Не оборачиваем реальный DOM, используем overlay-подход
        const overlay = document.createElement('div');
        overlay.id = 'engine-crossfade-wrapper';
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 9998;
            pointer-events: none; opacity: 1;
            transition: opacity 0.3s ease;
            background: var(--bg-primary, #0B0E11);
            mix-blend-mode: normal;
        `;
        // NOTE: При crossfade overlay opacity: 0→1→0 создаёт плавный переход
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);
    }

    // Create persistent DOM containers
    createOrbitalElements();
    createCollageElements();
    createVectorElements();

    // Initialize based on current vstyle
    const currentVstyle = getCurrentVstyle();
    updateLayoutEngines(currentVstyle);
}

/** Dispatcher: activates the right engine, deactivates others.
 *  Рек.4 — Crossfade transition: 300ms fade-out → swap → fade-in */
let _prevEngine = null;
let _crossfadeInProgress = false;

function updateLayoutEngines(vstyle) {
    const engines = ['vstyle-orbital', 'vstyle-collage', 'vstyle-vector'];
    const isEngine = engines.includes(vstyle);
    const wasEngine = engines.includes(_prevEngine);

    // Crossfade only when switching BETWEEN engines
    if (wasEngine && isEngine && vstyle !== _prevEngine && !_crossfadeInProgress) {
        _crossfadeInProgress = true;
        const wrapper = document.getElementById('engine-crossfade-wrapper');
        if (wrapper) {
            wrapper.style.opacity = '0';
            setTimeout(() => {
                _applyEngine(vstyle);
                wrapper.style.opacity = '1';
                _crossfadeInProgress = false;
            }, 300);
        } else {
            _applyEngine(vstyle);
            _crossfadeInProgress = false;
        }
    } else {
        _applyEngine(vstyle);
    }
    _prevEngine = vstyle;
}

function _applyEngine(vstyle) {
    // ORBITAL LAYERS
    if (vstyle === 'vstyle-orbital') {
        startOrbitalEngine();
    } else {
        stopOrbitalEngine();
    }

    // STREET COLLAGE
    if (vstyle === 'vstyle-collage') {
        startCollageEngine();
    } else {
        stopCollageEngine();
    }

    // KINETIC VECTOR
    if (vstyle === 'vstyle-vector') {
        startVectorEngine();
    } else {
        stopVectorEngine();
    }
}


/* ════════════════════════════════════════════
   ENGINE 1: ORBITAL LAYERS
   - Видео-фон туманностей (screen blend)
   - SVG орбитные линии
   - Mouse parallax на карточках
   ════════════════════════════════════════════ */

let orbitalRAF = null;
let orbitalMouseHandler = null;

function createOrbitalElements() {
    // SVG overlay — тонкие орбитные линии пересекающие экран
    if (!document.getElementById('orbital-svg-overlay')) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'orbital-svg-overlay';
        svg.setAttribute('viewBox', '0 0 1920 1080');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.innerHTML = `
            <defs>
                <linearGradient id="orb-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="var(--accent-1)" stop-opacity="0"/>
                    <stop offset="50%" stop-color="var(--accent-1)" stop-opacity="0.15"/>
                    <stop offset="100%" stop-color="var(--accent-1)" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="orb-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="var(--accent-2)" stop-opacity="0"/>
                    <stop offset="50%" stop-color="var(--accent-2)" stop-opacity="0.1"/>
                    <stop offset="100%" stop-color="var(--accent-2)" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <ellipse cx="960" cy="540" rx="800" ry="350" fill="none" stroke="url(#orb-grad-1)" stroke-width="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 960 540" to="360 960 540" dur="80s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="960" cy="540" rx="600" ry="250" fill="none" stroke="url(#orb-grad-2)" stroke-width="0.5">
                <animateTransform attributeName="transform" type="rotate" from="360 960 540" to="0 960 540" dur="60s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="960" cy="540" rx="450" ry="180" fill="none" stroke="url(#orb-grad-1)" stroke-width="0.3" stroke-dasharray="8 16">
                <animateTransform attributeName="transform" type="rotate" from="0 960 540" to="360 960 540" dur="45s" repeatCount="indefinite"/>
            </ellipse>
            <line x1="0" y1="400" x2="1920" y2="680" stroke="url(#orb-grad-2)" stroke-width="0.3" opacity="0.4"/>
            <line x1="200" y1="0" x2="1700" y2="1080" stroke="url(#orb-grad-1)" stroke-width="0.3" opacity="0.3"/>
        `;
        document.body.appendChild(svg);
    }

    // Генеративный canvas вместо видео
    if (!document.getElementById('orbital-canvas-bg')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'orbital-canvas-bg';
        canvas.style.cssText = `
            position: fixed; inset: 0; width: 100%; height: 100%;
            z-index: 0; pointer-events: none; opacity: 0;
            mix-blend-mode: screen; transition: opacity 1.5s ease;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);
    }
}

function startOrbitalEngine() {
    // Рек.1 — Enhanced particle system with stars, depth layers, and pulsing nebulae
    const canvas = document.getElementById('orbital-canvas-bg');
    if (canvas) {
        canvas.style.opacity = '0.18';
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.floor(window.innerWidth / 2);
        const h = Math.floor(window.innerHeight / 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // Генерация звёздного поля (300 частиц, 3 слоя глубины)
        const stars = [];
        for (let i = 0; i < 300; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 0.3 + Math.random() * 1.2,
                speed: 0.02 + Math.random() * 0.08,
                phase: Math.random() * Math.PI * 2,
                layer: Math.floor(Math.random() * 3),  // 0=far, 1=mid, 2=near
                alpha: 0.2 + Math.random() * 0.6
            });
        }

        let time = 0;
        function drawEnhancedNebula() {
            if (!document.body.classList.contains('vstyle-orbital')) return;
            time += 0.004;
            ctx.clearRect(0, 0, w, h);

            // Layer 1: Deep nebula clouds (large, soft)
            for (let i = 0; i < 6; i++) {
                const x = w * (0.25 + 0.5 * Math.sin(time * 0.3 + i * 1.1));
                const y = h * (0.25 + 0.5 * Math.cos(time * 0.25 + i * 0.7));
                const r = 100 + 60 * Math.sin(time * 0.2 + i * 0.5);
                const pulse = 0.5 + 0.5 * Math.sin(time * 0.4 + i * 1.5);
                const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                const colors = [
                    `rgba(47, 185, 179, ${0.04 * pulse})`,
                    `rgba(77, 163, 255, ${0.03 * pulse})`,
                    `rgba(147, 125, 255, ${0.025 * pulse})`
                ];
                grad.addColorStop(0, colors[i % 3]);
                grad.addColorStop(0.5, colors[(i + 1) % 3]);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            }

            // Layer 2: Star field with twinkling
            stars.forEach(s => {
                const twinkle = 0.5 + 0.5 * Math.sin(time * 3 * s.speed + s.phase);
                const drift = s.layer === 0 ? 0.2 : s.layer === 1 ? 0.5 : 1.0;

                // Parallax drift
                const sx = (s.x + time * 8 * drift) % w;
                const sy = s.y + Math.sin(time + s.phase) * 0.3;

                ctx.beginPath();
                ctx.arc(sx, sy, s.r * (0.7 + 0.3 * twinkle), 0, Math.PI * 2);
                ctx.fillStyle = s.layer === 2
                    ? `rgba(47, 185, 179, ${s.alpha * twinkle})`
                    : `rgba(220, 230, 255, ${s.alpha * twinkle * 0.6})`;
                ctx.fill();

                // Glow для крупных звёзд
                if (s.r > 0.9 && twinkle > 0.7) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, s.r * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(47, 185, 179, ${0.02 * twinkle})`;
                    ctx.fill();
                }
            });

            // Layer 3: Central gravity well (pulsing glow)
            const cPulse = 0.6 + 0.4 * Math.sin(time * 0.8);
            const cGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 120 * cPulse);
            cGrad.addColorStop(0, `rgba(47, 185, 179, ${0.06 * cPulse})`);
            cGrad.addColorStop(0.4, `rgba(47, 185, 179, ${0.02 * cPulse})`);
            cGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = cGrad;
            ctx.fillRect(0, 0, w, h);

            orbitalRAF = requestAnimationFrame(drawEnhancedNebula);
        }
        drawEnhancedNebula();
    }

    // Mouse parallax на карточках (perspective-based 3D tilt)
    orbitalMouseHandler = (e) => {
        const cards = document.querySelectorAll('.services__card, .problem__card, .cases__card');
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;

        cards.forEach((card, i) => {
            const depth = 0.5 + (i % 3) * 0.3;
            const tx = mx * 10 * depth;
            const ty = my * 8 * depth;
            const rx = -my * 3 * depth;  // 3D tilt X
            const ry = mx * 3 * depth;   // 3D tilt Y
            card.style.transform = `perspective(800px) translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            card.style.transition = 'transform 0.15s ease-out';
        });
    };
    document.addEventListener('mousemove', orbitalMouseHandler, { passive: true });
}

function stopOrbitalEngine() {
    if (orbitalRAF) {
        cancelAnimationFrame(orbitalRAF);
        orbitalRAF = null;
    }
    const canvas = document.getElementById('orbital-canvas-bg');
    if (canvas) canvas.style.opacity = '0';

    if (orbitalMouseHandler) {
        document.removeEventListener('mousemove', orbitalMouseHandler);
        orbitalMouseHandler = null;
        // Reset card transforms
        document.querySelectorAll('.services__card, .problem__card, .cases__card').forEach(c => {
            c.style.transform = '';
        });
    }
}


/* ════════════════════════════════════════════
   ENGINE 2: STREET COLLAGE
   - Случайные "tape strips" (скотч-полоски)
   - Random rotation jitter на картах при скролле
   - "Spray paint" курсор
   ════════════════════════════════════════════ */

let collageScrollHandler = null;

function createCollageElements() {
    // "Glass splinters" — тонкие парящие стеклянные осколки (фоновый декор)
    if (!document.getElementById('collage-tape-container')) {
        const container = document.createElement('div');
        container.id = 'collage-tape-container';
        container.style.cssText = `
            position: fixed; inset: 0; z-index: 1;
            pointer-events: none; opacity: 0; transition: opacity 0.8s ease;
        `;

        const splinters = [
            { top: '12%', left: '3%',  w: '140px', h: '40px',  rot: -8,  dur: 12, delay: 0 },
            { top: '40%', right: '4%', w: '100px', h: '32px',  rot: 10,  dur: 15, delay: 2 },
            { top: '68%', left: '6%',  w: '120px', h: '36px',  rot: -4,  dur: 11, delay: 1 },
            { top: '25%', left: '55%', w: '90px',  h: '28px',  rot: 14,  dur: 14, delay: 3 },
            { top: '80%', right: '8%', w: '110px', h: '34px',  rot: -6,  dur: 13, delay: 1.5 },
            { top: '55%', left: '12%', w: '80px',  h: '26px',  rot: 7,   dur: 16, delay: 4 },
        ];

        splinters.forEach((s, i) => {
            const el = document.createElement('div');
            const animIdx = (i % 3) + 1;
            el.style.cssText = `
                position: absolute;
                top: ${s.top}; ${s.left ? 'left:' + s.left : 'right:' + s.right};
                width: ${s.w}; height: ${s.h};
                --glass-rot: ${s.rot}deg;
                background: radial-gradient(
                    ellipse at 40% 30%,
                    rgba(var(--accent-1-rgb), 0.07) 0%,
                    rgba(var(--accent-1-rgb), 0.03) 50%,
                    transparent 100%
                );
                border: 1px solid rgba(var(--accent-1-rgb), 0.08);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border-radius: 42% 58% 64% 36% / 47% 35% 65% 53%;
                box-shadow: inset 0 0 20px rgba(var(--accent-1-rgb), 0.04);
                transform: rotate(${s.rot}deg);
                animation: splinter-float-${animIdx} ${s.dur}s ease-in-out ${s.delay}s infinite;
            `;
            container.appendChild(el);
        });

        // Inject float keyframes if not present
        if (!document.getElementById('splinter-keyframes')) {
            const style = document.createElement('style');
            style.id = 'splinter-keyframes';
            style.textContent = `
                @keyframes splinter-float-1 {
                    0%, 100% { transform: translateY(0) rotate(var(--glass-rot, 0deg)); border-radius: 42% 58% 64% 36% / 47% 35% 65% 53%; }
                    30% { transform: translateY(-18px) rotate(calc(var(--glass-rot, 0deg) + 2deg)); border-radius: 55% 45% 48% 52% / 60% 40% 55% 45%; }
                    60% { transform: translateY(-8px) rotate(calc(var(--glass-rot, 0deg) - 1deg)); border-radius: 38% 62% 55% 45% / 42% 58% 48% 52%; }
                }
                @keyframes splinter-float-2 {
                    0%, 100% { transform: translateY(0) rotate(var(--glass-rot, 0deg)); border-radius: 58% 42% 48% 52% / 55% 45% 60% 40%; }
                    40% { transform: translateY(-14px) rotate(calc(var(--glass-rot, 0deg) - 2deg)); border-radius: 45% 55% 60% 40% / 38% 62% 42% 58%; }
                    70% { transform: translateY(-22px) rotate(calc(var(--glass-rot, 0deg) + 1deg)); border-radius: 52% 48% 42% 58% / 50% 50% 55% 45%; }
                }
                @keyframes splinter-float-3 {
                    0%, 100% { transform: translateY(0) rotate(var(--glass-rot, 0deg)); border-radius: 48% 52% 55% 45% / 58% 42% 50% 50%; }
                    25% { transform: translateY(-20px) rotate(calc(var(--glass-rot, 0deg) + 1.5deg)); border-radius: 60% 40% 42% 58% / 45% 55% 62% 38%; }
                    55% { transform: translateY(-10px) rotate(calc(var(--glass-rot, 0deg) - 1.5deg)); border-radius: 40% 60% 58% 42% / 52% 48% 45% 55%; }
                }
                @media (prefers-reduced-motion: reduce) {
                    [style*="splinter-float"] { animation: none !important; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(container);
    }

    // "Spray drip" — дополнительные вертикальные подтёки
    if (!document.getElementById('collage-drips')) {
        const drips = document.createElement('div');
        drips.id = 'collage-drips';
        drips.style.cssText = `
            position: fixed; inset: 0; z-index: 3;
            pointer-events: none; opacity: 0; transition: opacity 0.6s ease;
        `;

        [15, 35, 78].forEach(leftPct => {
            const drip = document.createElement('div');
            const h = 30 + Math.random() * 40;
            drip.style.cssText = `
                position: absolute;
                top: ${10 + Math.random() * 30}%;
                left: ${leftPct}%;
                width: 2px;
                height: ${h}vh;
                background: linear-gradient(to bottom,
                    rgba(var(--accent-1-rgb), 0.1),
                    rgba(var(--accent-1-rgb), 0.03),
                    transparent
                );
                border-radius: 0 0 50% 50%;
            `;
            drips.appendChild(drip);
        });

        document.body.appendChild(drips);
    }

    // «Жидкое стекло» — декоративные floating стеклянные прямоугольники
    if (!document.getElementById('collage-glass-container')) {
        const glassContainer = document.createElement('div');
        glassContainer.id = 'collage-glass-container';
        glassContainer.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';

        // Конфигурация: секция → paint rivers (узкие и высокие потёки)
        // Конфигурация: секция → живые капли краски (органичные пропорции)
        const glassConfig = [
            // Hero — 2 капли
            { section: '.hero',     top: '8%',  right: '3%',  w: '220px', h: '200px', rot: '-3deg' },
            { section: '.hero',     top: '50%', left: '5%',   w: '180px', h: '240px', rot: '4deg' },
            // Problem
            { section: '.problem',  top: '6%',  right: '1%',  w: '200px', h: '180px', rot: '5deg' },
            { section: '.problem',  top: '55%', left: '1%',   w: '160px', h: '200px', rot: '-4deg' },
            // Services — обе справа
            { section: '.services', top: '4%',  right: '1%',  w: '230px', h: '190px', rot: '-2deg' },
            { section: '.services', top: '48%', right: '4%',  w: '190px', h: '170px', rot: '6deg' },
            // Model
            { section: '.model',    top: '8%',  right: '2%',  w: '180px', h: '200px', rot: '-5deg' },
            { section: '.model',    top: '55%', left: '3%',   w: '160px', h: '160px', rot: '3deg' },
            // Cases — верхний правее (не перекрывает заголовок), нижний справа
            { section: '.cases',    top: '8%',  right: '2%',  w: '200px', h: '160px', rot: '2deg' },
            { section: '.cases',    top: '55%', right: '2%',  w: '180px', h: '220px', rot: '-4deg' },
            // About — на уровне заголовка, между текстом и фото
            { section: '.about',    top: '8%',  right: '36%', w: '180px', h: '170px', rot: '5deg' },
            // CTA-final
            { section: '.cta-final',top: '12%', left: '3%',   w: '170px', h: '180px', rot: '-3deg' },
            { section: '.cta-final',top: '40%', right: '5%',  w: '200px', h: '170px', rot: '4deg' },
        ];

        glassConfig.forEach(cfg => {
            const host = document.querySelector(cfg.section);
            if (!host) return;
            // Секция должна быть position:relative для absolute-позиционирования
            if (getComputedStyle(host).position === 'static') {
                host.style.position = 'relative';
            }

            const el = document.createElement('div');
            el.className = 'collage-glass-float';
            el.style.cssText = `
                top: ${cfg.top};
                ${cfg.left ? 'left:' + cfg.left : 'right:' + cfg.right};
                width: ${cfg.w}; height: ${cfg.h};
                --glass-rot: ${cfg.rot};
                transform: rotate(${cfg.rot});
            `;
            host.appendChild(el);
        });
    }
}

let collageDragCleanup = null;

function startCollageEngine() {
    // NOTE: splinters hidden — не вписываются в текущий стиль
    // const tapeContainer = document.getElementById('collage-tape-container');
    // if (tapeContainer) tapeContainer.style.opacity = '1';

    const drips = document.getElementById('collage-drips');
    if (drips) drips.style.opacity = '1';

    // Glass rectangles — IntersectionObserver reveal + floating
    const glassRects = document.querySelectorAll('.collage-glass-float');
    if (glassRects.length) {
        const glassObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('glass-visible');
                    glassObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
        glassRects.forEach(r => glassObs.observe(r));
    }

    // Рек.2 — FLIP scatter: плавная анимация карточек в лёгкий хаос
    // NOTE: .problem__card исключены — используют чистые CSS-наклоны (как в Collage Old)
    const flipCards = document.querySelectorAll('.services__card, .model__month');
    flipCards.forEach((card, i) => {
        // Мягкие смещения
        const targetRot = ((i * 17 + 7) % 5 - 2.5) * 0.4;  // ±1°
        const targetTx = ((i * 13 + 3) % 7 - 3.5) * 1.5;    // ±5px
        const targetTy = ((i * 11 + 5) % 5 - 2.5) * 2;      // ±5px

        card.style.transition = 'none';
        card.style.transform = 'rotate(0deg) translate(0px, 0px)';
        card.offsetHeight;

        // Плавный ease-out вместо spring-overshoot
        card.style.transition = `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.04}s`;
        card.style.transform = `rotate(${targetRot}deg) translate(${targetTx}px, ${targetTy}px)`;
    });

    // Scroll jitter (поверх FLIP)
    collageScrollHandler = () => {
        const cards = document.querySelectorAll('.services__card, .model__month');
        const scrollY = window.scrollY;

        cards.forEach((card, i) => {
            const baseRot = ((i * 17 + 7) % 5 - 2.5) * 0.4;
            const scrollOffset = Math.sin(scrollY * 0.001 + i) * 0.3;
            const jitter = baseRot + scrollOffset;
            const tx = ((i * 13 + 3) % 7 - 3.5) * 1.5;
            const ty = ((i * 11 + 5) % 5 - 2.5) * 2;
            if (!card.matches(':hover') && !card.classList.contains('collage-dragging')) {
                card.style.transition = 'transform 0.4s ease';
                card.style.transform = `rotate(${jitter}deg) translate(${tx}px, ${ty}px)`;
            }
        });
    };
    window.addEventListener('scroll', collageScrollHandler, { passive: true });

    // Рек.5 — Drag-to-rearrange: карточки можно хватать и двигать мышью
    collageDragCleanup = initCollageDrag();
}

/** Рек.5 — Drag система для Collage: стаскивание карточек мышью */
function initCollageDrag() {
    // NOTE: .problem__card исключены — чистые CSS-наклоны
    const cards = document.querySelectorAll('.services__card, .model__month');
    const handlers = [];

    cards.forEach(card => {
        let isDragging = false;
        let startX, startY, origX, origY;
        let currentRot = 0;

        const onMouseDown = (e) => {
            if (e.button !== 0) return; // only left click
            isDragging = true;
            card.classList.add('collage-dragging');
            startX = e.clientX;
            startY = e.clientY;

            // Парсим текущие translate значения
            const matrix = new DOMMatrix(getComputedStyle(card).transform);
            origX = matrix.m41;
            origY = matrix.m42;
            currentRot = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);

            card.style.zIndex = '50';
            card.style.cursor = 'grabbing';
            card.style.transition = 'none';
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            card.style.transform = `rotate(${currentRot}deg) translate(${origX + dx}px, ${origY + dy}px)`;
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            card.classList.remove('collage-dragging');
            card.style.cursor = '';
            card.style.zIndex = '';
            card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s 0.4s';
        };

        card.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseup', onMouseUp);
        card.style.cursor = 'grab';

        handlers.push(() => {
            card.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            card.style.cursor = '';
            card.classList.remove('collage-dragging');
        });
    });

    return () => handlers.forEach(fn => fn());
}

function stopCollageEngine() {
    const tapeContainer = document.getElementById('collage-tape-container');
    if (tapeContainer) tapeContainer.style.opacity = '0';

    const drips = document.getElementById('collage-drips');
    if (drips) drips.style.opacity = '0';

    // Hide glass rectangles
    document.querySelectorAll('.collage-glass-float').forEach(r => {
        r.classList.remove('glass-visible');
    });

    // Cleanup drag handlers
    if (collageDragCleanup) {
        collageDragCleanup();
        collageDragCleanup = null;
    }

    if (collageScrollHandler) {
        window.removeEventListener('scroll', collageScrollHandler);
        collageScrollHandler = null;
        // Рек.2 — Reverse FLIP: animate back to grid
        const cards = document.querySelectorAll('.problem__card, .services__card, .model__month');
        cards.forEach((c, i) => {
            c.style.transition = `transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.03}s`;
            c.style.transform = '';
        });
        // Очистить transition после завершения
        setTimeout(() => {
            cards.forEach(c => { c.style.transition = ''; });
        }, 600);
    }
}


/* ════════════════════════════════════════════
   ENGINE 3: KINETIC VECTOR
   - Горизонтальный scroll-text (поток)
   - SVG стрелки-направляющие
   - Scroll-driven speed lines
   ════════════════════════════════════════════ */

let vectorScrollHandler = null;
let vectorRAF = null;

function createVectorElements() {
    // Horizontal scroll text — ghost text sliding on scroll
    if (!document.getElementById('vector-hscroll-top')) {
        const textTop = document.createElement('div');
        textTop.id = 'vector-hscroll-top';
        textTop.className = 'vector-hscroll-text vector-hscroll-text--top';
        textTop.textContent = 'PERFORMANCE · TRAFFIC · GROWTH · STRATEGY · ';
        document.body.appendChild(textTop);

        const textBottom = document.createElement('div');
        textBottom.id = 'vector-hscroll-bottom';
        textBottom.className = 'vector-hscroll-text vector-hscroll-text--bottom';
        textBottom.textContent = 'DVZH · SYSTEM · CONTROL · RESULTS · ';
        document.body.appendChild(textBottom);
    }

    // SVG arrows overlay
    if (!document.getElementById('vector-arrows-overlay')) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'vector-arrows-overlay';
        svg.setAttribute('viewBox', '0 0 1920 1080');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.style.cssText = 'width:100%;height:100%;';
        svg.innerHTML = `
            <defs>
                <marker id="vec-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="none" stroke="rgba(47,185,179,0.15)" stroke-width="1"/>
                </marker>
                <linearGradient id="vec-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="var(--accent-1)" stop-opacity="0"/>
                    <stop offset="40%" stop-color="var(--accent-1)" stop-opacity="0.1"/>
                    <stop offset="100%" stop-color="var(--accent-1)" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <!-- Диагональные направляющие -->
            <line x1="100" y1="900" x2="1800" y2="200" stroke="url(#vec-line-grad)" stroke-width="0.5" marker-end="url(#vec-arrow)"/>
            <line x1="300" y1="1000" x2="1600" y2="400" stroke="url(#vec-line-grad)" stroke-width="0.3" marker-end="url(#vec-arrow)" stroke-dasharray="6 12"/>
            <line x1="0" y1="600" x2="1920" y2="480" stroke="url(#vec-line-grad)" stroke-width="0.4" marker-end="url(#vec-arrow)"/>
            <!-- Speed chevrons -->
            <g opacity="0.06" transform="translate(1500, 300) rotate(-20)">
                <polyline points="0,0 20,15 0,30" fill="none" stroke="var(--accent-1)" stroke-width="1.5"/>
                <polyline points="15,0 35,15 15,30" fill="none" stroke="var(--accent-1)" stroke-width="1.5"/>
                <polyline points="30,0 50,15 30,30" fill="none" stroke="var(--accent-1)" stroke-width="1"/>
            </g>
            <g opacity="0.04" transform="translate(400, 700) rotate(-20)">
                <polyline points="0,0 20,15 0,30" fill="none" stroke="var(--accent-2)" stroke-width="1.5"/>
                <polyline points="15,0 35,15 15,30" fill="none" stroke="var(--accent-2)" stroke-width="1.5"/>
            </g>
        `;
        document.body.appendChild(svg);
    }
}

function startVectorEngine() {
    const textTop = document.getElementById('vector-hscroll-top');
    const textBottom = document.getElementById('vector-hscroll-bottom');

    // Рек.3 — Progressive tilt: наклон от 0° вверху до -5° внизу страницы
    const tiltSections = document.querySelectorAll(`
        .hero, .problem, .approach, .model, .services, .cases,
        .cta-mid, .process, .about, .not-for, .faq, .cta-final,
        .trusted, .marquee, .footer
    `);
    const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    vectorScrollHandler = () => {
        const scrollY = window.scrollY;
        const speed = scrollY * 0.3;
        const scrollProgress = Math.min(scrollY / docHeight, 1); // 0→1

        // Progressive tilt: -1° at top → -5° at bottom
        const baseTilt = -1 - scrollProgress * 4;

        if (textTop) textTop.style.transform = `translateX(${-speed}px)`;
        if (textBottom) textBottom.style.transform = `translateX(${speed - 200}px)`;

        // Apply progressive tilt to each section based on its position
        tiltSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionProgress = 1 - (rect.top / window.innerHeight);
            const clampedProgress = Math.max(0, Math.min(1, sectionProgress));
            const sectionTilt = baseTilt - clampedProgress * 0.5;

            section.style.transform = `rotate(${sectionTilt}deg)`;
        });
    };
    window.addEventListener('scroll', vectorScrollHandler, { passive: true });
    vectorScrollHandler();

    // Motion blur + speed streaks
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;

    function checkScrollSpeed() {
        if (!document.body.classList.contains('vstyle-vector')) return;

        const currentScrollY = window.scrollY;
        scrollSpeed = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        // Blur-эффект при быстром скролле
        const sections = document.querySelectorAll('.problem__card, .services__card, .cases__card');
        const blurAmount = Math.min(scrollSpeed * 0.05, 3);

        sections.forEach(s => {
            if (blurAmount > 0.5) {
                s.style.filter = `blur(${blurAmount}px)`;
                s.style.transition = 'filter 0.1s ease';
            } else {
                s.style.filter = '';
                s.style.transition = 'filter 0.4s ease';
            }
        });

        vectorRAF = requestAnimationFrame(checkScrollSpeed);
    }
    checkScrollSpeed();
}

function stopVectorEngine() {
    if (vectorScrollHandler) {
        window.removeEventListener('scroll', vectorScrollHandler);
        vectorScrollHandler = null;
    }
    if (vectorRAF) {
        cancelAnimationFrame(vectorRAF);
        vectorRAF = null;
    }

    // Reset transforms on hscroll text
    const textTop = document.getElementById('vector-hscroll-top');
    const textBottom = document.getElementById('vector-hscroll-bottom');
    if (textTop) textTop.style.transform = '';
    if (textBottom) textBottom.style.transform = '';

    // Рек.3 — Reset progressive tilt on all sections
    document.querySelectorAll(`
        .hero, .problem, .approach, .model, .services, .cases,
        .cta-mid, .process, .about, .not-for, .faq, .cta-final,
        .trusted, .marquee, .footer
    `).forEach(s => { s.style.transform = ''; });

    // Reset blur
    document.querySelectorAll('.problem__card, .services__card, .cases__card').forEach(s => {
        s.style.filter = '';
        s.style.transition = '';
    });
}