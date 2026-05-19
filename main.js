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
        });
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

    // Counter animation
    document.querySelectorAll('.stat-value').forEach(el => {
        const text = el.textContent;
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (!num) return;
        const suffix = text.replace(/[0-9.]/g, '');
        let start = 0;
        const step = num / 60;
        const timer = setInterval(() => {
            start += step;
            if (start >= num) { start = num; clearInterval(timer); }
            el.textContent = (Number.isInteger(num) ? Math.floor(start) : start.toFixed(1)) + suffix;
        }, 25);
    });
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
    if (hero) {
        hero.addEventListener('mousemove', function (e) {
            var rx = (e.clientX / window.innerWidth  - 0.5) * 20;
            var ry = (e.clientY / window.innerHeight - 0.5) * 20;
            floatCards.forEach(function (card, i) {
                var factor = (i % 2 === 0) ? 1 : -1;
                card.style.transform = 'translateY(' + (Math.sin(Date.now()/1000 + i) * 10) + 'px) translate(' + (rx * 0.3 * factor) + 'px,' + (ry * 0.2 * factor) + 'px)';
            });
        });
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
                    console.log("Autoplay / click play prevented:", err);
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

        track.addEventListener('scroll', updateProgressBar);
        window.addEventListener('resize', updateProgressBar);
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

    // Custom form fields precisely tailored to each service/package options to maximize conversion
    const serviceFieldsMap = {
        "Web Development": [
            {
                type: "select",
                id: "webFocus",
                label: "What is your main requirement?",
                options: [
                    "Custom responsive design (Starting from ₹50,000)",
                    "E-commerce solutions",
                    "CMS implementation & management",
                    "Performance optimization",
                    "SEO-ready architecture",
                    "Mobile-first approach"
                ]
            },
            {
                type: "select",
                id: "webHosting",
                label: "Do you already have a domain & hosting?",
                options: ["Yes, both are ready", "Only Domain is ready", "No, I need help with both"]
            },
            {
                type: "textarea",
                id: "webDetails",
                label: "Describe features you need (e.g. blog, booking, checkout):",
                placeholder: "e.g. Need a sleek e-commerce website with custom payment gateway..."
            }
        ],
        "Digital Marketing": [
            {
                type: "select",
                id: "mktFocus",
                label: "Primary service required (from ₹15,000/mo):",
                options: [
                    "Meta Ads & Google Ads",
                    "Lead generation campaigns",
                    "Email marketing funnels",
                    "Content strategy",
                    "Conversion optimization",
                    "Analytics & reporting"
                ]
            },
            {
                type: "select",
                id: "mktBudget",
                label: "What is your monthly ad budget?",
                options: ["Under ₹10,000", "₹10,000 - ₹30,000", "₹30,000 - ₹75,000", "₹75,000 - ₹1,50,000", "₹1,50,000+"]
            },
            {
                type: "textarea",
                id: "mktDetails",
                label: "Describe your target audience / current channels:",
                placeholder: "e.g. Targeting fitness enthusiasts via Meta Ads..."
            }
        ],
        "Brand Design": [
            {
                type: "select",
                id: "brandFocus",
                label: "Deliverables needed (Starting from ₹30,000):",
                options: [
                    "Logo & brand identity",
                    "Visual design systems",
                    "Brand guidelines",
                    "Packaging design",
                    "Marketing collateral",
                    "Brand positioning"
                ]
            },
            {
                type: "text",
                id: "brandNiche",
                label: "What is your business industry / niche?",
                placeholder: "e.g. Organic health food startup..."
            },
            {
                type: "textarea",
                id: "brandStyle",
                label: "Describe the brand style you prefer:",
                placeholder: "e.g. Clean, minimalist, futuristic, vibrant..."
            }
        ],
        "Content & Video": [
            {
                type: "select",
                id: "videoFocus",
                label: "Content format required (From ₹20,000):",
                options: [
                    "Reel editing & optimization",
                    "Product videos",
                    "Motion graphics",
                    "Promotional content",
                    "Photography direction",
                    "Script writing"
                ]
            },
            {
                type: "select",
                id: "videoVolume",
                label: "Average expected output per month?",
                options: ["1 to 5 Videos", "5 to 15 Videos", "15 to 30 Videos", "30+ Videos / Daily content"]
            },
            {
                type: "textarea",
                id: "videoRef",
                label: "Share reference videos or current social links:",
                placeholder: "e.g. We want short-form reels like @competitor, here's our link..."
            }
        ],
        "Growth Strategy": [
            {
                type: "select",
                id: "growthFocus",
                label: "Strategic roadmap focus (From ₹40,000):",
                options: [
                    "Market analysis",
                    "Growth planning",
                    "Competitor research",
                    "Sales funnel design",
                    "Performance tracking",
                    "Monthly optimization"
                ]
            },
            {
                type: "text",
                id: "growthRevenue",
                label: "Current monthly revenue / target revenue:",
                placeholder: "e.g. Current ₹2L, target is ₹10L/month..."
            },
            {
                type: "textarea",
                id: "growthCompetitors",
                label: "Describe your products and major competitors:",
                placeholder: "e.g. Premium wellness brand, competitor is XYZ..."
            }
        ],
        "AI Integration": [
            {
                type: "select",
                id: "aiFocus",
                label: "AI Solution requested (Custom Pricing):",
                options: [
                    "AI chatbots",
                    "Marketing automation",
                    "Smart workflows",
                    "Data analysis",
                    "Predictive analytics",
                    "Custom AI solutions"
                ]
            },
            {
                type: "select",
                id: "aiChannel",
                label: "Where should the AI chatbot deploy?",
                options: ["WhatsApp Business API", "Website Chat Widget", "Instagram / Meta DMs", "Omnichannel (Multiple Channels)", "Internal Workflows (Zapier/Make)"]
            },
            {
                type: "textarea",
                id: "aiDetails",
                label: "Describe your operations pain points:",
                placeholder: "e.g. Support team takes too long to answer FAQs..."
            }
        ],
        "Starter Boost - Growth Package": [
            {
                type: "text",
                id: "pkg1Brand",
                label: "Your Brand Name / Social Handles:",
                placeholder: "e.g. HealthyLife, @healthylife"
            },
            {
                type: "select",
                id: "pkg1Feature",
                label: "Starter Boost (₹15,000/mo) Includes:",
                options: [
                    "✓ All included (Video, Photo, Strategy, 4 Posts, Email support)",
                    "Video content editing & optimization focus",
                    "Photo enhancement & graphic design focus",
                    "Social media strategy focus"
                ]
            },
            {
                type: "textarea",
                id: "pkg1Goal",
                label: "What are your immediate goals with Starter Boost?",
                placeholder: "e.g. Launching in 2 weeks, need social presence..."
            }
        ],
        "Growth Accelerator - Growth Package": [
            {
                type: "text",
                id: "pkg2Website",
                label: "Your Website / Social Pages:",
                placeholder: "e.g. www.mywellnessbrand.com"
            },
            {
                type: "select",
                id: "pkg2Feature",
                label: "Growth Accelerator (₹25,000/mo) Includes:",
                options: [
                    "✓ All included (Ads, Funnels, Content, Weekly optimization, Support)",
                    "Ad campaign & lead generation funnel focus",
                    "Content creation & weekly posts focus",
                    "Performance reporting & weekly optimizations"
                ]
            },
            {
                type: "textarea",
                id: "pkg2Focus",
                label: "Main growth objectives for this accelerator package:",
                placeholder: "e.g. Need high-quality leads for our fitness coaching..."
            }
        ],
        "Premium Domination - Growth Package": [
            {
                type: "text",
                id: "pkg3BrandName",
                label: "Your Business Name & Website URL:",
                placeholder: "e.g. Global Wellness Ltd, globalwellness.com"
            },
            {
                type: "select",
                id: "pkg3Feature",
                label: "Premium Domination (₹40,000/mo) Includes:",
                options: [
                    "✓ Full growth automation & advanced ad strategy",
                    "✓ Dedicated manager & 24/7 premium support",
                    "✓ AI integrations & sales optimization"
                ]
            },
            {
                type: "textarea",
                id: "pkg3Details",
                label: "Operational automations or integrations required:",
                placeholder: "e.g. Need CRM synchronization, automated lead flow..."
            }
        ]
    };

    // Render custom fields on the fly
    const renderDynamicFields = (serviceName) => {
        const container = document.getElementById('dynamicServiceFields');
        if (!container) return;

        container.innerHTML = ''; // Reset container

        const fields = serviceFieldsMap[serviceName];
        if (!fields) {
            // Standard fallback details field
            container.innerHTML = `
                <div class="form-group" style="transition: all 0.3s ease;">
                    <label for="quoteDetails">Custom Requirements / Account Details</label>
                    <textarea id="quoteDetails" placeholder="Tell us a bit about your brand or requirements..." rows="3"></textarea>
                </div>
            `;
            return;
        }

        // Build HTML for each question
        fields.forEach((field, i) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.style.opacity = '0';
            formGroup.style.transform = 'translateY(12px)';
            formGroup.style.transition = 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)';
            formGroup.style.transitionDelay = `${i * 0.05}s`;

            const label = document.createElement('label');
            label.setAttribute('for', field.id);
            label.textContent = field.label;
            formGroup.appendChild(label);

            if (field.type === 'select') {
                const select = document.createElement('select');
                select.id = field.id;
                select.required = true;

                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });

                formGroup.appendChild(select);
            } else if (field.type === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.id = field.id;
                textarea.placeholder = field.placeholder || '';
                textarea.rows = 3;
                textarea.required = true;
                formGroup.appendChild(textarea);
            } else if (field.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = field.id;
                input.placeholder = field.placeholder || '';
                input.required = true;
                formGroup.appendChild(input);
            }

            container.appendChild(formGroup);

            // Trigger animation frame
            setTimeout(() => {
                formGroup.style.opacity = '1';
                formGroup.style.transform = 'translateY(0)';
            }, 30);
        });
    };

    // Open Modal and pre-fill selected service
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = trigger.getAttribute('data-service');
            
            if (serviceName && serviceSelect) {
                let matched = false;
                for (let option of serviceSelect.options) {
                    if (serviceName.toLowerCase().includes(option.value.toLowerCase()) || 
                        option.value.toLowerCase().includes(serviceName.toLowerCase())) {
                        serviceSelect.value = option.value;
                        matched = true;
                        break;
                    }
                }
            }
            
            // Set dynamic fields based on selection
            renderDynamicFields(serviceSelect.value);

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });

    // Handle service dropdown value changes in the form
    if (serviceSelect) {
        serviceSelect.addEventListener('change', () => {
            renderDynamicFields(serviceSelect.value);
        });
    }

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

    // Handle Form Submit and redirect to WhatsApp SMS
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('quoteName').value.trim();
            const phone = document.getElementById('quotePhone').value.trim();
            const service = serviceSelect.value;

            // Compile dynamic answers based on active fields
            let detailsMessage = '';
            const fields = serviceFieldsMap[service];
            if (fields) {
                fields.forEach(field => {
                    const el = document.getElementById(field.id);
                    if (el) {
                        const val = el.value.trim();
                        detailsMessage += `\n*${field.label}*\n↳ ${val}\n`;
                    }
                });
            } else {
                const el = document.getElementById('quoteDetails');
                if (el) {
                    detailsMessage += `\n*Custom Requirements:*\n↳ ${el.value.trim()}\n`;
                }
            }

            // Format a beautifully structured WhatsApp message
            const formattedMessage = 
`Hi Reka Creative Labs! I would like to request a quote. Here are my details:

📌 *Requested Service:* ${service}
👤 *Client Name:* ${name}
📞 *Contact Number:* ${phone}
----------------------------------------
📝 *Service-Specific Requirements:*
${detailsMessage}
----------------------------------------
Looking forward to hearing from you!`;

            // WhatsApp link encoding
            const whatsappUrl = `https://wa.me/918368508556?text=${encodeURIComponent(formattedMessage)}`;

            // Open in a new tab
            window.open(whatsappUrl, '_blank');

            // Close modal after redirection
            closeModal();
        });
    }
});