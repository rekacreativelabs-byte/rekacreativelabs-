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

    // Custom form fields precisely tailored to user specifications
    const serviceFieldsMap = {
        "Web Development": [
            {
                type: "text",
                id: "webBusinessType",
                label: "What type of business do you run?",
                placeholder: "e.g. E-commerce, SaaS, agency, clinic..."
            },
            {
                type: "text",
                id: "webExisting",
                label: "Do you already have a website?",
                placeholder: "e.g. No, or share link if yes..."
            },
            {
                type: "select",
                id: "webPages",
                label: "Number of pages required?",
                options: ["1 Page (Landing Page)", "2 to 5 Pages", "5 to 10 Pages", "10+ Pages / Enterprise"]
            },
            {
                type: "select",
                id: "webEcommerce",
                label: "Need eCommerce functionality?",
                options: ["No, showcase / brochure site only", "Yes, need full eCommerce"]
            },
            {
                type: "textarea",
                id: "webStyleRef",
                label: "Preferred style/reference websites?",
                placeholder: "e.g. Clean, premium glassmorphic, links..."
            },
            {
                type: "select",
                id: "webTimeline",
                label: "Expected timeline?",
                options: ["Standard (3 to 6 weeks)", "Urgent (Less than 2 weeks)", "Flexible (6+ weeks)"]
            }
        ],
        "Digital Marketing": [
            {
                type: "select",
                id: "mktAdSpend",
                label: "Current monthly ad budget?",
                options: ["₹0 (Not advertising yet)", "Under ₹15,000", "₹15,000 - ₹50,000", "₹50,000 - ₹1,50,000", "₹1,50,000+"]
            },
            {
                type: "text",
                id: "mktAudience",
                label: "Target audience?",
                placeholder: "e.g. Fitness enthusiasts 20-35, local parents..."
            },
            {
                type: "text",
                id: "mktPlatforms",
                label: "Main platform? (Meta/Google/etc.)",
                placeholder: "e.g. Meta ads, Google ads, Omnichannel..."
            },
            {
                type: "text",
                id: "mktLeadGoal",
                label: "Lead or sales goals?",
                placeholder: "e.g. 50 consultation bookings per month..."
            },
            {
                type: "select",
                id: "mktExisting",
                label: "Existing campaigns running?",
                options: ["No campaigns run yet", "Yes, running ads currently", "No, have run ads in the past"]
            },
            {
                type: "text",
                id: "mktLinks",
                label: "Website/social links?",
                placeholder: "e.g. instagram.com/mybrand"
            }
        ],
        "Brand Design": [
            {
                type: "text",
                id: "brandNameInput",
                label: "Brand/business name",
                placeholder: "Enter your brand or business name"
            },
            {
                type: "text",
                id: "brandIndustry",
                label: "Industry",
                placeholder: "e.g. Fashion, real estate, tech..."
            },
            {
                type: "select",
                id: "brandExisting",
                label: "Existing branding?",
                options: ["None (Starting from scratch)", "Yes, we need a complete redesign", "Yes, just need standard assets/updates"]
            },
            {
                type: "text",
                id: "brandStyle",
                label: "Preferred color/style",
                placeholder: "e.g. Luxury minimalist black & gold..."
            },
            {
                type: "text",
                id: "brandCompetitors",
                label: "Competitor brands",
                placeholder: "e.g. Competitor A, Competitor B"
            },
            {
                type: "select",
                id: "brandDeliverables",
                label: "Deliverables needed",
                options: [
                    "Full Brand Identity (Logo + guidelines)",
                    "Logo Design Only",
                    "Packaging / Label Design",
                    "Marketing Collateral & Banners"
                ]
            }
        ],
        "Content & Video": [
            {
                type: "select",
                id: "contentFocus",
                label: "Type of content needed",
                options: [
                    "Reels / Shorts (Short-form content)",
                    "Product Commercials / Videos",
                    "Motion Graphics & Animation",
                    "Promotional Content",
                    "Custom Brand Mix"
                ]
            },
            {
                type: "select",
                id: "contentVolume",
                label: "Number of videos/reels monthly",
                options: ["1 to 5 videos", "5 to 15 videos", "15 to 30 videos", "30+ videos"]
            },
            {
                type: "text",
                id: "contentPlatforms",
                label: "Platforms used",
                placeholder: "e.g. Instagram, TikTok, YouTube..."
            },
            {
                type: "select",
                id: "contentShooting",
                label: "Shooting required?",
                options: ["No, require editing/stock/motion only", "Yes, local shooting in NCR", "No, we will provide all raw footage"]
            },
            {
                type: "text",
                id: "contentStyleRef",
                label: "Editing style reference",
                placeholder: "e.g. Alex Hormozi style, clean minimal..."
            },
            {
                type: "textarea",
                id: "contentGoals",
                label: "Content goals",
                placeholder: "e.g. Brand awareness, product conversions..."
            }
        ],
        "Growth Strategy": [
            {
                type: "select",
                id: "growthCurrentRev",
                label: "Current monthly revenue",
                options: ["Starting up (₹0)", "Under ₹2L/month", "₹2L - ₹5L/month", "₹5L - ₹15L/month", "₹15L+ /month"]
            },
            {
                type: "select",
                id: "growthTargetRev",
                label: "Target monthly revenue",
                options: ["₹2L - ₹5L/month", "₹5L - ₹10L/month", "₹10L - ₹25L/month", "₹25L+/month"]
            },
            {
                type: "select",
                id: "growthModel",
                label: "Business model",
                options: ["E-commerce / D2C", "B2C (Products/Services directly)", "B2B (Selling to other businesses)", "SaaS / Digital Products"]
            },
            {
                type: "text",
                id: "growthCompetitors",
                label: "Major competitors",
                placeholder: "e.g. Competitor A, Competitor B"
            },
            {
                type: "textarea",
                id: "growthChallenge",
                label: "Biggest growth challenge",
                placeholder: "e.g. High customer acquisition costs..."
            },
            {
                type: "text",
                id: "growthChannels",
                label: "Current sales channels",
                placeholder: "e.g. Instagram organically, word of mouth..."
            }
        ],
        "AI Integration": [
            {
                type: "textarea",
                id: "aiWorkflows",
                label: "Current workflows",
                placeholder: "Briefly how support/sales are handled..."
            },
            {
                type: "select",
                id: "aiTeamSize",
                label: "Team size",
                options: ["1 (Solo founder)", "2 to 5 members", "5 to 15 members", "15+ members"]
            },
            {
                type: "text",
                id: "aiTasks",
                label: "Tasks to automate",
                placeholder: "e.g. FAQs, lead sorting, bookings..."
            },
            {
                type: "text",
                id: "aiTools",
                label: "CRM/tools currently used",
                placeholder: "e.g. Google Sheets, HubSpot, Zapier..."
            },
            {
                type: "select",
                id: "aiGoals",
                label: "AI goals",
                options: [
                    "Integrate AI chatbot on site/WhatsApp",
                    "Automate sales/lead qualification",
                    "Reduce support response time",
                    "Complete custom workflow automation"
                ]
            },
            {
                type: "textarea",
                id: "aiRequirements",
                label: "Custom requirements",
                placeholder: "Describe any specific AI setup needs..."
            }
        ],
        "Starter Boost - Growth Package": [
            {
                type: "text",
                id: "pkg1Socials",
                label: "Primary Social Channels",
                placeholder: "e.g. Instagram @handle, YouTube link"
            },
            {
                type: "select",
                id: "pkg1Focus",
                label: "Main Content Focus",
                options: [
                    "Short form Reels/Shorts",
                    "Photo graphics / Carousel posts",
                    "Social Media Strategy development",
                    "Standard balance of video & photo"
                ]
            },
            {
                type: "textarea",
                id: "pkg1Goals",
                label: "Goals with Starter Boost",
                placeholder: "What do you want to achieve with this starter package?"
            }
        ],
        "Growth Accelerator - Growth Package": [
            {
                type: "select",
                id: "pkg2AdSpend",
                label: "Current monthly ad spend",
                options: ["No ad spend yet", "Under ₹10,000/mo", "₹10,000 - ₹30,000/mo", "₹30,000+/mo"]
            },
            {
                type: "text",
                id: "pkg2Product",
                label: "Product/Service to promote",
                placeholder: "Describe what you are selling or generating leads for"
            },
            {
                type: "text",
                id: "pkg2Customer",
                label: "Ideal customer description",
                placeholder: "e.g. Local business owners, gym goers..."
            },
            {
                type: "textarea",
                id: "pkg2Goals",
                label: "Goals with Growth Accelerator",
                placeholder: "e.g. Scale customer base and launch Meta Ads..."
            }
        ],
        "Premium Domination - Growth Package": [
            {
                type: "text",
                id: "pkg3Volume",
                label: "Current Sales / Lead Volume",
                placeholder: "e.g. 200 orders/month, or 50 leads/month"
            },
            {
                type: "select",
                id: "pkg3Automations",
                label: "AI or Automations required",
                options: [
                    "Full automated sales funnel & nurturing",
                    "CRM automation & lead flows",
                    "WhatsApp API chatbot integrations",
                    "Not sure, need strategy recommendation"
                ]
            },
            {
                type: "select",
                id: "pkg3Budget",
                label: "Target monthly ad budget",
                options: ["₹50,000 - ₹1,50,000/mo", "Under ₹50,000/mo", "₹1,50,000+/mo"]
            },
            {
                type: "textarea",
                id: "pkg3Custom",
                label: "Custom Automations/Requirements",
                placeholder: "Describe your specific integration or strategy requirements..."
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

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle Form Submit and redirect to WhatsApp SMS
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('quoteName').value.trim();
            const phone = document.getElementById('quotePhone').value.trim();
            const business = document.getElementById('quoteBusiness').value.trim();
            const email = document.getElementById('quoteEmail').value.trim();
            const service = serviceSelect.value;

            // Compile dynamic answers based on active fields
            let detailsMessage = '';
            const fields = serviceFieldsMap[service];
            if (fields) {
                fields.forEach(field => {
                    const el = document.getElementById(field.id);
                    if (el) {
                        const val = el.value.trim();
                        detailsMessage += `\n${field.label}: ${val}`;
                    }
                });
            } else {
                const el = document.getElementById('quoteDetails');
                if (el) {
                    detailsMessage += `\nCustom Requirements: ${el.value.trim()}`;
                }
            }

            // Format a beautifully structured WhatsApp message matching exactly the user's specs
            const formattedMessage = 
`Hello, I want a quote.

Name: ${name}
Phone: ${phone}
Business: ${business}
Email: ${email}
Service: ${service}
${detailsMessage}

Please contact me.`;

            // WhatsApp link encoding
            const whatsappUrl = `https://wa.me/918368508556?text=${encodeURIComponent(formattedMessage)}`;

            // Open in a new tab
            window.open(whatsappUrl, '_blank');

            // Close modal after redirection
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

        // Do not show if dismissed or submitted in this session (unless reload cleared it)
        if (isDismissed || isSubmitted) return;

        // 2. Inject popup HTML into the document body
        const toastHTML = `
            <div id="leadToast" class="lead-toast">
                <div class="lead-toast-progress-container">
                    <div id="leadToastProgress" class="lead-toast-progress"></div>
                </div>
                <div class="lead-toast-header">
                    <div class="lead-toast-header-text">
                        <span class="lead-toast-title">Unlock Your <span class="gradient-text" style="color: #8CF665; background: linear-gradient(90deg, #8CF665, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Growth Plan</span></span>
                        <span class="lead-toast-subtitle">Exclusive offer for new visitors</span>
                    </div>
                    <button id="closeLeadToast" class="lead-toast-close" aria-label="Close popup">&times;</button>
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

        // 4. Minimized FAB Toggle Logic
        const showMinimizedFAB = () => {
            if (document.getElementById('leadFAB')) return;
            
            const fab = document.createElement('div');
            fab.id = 'leadFAB';
            fab.className = 'lead-fab';
            fab.innerHTML = '<i class="ph ph-chat-centered-text"></i>';
            fab.setAttribute('title', 'Claim Free Strategy Call');
            document.body.appendChild(fab);

            // Animate it in
            setTimeout(() => {
                fab.classList.add('active');
            }, 100);

            fab.addEventListener('click', () => {
                sessionStorage.removeItem('leadPopupDismissed');
                
                // Hide FAB
                fab.classList.remove('active');
                setTimeout(() => fab.remove(), 500);

                // Slide Lead Popup back up
                if (leadToast) {
                    leadToast.style.display = 'block';
                    setTimeout(() => {
                        leadToast.classList.add('active');
                        
                        // Hardware reset of the 60s laser progress bar countdown
                        if (leadProgress) {
                            leadProgress.style.transition = 'none';
                            leadProgress.style.width = '100%';
                            setTimeout(() => {
                                leadProgress.style.transition = 'width 60s linear';
                                leadProgress.style.width = '0%';
                            }, 50);
                        }

                        // Re-trigger auto dismiss timer
                        clearTimeout(autoDismissTimer);
                        autoDismissTimer = setTimeout(() => {
                            closePopup(false);
                        }, 60000);
                    }, 50);
                }
            });
        };

        // 5. Function to close/minimize the popup
        const closePopup = (dismissedByUser = false) => {
            if (!leadToast) return;
            leadToast.classList.remove('active');
            
            if (dismissedByUser) {
                sessionStorage.setItem('leadPopupDismissed', 'true');
                showMinimizedFAB();
            }
            
            clearTimeout(autoDismissTimer);
            
            // Retain in DOM but set display to none to support minimizing/maximizing
            setTimeout(() => {
                if (!leadToast.classList.contains('active')) {
                    leadToast.style.display = 'none';
                }
            }, 600);
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

        // 6. Handle initial session load state
        if (isDismissed) {
            // If they dismissed in this session, show the pulsing FAB immediately
            setTimeout(() => {
                showMinimizedFAB();
            }, 1000);
            leadToast.style.display = 'none';
        } else {
            // Trigger popup after 3 seconds
            setTimeout(() => {
                if (!leadToast) return;
                leadToast.classList.add('active');

                // Trigger CSS transition for the 60s progress bar
                setTimeout(() => {
                    if (leadProgress) {
                        leadProgress.style.width = '0%';
                    }
                }, 50);

                // Auto dismiss after 60 seconds (60000ms)
                autoDismissTimer = setTimeout(() => {
                    closePopup(false);
                }, 60000);
            }, 3000);
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
`Hello, I would like to claim my Free Strategy Call.

Name: ${name}
WhatsApp/Phone: ${phone}
Selected Service: ${service}${customQuestionLine}

Please connect with me.`;

                // WhatsApp link encoding
                const whatsappUrl = `https://wa.me/918368508556?text=${encodeURIComponent(formattedMessage)}`;

                // Open in a new tab
                window.open(whatsappUrl, '_blank');

                // Set session storage state so they aren't prompted again
                sessionStorage.setItem('leadPopupSubmitted', 'true');

                // Close and destroy popup
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
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Track mouse coordinates for spotlights
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Calculate tilt angles based on mouse position relative to card center
                const cardWidth = rect.width;
                const cardHeight = rect.height;
                const centerX = cardWidth / 2;
                const centerY = cardHeight / 2;
                
                // Max rotation: 12 degrees
                const rotateX = ((centerY - y) / centerY) * 12;
                const rotateY = ((x - centerX) / centerX) * 12;

                card.style.setProperty('--rotate-x', `${rotateX}deg`);
                card.style.setProperty('--rotate-y', `${rotateY}deg`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
                // Center coordinates on leave
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${rect.width / 2}px`);
                card.style.setProperty('--mouse-y', `${rect.height / 2}px`);
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