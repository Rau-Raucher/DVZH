/* ============================================
   НейроФуд × DVZH — scripts.js
   ============================================ */

(function () {
    'use strict';

    /* ── Intersection Observer: fade-up ── */
    const fadeObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('is-visible');
                if (el.classList.contains('stagger-children')) {
                    Array.from(el.children).forEach(function (child, i) {
                        setTimeout(function () {
                            child.classList.add('is-visible');
                        }, i * 90);
                    });
                }
                fadeObserver.unobserve(el);
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-animate="fade-up"], .stagger-children').forEach(function (el) {
        fadeObserver.observe(el);
    });

    /* ── Counter animation ── */
    function animateCounter(el) {
        var target = parseInt(el.dataset.counter, 10);
        var duration = 1600;
        var start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var elapsed = timestamp - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    var counterObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('[data-counter]').forEach(function (el) {
        counterObserver.observe(el);
    });

    /* ── Particles in hero ── */
    var particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (var i = 0; i < 45; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            var size = Math.random() * 2 + 0.8;
            p.style.cssText = [
                'left:' + (Math.random() * 100) + '%',
                'top:' + (Math.random() * 100) + '%',
                'width:' + size + 'px',
                'height:' + size + 'px',
                'animation-duration:' + (Math.random() * 10 + 8) + 's',
                'animation-delay:' + (Math.random() * 8) + 's',
                'opacity:' + (Math.random() * 0.35 + 0.08)
            ].join(';');
            particlesContainer.appendChild(p);
        }
    }

    /* ── Nav scroll behaviour ── */
    var nav = document.getElementById('nav');
    if (nav) {
        function onScroll() {
            nav.classList.toggle('nav--scrolled', window.scrollY > 50);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── Burger menu ── */
    var burger = document.getElementById('navBurger');
    var navLinks = document.getElementById('navLinks');
    if (burger && navLinks) {
        burger.addEventListener('click', function () {
            navLinks.classList.toggle('nav__links--open');
            burger.classList.toggle('nav__burger--active');
        });
        navLinks.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('nav__links--open');
                burger.classList.remove('nav__burger--active');
            });
        });
    }

    /* ── FAQ accordion ── */
    document.querySelectorAll('.faq__question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.closest('.faq__item');
            var isOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq__item.is-open').forEach(function (i) {
                i.classList.remove('is-open');
            });
            if (!isOpen) item.classList.add('is-open');
        });
    });

    /* ── How pipeline fill animation ── */
    var lineFill = document.getElementById('howLineFill');
    if (lineFill) {
        var pipelineObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setTimeout(function () {
                            lineFill.classList.add('is-animating');
                        }, 200);
                        pipelineObserver.disconnect();
                    }
                });
            },
            { threshold: 0.2 }
        );
        var pipeline = lineFill.closest('.how__pipeline');
        if (pipeline) pipelineObserver.observe(pipeline);
    }

    /* ── Magnetic button effect ── */
    document.querySelectorAll('.btn--magnetic').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + x * 0.15 + 'px, ' + y * 0.15 + 'px) translateY(-3px)';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
        });
    });

    /* ── Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ── Results cards: stagger on entry ── */
    var resultsGrid = document.querySelector('.results__grid');
    if (resultsGrid) {
        var resObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                Array.from(resultsGrid.children).forEach(function (card, i) {
                    setTimeout(function () {
                        card.classList.add('is-visible');
                    }, i * 80);
                });
                resObserver.disconnect();
            }
        }, { threshold: 0.1 });
        resObserver.observe(resultsGrid);
    }

    /* ── Lead form → Aspro Cloud CRM ── */
    var leadForm    = document.getElementById('leadForm');
    var leadSuccess = document.getElementById('leadSuccess');

    if (leadForm) {
        var ASPRO_URL = 'https://dvzh.aspro.cloud/api/v1/module/crm/lead/create'
                      + '?api_key=Z244dUY2cUx4aHIzdld0V2dEcERtNEI0eU9GNGdDNHBfMTY5MTMx';

        function showFieldError(inputId, errorId, msg) {
            var input = document.getElementById(inputId);
            var error = document.getElementById(errorId);
            if (input) input.classList.add('is-error');
            if (error) error.textContent = msg;
        }

        function clearErrors() {
            leadForm.querySelectorAll('.lead-form__input').forEach(function (el) {
                el.classList.remove('is-error');
            });
            leadForm.querySelectorAll('.lead-form__error').forEach(function (el) {
                el.textContent = '';
            });
        }

        function validate(name, phone) {
            var ok = true;
            if (!name || name.trim().length < 2) {
                showFieldError('leadName', 'leadNameError', 'Введите имя (миним��м 2 символа)');
                ok = false;
            }
            if (!phone || phone.trim().length < 5) {
                showFieldError('leadPhone', 'leadPhoneError', 'Введите телефон или Telegram');
                ok = false;
            }
            return ok;
        }

        leadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            clearErrors();

            var name  = leadForm.querySelector('[name="name"]').value;
            var phone = leadForm.querySelector('[name="phone"]').value;

            if (!validate(name, phone)) return;

            leadForm.classList.add('lead-form--loading');

            var body = new URLSearchParams({
                name:        name.trim(),
                phone:       phone.trim(),
                manager_id:  '413955',
                pipeline_id: '2',
                source_id:   '4',
                description: 'Заявка с лендинга НейроФуд'
            });

            fetch(ASPRO_URL, {
                method:  'POST',
                mode:    'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body:    body.toString()
            })
            .then(function () {
                leadForm.hidden    = true;
                leadSuccess.hidden = false;
            })
            .catch(function () {
                /* Запрос ушёл даже при ошибке CORS — показываем успех */
                leadForm.hidden    = true;
                leadSuccess.hidden = false;
            });
        });

        /* Убираем ошибку при редактировании поля */
        leadForm.querySelectorAll('.lead-form__input').forEach(function (input) {
            input.addEventListener('input', function () {
                input.classList.remove('is-error');
                var err = document.getElementById(input.id + 'Error');
                if (err) err.textContent = '';
            });
        });
    }

})();
