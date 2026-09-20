/* ===== REKA CREATIVE LABS — MAIN.JS ===== */

// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        document.querySelectorAll('.mobile-links a').forEach(a => {
            a.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Cursor follower
    const cursor = document.querySelector('.cursor-follower');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // Counter animation with IntersectionObserver
    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();
                if (text === '24–48h') {
                    let cur = 0;
                    const timer = setInterval(() => {
                        cur += 2;
                        if (cur >= 24) { el.textContent = '24–48h'; clearInterval(timer); }
                        else { el.textContent = cur + '–48h'; }
                    }, 40);
                    observer.unobserve(el);
                    return;
                }
                const prefix = text.startsWith('₹') ? '₹' : '';
                const numMatch = text.match(/[\d.]+/);
                if (!numMatch) return;
                const num = parseFloat(numMatch[0]);
                const suffix = text.slice(prefix.length + numMatch[0].length);
                let start = 0;
                const step = num / 45;
                const timer = setInterval(() => {
                    start += step;
                    if (start >= num) { start = num; clearInterval(timer); }
                    el.textContent = prefix + (Number.isInteger(num) ? Math.floor(start) : start.toFixed(1)) + suffix;
                }, 25);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-value, .hero-meta .num').forEach(el => statObserver.observe(el));

    // ===== HERO GLASS AI VIDEO STUDIO CONTROLLER =====
    const heroVideo = document.getElementById('heroBgVideo');
    const heroAmbient = document.getElementById('heroBgAmbient');
    const heroPhoneFrame = document.getElementById('heroPhoneFrame');
    const heroPlayStopBtn = document.getElementById('heroPlayStopBtn');
    const heroPlayStopIcon = document.getElementById('heroPlayStopIcon');
    const heroPlayStopText = document.getElementById('heroPlayStopText');
    const heroScreenPlayIcon = document.getElementById('heroScreenPlayIcon');
    const heroPrevBtn = document.getElementById('heroPrevBtn');
    const heroNextBtn = document.getElementById('heroNextBtn');
    const heroAudioBtn = document.getElementById('heroAudioToggle');
    const heroAudioIcon = document.getElementById('heroAudioIcon');
    const heroCounter = document.getElementById('heroVideoCounter');
    const heroTitle = document.getElementById('heroVideoTitle');
    const heroProgressFill = document.getElementById('heroProgressFill');

    if (heroVideo) {
        // Complete playlist of all real client ad creatives
        const videoPlaylist = [
            {
                src: 'rev/AQOTgmeLVUqSyI--kXy5uuvmUms6by_c7jWnXN9vzYLWkFDmVAlmmWLAarOoZyM-sJHgqJM-NCIZwt11NzXr_ugWicHnKoHNggEgOUo.mp4',
                title: 'E-Commerce Scaling Hook'
            },
            {
                src: 'rev/SaveClip.App_AQOJrc2k0cX-Tlh_6h0trb_1AYlPZTdTeqK_d0qzWbZ5O_nKc0WPTWuvqatvmcOa2Xn10vRjv7oxP_QkF98qBtyMAjqSY5jXji0Dnuw.mp4',
                title: 'Founder Brand Story'
            },
            {
                src: 'rev/AQO_EnVBTiqbx6h-qpT8OLKZ1GIyVt0TYd5yCQs36W2VWotQiz4S9vT84tq5YBkmY-2aa42yGj8kPh6KrMsCqMUB-BDa41vaoUsox_Q.mp4',
                title: 'Product Demonstration Ad'
            },
            {
                src: 'rev/SaveClip.App_AQM3FdvL9wlrzoztCJ9zraoNJq35JpxRwWqaFt0TH5g3b6EM1x5QIsYMZXb1oUK-8E7b2rQgjBhbUHJqdXHGDD7jnIms79DnD-dRYIg.mp4',
                title: 'High-ROAS Direct Response'
            },
            {
                src: 'rev/SaveClip.App_AQMmwG59-OkswBTdG0JNXddWGCBFNWT49jeJ8HNXJknnOnA-DxnGsAxIsnVJw6WXWp-IJe3CfPXbTcqRbFUvVIKz6I38e_S_MDVlUNs.mp4',
                title: 'Viral UGC Creative'
            },
            {
                src: 'rev/AQOjVd47tqxs6dg1qR9audu2HKzV-m2m1JGWwNu8fh6MmNKGR5UxOEcw_yk0OVmNXG951JL-e2nIYmfm1nrZ4hdD5fWqkD28iVMcgp0.mp4',
                title: 'D2C Retention Sprint'
            },
            {
                src: 'rev/SaveClip.App_AQPlY1vGs7TR0Wi0afKHfFVWDP6jTLTfT2o3YUtMuV_1QS97seLFxpz9vEZxFrIQ56QkS4XGLMzssvQeq_q7TFF1lZ1u-0CTt6wUI6o.mp4',
                title: 'Omnichannel Funnel Test'
            },
            {
                src: 'rev/AQO0DYvdfi0_GCWgMV5PjaN4z7on28WIbI7p_jK-fXB63EPQqO_KRZulExHz-JF1el4r1mVHJ9cCPrFAZgNL0NjenCAYBeFjY4JifsQ.mp4',
                title: 'B2B Founder Authority'
            },
            {
                src: 'rev/AQOIhcaG4iBc5vb2JnM6rgU8ChK6WfDcHIkx5SJeGIvDZdd2l1lYeFy1ur5pfldbmbeOXWyByavfKXmIiqzdmZDNqv9KaVBLP1YmZPo.mp4',
                title: 'Performance Creative #09'
            },
            {
                src: 'rev/AQPmvvhUyKPvraAx6qXnKgZ0if5J6IIFttmC5KKm7Eyz-UBCEkTu75h1yeMIg57U8Q2ZV992zAb-V1KzUmOVx-rsqqKlCjRD5gt_P2Y.mp4',
                title: 'AI Creative Variant #10'
            }
        ];

        let currentIdx = 0;

        function updatePlayStopUI(isPlaying) {
            if (isPlaying) {
                if (heroPlayStopIcon) heroPlayStopIcon.className = 'ph-fill ph-pause';
                if (heroPlayStopText) heroPlayStopText.textContent = 'Stop';
                if (heroScreenPlayIcon) heroScreenPlayIcon.innerHTML = '<i class="ph-fill ph-pause"></i>';
                if (heroPhoneFrame) heroPhoneFrame.classList.remove('paused');
            } else {
                if (heroPlayStopIcon) heroPlayStopIcon.className = 'ph-fill ph-play';
                if (heroPlayStopText) heroPlayStopText.textContent = 'Play';
                if (heroScreenPlayIcon) heroScreenPlayIcon.innerHTML = '<i class="ph-fill ph-play"></i>';
                if (heroPhoneFrame) heroPhoneFrame.classList.add('paused');
            }
        }

        function playVideo() {
            heroVideo.play().then(() => {
                updatePlayStopUI(true);
                if (heroAmbient) heroAmbient.play().catch(() => {});
            }).catch(() => {
                heroVideo.muted = true;
                heroVideo.play().then(() => {
                    updatePlayStopUI(true);
                    if (heroAmbient) heroAmbient.play().catch(() => {});
                }).catch(() => updatePlayStopUI(false));
            });
        }

        function stopVideo() {
            heroVideo.pause();
            if (heroAmbient) heroAmbient.pause();
            updatePlayStopUI(false);
        }

        function togglePlayStop(e) {
            if (e) e.stopPropagation();
            if (heroVideo.paused) {
                playVideo();
            } else {
                stopVideo();
            }
        }

        function loadVideo(index, shouldPlay = true) {
            currentIdx = (index + videoPlaylist.length) % videoPlaylist.length;
            const item = videoPlaylist[currentIdx];

            heroVideo.src = item.src;
            if (heroAmbient) heroAmbient.src = item.src;

            if (heroCounter) {
                heroCounter.textContent = 'Ad ' + String(currentIdx + 1).padStart(2, '0') + ' / ' + String(videoPlaylist.length).padStart(2, '0');
            }
            if (heroTitle) {
                heroTitle.textContent = item.title;
            }
            if (heroProgressFill) {
                heroProgressFill.style.width = '0%';
            }

            if (shouldPlay) {
                playVideo();
            } else {
                stopVideo();
            }
        }

        // Initial setup
        heroVideo.muted = true;
        if (heroAmbient) heroAmbient.muted = true;
        playVideo();

        // Progress bar updates
        heroVideo.addEventListener('timeupdate', () => {
            if (heroVideo.duration && heroProgressFill) {
                const pct = (heroVideo.currentTime / heroVideo.duration) * 100;
                heroProgressFill.style.width = pct + '%';
            }
        });

        // "Video sara chalna chahiye" — automatically play all videos in sequence!
        heroVideo.removeAttribute('loop');
        heroVideo.addEventListener('ended', () => {
            loadVideo(currentIdx + 1, true);
        });

        // Button controls
        if (heroPlayStopBtn) heroPlayStopBtn.addEventListener('click', togglePlayStop);
        if (heroPhoneFrame) heroPhoneFrame.addEventListener('click', togglePlayStop);
        if (heroNextBtn) heroNextBtn.addEventListener('click', () => loadVideo(currentIdx + 1, true));
        if (heroPrevBtn) heroPrevBtn.addEventListener('click', () => loadVideo(currentIdx - 1, true));

        // Audio toggle
        if (heroAudioBtn) {
            heroAudioBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                heroVideo.muted = !heroVideo.muted;
                if (heroAudioIcon) {
                    if (heroVideo.muted) {
                        heroAudioIcon.className = 'ph ph-speaker-slash';
                        heroAudioBtn.setAttribute('title', 'Unmute Sound');
                    } else {
                        heroAudioIcon.className = 'ph-bold ph-speaker-high';
                        heroAudioBtn.setAttribute('title', 'Mute Sound');
                    }
                }
            });
        }
    }
});



// ===== HERO CANVAS — PARTICLE CONSTELLATION =====
(function () {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles, mouse = { x: -9999, y: -9999 };
    var RAD = 120, COUNT = 90;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function Particle() {
        this.reset();
    }

    Particle.prototype.reset = function () {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r  = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
    };

    Particle.prototype.update = function () {
        // Mouse repel
        var dx = this.x - mouse.x;
        var dy = this.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            var force = (120 - dist) / 120;
            this.vx += (dx / dist) * force * 0.6;
            this.vy += (dy / dist) * force * 0.6;
        }
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.x  += this.vx;
        this.y  += this.vy;
        if (this.x < 0)  this.x = W;
        if (this.x > W)  this.x = 0;
        if (this.y < 0)  this.y = H;
        if (this.y > H)  this.y = 0;
    };

    function init() {
        resize();
        particles = [];
        for (var i = 0; i < COUNT; i++) particles.push(new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Draw connections
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < RAD) {
                    var opacity = (1 - d / RAD) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(140,246,101,' + opacity + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        for (var k = 0; k < particles.length; k++) {
            var p = particles[k];
            p.update();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(140,246,101,' + p.alpha + ')';
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', function () { init(); });
    canvas.closest('section').addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.closest('section').addEventListener('mouseleave', function () {
        mouse.x = -9999; mouse.y = -9999;
    });

    init();
    draw();

    // Parallax float cards on mouse move
    var hero = document.getElementById('hero');
    var floatCards = document.querySelectorAll('.hero-float-card');
    if (hero && floatCards.length > 0) {
        var heroRAF = null;
        hero.addEventListener('mousemove', function (e) {
            if (heroRAF) cancelAnimationFrame(heroRAF);
            heroRAF = requestAnimationFrame(function () {
                var rx = (e.clientX / window.innerWidth  - 0.5) * 20;
                var ry = (e.clientY / window.innerHeight - 0.5) * 20;
                floatCards.forEach(function (card, i) {
                    var factor = (i % 2 === 0) ? 1 : -1;
                    card.style.transform = 'translate3d(' + (rx * 0.3 * factor) + 'px,' + (ry * 0.2 * factor) + 'px, 0)';
                });
            });
        }, { passive: true });
    }
})();


// ===== LOGO DECODE / MATRIX ANIMATION =====
document.addEventListener('DOMContentLoaded', () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>";
    const logos = document.querySelectorAll('.logo-text-brand');
    
    logos.forEach(logo => {
        // Ensure data-value is set
        if (!logo.dataset.value) {
            logo.dataset.value = logo.innerText.trim();
        }
        
        let interval = null;
        
        const scramble = () => {
            let iteration = 0;
            clearInterval(interval);
            
            interval = setInterval(() => {
                logo.innerText = logo.dataset.value
                    .split("")
                    .map((letter, index) => {
                        if (letter === " ") return " ";
                        if (index < iteration) {
                            return logo.dataset.value[index];
                        }
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");
                
                if (iteration >= logo.dataset.value.length) {
                    clearInterval(interval);
                }
                
                iteration += 1 / 3;
            }, 30);
        };
        
        // Run once on load
        setTimeout(scramble, 300);
        
        // Run on hover
        logo.addEventListener("mouseover", scramble);
    });
});



// ===== FOUNDER CAROUSEL =====
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.f-img');
    const dots = document.querySelectorAll('.f-dot');
    if (images.length === 0) return;
    
    let currentIndex = 0;
    let timer;
    
    function showSlide(index) {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        images[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    function nextSlide() {
        let nextIndex = (currentIndex + 1) % images.length;
        showSlide(nextIndex);
    }
    
    timer = setInterval(nextSlide, 4000);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(timer);
            showSlide(index);
            timer = setInterval(nextSlide, 4000);
        });
    });
});


// ===== VIDEO TESTIMONIALS CONTROLLER =====
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.video-track');
    const cards = document.querySelectorAll('.video-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressFill = document.querySelector('.progress-fill');

    if (!track) return;

    // Handle Play / Pause behavior
    cards.forEach(card => {
        const video = card.querySelector('video');
        const muteBtn = card.querySelector('.mute-btn');
        const playIcon = card.querySelector('.play-btn-circle i');

        // Play/Pause on click
        card.addEventListener('click', (e) => {
            // Avoid triggering play toggle if clicking mute button
            if (e.target.closest('.mute-btn')) return;

            if (video.paused) {
                // Pause all other videos first
                document.querySelectorAll('.video-card video').forEach(otherVideo => {
                    if (otherVideo !== video) {
                        otherVideo.pause();
                        otherVideo.closest('.video-card').classList.remove('playing');
                        const otherPlayIcon = otherVideo.closest('.video-card').querySelector('.play-btn-circle i');
                        if (otherPlayIcon) {
                            otherPlayIcon.className = 'ph-fill ph-play';
                        }
                    }
                });

                video.play().then(() => {
                    card.classList.add('playing');
                    if (playIcon) playIcon.className = 'ph-fill ph-pause';
                }).catch(err => {
                    video.muted = true;
                    const muteIcon = muteBtn ? muteBtn.querySelector('i') : null;
                    if (muteIcon) muteIcon.className = 'ph ph-speaker-slash';
                    video.play().then(() => {
                        card.classList.add('playing');
                        if (playIcon) playIcon.className = 'ph-fill ph-pause';
                    }).catch(e => console.log('Playback error:', e));
                });
            } else {
                video.pause();
                card.classList.remove('playing');
                if (playIcon) playIcon.className = 'ph-fill ph-play';
            }
        });

        // Mute / Unmute
        if (muteBtn) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                const icon = muteBtn.querySelector('i');
                if (icon) {
                    if (video.muted) {
                        icon.className = 'ph ph-speaker-slash';
                        muteBtn.style.background = 'rgba(7, 14, 10, 0.6)';
                    } else {
                        icon.className = 'ph ph-speaker-high';
                        muteBtn.style.background = 'var(--primary)';
                    }
                }
            });
        }
    });

    // Slider Horizontal Navigation
    if (prevBtn && nextBtn) {
        const getScrollStep = () => {
            const firstCard = cards[0];
            return firstCard ? firstCard.offsetWidth + 32 : 350; // card width + gap
        };

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });

        // Dynamic Progress Bar based on Scroll position
        const updateProgressBar = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (maxScroll <= 0) return;
            const progress = (track.scrollLeft / maxScroll) * 100;
            if (progressFill) {
                progressFill.style.width = `${Math.min(100, Math.max(15, progress))}%`;
            }
        };

        track.addEventListener('scroll', updateProgressBar, { passive: true });
        window.addEventListener('resize', updateProgressBar, { passive: true });
        // Initial call
        updateProgressBar();
    }
});

/* ═══════════════════════════════════════════════════
   GET QUOTE MODAL CONTROLLER — DYNAMIC & SERVICE-AWARE
   ═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('quoteModal');
    const closeBtn = document.getElementById('closeQuoteModal');
    const form = document.getElementById('quoteForm');
    const serviceSelect = document.getElementById('quoteService');
    const triggers = document.querySelectorAll('.open-quote-modal');

    if (!modal) return;

    // Open Modal and pre-fill selected service
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = trigger.getAttribute('data-service');
            
            if (serviceName && serviceSelect) {
                for (let option of serviceSelect.options) {
                    if (serviceName.toLowerCase().includes(option.value.toLowerCase()) || 
                        option.value.toLowerCase().includes(serviceName.toLowerCase())) {
                        serviceSelect.value = option.value;
                        break;
                    }
                }
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });

    // Close Modal Function
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scroll
        if (form) form.reset();
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle Form Submit and redirect to WhatsApp
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('quoteName');
            const phoneEl = document.getElementById('quotePhone');
            const businessEl = document.getElementById('quoteBusiness');
            const emailEl = document.getElementById('quoteEmail');
            const goalEl = document.getElementById('quoteGoal');

            const name = nameEl ? nameEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const business = businessEl ? businessEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const goal = goalEl ? goalEl.value.trim() : '';
            const service = serviceSelect ? serviceSelect.value : 'Growth Strategy';

            let msg = `Hi Reka Creative Labs! I want a custom growth quote.\n\n`;
            msg += `• *Name:* ${name}\n`;
            msg += `• *Phone / WhatsApp:* ${phone}\n`;
            msg += `• *Business / Brand:* ${business}\n`;
            if (email) msg += `• *Email:* ${email}\n`;
            msg += `• *Service:* ${service}\n`;
            if (goal) msg += `• *Goal / Note:* ${goal}\n`;
            msg += `\nPlease connect with me.`;

            const whatsappUrl = `https://wa.me/918368508556?text=${encodeURIComponent(msg)}`;
            window.open(whatsappUrl, '_blank');
            closeModal();
        });
    }
});

/* ═══════════════════════════════════════════════════
   PREMIUM LEAD GENERATION POPUP (SMART GROWTH TOAST)
   ═══════════════════════════════════════════════════ */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Session state checks
        const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
        if (isReload) {
            sessionStorage.removeItem('leadPopupDismissed');
        }

        const isDismissed = sessionStorage.getItem('leadPopupDismissed');
        const isSubmitted = sessionStorage.getItem('leadPopupSubmitted');

        // 2. Inject popup HTML into the document body
        const toastHTML = `
            <div id="leadToast" class="lead-toast">
                <div class="lead-toast-progress-container">
                    <div id="leadToastProgress" class="lead-toast-progress"></div>
                </div>
                <div class="lead-toast-badge-strip">
                    <div class="lead-toast-badge">
                        <span class="lead-badge-pulse"></span>
                        <span>Wanna Use Reka AI Free? Use Here</span>
                    </div>
                    <button id="closeLeadToast" class="lead-toast-close" aria-label="Close popup">&times;</button>
                </div>
                <div class="lead-toast-header">
                    <div class="lead-toast-header-text">
                        <span class="lead-toast-title">Unlock Your <span class="gradient-text" style="color: #8CF665; background: linear-gradient(90deg, #8CF665, #57E3C4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Growth Plan</span></span>
                        <span class="lead-toast-subtitle">Instant access to AI tools + bespoke strategy roadmap.</span>
                    </div>
                </div>
                <div class="lead-toast-body">
                    <form id="leadToastForm" class="lead-toast-form">
                        <div class="form-group">
                            <label for="leadName">Your Name</label>
                            <input type="text" id="leadName" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="leadPhone">WhatsApp Number</label>
                            <input type="tel" id="leadPhone" placeholder="Enter WhatsApp number" required>
                        </div>
                        <div class="form-group">
                            <label for="leadService">Select Service</label>
                            <select id="leadService" required>
                                <option value="" disabled selected>Choose a service...</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Digital Marketing">Digital Marketing</option>
                                <option value="Brand Design">Brand Design</option>
                                <option value="Content & Video">Content & Video</option>
                                <option value="Growth Strategy">Growth Strategy</option>
                                <option value="AI Integration">AI Integration</option>
                                <option value="Starter Boost - Growth Package">Starter Boost - ₹15k/mo</option>
                                <option value="Growth Accelerator - Growth Package">Growth Accelerator - ₹25k/mo</option>
                                <option value="Premium Domination - Growth Package">Premium Domination - ₹40k/mo</option>
                            </select>
                        </div>
                        
                        <!-- Dynamic sub-question container -->
                        <div id="leadDynamicContainer" class="lead-toast-dynamic-field"></div>
                        
                        <button type="submit" class="btn btn-primary btn-lead-submit">
                            <span>Claim Free Strategy Call</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;

        // Append to body
        const containerDiv = document.createElement('div');
        containerDiv.innerHTML = toastHTML;
        document.body.appendChild(containerDiv.firstElementChild);

        const leadToast = document.getElementById('leadToast');
        const leadProgress = document.getElementById('leadToastProgress');
        const closeBtn = document.getElementById('closeLeadToast');
        const form = document.getElementById('leadToastForm');
        const serviceSelect = document.getElementById('leadService');
        const dynamicContainer = document.getElementById('leadDynamicContainer');

        let autoDismissTimer;

        // 3. Dynamic Question Config
        const questionsMap = {
            "Web Development": {
                label: "What type of website do you need?",
                placeholder: "e.g. E-commerce, landing page, business site..."
            },
            "Digital Marketing": {
                label: "What is your target monthly ad budget?",
                options: ["Not advertising yet", "Under ₹25,000", "₹25,000 - ₹1,00,000", "₹1,00,000+"]
            },
            "Brand Design": {
                label: "What industry is your brand in?",
                placeholder: "e.g. Real Estate, Tech, Fashion, Food..."
            },
            "Content & Video": {
                label: "How many videos do you need monthly?",
                options: ["1 to 5 videos", "5 to 15 videos", "15 to 30 videos", "30+ videos"]
            },
            "Growth Strategy": {
                label: "What is your target monthly revenue?",
                options: ["Under ₹5L/mo", "₹5L - ₹15L/mo", "₹15L+/mo"]
            },
            "AI Integration": {
                label: "What manual task do you want to automate?",
                placeholder: "e.g. FAQ support, lead sorting, Zapier syncs..."
            },
            "Starter Boost - Growth Package": {
                label: "What is your primary social channel?",
                placeholder: "e.g. Instagram link or @username"
            },
            "Growth Accelerator - Growth Package": {
                label: "What product/service do you want to promote?",
                placeholder: "Describe what you sell or generate leads for"
            },
            "Premium Domination - Growth Package": {
                label: "What CRM or tools do you currently use?",
                placeholder: "e.g. HubSpot, Google Sheets, Salesforce..."
            }
        };

        const renderDynamicQuestion = (service) => {
            dynamicContainer.innerHTML = '';
            dynamicContainer.classList.remove('visible');

            const question = questionsMap[service];
            if (!question) return;

            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.textContent = question.label;
            formGroup.appendChild(label);

            if (question.options) {
                const select = document.createElement('select');
                select.id = 'leadSubField';
                select.required = true;
                
                const defaultOpt = document.createElement('option');
                defaultOpt.value = '';
                defaultOpt.disabled = true;
                defaultOpt.selected = true;
                defaultOpt.textContent = 'Select an option...';
                select.appendChild(defaultOpt);

                question.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                formGroup.appendChild(select);
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'leadSubField';
                input.placeholder = question.placeholder || '';
                input.required = true;
                formGroup.appendChild(input);
            }

            dynamicContainer.appendChild(formGroup);
            
            // Allow DOM to layout then animate
            setTimeout(() => {
                dynamicContainer.classList.add('visible');
            }, 50);
        };

        if (serviceSelect) {
            serviceSelect.addEventListener('change', () => {
                renderDynamicQuestion(serviceSelect.value);
            });
        }

        // 4. Cool Floating Button ("Wanna use Reka AI free? Use here")
        const createFloatingFAB = () => {
            let fab = document.getElementById('leadFAB');
            if (fab) return fab;
            
            fab = document.createElement('button');
            fab.id = 'leadFAB';
            fab.setAttribute('type', 'button');
            fab.setAttribute('aria-label', 'Wanna use Reka AI free? Use here');
            fab.innerHTML = `
                <span class="reka-fab-beacon"></span>
                <i class="ph-duotone ph-sparkle reka-fab-icon"></i>
                <span class="reka-fab-text">Wanna use Reka AI free? <span class="reka-fab-bold">Use here</span></span>
                <i class="ph-bold ph-arrow-up-right reka-fab-arrow"></i>
            `;
            document.body.appendChild(fab);

            fab.addEventListener('click', () => {
                openPopup();
            });

            return fab;
        };

        // 5. Open and Close modal logic
        const openPopup = () => {
            const fab = document.getElementById('leadFAB');
            if (fab) {
                fab.classList.remove('active');
            }

            if (leadToast) {
                leadToast.style.display = 'block';
                setTimeout(() => {
                    leadToast.classList.add('active');
                    
                    // Reset 60s progress bar countdown
                    if (leadProgress) {
                        leadProgress.style.transition = 'none';
                        leadProgress.style.width = '100%';
                        setTimeout(() => {
                            leadProgress.style.transition = 'width 60s linear';
                            leadProgress.style.width = '0%';
                        }, 50);
                    }

                    clearTimeout(autoDismissTimer);
                    autoDismissTimer = setTimeout(() => {
                        closePopup(false);
                    }, 60000);
                }, 30);
            }
        };

        const closePopup = (dismissedByUser = false) => {
            if (!leadToast) return;
            leadToast.classList.remove('active');
            
            if (dismissedByUser) {
                sessionStorage.setItem('leadPopupDismissed', 'true');
            }
            
            clearTimeout(autoDismissTimer);
            
            setTimeout(() => {
                if (!leadToast.classList.contains('active')) {
                    leadToast.style.display = 'none';
                }
                const fab = document.getElementById('leadFAB');
                if (fab) {
                    fab.classList.add('active');
                }
            }, 450);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', () => closePopup(true));
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('leadToast') && leadToast.classList.contains('active')) {
                closePopup(true);
            }
        });

        // 6. Floating button & initial session load
        const fab = createFloatingFAB();

        if (isDismissed || isSubmitted) {
            leadToast.style.display = 'none';
            setTimeout(() => {
                fab.classList.add('active');
            }, 500);
        } else {
            // First time in session: show cool button right away, open popup after 3.5s
            setTimeout(() => {
                fab.classList.add('active');
            }, 400);

            setTimeout(() => {
                if (!sessionStorage.getItem('leadPopupDismissed') && !sessionStorage.getItem('leadPopupSubmitted')) {
                    openPopup();
                }
            }, 3500);
        }

        // 7. Submit handling with WhatsApp compilation
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const name = document.getElementById('leadName').value.trim();
                const phone = document.getElementById('leadPhone').value.trim();
                const service = serviceSelect.value;
                const subField = document.getElementById('leadSubField');
                const subValue = subField ? subField.value.trim() : '';
                const question = questionsMap[service];

                let customQuestionLine = '';
                if (question && subValue) {
                    customQuestionLine = `\n${question.label}: ${subValue}`;
                }

                // Beautiful formatted WhatsApp Message
                const formattedMessage = 
`Hello Reka Creative Labs, I would like to unlock my Growth Plan & Free AI Access.

Name: ${name}
WhatsApp/Phone: ${phone}
Selected Service: ${service}${customQuestionLine}

Please connect with me and share my growth plan!`;

                // WhatsApp link encoding
                const whatsappUrl = `https://wa.me/918368508556?text=${encodeURIComponent(formattedMessage)}`;

                // Open in a new tab
                window.open(whatsappUrl, '_blank');

                // Set session storage state so they aren't prompted again
                sessionStorage.setItem('leadPopupSubmitted', 'true');

                // Close and restore floating button
                closePopup(false);
            });
        }
    });
})();

/* ═══════════════════════════════════════════════════
   ADVANCED INTERACTIVE BRAND CARD SPOTLIGHTS & FILTERS
   ═══════════════════════════════════════════════════ */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const brandCards = document.querySelectorAll('.brand-card');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (brandCards.length === 0) return;

        // 1. 3D Card Hover & Border Spotlight Tracking
        brandCards.forEach(card => {
            let cardRect = null;
            let cardRAF = null;
            card.addEventListener('mouseenter', () => {
                cardRect = card.getBoundingClientRect();
            }, { passive: true });
            card.addEventListener('mousemove', e => {
                if (!cardRect) cardRect = card.getBoundingClientRect();
                const x = e.clientX - cardRect.left;
                const y = e.clientY - cardRect.top;
                
                if (cardRAF) cancelAnimationFrame(cardRAF);
                cardRAF = requestAnimationFrame(() => {
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);

                    const cardWidth = cardRect.width;
                    const cardHeight = cardRect.height;
                    const centerX = cardWidth / 2;
                    const centerY = cardHeight / 2;
                    
                    const rotateX = ((centerY - y) / (centerY || 1)) * 12;
                    const rotateY = ((x - centerX) / (centerX || 1)) * 12;

                    card.style.setProperty('--rotate-x', `${rotateX}deg`);
                    card.style.setProperty('--rotate-y', `${rotateY}deg`);
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                if (cardRAF) cancelAnimationFrame(cardRAF);
                cardRect = null;
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
            });

            // Initial center
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${rect.width > 0 ? rect.width / 2 : 90}px`);
            card.style.setProperty('--mouse-y', `${rect.height > 0 ? rect.height / 2 : 40}px`);
        });

        // 2. Interactive Marquee Country Filter & Laser Sweep
        if (filterBtns.length === 0) return;

        const scanner = document.getElementById('partnersLaserScanner');

        // Dynamic helper to map flag emoji to region code
        const getCardRegion = (card) => {
            const flagSpan = card.querySelector('.brand-flag');
            if (!flagSpan) return 'ROW';
            const flag = flagSpan.textContent.trim();
            
            if (flag === '🇮🇳') return 'IN';
            if (flag === '🇺🇸') return 'US';
            if (['🇬🇧', '🇵🇹', '🇩🇪'].includes(flag)) return 'EU';
            return 'ROW';
        };

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Trigger laser scan animation
                if (scanner) {
                    scanner.classList.remove('active');
                    void scanner.offsetWidth; // Trigger reflow to restart animation
                    scanner.classList.add('active');
                    
                    // Remove active class after animation finishes (1.2s)
                    setTimeout(() => {
                        scanner.classList.remove('active');
                    }, 1200);
                }

                // Toggle active button class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Apply filter states to all cards with animated transitions
                brandCards.forEach(card => {
                    const region = getCardRegion(card);

                    if (filter === 'all') {
                        card.classList.remove('highlighted', 'dimmed');
                    } else if (region === filter) {
                        card.classList.add('highlighted');
                        card.classList.remove('dimmed');
                    } else {
                        card.classList.add('dimmed');
                        card.classList.remove('highlighted');
                    }
                });
            });
        });

        // 3. Stats Count-Up Observer
        const countStats = document.querySelectorAll('.count-stat');
        if (countStats.length > 0) {
            const countObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const targetVal = parseInt(target.getAttribute('data-val'), 10);
                        if (isNaN(targetVal)) return;

                        let start = 0;
                        const duration = 1500; // 1.5s
                        const startTime = performance.now();

                        const updateCount = (currentTime) => {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            // Ease out quad
                            const easeProgress = progress * (2 - progress);
                            const currentVal = Math.floor(easeProgress * targetVal);

                            target.textContent = currentVal + (targetVal === 30 ? '+' : '');
                            
                            if (progress < 1) {
                                requestAnimationFrame(updateCount);
                            } else {
                                target.textContent = targetVal + (targetVal === 30 ? '+' : '');
                            }
                        };

                        requestAnimationFrame(updateCount);
                        observer.unobserve(target);
                    }
                });
            }, { threshold: 0.2 });

            countStats.forEach(stat => countObserver.observe(stat));
        }
    });
})();

/* ═══════════════════════════════════════════════════
   SITE-WIDE SOCIAL PROOF NOTIFICATIONS
   ═══════════════════════════════════════════════════ */
(function() {
    // Array of random social proof items
    const baseProofData = [
        { icon: '<i class="ph ph-tray-arrow-down"></i>', msg: '<strong>Vikram R.</strong> just booked a strategy call', time: '2 min ago' },
        { icon: '<i class="ph ph-trophy"></i>', msg: '<strong>Priya M.</strong> got a <strong>4.7x ROAS</strong> this month', time: '8 min ago' },
        { icon: '<i class="ph ph-star"></i>', msg: '<strong>Rahul S.</strong> left a 5-star review', time: '12 min ago' },
        { icon: '<i class="ph ph-target"></i>', msg: '<strong>UrbanKart</strong> generated <strong>247 leads</strong> this week', time: '18 min ago' },
        { icon: '<i class="ph ph-tray-arrow-down"></i>', msg: '<strong>Ananya T.</strong> just ran a site audit', time: '23 min ago' },
        { icon: '<i class="ph ph-rocket"></i>', msg: '<strong>StartupX</strong> launched campaign — <strong>+312% reach</strong>', time: '31 min ago' },
        { icon: '<i class="ph ph-briefcase"></i>', msg: '<strong>Neha K.</strong> from Mumbai booked a call', time: '45 min ago' },
        { icon: '<i class="ph ph-chart-bar"></i>', msg: '<strong>EduTech India</strong> scored <strong>89/100</strong> on audit', time: '1 hr ago' },
        { icon: '<i class="ph ph-star"></i>', msg: '<strong>Karan D.</strong> rated us 5 stars for Web Dev', time: '1 hr ago' },
        { icon: '<i class="ph ph-lightning"></i>', msg: '<strong>FreshBite</strong> saw <strong>+180% organic traffic</strong>', time: '2 hrs ago' },
        { icon: '<i class="ph ph-chat-circle"></i>', msg: '<strong>Sneha P.</strong> started a conversation', time: '3 hrs ago' },
        { icon: '<i class="ph ph-fire"></i>', msg: '<strong>FitLife Gym</strong> sold out their program', time: '5 hrs ago' }
    ];

    // Mix in any user-generated events from localStorage
    let localEvents = JSON.parse(localStorage.getItem('userProofEvents')) || [];
    let combinedProofData = [...localEvents, ...baseProofData];
    
    // Shuffle the array to make it feel random
    combinedProofData.sort(() => 0.5 - Math.random());

    let proofIndex = 0;
    
    function showProofToast() {
        const proofBar = document.getElementById('socialProofBar');
        if (!proofBar) return;
        
        // Refresh local events in case another tab updated them
        localEvents = JSON.parse(localStorage.getItem('userProofEvents')) || [];
        combinedProofData = [...localEvents, ...baseProofData];

        const item = combinedProofData[proofIndex % combinedProofData.length];
        proofIndex++;
        
        const toast = document.createElement('div');
        toast.className = 'proof-toast';
        toast.innerHTML = `<span class="proof-dot"></span><span class="toast-icon">${item.icon}</span><div><div>${item.msg}</div><div style="font-size:0.75rem;opacity:0.6;margin-top:2px;">${item.time}</div></div>`;
        
        proofBar.prepend(toast);
        
        // Remove after 6 seconds with a leaving animation
        setTimeout(() => {
            toast.classList.add('leaving');
            setTimeout(() => toast.remove(), 600); // wait for animation to finish
        }, 6000);
    }

    // Start showing toasts after a slight delay
    setTimeout(() => {
        showProofToast();
        // Show a new toast randomly between 6 and 14 seconds
        setInterval(() => {
            if(Math.random() > 0.3) { // 70% chance to show to prevent spamming
                showProofToast();
            }
        }, 8000);
    }, 2000);

    // Track user form submissions to create live local events
    document.addEventListener('submit', (e) => {
        let name = '';
        let action = 'interacted with a form';
        let icon = '<i class="ph ph-check-circle"></i>';

        // Check which form was submitted
        if (e.target.id === 'quoteForm') {
            name = document.getElementById('quoteName')?.value || 'Someone';
            action = 'requested a custom quote';
            icon = '<i class="ph ph-file-text"></i>';
        } else if (e.target.id === 'leadToastForm') {
            name = document.getElementById('leadName')?.value || 'Someone';
            action = 'claimed a free strategy call';
            icon = '<i class="ph ph-phone-call"></i>';
        } else {
            // Find any name input in the form
            const nameInput = e.target.querySelector('input[name*="name" i], input[id*="name" i]');
            if (nameInput) {
                name = nameInput.value;
                action = 'just submitted their details';
            }
        }

        if (name) {
            // Get just the first name and initial (e.g. Abhinash S.)
            const nameParts = name.trim().split(' ');
            const displayName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1].charAt(0)}.` : nameParts[0];
            
            const newEvent = {
                icon: icon,
                msg: `<strong>${displayName}</strong> ${action}`,
                time: 'Just now'
            };

            // Save to localStorage
            let currentEvents = JSON.parse(localStorage.getItem('userProofEvents')) || [];
            currentEvents.unshift(newEvent); // Add to beginning
            if(currentEvents.length > 3) currentEvents.pop(); // Keep only last 3
            localStorage.setItem('userProofEvents', JSON.stringify(currentEvents));
            
            // Show immediately
            setTimeout(() => {
                combinedProofData.unshift(newEvent);
                proofIndex = 0; // reset to show the new one next
                showProofToast();
            }, 1500);
        }
    });
})();

/* ===== INTERACTIVE AI ROI CALCULATOR LOGIC ===== */
(function initAiRoiCalculator() {
    function setupCalculator() {
        const slider = document.getElementById('roiSpendSlider');
        const spendDisplay = document.getElementById('calcSpendDisplay');
        const wasteSaved = document.getElementById('calcWasteSaved');
        const targetRoas = document.getElementById('calcTargetRoas');
        const projectedRev = document.getElementById('calcProjectedRevenue');
        const industryButtons = document.querySelectorAll('#industryPills .industry-btn');

        if (!slider || !spendDisplay || !wasteSaved || !targetRoas || !projectedRev) {
            return;
        }

        let currentMultiplier = 4.5;
        let currentWasteRatio = 0.32;

        function formatCurrency(amount) {
            return '₹' + Number(Math.round(amount)).toLocaleString('en-IN');
        }

        function updateEstimates() {
            const spend = parseFloat(slider.value) || 500000;
            spendDisplay.textContent = formatCurrency(spend);

            const waste = spend * currentWasteRatio;
            const revenue = spend * currentMultiplier;

            wasteSaved.textContent = formatCurrency(waste);
            targetRoas.textContent = currentMultiplier.toFixed(1) + 'x';
            projectedRev.textContent = formatCurrency(revenue);
        }

        slider.addEventListener('input', updateEstimates);

        industryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                industryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMultiplier = parseFloat(btn.dataset.multiplier) || 4.5;
                currentWasteRatio = parseFloat(btn.dataset.waste) || 0.32;
                updateEstimates();
            });
        });

        updateEstimates();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupCalculator);
    } else {
        setupCalculator();
    }
})();

// ===== INTERACTIVE SERVICE TABS FILTER (SERVICES.HTML) =====
(function initServiceTabsFilter() {
    function setupTabs() {
        const tabsWrapper = document.getElementById('serviceTabs');
        const grid = document.getElementById('servicesGrid');
        if (!tabsWrapper || !grid) return;

        const tabs = tabsWrapper.querySelectorAll('.service-tab-btn');
        const cards = grid.querySelectorAll('.service-card-item');

        function applyFilter(category) {
            tabs.forEach(t => {
                if (t.dataset.filter === category) {
                    t.classList.add('active');
                } else {
                    t.classList.remove('active');
                }
            });

            if (category === 'all') {
                grid.classList.remove('single-view');
                cards.forEach(card => {
                    card.style.display = 'flex';
                });
            } else {
                grid.classList.add('single-view');
                cards.forEach(card => {
                    const cardCat = card.dataset.category || '';
                    if (cardCat === category || cardCat.split(' ').includes(category)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.dataset.filter;
                applyFilter(filter);
                if (filter !== 'all') {
                    history.replaceState(null, null, '#' + filter);
                } else {
                    history.replaceState(null, null, ' ');
                }
            });
        });

        // URL hash support (e.g. services.html#marketing or services.html#web-dev)
        const hash = window.location.hash.replace('#', '').trim();
        if (hash) {
            const matchTab = Array.from(tabs).find(t => t.dataset.filter === hash || ('service-' + t.dataset.filter) === hash);
            if (matchTab) {
                applyFilter(matchTab.dataset.filter);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupTabs);
    } else {
        setupTabs();
    }
})();

// ===== LIVE DASHBOARDS INTERACTION (INSTAGRAM & ADS MANAGER) =====
(function () {
    const igData = {
        overview: {
            url: 'instagram.com/insights/overview',
            html: `
                <div class="ig-kpis">
                    <div class="ig-kpi"><div class="label">Accounts reached</div><div class="val">1.84L</div><div class="delta">▲ 96% vs last period</div></div>
                    <div class="ig-kpi"><div class="label">DM booking inquiries</div><div class="val">318</div><div class="delta">▲ 74%</div></div>
                    <div class="ig-kpi"><div class="label">Followers gained</div><div class="val">+6,812</div><div class="delta">▲ 143%</div></div>
                    <div class="ig-kpi"><div class="label">Engagement rate</div><div class="val">7.4%</div><div class="delta">▲ 2.1 pts</div></div>
                </div>
                <div class="ig-chart-card">
                    <div class="chart-scanner"></div>
                    <div class="ig-chart-head">
                        <h4>Accounts reached — organic only</h4>
                        <div class="ig-legend"><span><i></i>This period (Live)</span></div>
                    </div>
                    <svg viewBox="0 0 600 140" width="100%" height="140" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="igFillNew" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#ee2a7b" stop-opacity="0.32" />
                                <stop offset="100%" stop-color="#ee2a7b" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                        <polygon points="0,120 60,110 120,116 180,95 240,88 300,70 360,74 420,50 480,40 540,22 600,14 600,140 0,140" fill="url(#igFillNew)" />
                        <polyline class="chart-line-anim" points="0,120 60,110 120,116 180,95 240,88 300,70 360,74 420,50 480,40 540,22 600,14" fill="none" stroke="#ee2a7b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="600" cy="14" r="5" fill="#ee2a7b" style="filter: drop-shadow(0 0 6px #ee2a7b);" />
                    </svg>
                </div>
                <div class="ig-posts-head">
                    <h4>Top performing health content this month</h4>
                    <span style="font-size:0.75rem; color:#8a8f98;">High-retention reels</span>
                </div>
                <div class="ig-posts">
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/gut_health.jpeg" alt="5 gut-health myths" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/content_dashboard_1.jpeg" alt="Content Dashboard" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/educational_video.jpeg" alt="Educational Video" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/reels_analytics.jpeg" alt="Reels Analytics" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/gut_health.jpeg" alt="5 gut-health myths" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>42.1K reach · "5 gut-health myths"</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-play"></i> 89.2% retention</div>
                        </div>
                    </div>
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/hormone_quiz.jpeg" alt="Free assessment reel" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/ads_analytics.jpeg" alt="Ads Analytics" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/content_dashboard_2.jpeg" alt="Content Metrics" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/marketing_results.jpeg" alt="Marketing Results" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/hormone_quiz.jpeg" alt="Free assessment reel" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>38.7K reach · Free assessment reel</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-chats"></i> 142 DMs triggered</div>
                        </div>
                    </div>
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/client_transformation.jpeg" alt="Client transformation" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/doctor_consultation.jpeg" alt="Doctor Consultation" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/video_retention.jpeg" alt="Video Retention" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/marketing_results.jpeg" alt="Clinic Growth" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/client_transformation.jpeg" alt="Client transformation" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>31.4K reach · Client transformation</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-heart"></i> 1.8k saves</div>
                        </div>
                    </div>
                </div>
            `
        },
        content: {
            url: 'instagram.com/insights/content',
            html: `
                <div class="ig-kpis">
                    <div class="ig-kpi"><div class="label">Reels published</div><div class="val">28</div><div class="delta">▲ 12 this month</div></div>
                    <div class="ig-kpi"><div class="label">Avg 3s retention</div><div class="val">84.6%</div><div class="delta">▲ 18.2 pts</div></div>
                    <div class="ig-kpi"><div class="label">Total video plays</div><div class="val">6.42L</div><div class="delta">▲ 182%</div></div>
                    <div class="ig-kpi"><div class="label">Avg watch duration</div><div class="val">24.8s</div><div class="delta">▲ 6.2s longer</div></div>
                </div>
                <div class="ig-posts-head">
                    <h4>Top Hook Performance &amp; Video Retention</h4>
                    <span style="font-size:0.75rem; color:#8a8f98;">Sorted by patient conversions</span>
                </div>
                <div class="ig-posts">
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/educational_video.jpeg" alt="5 Signs Of Cortisol Spike" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/video_retention.jpeg" alt="Retention Analytics" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/content_dashboard_1.jpeg" alt="Top Content" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/gut_health.jpeg" alt="Gut Health Guide" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/educational_video.jpeg" alt="5 Signs Of Cortisol Spike" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>82.4K views · "5 Signs Of Cortisol Spike"</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-play"></i> 91.2% hook · 642 shares</div>
                        </div>
                    </div>
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/gut_health.jpeg" alt="What I Eat As Functional MD" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/reels_analytics.jpeg" alt="Reels Metrics" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/hormone_quiz.jpeg" alt="Patient Assessment" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/content_dashboard_2.jpeg" alt="Audience Growth" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/gut_health.jpeg" alt="What I Eat As Functional MD" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>54.9K views · "What I Eat As Functional MD"</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-chats"></i> 142 DMs · 88.4% ret</div>
                        </div>
                    </div>
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/client_transformation.jpeg" alt="Why Weight Won't Budge" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/doctor_consultation.jpeg" alt="Doctor Consultation" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/ads_analytics.jpeg" alt="Ads Dashboard" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/marketing_results.jpeg" alt="Marketing ROI" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/client_transformation.jpeg" alt="Why Weight Won't Budge" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>76.1K views · "Why Weight Won't Budge"</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-bookmark-simple"></i> 1.8K saves · 418 DMs</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top:20px; background:#fafafa; border:1px solid #eeeeee; border-radius:14px; padding:18px 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h4 style="font-size:0.92rem; font-weight:700; color:#111827; font-family:'Space Grotesk',sans-serif; margin:0;">Content Format Breakdown</h4>
                        <span style="font-size:0.75rem; color:#8a8f98;">High conversion split</span>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; text-align:left;">
                        <div style="background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:12px;">
                            <div style="font-size:0.75rem; color:#6b7280; font-weight:600;">Reels (Short-Form)</div>
                            <div style="font-size:1.15rem; font-weight:800; color:#111827; margin:4px 0;">6,42,000</div>
                            <div style="font-size:0.72rem; color:var(--green); font-weight:600;">84.6% avg completion</div>
                        </div>
                        <div style="background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:12px;">
                            <div style="font-size:0.75rem; color:#6b7280; font-weight:600;">Carousels (Guides)</div>
                            <div style="font-size:1.15rem; font-weight:800; color:#111827; margin:4px 0;">84,100</div>
                            <div style="font-size:0.72rem; color:var(--green); font-weight:600;">14.2% save rate</div>
                        </div>
                        <div style="background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:12px;">
                            <div style="font-size:0.75rem; color:#6b7280; font-weight:600;">Daily Stories</div>
                            <div style="font-size:1.15rem; font-weight:800; color:#111827; margin:4px 0;">14,800/day</div>
                            <div style="font-size:0.72rem; color:var(--green); font-weight:600;">8.9% calendar CTR</div>
                        </div>
                    </div>
                </div>
            `
        },
        audience: {
            url: 'instagram.com/insights/audience',
            html: `
                <div class="ig-kpis">
                    <div class="ig-kpi"><div class="label">Total followers</div><div class="val">42,850</div><div class="delta">▲ +6,812 this month</div></div>
                    <div class="ig-kpi"><div class="label">Core target age (25–44)</div><div class="val">78.4%</div><div class="delta">▲ High purchasing power</div></div>
                    <div class="ig-kpi"><div class="label">Primary city</div><div class="val">Bengaluru</div><div class="delta">44% clinic catchment</div></div>
                    <div class="ig-kpi"><div class="label">Peak active window</div><div class="val">7 – 10:30 PM</div><div class="delta">▲ 18.2K active online</div></div>
                </div>
                <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:16px;">
                    <div style="background:#fafafa; border:1px solid #eeeeee; border-radius:14px; padding:20px;">
                        <h4 style="font-size:0.92rem; font-weight:700; color:#111827; font-family:'Space Grotesk',sans-serif; margin-bottom:14px;">Age &amp; Gender Demographics</h4>
                        <div class="demo-bar-group">
                            <div class="demo-bar-header"><span>25–34 years (Young Professionals)</span><span>52%</span></div>
                            <div class="demo-bar-track"><div class="demo-bar-fill" style="width:52%;"></div></div>
                        </div>
                        <div class="demo-bar-group">
                            <div class="demo-bar-header"><span>35–44 years (High HNI Families)</span><span>26%</span></div>
                            <div class="demo-bar-track"><div class="demo-bar-fill" style="width:26%;"></div></div>
                        </div>
                        <div class="demo-bar-group">
                            <div class="demo-bar-header"><span>18–24 years (Students &amp; Early Career)</span><span>14%</span></div>
                            <div class="demo-bar-track"><div class="demo-bar-fill" style="width:14%; background:#cbd5e1;"></div></div>
                        </div>
                        <div class="demo-bar-group">
                            <div class="demo-bar-header"><span>45+ years (Executive Health)</span><span>8%</span></div>
                            <div class="demo-bar-track"><div class="demo-bar-fill" style="width:8%; background:#cbd5e1;"></div></div>
                        </div>
                        <div style="margin-top:16px; padding-top:12px; border-top:1px dashed #e5e7eb; display:flex; justify-content:space-between; font-size:0.8rem; color:#4b5563;">
                            <span><strong style="color:#ee2a7b;">68%</strong> Female</span>
                            <span><strong style="color:#3b82f6;">32%</strong> Male</span>
                            <span style="color:#10b981; font-weight:600;"><i class="ph-bold ph-shield-check"></i> 99.4% Verified India</span>
                        </div>
                    </div>

                    <div style="background:#fafafa; border:1px solid #eeeeee; border-radius:14px; padding:20px;">
                        <h4 style="font-size:0.92rem; font-weight:700; color:#111827; font-family:'Space Grotesk',sans-serif; margin-bottom:14px;">Top Metro Catchment</h4>
                        <div class="demo-bar-group">
                            <div class="demo-bar-header"><span>Bengaluru (Indiranagar, Koramangala)</span><span>44%</span></div>
                            <div class="demo-bar-track"><div class="demo-bar-fill" style="width:44%; background:var(--accent-teal);"></div></div>
                        </div>
                        <div class="demo-bar-group">
                            <div class="demo-bar-header"><span>Mumbai (Bandra, BKC, Powai)</span><span>22%</span></div>
                            <div class="demo-bar-track"><div class="demo-bar-fill" style="width:22%; background:var(--accent-teal);"></div></div>
                        </div>
                        <div class="demo-bar-group">
                            <div class="demo-bar-header"><span>Delhi NCR (Gurugram, South Delhi)</span><span>16%</span></div>
                            <div class="demo-bar-track"><div class="demo-bar-fill" style="width:16%; background:var(--accent-teal);"></div></div>
                        </div>
                        <div class="demo-bar-group">
                            <div class="demo-bar-header"><span>Hyderabad &amp; Pune</span><span>11%</span></div>
                            <div class="demo-bar-track"><div class="demo-bar-fill" style="width:11%; background:var(--accent-teal);"></div></div>
                        </div>
                        <div style="margin-top:16px; font-size:0.76rem; color:#6b7280; display:flex; align-items:center; gap:6px;">
                            <i class="ph-fill ph-map-pin" style="color:#ef4444;"></i> Zero spam or bot followers — 100% targeted metro reach.
                        </div>
                    </div>
                </div>
            `
        },
        ads: {
            url: 'instagram.com/insights/ads',
            html: `
                <div class="ig-kpis">
                    <div class="ig-kpi"><div class="label">Organic boosted reach</div><div class="val">94,200</div><div class="delta">Direct into profile grid</div></div>
                    <div class="ig-kpi"><div class="label">Profile visits from ads</div><div class="val">4,810</div><div class="delta">▲ 124% increase</div></div>
                    <div class="ig-kpi"><div class="label">Cost per profile visit</div><div class="val">₹2.10</div><div class="delta">▼ Ultra-low CAC</div></div>
                    <div class="ig-kpi"><div class="label">Patient DM triggers</div><div class="val">186 DMs</div><div class="delta">▲ ₹26.4 per patient DM</div></div>
                </div>
                <div class="ig-posts-head">
                    <h4>Active Instagram Boosted Posts &amp; Amplification</h4>
                    <span style="font-size:0.75rem; color:#8a8f98;">Meta Ads integration</span>
                </div>
                <div class="ig-posts">
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/hormone_quiz.jpeg" alt="Free Hormone Quiz" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/ads_analytics.jpeg" alt="Campaign Ads" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/content_dashboard_1.jpeg" alt="Creative Analytics" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/reels_analytics.jpeg" alt="Reels Conversions" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/hormone_quiz.jpeg" alt="Free Hormone Quiz" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>₹4,800 spent · "Free Hormone Quiz"</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-chats"></i> 194 DMs · ₹24.7/lead</div>
                        </div>
                    </div>
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/gut_health.jpeg" alt="Gut Reset 7-Day Guide" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/content_dashboard_2.jpeg" alt="Lead Form" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/marketing_results.jpeg" alt="Patient Reach" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/educational_video.jpeg" alt="Health Video" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/gut_health.jpeg" alt="Gut Reset 7-Day Guide" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>₹3,500 spent · "Gut Reset 7-Day Guide"</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-user"></i> 1,480 profile visits</div>
                        </div>
                    </div>
                    <div class="ig-post ig-carousel">
                        <div class="ig-slider-track">
                            <div class="ig-slide"><img src="Insights/doctor_consultation.jpeg" alt="Doctor Consultation Promo" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/video_retention.jpeg" alt="Video Retention" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/client_transformation.jpeg" alt="Consultation Result" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/ads_analytics.jpeg" alt="Ad ROI" loading="lazy"></div>
                            <div class="ig-slide"><img src="Insights/doctor_consultation.jpeg" alt="Doctor Consultation Promo" loading="lazy"></div>
                        </div>
                        <div class="ig-carousel-badge"><i class="ph-fill ph-stack"></i> 1/4</div>
                        <div class="ig-post-overlay">
                            <span>₹5,200 spent · "Doctor Consultation Promo"</span>
                            <div class="ig-post-badge"><i class="ph-bold ph-calendar-check"></i> 86 clinic bookings</div>
                        </div>
                    </div>
                </div>
            `
        },
        saved: {
            url: 'instagram.com/insights/saved',
            html: `
                <div class="ig-kpis">
                    <div class="ig-kpi"><div class="label">Total content saves</div><div class="val">8,940</div><div class="delta">▲ 210% vs last month</div></div>
                    <div class="ig-kpi"><div class="label">Save-to-reach ratio</div><div class="val">12.8%</div><div class="delta">▲ 3.4x industry average</div></div>
                    <div class="ig-kpi"><div class="label">High-intent bookmarks</div><div class="val">4,120</div><div class="delta">▲ Warm clinical leads</div></div>
                    <div class="ig-kpi"><div class="label">Evergreen shares</div><div class="val">3,180</div><div class="delta">▲ Compounding traffic</div></div>
                </div>
                <div style="background:#fafafa; border:1px solid #eeeeee; border-radius:14px; padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <h4 style="font-size:0.92rem; font-weight:700; color:#111827; font-family:'Space Grotesk',sans-serif; margin:0;">Most Bookmarked Clinical Resource Guides</h4>
                        <span style="font-size:0.75rem; color:#8a8f98;">Algorithm signals of authority</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:#fff; border:1px solid #e5e7eb; border-radius:10px;">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="ig-thumb-slider">
                                    <div class="ig-thumb-slider-track">
                                        <div class="ig-thumb-slide"><img src="Insights/gut_health.jpeg" alt="Meal Guide" loading="lazy"></div>
                                        <div class="ig-thumb-slide"><img src="Insights/content_dashboard_1.jpeg" alt="Meal Chart" loading="lazy"></div>
                                        <div class="ig-thumb-slide"><img src="Insights/educational_video.jpeg" alt="Nutrition Video" loading="lazy"></div>
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size:0.86rem; font-weight:700; color:#111827;">"The 7-Day Anti-Inflammatory Meal Cheat Sheet"</div>
                                    <div style="font-size:0.74rem; color:#6b7280;">Carousel post · 41.2% save-to-view ratio</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:0.92rem; font-weight:800; color:#111827;">3,410 saves</div>
                                <div style="font-size:0.72rem; color:var(--green); font-weight:600;">+840 this week</div>
                            </div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:#fff; border:1px solid #e5e7eb; border-radius:10px;">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="ig-thumb-slider">
                                    <div class="ig-thumb-slider-track" style="animation-delay: -3s;">
                                        <div class="ig-thumb-slide"><img src="Insights/hormone_quiz.jpeg" alt="Lab Markers" loading="lazy"></div>
                                        <div class="ig-thumb-slide"><img src="Insights/reels_analytics.jpeg" alt="Blood Analysis" loading="lazy"></div>
                                        <div class="ig-thumb-slide"><img src="Insights/content_dashboard_2.jpeg" alt="Hormone Report" loading="lazy"></div>
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size:0.86rem; font-weight:700; color:#111827;">"Thyroid &amp; PCOD Blood Markers Interpretation"</div>
                                    <div style="font-size:0.74rem; color:#6b7280;">Infographic guide · 36.4% save rate</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:0.92rem; font-weight:800; color:#111827;">2,840 saves</div>
                                <div style="font-size:0.72rem; color:var(--green); font-weight:600;">+620 this week</div>
                            </div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:#fff; border:1px solid #e5e7eb; border-radius:10px;">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div class="ig-thumb-slider">
                                    <div class="ig-thumb-slider-track" style="animation-delay: -6s;">
                                        <div class="ig-thumb-slide"><img src="Insights/doctor_consultation.jpeg" alt="Doctor Advice" loading="lazy"></div>
                                        <div class="ig-thumb-slide"><img src="Insights/video_retention.jpeg" alt="Mineral Guide" loading="lazy"></div>
                                        <div class="ig-thumb-slide"><img src="Insights/marketing_results.jpeg" alt="Clinical Evidence" loading="lazy"></div>
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size:0.86rem; font-weight:700; color:#111827;">"5 Magnesium Forms &amp; Which One You Actually Need"</div>
                                    <div style="font-size:0.74rem; color:#6b7280;">Reel save trigger · 31.8% save rate</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:0.92rem; font-weight:800; color:#111827;">2,690 saves</div>
                                <div style="font-size:0.72rem; color:var(--green); font-weight:600;">+490 this week</div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    };

    const adsData = {
        campaigns: {
            title: 'Campaigns — Dr. Meera Wellness Clinic',
            url: 'adsmanager.facebook.com/campaigns',
            html: `
                <div class="ads-kpis">
                    <div class="ads-kpi"><div class="label">Amount spent</div><div class="val">₹4,78,100</div><div class="delta up">▲ on pace</div></div>
                    <div class="ads-kpi"><div class="label">Bookings + B2B leads</div><div class="val">654</div><div class="delta up">▲ 44%</div></div>
                    <div class="ads-kpi"><div class="label">Cost per result</div><div class="val">₹731</div><div class="delta up">▼ 18% cheaper</div></div>
                    <div class="ads-kpi"><div class="label">Lead → booked call rate</div><div class="val">61%</div><div class="delta up">▲ 9 pts</div></div>
                </div>
                <div class="ads-table-wrap overflow-safe">
                    <table>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Status</th>
                                <th>Results</th>
                                <th>Reach</th>
                                <th>Cost / result</th>
                                <th>Amount spent</th>
                                <th>Live Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="camp-name">Doctor consultation booking — Retargeting</div>
                                    <div class="camp-sub">Conversions · Call &amp; calendar bookings</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>286 bookings</strong></td>
                                <td>1.10L</td>
                                <td>₹410</td>
                                <td>₹1,17,300</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:30%"></span><span style="height:45%"></span><span style="height:40%"></span><span style="height:60%"></span><span style="height:55%"></span><span style="height:80%"></span><span style="height:95%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">B2B corporate wellness — Lead gen</div>
                                    <div class="camp-sub">Lead form · Targeting HR &amp; L&amp;D decision-makers</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>96 leads</strong></td>
                                <td>2.40L</td>
                                <td>₹1,850</td>
                                <td>₹1,77,600</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:40%"></span><span style="height:35%"></span><span style="height:50%"></span><span style="height:48%"></span><span style="height:65%"></span><span style="height:70%"></span><span style="height:88%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Free consultation funnel</div>
                                    <div class="camp-sub">Traffic + Leads · Patient acquisition</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>214 leads</strong></td>
                                <td>1.68L</td>
                                <td>₹520</td>
                                <td>₹1,11,280</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:50%"></span><span style="height:55%"></span><span style="height:45%"></span><span style="height:60%"></span><span style="height:58%"></span><span style="height:72%"></span><span style="height:80%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Employee wellness webinar</div>
                                    <div class="camp-sub">B2B lead gen · Corporate HR audience</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>58 leads</strong></td>
                                <td>92.4K</td>
                                <td>₹1,240</td>
                                <td>₹71,920</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:25%"></span><span style="height:38%"></span><span style="height:30%"></span><span style="height:50%"></span><span style="height:62%"></span><span style="height:58%"></span><span style="height:75%"></span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        adsets: {
            title: 'Ad Sets (12 Active) — Dr. Meera Wellness Clinic',
            url: 'adsmanager.facebook.com/adsets',
            html: `
                <div class="ads-kpis">
                    <div class="ads-kpi"><div class="label">Active Ad Sets</div><div class="val">12 of 12</div><div class="delta up">▲ 100% healthy delivery</div></div>
                    <div class="ads-kpi"><div class="label">Avg CPM</div><div class="val">₹142</div><div class="delta up">▼ 22% vs benchmark</div></div>
                    <div class="ads-kpi"><div class="label">Avg CTR (Link click)</div><div class="val">3.84%</div><div class="delta up">▲ Top 5% in category</div></div>
                    <div class="ads-kpi"><div class="label">Frequency</div><div class="val">1.42</div><div class="delta up">✔ Zero ad fatigue</div></div>
                </div>
                <div class="ads-table-wrap overflow-safe">
                    <table>
                        <thead>
                            <tr>
                                <th>Ad Set Name</th>
                                <th>Status</th>
                                <th>Results</th>
                                <th>Reach</th>
                                <th>Cost / result</th>
                                <th>Daily Budget</th>
                                <th>Live Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="camp-name">Lookalike 1% — Past Clinic Patients (High LTV)</div>
                                    <div class="camp-sub">Custom Audience Seed · 180-Day CRM Patient Sync</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>142 bookings</strong></td>
                                <td>58.4K</td>
                                <td>₹380</td>
                                <td>₹4,500/day</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:35%"></span><span style="height:50%"></span><span style="height:65%"></span><span style="height:55%"></span><span style="height:80%"></span><span style="height:90%"></span><span style="height:95%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Retargeting 30D — IG Engagers &amp; Profile Visitors</div>
                                    <div class="camp-sub">CAPI Pixel + Profile Interactions · Highest Intent</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>98 bookings</strong></td>
                                <td>32.1K</td>
                                <td>₹340</td>
                                <td>₹3,000/day</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:45%"></span><span style="height:40%"></span><span style="height:60%"></span><span style="height:70%"></span><span style="height:75%"></span><span style="height:88%"></span><span style="height:100%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">B2B Enterprise HR &amp; People Heads — BLR &amp; NCR</div>
                                    <div class="camp-sub">Tech Parks &amp; Corporate Corridors · L&amp;D Decision Makers</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>54 leads</strong></td>
                                <td>84.6K</td>
                                <td>₹1,680</td>
                                <td>₹6,000/day</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:30%"></span><span style="height:42%"></span><span style="height:48%"></span><span style="height:56%"></span><span style="height:68%"></span><span style="height:72%"></span><span style="height:85%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Broad Match — Women 28-48 Gut &amp; Hormonal Health</div>
                                    <div class="camp-sub">Advantage+ Targeting · AI Dynamic Creative Engine</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>164 leads</strong></td>
                                <td>98.2K</td>
                                <td>₹490</td>
                                <td>₹5,000/day</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:50%"></span><span style="height:55%"></span><span style="height:50%"></span><span style="height:65%"></span><span style="height:70%"></span><span style="height:82%"></span><span style="height:90%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Corporate Wellbeing Managers — Mumbai &amp; Hyderabad</div>
                                    <div class="camp-sub">Annual Executive Health &amp; Stress Management Funnel</div>
                                </td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>42 leads</strong></td>
                                <td>46.8K</td>
                                <td>₹1,920</td>
                                <td>₹3,500/day</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:25%"></span><span style="height:35%"></span><span style="height:40%"></span><span style="height:52%"></span><span style="height:60%"></span><span style="height:65%"></span><span style="height:78%"></span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        ads: {
            title: 'Ads (36 Creatives) — Dr. Meera Wellness Clinic',
            url: 'adsmanager.facebook.com/ads',
            html: `
                <div class="ads-kpis">
                    <div class="ads-kpi"><div class="label">Active Creatives</div><div class="val">36 Active</div><div class="delta up">▲ A/B testing multi-hook</div></div>
                    <div class="ads-kpi"><div class="label">Avg Hook Rate (3s)</div><div class="val">46.2%</div><div class="delta up">▲ High thumb-stop</div></div>
                    <div class="ads-kpi"><div class="label">Hold Rate (ThruPlay)</div><div class="val">34.8%</div><div class="delta up">▲ Top tier retention</div></div>
                    <div class="ads-kpi"><div class="label">Winning ROAS</div><div class="val">5.4x</div><div class="delta up">▲ Outperforming target</div></div>
                </div>
                <div class="ads-table-wrap overflow-safe">
                    <table>
                        <thead>
                            <tr>
                                <th>Ad Creative</th>
                                <th>Format</th>
                                <th>Status</th>
                                <th>CTR (Link)</th>
                                <th>Results</th>
                                <th>Amount spent</th>
                                <th>Live Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="camp-name">"Why your thyroid medicine isn't fixing fatigue"</div>
                                    <div class="camp-sub">Hook: Stethoscope visual + Root cause cellular analysis</div>
                                </td>
                                <td><span class="rule-tag">Reel (9:16)</span></td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>4.62%</strong></td>
                                <td>182 consults</td>
                                <td>₹68,400</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:40%"></span><span style="height:55%"></span><span style="height:60%"></span><span style="height:75%"></span><span style="height:80%"></span><span style="height:90%"></span><span style="height:95%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">"5 Blood Markers Your Regular Doctor Ignores"</div>
                                    <div class="camp-sub">Carousel: Lab report breakdown + Symptom correlation</div>
                                </td>
                                <td><span class="rule-tag">Carousel (1:1)</span></td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>4.15%</strong></td>
                                <td>126 consults</td>
                                <td>₹48,200</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:30%"></span><span style="height:45%"></span><span style="height:50%"></span><span style="height:65%"></span><span style="height:70%"></span><span style="height:82%"></span><span style="height:88%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">"How Swiggy &amp; Infosys HR cut sick days 32%"</div>
                                    <div class="camp-sub">B2B Case Study: ROI model for enterprise leadership</div>
                                </td>
                                <td><span class="rule-tag">B2B Video</span></td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>3.20%</strong></td>
                                <td>58 B2B leads</td>
                                <td>₹84,200</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:35%"></span><span style="height:40%"></span><span style="height:55%"></span><span style="height:60%"></span><span style="height:70%"></span><span style="height:75%"></span><span style="height:82%"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">"PCOS reversed after 6 years — Patient Deep Dive"</div>
                                    <div class="camp-sub">Patient Testimonial Reel: Before/after ultrasound &amp; labs</div>
                                </td>
                                <td><span class="rule-tag">UGC Video</span></td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                                <td><strong>4.88%</strong></td>
                                <td>144 consults</td>
                                <td>₹51,840</td>
                                <td>
                                    <div class="spark">
                                        <span style="height:50%"></span><span style="height:60%"></span><span style="height:55%"></span><span style="height:70%"></span><span style="height:80%"></span><span style="height:88%"></span><span style="height:98%"></span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        audiences: {
            title: 'Audiences & Pixel Telemetry — Dr. Meera Wellness Clinic',
            url: 'adsmanager.facebook.com/audiences',
            html: `
                <div class="ads-kpis">
                    <div class="ads-kpi"><div class="label">Custom Audience Pools</div><div class="val">8 Active</div><div class="delta up">▲ Auto-refreshing</div></div>
                    <div class="ads-kpi"><div class="label">Meta Pixel Health</div><div class="val">99.2%</div><div class="delta up">✔ Conversions API (CAPI)</div></div>
                    <div class="ads-kpi"><div class="label">Addressable Reach</div><div class="val">1.84M</div><div class="delta up">▲ High match rate</div></div>
                    <div class="ads-kpi"><div class="label">Event Match Quality</div><div class="val">9.1 / 10</div><div class="delta up">✔ Server-side deduplicated</div></div>
                </div>
                <div class="ads-table-wrap overflow-safe">
                    <table>
                        <thead>
                            <tr>
                                <th>Audience Name</th>
                                <th>Type</th>
                                <th>Est. Size</th>
                                <th>Match Quality</th>
                                <th>Status</th>
                                <th>Last Synced</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="camp-name">Past Clinic Patients &amp; Consultation Bookings</div>
                                    <div class="camp-sub">CRM Database Sync (Phone + Email SHA-256 hash)</div>
                                </td>
                                <td><span class="rule-tag">Custom Audience</span></td>
                                <td><strong>14,200</strong></td>
                                <td><span style="color:var(--green); font-weight:700;">94% Match</span></td>
                                <td><span class="status-pill"><i></i>Ready</span></td>
                                <td>2 hours ago</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">High-Intent Instagram Engagers (365 Days)</div>
                                    <div class="camp-sub">Saved posts, DMs, reel shares, profile interactions</div>
                                </td>
                                <td><span class="rule-tag">Engagement Pool</span></td>
                                <td><strong>1,84,000</strong></td>
                                <td><span style="color:var(--green); font-weight:700;">100% Meta Direct</span></td>
                                <td><span class="status-pill"><i></i>Live Stream</span></td>
                                <td>Real-time</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Lookalike (1% India) — High-Value Wellness Clients</div>
                                    <div class="camp-sub">Algorithmic clone of top ₹50k+ program buyers</div>
                                </td>
                                <td><span class="rule-tag">Lookalike 1%</span></td>
                                <td><strong>5,40,000</strong></td>
                                <td><span style="color:var(--green); font-weight:700;">Top 1% Precision</span></td>
                                <td><span class="status-pill"><i></i>Ready</span></td>
                                <td>Auto-refresh</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Corporate HR, CHRO &amp; Talent Operations Leaders</div>
                                    <div class="camp-sub">B2B Verified Job Titles &amp; Company Headcount &gt; 250</div>
                                </td>
                                <td><span class="rule-tag">B2B Saved Target</span></td>
                                <td><strong>3,20,000</strong></td>
                                <td><span style="color:var(--green); font-weight:700;">Verified B2B</span></td>
                                <td><span class="status-pill"><i></i>Ready</span></td>
                                <td>1 day ago</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Website Consultation Drop-offs (Last 60 Days)</div>
                                    <div class="camp-sub">Visited Booking Page without Calendly completion</div>
                                </td>
                                <td><span class="rule-tag">Meta CAPI Pixel</span></td>
                                <td><strong>68,000</strong></td>
                                <td><span style="color:var(--green); font-weight:700;">96% Match</span></td>
                                <td><span class="status-pill"><i></i>Live Stream</span></td>
                                <td>Real-time</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        rules: {
            title: 'Autonomous AI Execution Rules — Dr. Meera Wellness Clinic',
            url: 'adsmanager.facebook.com/automated-rules',
            html: `
                <div class="ads-kpis">
                    <div class="ads-kpi"><div class="label">Active AI Rules</div><div class="val">14 Running</div><div class="delta up">▲ 24/7 Autonomous guard</div></div>
                    <div class="ads-kpi"><div class="label">Actions Triggered (7D)</div><div class="val">38 Actions</div><div class="delta up">✔ Zero wasted ad spend</div></div>
                    <div class="ads-kpi"><div class="label">Budget Protected</div><div class="val">₹46,200</div><div class="delta up">▼ Cut loss early</div></div>
                    <div class="ads-kpi"><div class="label">Scale Velocity</div><div class="val">+20% / 48h</div><div class="delta up">▲ On profitable ads</div></div>
                </div>
                <div class="ads-table-wrap overflow-safe">
                    <table>
                        <thead>
                            <tr>
                                <th>Rule Description</th>
                                <th>Logic Condition</th>
                                <th>Autonomous Action</th>
                                <th>Target Scope</th>
                                <th>Triggers (7D)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="camp-name">Auto-Stop Inefficient Ad Sets</div>
                                    <div class="camp-sub">Strict loss-prevention circuit breaker</div>
                                </td>
                                <td><span class="rule-tag">Cost/Lead &gt; ₹900 (72h)</span></td>
                                <td><strong style="color:#ef4444;">Pause Ad Set</strong></td>
                                <td>12 Ad Sets</td>
                                <td>4 times</td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Auto-Scale High-ROAS Winners</div>
                                    <div class="camp-sub">Autonomous profit maximization</div>
                                </td>
                                <td><span class="rule-tag">ROAS &gt; 4.0x &amp; Leads &gt; 8</span></td>
                                <td><strong style="color:var(--green);">+20% Daily Budget</strong></td>
                                <td>All Active Sets</td>
                                <td>12 times</td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">Creative Fatigue Protection</div>
                                    <div class="camp-sub">Prevents audience burn &amp; rising CPMs</div>
                                </td>
                                <td><span class="rule-tag">Frequency &gt; 2.8 &amp; CTR &lt; 1.8%</span></td>
                                <td><strong>Notify Team &amp; Throttle</strong></td>
                                <td>36 Creatives</td>
                                <td>2 times</td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="camp-name">B2B CPL Early Warning Relay</div>
                                    <div class="camp-sub">Instant Slack ping to growth account director</div>
                                </td>
                                <td><span class="rule-tag">B2B Cost/Lead &gt; ₹2,200</span></td>
                                <td><strong>Slack Urgent Alert</strong></td>
                                <td>B2B Funnels</td>
                                <td>1 time</td>
                                <td><span class="status-pill"><i></i>Active</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        billing: {
            title: 'Billing, Invoices & Payment Methods — Dr. Meera Wellness Clinic',
            url: 'adsmanager.facebook.com/billing',
            html: `
                <div class="ads-kpis">
                    <div class="ads-kpi"><div class="label">Current Unbilled Balance</div><div class="val">₹14,280</div><div class="delta up">Threshold: ₹50,000</div></div>
                    <div class="ads-kpi"><div class="label">Total Spent This Month</div><div class="val">₹4,78,100</div><div class="delta up">✔ GST Tax Invoices Ready</div></div>
                    <div class="ads-kpi"><div class="label">Primary Payment Card</div><div class="val">HDFC Visa •••• 4092</div><div class="delta up">✔ Auto-pay Active</div></div>
                    <div class="ads-kpi"><div class="label">Account Spend Limit</div><div class="val">₹10,00,000</div><div class="delta up">95% headroom open</div></div>
                </div>
                <div class="ads-table-wrap overflow-safe">
                    <table>
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Billing Date</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Tax Status</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>INV-2026-03-8821</strong></td>
                                <td>Mar 15, 2026</td>
                                <td><strong>₹1,50,000</strong></td>
                                <td>Visa •••• 4092</td>
                                <td><span class="status-pill"><i></i>Paid (GST 18% Compliant)</span></td>
                                <td><a href="#" class="table-btn-action" onclick="event.preventDefault();"><i class="ph-bold ph-download-simple"></i> Download PDF</a></td>
                            </tr>
                            <tr>
                                <td><strong>INV-2026-03-7419</strong></td>
                                <td>Mar 08, 2026</td>
                                <td><strong>₹1,50,000</strong></td>
                                <td>Visa •••• 4092</td>
                                <td><span class="status-pill"><i></i>Paid (GST 18% Compliant)</span></td>
                                <td><a href="#" class="table-btn-action" onclick="event.preventDefault();"><i class="ph-bold ph-download-simple"></i> Download PDF</a></td>
                            </tr>
                            <tr>
                                <td><strong>INV-2026-03-6102</strong></td>
                                <td>Mar 01, 2026</td>
                                <td><strong>₹1,50,000</strong></td>
                                <td>Visa •••• 4092</td>
                                <td><span class="status-pill"><i></i>Paid (GST 18% Compliant)</span></td>
                                <td><a href="#" class="table-btn-action" onclick="event.preventDefault();"><i class="ph-bold ph-download-simple"></i> Download PDF</a></td>
                            </tr>
                            <tr>
                                <td><strong>INV-2026-02-9934</strong></td>
                                <td>Feb 22, 2026</td>
                                <td><strong>₹28,100</strong></td>
                                <td>Visa •••• 4092</td>
                                <td><span class="status-pill"><i></i>Paid (GST 18% Compliant)</span></td>
                                <td><a href="#" class="table-btn-action" onclick="event.preventDefault();"><i class="ph-bold ph-download-simple"></i> Download PDF</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        }
    };

    function initDashboards() {
        // 1. Instagram Nav Tabs Click
        document.querySelectorAll('.ig-nav li').forEach(li => {
            li.addEventListener('click', function () {
                const shell = this.closest('.ig-shell');
                if (!shell) return;
                
                const device = shell.closest('.device') || shell.parentElement;
                const tabKey = (this.getAttribute('data-tab') || this.textContent.trim().toLowerCase()).split(' ')[0];
                
                shell.querySelectorAll('.ig-nav li').forEach(item => item.classList.remove('active'));
                this.classList.add('active');

                // Update Browser Bar URL
                const urlEl = device.querySelector('.ig-browser-url-text') || device.querySelector('.browser-url span');
                if (urlEl && igData[tabKey]) {
                    urlEl.textContent = igData[tabKey].url;
                    urlEl.style.opacity = '0.5';
                    setTimeout(() => { urlEl.style.opacity = '1'; }, 200);
                }

                // Render Content
                const contentPane = shell.querySelector('.ig-content-pane');
                if (contentPane && igData[tabKey]) {
                    contentPane.innerHTML = igData[tabKey].html;
                    contentPane.classList.remove('dashboard-tab-fade');
                    void contentPane.offsetWidth; // trigger reflow
                    contentPane.classList.add('dashboard-tab-fade');
                }
            });
        });

        // 2. Meta Ads Tabs Click
        document.querySelectorAll('.ads-tabs li').forEach(li => {
            li.addEventListener('click', function () {
                const shell = this.closest('.ads-shell');
                if (!shell) return;

                const device = shell.closest('.device') || shell.parentElement;
                let tabKey = this.getAttribute('data-tab');
                if (!tabKey) {
                    const text = this.textContent.toLowerCase();
                    if (text.includes('campaign')) tabKey = 'campaigns';
                    else if (text.includes('ad set')) tabKey = 'adsets';
                    else if (text.includes('ad')) tabKey = 'ads';
                    else if (text.includes('audience')) tabKey = 'audiences';
                    else if (text.includes('rule')) tabKey = 'rules';
                    else if (text.includes('billing')) tabKey = 'billing';
                    else tabKey = 'campaigns';
                }

                shell.querySelectorAll('.ads-tabs li').forEach(item => item.classList.remove('active'));
                this.classList.add('active');

                // Update Browser Bar URL
                const urlEl = device.querySelector('.ads-browser-url-text') || device.querySelector('.browser-url span');
                if (urlEl && adsData[tabKey]) {
                    urlEl.textContent = adsData[tabKey].url;
                    urlEl.style.opacity = '0.5';
                    setTimeout(() => { urlEl.style.opacity = '1'; }, 200);
                }

                // Update Ads Title
                const titleEl = shell.querySelector('.ads-title-text') || shell.querySelector('.ads-title');
                if (titleEl && adsData[tabKey]) {
                    titleEl.textContent = adsData[tabKey].title;
                }

                // Render Content
                const contentPane = shell.querySelector('.ads-content-pane');
                if (contentPane && adsData[tabKey]) {
                    contentPane.innerHTML = adsData[tabKey].html;
                    contentPane.classList.remove('dashboard-tab-fade');
                    void contentPane.offsetWidth; // trigger reflow
                    contentPane.classList.add('dashboard-tab-fade');
                }
            });
        });

        // 3. Instagram Range Filter Click
        document.querySelectorAll('.ig-range-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const parent = this.closest('.ig-main');
                if (!parent) return;
                parent.querySelectorAll('.ig-range-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Animated pulse on values
                parent.querySelectorAll('.ig-kpi .val').forEach(val => {
                    val.style.transform = 'scale(1.08)';
                    val.style.color = '#ee2a7b';
                    setTimeout(() => {
                        val.style.transform = 'scale(1)';
                        val.style.color = '#111827';
                    }, 300);
                });
            });
        });

        // 4. Meta Ads Filter Click
        document.querySelectorAll('.ads-filter').forEach(btn => {
            btn.addEventListener('click', function () {
                const parent = this.closest('.ads-main');
                if (!parent) return;
                parent.querySelectorAll('.ads-filter').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Animated pulse on table and kpis
                parent.querySelectorAll('.ads-kpi .val').forEach(val => {
                    val.style.transform = 'scale(1.08)';
                    val.style.color = '#1877f2';
                    setTimeout(() => {
                        val.style.transform = 'scale(1)';
                        val.style.color = '#1c1e21';
                    }, 300);
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboards);
    } else {
        initDashboards();
    }
})();

// ================================================================
// REAL AUDITED CLIENT RESULTS & LIGHTBOX CONTROLLER (ENHANCED)
// ================================================================
(function () {
    // 1. Toggle Video Playback on Proof Cards
    window.toggleProofVideo = function (triggerEl) {
        const card = triggerEl.closest('.proof-card');
        const video = card ? card.querySelector('video') : null;
        const btnIcon = triggerEl.querySelector('i');
        if (!video) return;

        if (video.paused) {
            video.play().catch(() => {});
            card.classList.add('playing');
            card.classList.remove('manual-paused');
            if (btnIcon) {
                btnIcon.className = 'ph-fill ph-pause';
            }
        } else {
            video.pause();
            card.classList.remove('playing');
            card.classList.add('manual-paused');
            if (btnIcon) {
                btnIcon.className = 'ph-fill ph-play';
            }
        }
    };

    // 2. Toggle Audio Unmute/Mute
    window.toggleProofAudio = function (btnEl, e) {
        if (e) e.stopPropagation();
        const card = btnEl.closest('.proof-card');
        const video = card ? card.querySelector('video') : null;
        const icon = btnEl.querySelector('i');
        const label = btnEl.querySelector('span');
        if (!video) return;

        video.muted = !video.muted;
        if (video.muted) {
            if (icon) icon.className = 'ph-fill ph-speaker-simple-slash';
            if (label) label.textContent = 'Muted';
        } else {
            if (icon) icon.className = 'ph-fill ph-speaker-simple-high';
            if (label) label.textContent = 'Audio On';
            // Auto play if unmuted
            if (video.paused) {
                video.play().catch(() => {});
                if (card) card.classList.add('playing');
            }
        }
    };

    // 3. Open High-Res Lightbox Modal
    window.openProofLightbox = function (containerEl) {
        const modal = document.getElementById('proofLightboxModal');
        const mediaSlot = document.getElementById('proofLightboxMedia');
        const detailsSlot = document.getElementById('proofLightboxDetails');
        if (!modal || !mediaSlot || !detailsSlot) return;

        const card = containerEl.closest('.proof-card');
        const img = containerEl.querySelector('img');
        const video = containerEl.querySelector('video');

        // Clear previous contents
        mediaSlot.innerHTML = '';
        detailsSlot.innerHTML = '';

        if (img) {
            const bigImg = document.createElement('img');
            bigImg.src = img.src;
            bigImg.alt = img.alt || 'Audited Client Telemetry';
            mediaSlot.appendChild(bigImg);
        } else if (video) {
            const source = video.querySelector('source');
            const bigVideo = document.createElement('video');
            bigVideo.src = source ? source.src : video.src;
            bigVideo.controls = true;
            bigVideo.autoplay = true;
            bigVideo.loop = true;
            bigVideo.playsInline = true;
            bigVideo.style.maxWidth = '100%';
            bigVideo.style.maxHeight = '65vh';
            mediaSlot.appendChild(bigVideo);
        }

        // Clone details from card
        if (card) {
            const badge = card.querySelector('.proof-badge-floating');
            const stat = card.querySelector('.proof-stat-highlight');
            const title = card.querySelector('.proof-title');
            const desc = card.querySelector('.proof-desc');
            const meta = card.querySelector('.proof-meta-row');

            let detailsHtml = '';
            if (badge) {
                detailsHtml += `<span style="display:inline-block; align-self:flex-start; padding:4px 12px; border-radius:999px; background:rgba(87,227,196,0.15); border:1px solid rgba(87,227,196,0.4); color:var(--accent-teal); font-size:0.8rem; font-weight:700;">${badge.innerHTML}</span>`;
            }
            if (stat) {
                detailsHtml += `<div style="font-size:1.65rem; font-weight:800; color:var(--accent-teal); margin-top:4px;">${stat.innerHTML}</div>`;
            }
            if (title) {
                detailsHtml += `<h3 style="font-size:1.25rem; font-weight:700; color:var(--text-primary); margin:0;">${title.innerHTML}</h3>`;
            }
            if (desc) {
                detailsHtml += `<p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6; margin:4px 0 0;">${desc.innerHTML}</p>`;
            }
            if (meta) {
                detailsHtml += `<div style="margin-top:8px; padding-top:10px; border-top:1px solid var(--glass-border-soft); display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; color:var(--text-tertiary);">${meta.innerHTML}</div>`;
            }
            detailsHtml += `
                <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
                    <a href="https://wa.me/918368508556?text=Hi%20Reka%20Creative%20Labs!%20I%20saw%20this%20audited%20client%20result%20and%20want%20to%20scale%20my%20brand%20similarly." target="_blank" rel="noopener" class="btn-primary" style="font-size:0.88rem; padding:9px 18px;">
                        <i class="ph-bold ph-whatsapp-logo"></i> Scale My Brand Like This →
                    </a>
                </div>
            `;
            detailsSlot.innerHTML = detailsHtml;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // 4. Close Lightbox Modal
    window.closeProofLightboxModal = function () {
        const modal = document.getElementById('proofLightboxModal');
        const mediaSlot = document.getElementById('proofLightboxMedia');
        if (mediaSlot) {
            const v = mediaSlot.querySelector('video');
            if (v) v.pause();
        }
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.closeProofLightbox = function (e) {
        if (e.target && e.target.id === 'proofLightboxModal') {
            window.closeProofLightboxModal();
        }
    };

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            window.closeProofLightboxModal();
        }
    });

    // 5. Initialize Proof Sections (Filter Tabs, Progress Bars, Hover Previews)
    function initProofSection() {
        // A. Video features: progress bars & desktop hover previews
        document.querySelectorAll('.proof-video').forEach(video => {
            const container = video.parentElement;
            const barFill = container.querySelector('.proof-video-bar-fill');
            const card = video.closest('.proof-card');

            if (barFill) {
                video.addEventListener('timeupdate', () => {
                    if (video.duration) {
                        barFill.style.width = ((video.currentTime / video.duration) * 100) + '%';
                    }
                });
            }

            // Hover preview on desktop
            container.addEventListener('mouseenter', () => {
                if (video.paused && card && !card.classList.contains('manual-paused')) {
                    video.play().catch(() => {});
                }
            });

            container.addEventListener('mouseleave', () => {
                if (card && !card.classList.contains('playing')) {
                    video.pause();
                }
            });
        });

        // B. Filter pills scoped to each proof section
        document.querySelectorAll('.real-proof-section').forEach(section => {
            const filterBtns = section.querySelectorAll('.proof-filter-btn');
            const cards = section.querySelectorAll('.proof-card');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    const filter = this.getAttribute('data-filter');

                    cards.forEach(card => {
                        const cat = card.getAttribute('data-category') || '';
                        let match = false;

                        if (filter === 'all') {
                            match = true;
                        } else if (filter === 'video') {
                            match = cat.includes('video');
                        } else {
                            match = cat.includes(filter);
                        }

                        if (match) {
                            card.style.display = 'flex';
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(15px)';
                            setTimeout(() => {
                                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 20);
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProofSection);
    } else {
        initProofSection();
    }
})();

/* ================= HERO SPOTLIGHT TESTIMONIAL 55 REVIEWS SLIDER ================= */
(function initHeroTestimonialsSlider() {
    function setup() {
        const card = document.getElementById('heroTestimonialCard');
        if (!card) return;

        const REVIEWS_DATA = [
  {
    "id": 1,
    "role": "Verified Wellness Coach",
    "subtitle": "Health & Wellness Category Leader",
    "category": "Wellness Coach",
    "icon": "ph-heartbeat",
    "quote": "Reka Creative Labs helped me bring structure to my Instagram content and lead generation. The combination of short-form video, social media strategy and performance marketing made a noticeable difference to how professionally my wellness brand is positioned.",
    "pills": [
      {
        "val": "+140% Walk-ins",
        "lbl": "Member Acquisition"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "High Velocity",
        "lbl": "Short-Form Reels"
      }
    ]
  },
  {
    "id": 2,
    "role": "Verified Nutritionist",
    "subtitle": "Nutrition & Metabolic Health",
    "category": "Nutritionist",
    "icon": "ph-leaf",
    "quote": "I was struggling to consistently create content that actually generated enquiries. Reka Creative Labs helped us build a content system around reels, educational posts and lead generation. The strategy was much more practical than simply posting every day.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 3,
    "role": "Verified Doctor",
    "subtitle": "Healthcare & Clinical Practice",
    "category": "Doctor",
    "icon": "ph-first-aid",
    "quote": "As a doctor, I wanted my online presence to remain professional while still being engaging. Reka Creative Labs understood that balance and helped us improve our website, social media content and online visibility.",
    "pills": [
      {
        "val": "+186 DMs",
        "lbl": "Consultation Bookings"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "100% HIPAA",
        "lbl": "Clinical Discretion"
      }
    ]
  },
  {
    "id": 4,
    "role": "Verified Herbalife Coach",
    "subtitle": "Creator & Digital Consulting",
    "category": "Herbalife Coach",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs helped me turn my social media presence into a more structured lead-generation channel. Their approach to reels, content and follow-up funnels gave me a much clearer system for connecting with prospects.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 5,
    "role": "Verified Fitness Trainer",
    "subtitle": "Health & Wellness Category Leader",
    "category": "Fitness Trainer",
    "icon": "ph-barbell",
    "quote": "I needed more than just someone to edit videos. Reka Creative Labs worked on the content strategy, editing and lead-generation side together, which made the whole process much easier for me as a fitness professional.",
    "pills": [
      {
        "val": "+140% Walk-ins",
        "lbl": "Member Acquisition"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "High Velocity",
        "lbl": "Short-Form Reels"
      }
    ]
  },
  {
    "id": 6,
    "role": "Verified Gym Owner",
    "subtitle": "Health & Wellness Category Leader",
    "category": "Gym Owner",
    "icon": "ph-barbell",
    "quote": "Our gym needed a stronger digital presence and a consistent flow of content. Reka Creative Labs helped us improve our social media strategy and create content that communicated our training programs much more clearly.",
    "pills": [
      {
        "val": "+140% Walk-ins",
        "lbl": "Member Acquisition"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "High Velocity",
        "lbl": "Short-Form Reels"
      }
    ]
  },
  {
    "id": 7,
    "role": "Verified D2C Founder",
    "subtitle": "D2C Brand & Growth Scaling",
    "category": "D2C Founder",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs understood that D2C growth is not just about making attractive creatives. They looked at the complete customer journey — content, landing pages, ads and conversion — and helped us identify areas to improve.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 8,
    "role": "Verified Skincare Brand",
    "subtitle": "D2C Brand & Growth Scaling",
    "category": "Skincare Brand",
    "icon": "ph-sparkle",
    "quote": "We approached Reka Creative Labs to improve our digital marketing for our skincare brand. Their creative team helped us develop short-form content that explained our products in a much more engaging way.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 9,
    "role": "Verified Restaurant Owner",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Restaurant Owner",
    "icon": "ph-fork-knife",
    "quote": "Our restaurant had good food but our online presence wasn't communicating the experience properly. Reka Creative Labs helped us create better social media content and improve how customers discovered us online.",
    "pills": [
      {
        "val": "3.2x Footfall",
        "lbl": "Local Discovery"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Viral Reach",
        "lbl": "Food Reels System"
      }
    ]
  },
  {
    "id": 10,
    "role": "Verified Café Owner",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Café Owner",
    "icon": "ph-fork-knife",
    "quote": "Reka Creative Labs gave our café a much more consistent social media presence. From reels to promotional content, everything started feeling more organised and aligned with our brand.",
    "pills": [
      {
        "val": "3.2x Footfall",
        "lbl": "Local Discovery"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Viral Reach",
        "lbl": "Food Reels System"
      }
    ]
  },
  {
    "id": 11,
    "role": "Verified Startup Founder",
    "subtitle": "B2B & Tech Scaleup",
    "category": "Startup Founder",
    "icon": "ph-user-check",
    "quote": "As a startup founder, I wanted an agency that could understand the business rather than just execute a marketing checklist. Reka Creative Labs spent time understanding our offer, audience and growth goals before working on the campaigns.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 12,
    "role": "Verified Business Consultant",
    "subtitle": "Creator & Digital Consulting",
    "category": "Business Consultant",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs helped us turn our expertise into content that was easier for potential clients to understand. The combination of content marketing, website improvements and lead generation gave us a much clearer digital strategy.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 13,
    "role": "Verified Coach",
    "subtitle": "Creator & Digital Consulting",
    "category": "Coach",
    "icon": "ph-user-check",
    "quote": "The biggest difference was the strategy behind the content. Instead of simply making reels, Reka Creative Labs helped us think about what each piece of content was supposed to achieve.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 14,
    "role": "Verified Dermatologist",
    "subtitle": "Healthcare & Clinical Practice",
    "category": "Dermatologist",
    "icon": "ph-first-aid",
    "quote": "Our online presence needed to look professional, trustworthy and informative. Reka Creative Labs helped us improve our website and social media communication while keeping the content aligned with our professional image.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 15,
    "role": "Verified Physiotherapist",
    "subtitle": "Healthcare & Clinical Practice",
    "category": "Physiotherapist",
    "icon": "ph-first-aid",
    "quote": "Reka Creative Labs helped us communicate our services online in a much simpler way. Their content strategy made it easier for potential patients to understand what we do and how they could reach us.",
    "pills": [
      {
        "val": "+186 DMs",
        "lbl": "Consultation Bookings"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "100% HIPAA",
        "lbl": "Clinical Discretion"
      }
    ]
  },
  {
    "id": 16,
    "role": "Verified Dental Clinic",
    "subtitle": "Healthcare & Clinical Practice",
    "category": "Dental Clinic",
    "icon": "ph-first-aid",
    "quote": "We wanted our dental clinic to be easier to find online and more credible when people visited our website or social profiles. Reka Creative Labs worked across our website, content and digital marketing to create a more consistent presence.",
    "pills": [
      {
        "val": "+186 DMs",
        "lbl": "Consultation Bookings"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "100% HIPAA",
        "lbl": "Clinical Discretion"
      }
    ]
  },
  {
    "id": 17,
    "role": "Verified Ayurvedic Practitioner",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Ayurvedic Practitioner",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs understood that our audience needs educational content before they make a decision. Their team helped us turn our knowledge into informative videos and social media content.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 18,
    "role": "Verified Yoga Instructor",
    "subtitle": "Health & Wellness Category Leader",
    "category": "Yoga Instructor",
    "icon": "ph-heartbeat",
    "quote": "I wanted my yoga business to look more professional online without losing its personal feel. Reka Creative Labs helped us create a consistent visual identity and content strategy around our classes.",
    "pills": [
      {
        "val": "+140% Walk-ins",
        "lbl": "Member Acquisition"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "High Velocity",
        "lbl": "Short-Form Reels"
      }
    ]
  },
  {
    "id": 19,
    "role": "Verified Pilates Studio",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Pilates Studio",
    "icon": "ph-heartbeat",
    "quote": "The team helped us create content that actually reflected the experience inside our studio. Our Instagram now feels much more organised and professional.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 20,
    "role": "Verified Personal Trainer",
    "subtitle": "Health & Wellness Category Leader",
    "category": "Personal Trainer",
    "icon": "ph-barbell",
    "quote": "Before working with Reka Creative Labs, I was doing everything myself. Their team took over the content and digital marketing side and gave me more time to focus on my clients.",
    "pills": [
      {
        "val": "+140% Walk-ins",
        "lbl": "Member Acquisition"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "High Velocity",
        "lbl": "Short-Form Reels"
      }
    ]
  },
  {
    "id": 21,
    "role": "Verified E-commerce Founder",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "E-commerce Founder",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs helped us look at our online store from a marketing and conversion perspective, not just a design perspective. Their suggestions around content, landing pages and customer journeys were particularly useful.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 22,
    "role": "Verified Fashion Brand Founder",
    "subtitle": "D2C Brand & Growth Scaling",
    "category": "Fashion Brand Founder",
    "icon": "ph-t-shirt",
    "quote": "Our challenge was standing out in a crowded social media market. Reka Creative Labs helped us develop a stronger content direction and create short-form videos that represented our brand better.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 23,
    "role": "Verified Beauty Brand Founder",
    "subtitle": "D2C Brand & Growth Scaling",
    "category": "Beauty Brand Founder",
    "icon": "ph-sparkle",
    "quote": "The creative team understood the visual side of our brand while also thinking about conversions. That combination was exactly what we were looking for.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 24,
    "role": "Verified Real Estate Founder",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Real Estate Founder",
    "icon": "ph-buildings",
    "quote": "Reka Creative Labs helped us turn property information into content that was much easier for potential buyers to consume. The focus on video and lead generation made our digital marketing more structured.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 25,
    "role": "Verified Education Founder",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Education Founder",
    "icon": "ph-graduation-cap",
    "quote": "We needed a digital marketing partner who could simplify complicated course offerings. Reka Creative Labs helped us improve our website messaging, social media content and lead-generation process.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 26,
    "role": "Verified SaaS Founder",
    "subtitle": "B2B & Tech Scaleup",
    "category": "SaaS Founder",
    "icon": "ph-cpu",
    "quote": "What I liked about Reka Creative Labs was that they approached marketing from a growth perspective. They looked at our website, messaging, content and acquisition funnel instead of treating each service separately.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 27,
    "role": "Verified B2B Founder",
    "subtitle": "B2B & Tech Scaleup",
    "category": "B2B Founder",
    "icon": "ph-cpu",
    "quote": "Generating B2B leads requires a different approach from regular social media marketing. Reka Creative Labs helped us build a more focused digital strategy around our target audience and sales process.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 28,
    "role": "Verified Marketing Consultant",
    "subtitle": "Creator & Digital Consulting",
    "category": "Marketing Consultant",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs brought a good mix of creative thinking and performance marketing. The team was particularly strong when it came to converting business ideas into content.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 29,
    "role": "Verified Financial Services Founder",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Financial Services Founder",
    "icon": "ph-user-check",
    "quote": "We wanted our digital presence to communicate trust and professionalism. Reka Creative Labs helped us improve the structure of our website and create clearer educational content for our audience.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 30,
    "role": "Verified Healthcare Startup Founder",
    "subtitle": "B2B & Tech Scaleup",
    "category": "Healthcare Startup Founder",
    "icon": "ph-user-check",
    "quote": "Working with Reka Creative Labs helped us bring our healthcare brand online with a much clearer content and marketing strategy. The team was responsive and understood our audience.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 31,
    "role": "Verified Home Brand Founder",
    "subtitle": "D2C Brand & Growth Scaling",
    "category": "Home Brand Founder",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs helped us improve our product presentation across social media and our website. The new content direction made our products much easier to understand.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 32,
    "role": "Verified Food Brand Founder",
    "subtitle": "D2C Brand & Growth Scaling",
    "category": "Food Brand Founder",
    "icon": "ph-fork-knife",
    "quote": "Our products needed strong visual storytelling, and Reka Creative Labs helped us build that through short-form videos and social media campaigns.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 33,
    "role": "Verified Restaurant Marketing",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Restaurant Marketing",
    "icon": "ph-fork-knife",
    "quote": "From promotional reels to social media strategy, Reka Creative Labs helped us create a much more consistent digital presence for our restaurant.",
    "pills": [
      {
        "val": "3.2x Footfall",
        "lbl": "Local Discovery"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Viral Reach",
        "lbl": "Food Reels System"
      }
    ]
  },
  {
    "id": 34,
    "role": "Verified Salon Owner",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Salon Owner",
    "icon": "ph-sparkle",
    "quote": "Our salon needed better local visibility and more engaging Instagram content. Reka Creative Labs helped us work on both sides instead of focusing only on posting.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 35,
    "role": "Verified Spa Owner",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Spa Owner",
    "icon": "ph-sparkle",
    "quote": "The team understood how important visuals are for a spa business. They helped us create content that communicated the experience while keeping our brand professional.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 36,
    "role": "Verified Clinic Founder",
    "subtitle": "Healthcare & Clinical Practice",
    "category": "Clinic Founder",
    "icon": "ph-first-aid",
    "quote": "Reka Creative Labs helped us organise our online presence from the website to social media. Everything now communicates our services more clearly.",
    "pills": [
      {
        "val": "+186 DMs",
        "lbl": "Consultation Bookings"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "100% HIPAA",
        "lbl": "Clinical Discretion"
      }
    ]
  },
  {
    "id": 37,
    "role": "Verified Startup Marketing",
    "subtitle": "B2B & Tech Scaleup",
    "category": "Startup Marketing",
    "icon": "ph-user-check",
    "quote": "We had ideas but no consistent execution system. Reka Creative Labs helped us turn those ideas into a repeatable content and marketing process.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 38,
    "role": "Verified Small Business Owner",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Small Business Owner",
    "icon": "ph-user-check",
    "quote": "What impressed me was that the team didn't make digital marketing unnecessarily complicated. They explained what we needed, why we needed it and then focused on execution.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 39,
    "role": "Verified Founder — Website Development",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Founder — Website Development",
    "icon": "ph-cpu",
    "quote": "We needed a website that looked modern but also supported our sales process. Reka Creative Labs combined website development with conversion-focused thinking, which made the project much more valuable.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 40,
    "role": "Verified SEO Client",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "SEO Client",
    "icon": "ph-cpu",
    "quote": "Our website had content but wasn't generating enough organic visibility. Reka Creative Labs helped us identify SEO opportunities and improve the structure and content of important pages.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 41,
    "role": "Verified Local Business",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Local Business",
    "icon": "ph-user-check",
    "quote": "We wanted more people to discover our business online. Reka Creative Labs helped us improve our digital presence, content and local marketing strategy.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 42,
    "role": "Verified Lead Generation Client",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Lead Generation Client",
    "icon": "ph-user-check",
    "quote": "The biggest improvement for us was having an actual lead-generation process instead of randomly running campaigns. Reka Creative Labs helped connect our ads, landing pages and follow-up process.",
    "pills": [
      {
        "val": "3.8x ROAS",
        "lbl": "Meta & Lead Funnel"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "₹22.4 CAC",
        "lbl": "Lead Acquisition"
      }
    ]
  },
  {
    "id": 43,
    "role": "Verified Meta Ads Client",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Meta Ads Client",
    "icon": "ph-user-check",
    "quote": "We had experimented with Meta Ads before but didn't have a proper strategy behind them. Reka Creative Labs helped us approach campaigns with clearer audiences, creatives and conversion goals.",
    "pills": [
      {
        "val": "3.8x ROAS",
        "lbl": "Meta & Lead Funnel"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "₹22.4 CAC",
        "lbl": "Lead Acquisition"
      }
    ]
  },
  {
    "id": 44,
    "role": "Verified Social Media Client",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Social Media Client",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs brought consistency to our social media. The content calendar, reels and creative direction made our brand look much more active and professional.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 45,
    "role": "Verified Video Editing Client",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Video Editing Client",
    "icon": "ph-video-camera",
    "quote": "We were looking for an editing team that understood retention rather than simply adding transitions. Reka Creative Labs focused on hooks, pacing and storytelling to make our short-form videos more engaging.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 46,
    "role": "Verified Content Creator",
    "subtitle": "Creator & Digital Consulting",
    "category": "Content Creator",
    "icon": "ph-video-camera",
    "quote": "I had plenty of ideas but struggled with execution. Reka Creative Labs helped turn those ideas into structured short-form content that was much easier for my audience to consume.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 47,
    "role": "Verified Influencer / Coach",
    "subtitle": "Creator & Digital Consulting",
    "category": "Influencer / Coach",
    "icon": "ph-video-camera",
    "quote": "The team helped me understand that content isn't only about views. They worked with us on turning attention into profile visits, conversations and enquiries.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 48,
    "role": "Verified Wellness Brand Founder",
    "subtitle": "Health & Wellness Category Leader",
    "category": "Wellness Brand Founder",
    "icon": "ph-heartbeat",
    "quote": "Reka Creative Labs helped us position our wellness brand more clearly online. Their combination of creative content and performance marketing gave us a much more organised growth process.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 49,
    "role": "Verified Nutrition Brand",
    "subtitle": "Nutrition & Metabolic Health",
    "category": "Nutrition Brand",
    "icon": "ph-leaf",
    "quote": "Our challenge was explaining our products without making the content feel like a traditional advertisement. Reka Creative Labs helped us develop educational and product-focused content that felt much more natural.",
    "pills": [
      {
        "val": "7.1x Scale",
        "lbl": "Revenue Velocity"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "90 Days",
        "lbl": "Growth Trajectory"
      }
    ]
  },
  {
    "id": 50,
    "role": "Verified Gym Marketing",
    "subtitle": "Health & Wellness Category Leader",
    "category": "Gym Marketing",
    "icon": "ph-barbell",
    "quote": "The team understood that gym marketing needs strong local content and a clear reason for people to take action. Their reels and lead-generation approach helped us create a more complete marketing system.",
    "pills": [
      {
        "val": "+140% Walk-ins",
        "lbl": "Member Acquisition"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "High Velocity",
        "lbl": "Short-Form Reels"
      }
    ]
  },
  {
    "id": 51,
    "role": "Verified Restaurant Marketing",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Restaurant Marketing",
    "icon": "ph-fork-knife",
    "quote": "Reka Creative Labs helped us move beyond basic food pictures. The team created a content direction around the food, experience and reasons people should visit us.",
    "pills": [
      {
        "val": "3.2x Footfall",
        "lbl": "Local Discovery"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Viral Reach",
        "lbl": "Food Reels System"
      }
    ]
  },
  {
    "id": 52,
    "role": "Verified Founder — Growth",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Founder — Growth",
    "icon": "ph-user-check",
    "quote": "What started as a conversation about social media quickly became a much broader growth strategy. Reka Creative Labs helped us look at content, website, leads and conversion together.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 53,
    "role": "Verified Agency Client",
    "subtitle": "B2B & Tech Scaleup",
    "category": "Agency Client",
    "icon": "ph-user-check",
    "quote": "We've worked with different freelancers and agencies before, but Reka Creative Labs gave us a more integrated approach. Their creative and marketing teams worked toward the same business objectives.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 54,
    "role": "Verified Long-Term Client",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Long-Term Client",
    "icon": "ph-user-check",
    "quote": "The biggest reason we've continued working with Reka Creative Labs is consistency. They understand our brand, our audience and what we're trying to achieve, so every new campaign starts from a much stronger position.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  },
  {
    "id": 55,
    "role": "Verified Growth-Focused Founder",
    "subtitle": "Verified Client · Performance Retainer",
    "category": "Growth-Focused Founder",
    "icon": "ph-user-check",
    "quote": "Reka Creative Labs doesn't feel like an agency that simply delivers posts and ads. The conversations are usually about growth, positioning, content, leads and conversions — which is exactly how we wanted our marketing partner to think.",
    "pills": [
      {
        "val": "100% High Impact",
        "lbl": "Strategic Creative"
      },
      {
        "val": "5.0 ★",
        "lbl": "Verified Rating"
      },
      {
        "val": "Ongoing",
        "lbl": "Growth Retainer"
      }
    ]
  }
];

        let currentIndex = 0;
        let autoplayTimer = null;
        let isTransitioning = false;
        const AUTOPLAY_INTERVAL = 3200; // Fast auto-slide 3.2 seconds

        const badgeText = document.getElementById('testiBadgeText');
        const quoteText = document.getElementById('testiQuoteText');
        const authorName = document.getElementById('testiAuthorName');
        const authorTitle = document.getElementById('testiAuthorTitle');
        const avatarIcon = document.getElementById('testiAvatarIcon');
        const prevBtn = document.getElementById('testiPrevBtn');
        const nextBtn = document.getElementById('testiNextBtn');
        const progressBar = document.getElementById('testiProgressBar');
        const slideTrack = document.getElementById('testiSlideTrack');
        const bottomGrid = card.querySelector('.testimonial-bottom-grid');
        const pill1Val = document.getElementById('testiPill1Val');
        const pill1Lbl = document.getElementById('testiPill1Lbl');
        const pill2Val = document.getElementById('testiPill2Val');
        const pill2Lbl = document.getElementById('testiPill2Lbl');
        const pill3Val = document.getElementById('testiPill3Val');
        const pill3Lbl = document.getElementById('testiPill3Lbl');

        function updateContent(item) {
            if (badgeText) badgeText.textContent = 'VERIFIED CLIENT REVIEW · ' + item.id + ' OF ' + REVIEWS_DATA.length;
            if (quoteText) quoteText.textContent = '“' + item.quote + '”';
            if (authorName) authorName.innerHTML = item.role + ' <i class="ph-fill ph-seal-check" title="Verified Client"></i>';
            if (authorTitle) authorTitle.textContent = item.subtitle;
            if (avatarIcon) avatarIcon.className = 'ph-bold ' + item.icon;
            if (progressBar) progressBar.style.width = ((item.id / REVIEWS_DATA.length) * 100) + '%';

            if (item.pills && item.pills.length >= 3) {
                if (pill1Val) pill1Val.textContent = item.pills[0].val;
                if (pill1Lbl) pill1Lbl.textContent = item.pills[0].lbl;
                if (pill2Val) pill2Val.textContent = item.pills[1].val;
                if (pill2Lbl) pill2Lbl.textContent = item.pills[1].lbl;
                if (pill3Val) pill3Val.textContent = item.pills[2].val;
                if (pill3Lbl) pill3Lbl.textContent = item.pills[2].lbl;
            }
        }

        function slideTo(nextIndex, direction) {
            if (isTransitioning) return;
            isTransitioning = true;
            direction = direction || 'next';

            const outOffset = direction === 'next' ? -35 : 35;
            const inOffset = direction === 'next' ? 35 : -35;

            if (slideTrack) {
                slideTrack.style.transition = 'transform 0.18s cubic-bezier(0.4, 0, 1, 1), opacity 0.16s ease-in';
                slideTrack.style.transform = 'translateX(' + outOffset + 'px)';
                slideTrack.style.opacity = '0';
            }
            if (bottomGrid) {
                bottomGrid.style.transition = 'opacity 0.18s ease-in';
                bottomGrid.style.opacity = '0.4';
            }

            setTimeout(() => {
                currentIndex = nextIndex;
                const item = REVIEWS_DATA[currentIndex];
                updateContent(item);

                if (slideTrack) {
                    slideTrack.style.transition = 'none';
                    slideTrack.style.transform = 'translateX(' + inOffset + 'px)';
                }

                if (slideTrack) void slideTrack.offsetWidth;

                if (slideTrack) {
                    slideTrack.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out';
                    slideTrack.style.transform = 'translateX(0)';
                    slideTrack.style.opacity = '1';
                }
                if (bottomGrid) {
                    bottomGrid.style.transition = 'opacity 0.22s ease-out';
                    bottomGrid.style.opacity = '1';
                }

                setTimeout(() => {
                    isTransitioning = false;
                }, 230);
            }, 190);
        }

        function next() {
            const nextIdx = (currentIndex + 1) % REVIEWS_DATA.length;
            slideTo(nextIdx, 'next');
        }

        function prev() {
            const prevIdx = (currentIndex - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length;
            slideTo(prevIdx, 'prev');
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(next, AUTOPLAY_INTERVAL);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                next();
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prev();
                startAutoplay();
            });
        }

        card.addEventListener('mouseenter', stopAutoplay);
        card.addEventListener('mouseleave', startAutoplay);
        card.addEventListener('touchstart', stopAutoplay, { passive: true });
        card.addEventListener('touchend', startAutoplay, { passive: true });

        // Touch gestures
        let touchStartX = 0;
        card.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                touchStartX = e.touches[0].clientX;
            }
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchEndX - touchStartX;
                if (Math.abs(diff) > 40) {
                    if (diff < 0) next();
                    else prev();
                }
            }
        }, { passive: true });

        // Start autoplay
        startAutoplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();
