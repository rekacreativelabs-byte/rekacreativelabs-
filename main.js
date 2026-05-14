document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollReveal();
    initCounters();
    initMobileMenu();
});

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-links a');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

/* ===== PARTICLES CANVAS ===== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
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
            ctx.fillStyle = `rgba(140, 246, 101, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
        observer.observe(el);
    });

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* ===== COUNTERS ===== */
function initCounters() {
    const stats = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                const increment = target / 100;
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        entry.target.innerText = Math.ceil(count) + (entry.target.getAttribute('data-target') === '98' ? '' : '+');
                        setTimeout(updateCount, 20);
                    } else {
                        entry.target.innerText = target + (entry.target.getAttribute('data-target') === '98' ? '%' : '+');
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => observer.observe(stat));
}

/* ===== CALCULATOR LOGIC ===== */
function calculateMeta() {
    const budget = parseFloat(document.getElementById('meta-budget').value);
    const industry = document.getElementById('meta-industry').value;
    const ctr = parseFloat(document.getElementById('meta-ctr').value) / 100;
    
    const cpmMap = { ecommerce: 120, real_estate: 250, education: 180, healthcare: 200 };
    const cpm = cpmMap[industry] || 150;
    
    const impressions = (budget / cpm) * 1000;
    const clicks = impressions * ctr;
    const leads = clicks * 0.03; // 3% benchmark
    
    const resultsContainer = document.getElementById('meta-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem;">
                <div style="background: rgba(140, 246, 101, 0.05); padding: 1.5rem; border-radius: 16px;">
                    <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">Est. Impressions</span>
                    <span style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${Math.floor(impressions).toLocaleString()}</span>
                </div>
                <div style="background: rgba(140, 246, 101, 0.05); padding: 1.5rem; border-radius: 16px;">
                    <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">Est. Leads</span>
                    <span style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${Math.floor(leads)}</span>
                </div>
            </div>
        `;
    }
}

/* ===== SITE PREVIEW GENERATOR ===== */
function generateSitePreview() {
    const name = document.getElementById('biz-name').value || "Your Brand";
    const industry = document.getElementById('biz-industry').value;
    const style = document.getElementById('biz-style').value;
    const iframe = document.getElementById('previewIframe');
    if (!iframe) return;

    iframe.srcdoc = `<div style="height:100%; display:flex; align-items:center; justify-content:center; background:#070E0A; color:#8CF665; font-family:sans-serif;">Generating preview...</div>`;
    
    setTimeout(() => {
        const theme = style === 'dark' ? { bg: '#070E0A', text: '#fff', accent: '#8CF665' } : { bg: '#fff', text: '#070E0A', accent: '#036A3A' };
        iframe.srcdoc = `
            <body style="margin:0; background:${theme.bg}; color:${theme.text}; font-family:sans-serif; text-align:center; padding:50px;">
                <h1 style="color:${theme.accent}">${name}</h1>
                <p>Welcome to the future of ${industry}.</p>
                <div style="background:${theme.accent}; color:#000; padding:10px 20px; border-radius:50px; display:inline-block; margin-top:20px; font-weight:bold;">Get Started</div>
            </body>
        `;
        const urlBar = document.getElementById('previewUrl');
        if (urlBar) urlBar.innerText = `www.${name.toLowerCase().replace(/\s+/g, '')}.com`;
    }, 1500);
}
