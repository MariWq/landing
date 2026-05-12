/* ==========================================
   WOW.JS — Animations for wow-redesign
   Content Pulse Landing
   ========================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ---- Sticky Bottom Bar ----
    const stickyBar = document.getElementById('stickyBar');
    const hero = document.querySelector('.hero');

    if (stickyBar && hero) {
        let ticking = false;
        const threshold = hero.offsetHeight * 0.6;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    if (window.scrollY > threshold) {
                        stickyBar.classList.add('visible');
                    } else {
                        stickyBar.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ---- Animated Counters ----
    function animateCount(el, target, duration, suffix, isFloat) {
        const startTime = performance.now();
        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = target * eased;
            if (isFloat) {
                el.textContent = val.toFixed(1) + suffix;
            } else {
                el.textContent = Math.round(val).toLocaleString('ru-RU') + suffix;
            }
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const statsBar = document.querySelector('.stats-bar');
    let countersStarted = false;

    if (statsBar) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;

                    var items = [
                        { selector: '.stat-count-1', target: 1000,  suffix: '+',  float: false, duration: 1800 },
                        { selector: '.stat-count-2', target: 50000, suffix: '+',  float: false, duration: 2200 },
                        { selector: '.stat-count-3', target: 95,    suffix: '%',  float: false, duration: 1600 },
                        { selector: '.stat-count-4', target: 4.9,   suffix: '/5', float: true,  duration: 1400 },
                    ];

                    items.forEach(function (item) {
                        var el = document.querySelector(item.selector);
                        if (el) animateCount(el, item.target, item.duration, item.suffix, item.float);
                    });
                }
            });
        }, { threshold: 0.4 });

        observer.observe(statsBar);
    }

    // ---- Comparison table row reveal ----
    var compRows = document.querySelectorAll('.comparison-table tbody tr');
    if (compRows.length) {
        compRows.forEach(function (row) {
            row.style.opacity = '0';
            row.style.transform = 'translateY(12px)';
            row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        });

        var rowObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var rows = entry.target.parentElement.querySelectorAll('tr');
                    rows.forEach(function (r, i) {
                        setTimeout(function () {
                            r.style.opacity = '1';
                            r.style.transform = 'translateY(0)';
                        }, i * 70);
                    });
                    rowObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        if (compRows[0]) rowObserver.observe(compRows[0]);
    }

    // ---- Typing / cycling animation in hero ----
    var typingEl = document.getElementById('heroTypingWord');
    if (typingEl) {
        var words = ['блогеров', 'стартапов', 'агентств', 'экспертов', 'бизнеса'];
        var idx = 0;

        setInterval(function () {
            typingEl.style.opacity = '0';
            typingEl.style.transform = 'translateY(-8px)';

            setTimeout(function () {
                idx = (idx + 1) % words.length;
                typingEl.textContent = words[idx];
                typingEl.style.opacity = '1';
                typingEl.style.transform = 'translateY(0)';
            }, 280);
        }, 2800);
    }

    // ---- Parallax orbs on mouse move (desktop only) ----
    if (window.matchMedia('(min-width: 769px)').matches) {
        var orbs = document.querySelectorAll('.orb');
        var lastX = 0, lastY = 0;

        document.addEventListener('mousemove', function (e) {
            var xRatio = (e.clientX / window.innerWidth - 0.5);
            var yRatio = (e.clientY / window.innerHeight - 0.5);

            // Smooth interpolation
            lastX += (xRatio - lastX) * 0.08;
            lastY += (yRatio - lastY) * 0.08;

            orbs.forEach(function (orb, i) {
                var strength = (i + 1) * 12;
                orb.style.transform = 'translate(' + (lastX * strength) + 'px, ' + (lastY * strength) + 'px)';
            });
        }, { passive: true });
    }

    // ---- Section reveal (feature cards, pricing cards) ----
    var revealEls = document.querySelectorAll(
        '.feature-card, .who-for-item, .pricing-card, .comparison-header'
    );

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
        // Don't override existing animation class system, just enhance
        if (!el.classList.contains('animate-in')) {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        }
        revealObserver.observe(el);
    });

});
