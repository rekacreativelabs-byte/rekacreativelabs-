
// =========================================
// CURSOR FOLLOWER
// =========================================
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

// =========================================
// ANTIGRAVITY PARTICLE SYSTEM
// =========================================
const canvas = document.getElementById('particles-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.opacity = Math.random() * 0.5 + 0.1;
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;
            if (this.y < -10 || this.life > this.maxLife) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(140, 246, 101, ${this.opacity * (1 - this.life / this.maxLife)})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// =========================================
// TOOL SWITCHER — Full Sidebar + State Engine
// =========================================
function switchTool(id) {
    // Hide all panels
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));

    // Deactivate all sidebar tabs
    document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));

    // Show the target panel
    const targetPanel = document.getElementById('panel-' + id);
    if (targetPanel) targetPanel.classList.add('active');

    const sidebar = document.getElementById('toolsSidebar');
    const toggleBtn = document.getElementById('sidebarToggleMobile');

    if (id === 'hub') {
        // On hub, hide sidebar
        if (sidebar) {
            sidebar.classList.remove('visible', 'open');
        }
        if (toggleBtn) toggleBtn.style.display = 'none';
    } else {
        // On tool panels, show sidebar
        if (sidebar) sidebar.classList.add('visible');
        if (toggleBtn) toggleBtn.style.display = 'flex';

        // Set active sidebar tab
        const activeTab = document.querySelector(`.sidebar-tab[data-tool="${id}"]`);
        if (activeTab) activeTab.classList.add('active');

        // Close mobile drawer
        if (sidebar) sidebar.classList.remove('open');
    }

    // Scroll to top removed to prevent page jump
    // window.scrollTo({ top: 0, behavior: 'smooth' });

    // Init tool-specific logic
    if (id === 'chatbot' && !chatInitialized) initChat();
    if (id === 'dashboard') initDashboard();
    if (id === 'social') initSocialFeed();
    if (id === 'booking') renderCalendar();
    if (id === 'adbudget') calcBudget();
}

// =========================================
// MOBILE SIDEBAR TOGGLE
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('sidebarToggleMobile');
    const sidebar = document.getElementById('toolsSidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent bubbling to document
            sidebar.classList.toggle('open');
        });

        // Close sidebar on outside click (mobile)
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
});



// =========================================
// WEBSITE AUDIT
// =========================================
function runAudit() {
    const url = document.getElementById('audit-url').value.trim();
    if (!url) { alert('Please enter a URL'); return; }

    document.getElementById('audit-placeholder').style.display = 'none';
    document.getElementById('audit-results').style.display = 'none';
    document.getElementById('audit-loading-wrap').style.display = 'block';

    const fill = document.getElementById('audit-loading-fill');
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 8;
        if (width >= 100) { width = 100; clearInterval(interval); showAuditResults(); }
        fill.style.width = width + '%';
    }, 80);
}

function showAuditResults() {
    document.getElementById('audit-loading-wrap').style.display = 'none';
    document.getElementById('audit-results').style.display = 'block';
    document.getElementById('audit-email-cta').style.display = 'block';

    const score = Math.floor(Math.random() * 30 + 55);
    const maxDash = 427;
    const fill = maxDash - (maxDash * score / 100);
    document.getElementById('scoreCircle').style.strokeDashoffset = fill;
    document.getElementById('auditScoreNum').textContent = score;

    const checks = [
        { name: 'Page Speed', detail: 'LCP 2.4s — Good', status: 'pass' },
        { name: 'Mobile Friendly', detail: 'Responsive design detected', status: 'pass' },
        { name: 'SEO Meta Tags', detail: 'Missing OG tags & schema markup', status: 'warn' },
        { name: 'HTTPS / SSL', detail: 'Secure connection active', status: 'pass' },
        { name: 'Core Web Vitals', detail: 'CLS score needs improvement', status: 'warn' },
        { name: 'Broken Links', detail: '3 broken links found', status: 'fail' },
        { name: 'Image Optimization', detail: '12 images not compressed', status: 'fail' },
        { name: 'CTA Clarity', detail: 'Clear primary CTA present', status: 'pass' },
        { name: 'Sitemap', detail: 'Sitemap found & valid', status: 'pass' },
        { name: 'Conversion Leaks', detail: 'Long form detected on mobile', status: 'warn' },
    ];

    const icons = { pass: '<i class="ph ph-check-circle"></i>', warn: '<i class="ph ph-warning-circle"></i>', fail: '<i class="ph ph-x-circle"></i>' };
    const labels = { pass: 'PASS', warn: 'WARNING', fail: 'ISSUE' };

    document.getElementById('auditChecks').innerHTML = checks.map(c => `
        <div class="audit-check-item ${c.status}">
            <span class="check-icon">${icons[c.status]}</span>
            <div style="flex:1">
                <div class="check-name">${c.name}</div>
                <div class="check-detail">${c.detail}</div>
            </div>
            <span class="check-badge badge-${c.status}">${labels[c.status]}</span>
        </div>
    `).join('');
}

function showAuditSuccess() {
    document.getElementById('audit-email-cta').innerHTML = `
        <div class="success-box" style="padding:1.5rem;">
            <div class="s-icon"><i class="ph ph-envelope"></i></div>
            <h3>Report Sent!</h3>
            <p>Check your inbox for the full PDF audit report.</p>
        </div>`;
}

// =========================================
// AI CHATBOT — Unified Conversational Agent
// =========================================
let chatInitialized = false;
let chatState = { tool: null, step: 0, data: {} };

const WA_NUMBER = '918368508556';

function initChat() {
    chatInitialized = true;
    chatState = { tool: null, step: 0, data: {} };

    addBotMsg(`<div style="margin-bottom:12px;">Hey! 👋 I'm <strong style="color:var(--primary)">Reka AI</strong> — your Growth Agent.<br><span style="color:var(--text-secondary);font-size:0.88rem;">Pick a tool below or type what you need:</span></div>
    <div class="chat-tool-grid">
        <button class="chat-tool-chip" onclick="startChatTool('audit')"><i class="ph ph-magnifying-glass"></i> Website Audit</button>
        <button class="chat-tool-chip" onclick="startChatTool('quiz')"><i class="ph ph-chart-bar"></i> Strategy Quiz</button>
        <button class="chat-tool-chip" onclick="startChatTool('adbudget')"><i class="ph ph-money"></i> Ad Budget</button>
        <button class="chat-tool-chip" onclick="startChatTool('landing')"><i class="ph ph-target"></i> Landing Analyzer</button>
        <button class="chat-tool-chip" onclick="startChatTool('aicheck')"><i class="ph ph-brain"></i> AI Readiness</button>
        <button class="chat-tool-chip" onclick="startChatTool('social')"><i class="ph ph-star"></i> Social Proof</button>
        <button class="chat-tool-chip" onclick="startChatTool('booking')"><i class="ph ph-calendar"></i> Book a Call</button>
        <button class="chat-tool-chip" onclick="startChatTool('dashboard')"><i class="ph ph-trend-up"></i> Dashboard</button>
        <button class="chat-tool-chip" onclick="startChatTool('pricing')"><i class="ph ph-tag"></i> Pricing Plans</button>
    </div>`);
}

function startChatTool(tool) {
    chatState = { tool, step: 1, data: {} };

    const toolStarters = {
        'audit': () => {
            addUserMsg('Website Audit');
            showTyping(() => addBotMsg(`<i class="ph ph-magnifying-glass"></i> <strong>Website Audit Tool</strong><br><span style="color:var(--text-secondary);font-size:0.88rem;">Enter your website URL and I'll run a full SEO, speed & UX scan.</span>
            <div class="chat-widget">
                <div class="chat-widget-field">
                    <label>Your Website URL</label>
                    <input id="cw-audit-url" type="url" placeholder="https://yoursite.com" class="chat-widget-input"/>
                </div>
                <div class="chat-widget-field">
                    <label>Industry</label>
                    <select id="cw-audit-industry" class="chat-widget-input">
                        <option value="ecommerce">E-commerce</option>
                        <option value="saas">SaaS / Tech</option>
                        <option value="agency">Agency</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="realestate">Real Estate</option>
                        <option value="education">Education</option>
                    </select>
                </div>
                <button class="chat-widget-btn" onclick="runChatAudit()"><i class="ph ph-lightning"></i> Run Audit Now</button>
            </div>`));
        },
        'quiz': () => {
            addUserMsg('Strategy Quiz');
            showTyping(() => {
                chatState.step = 1;
                chatState.data.answers = {};
                addBotMsg(getChatQuizStep(1));
            });
        },
        'adbudget': () => {
            addUserMsg('Ad Budget Planner');
            showTyping(() => addBotMsg(`<i class="ph ph-money"></i> <strong>Ad Budget Planner</strong><br><span style="color:var(--text-secondary);font-size:0.88rem;">Let me forecast your ad performance.</span>
            <div class="chat-widget">
                <div class="chat-widget-field">
                    <label>Industry</label>
                    <select id="cw-bp-industry" class="chat-widget-input">
                        <option value="ecommerce">E-commerce</option>
                        <option value="saas">SaaS / Tech</option>
                        <option value="realestate">Real Estate</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                    </select>
                </div>
                <div class="chat-widget-field">
                    <label>Monthly Budget (₹)</label>
                    <input id="cw-bp-budget" type="number" placeholder="100000" class="chat-widget-input" value="100000"/>
                </div>
                <div class="chat-widget-field">
                    <label>Target ROAS</label>
                    <select id="cw-bp-roas" class="chat-widget-input">
                        <option value="2">2x</option>
                        <option value="3" selected>3x</option>
                        <option value="4">4x</option>
                        <option value="5">5x</option>
                        <option value="7">7x</option>
                        <option value="10">10x</option>
                    </select>
                </div>
                <div class="chat-widget-field">
                    <label>Primary Platform</label>
                    <select id="cw-bp-platform" class="chat-widget-input">
                        <option value="meta">Meta (Facebook/Instagram)</option>
                        <option value="google">Google Ads</option>
                        <option value="youtube">YouTube Ads</option>
                        <option value="mixed">Mixed Channels</option>
                    </select>
                </div>
                <button class="chat-widget-btn" onclick="runChatBudget()"><i class="ph ph-calculator"></i> Calculate Forecast</button>
            </div>`));
        },
        'landing': () => {
            addUserMsg('Landing Page Analyzer');
            showTyping(() => addBotMsg(`<i class="ph ph-target"></i> <strong>Landing Page Analyzer</strong><br><span style="color:var(--text-secondary);font-size:0.88rem;">Enter your landing page URL to analyze conversions.</span>
            <div class="chat-widget">
                <div class="chat-widget-field">
                    <label>Landing Page URL</label>
                    <input id="cw-lp-url" type="url" placeholder="https://yourpage.com" class="chat-widget-input"/>
                </div>
                <div class="chat-widget-field">
                    <label>Page Type</label>
                    <select id="cw-lp-type" class="chat-widget-input">
                        <option value="lead">Lead Generation</option>
                        <option value="sales">Sales / Product</option>
                        <option value="webinar">Webinar / Event</option>
                        <option value="app">App Download</option>
                    </select>
                </div>
                <button class="chat-widget-btn" onclick="runChatLanding()"><i class="ph ph-chart-line"></i> Analyze Now</button>
            </div>`));
        },
        'aicheck': () => {
            addUserMsg('AI Readiness Checker');
            showTyping(() => addBotMsg(`<i class="ph ph-brain"></i> <strong>AI Readiness Checker</strong><br><span style="color:var(--text-secondary);font-size:0.88rem;">Let me assess how AI-ready your business is.</span>
            <div class="chat-widget">
                <div class="chat-widget-field">
                    <label>Business Size</label>
                    <select id="cw-ai-size" class="chat-widget-input">
                        <option value="solo">Solo / Freelancer</option>
                        <option value="small">Small (2–10 employees)</option>
                        <option value="mid">Mid (11–50 employees)</option>
                        <option value="large">Large (51–200 employees)</option>
                        <option value="enterprise">Enterprise (200+)</option>
                    </select>
                </div>
                <div class="chat-widget-field">
                    <label>Tech Stack</label>
                    <select id="cw-ai-tech" class="chat-widget-input">
                        <option value="basic">Basic (Email + Spreadsheets)</option>
                        <option value="crm">CRM + Marketing Tools</option>
                        <option value="integrated">Integrated SaaS Stack</option>
                        <option value="advanced">Advanced + APIs + Custom</option>
                    </select>
                </div>
                <div class="chat-widget-field">
                    <label>Data Quality</label>
                    <select id="cw-ai-data" class="chat-widget-input">
                        <option value="poor">Poor — scattered, inconsistent</option>
                        <option value="fair">Fair — organized in some areas</option>
                        <option value="good">Good — centralized, mostly clean</option>
                        <option value="excellent">Excellent — structured pipelines</option>
                    </select>
                </div>
                <button class="chat-widget-btn" onclick="runChatAI()"><i class="ph ph-lightning"></i> Check AI Readiness</button>
            </div>`));
        },
        'social': () => {
            addUserMsg('Social Proof');
            showTyping(() => {
                const feedHtml = [
                    { icon: '🏆', text: '<strong>ZestMart</strong> achieved <strong>4.7x ROAS</strong> on Meta Ads', time: '8 min ago' },
                    { icon: '⭐', text: '<strong>Priya M.</strong> left a 5-star review — "Best agency in India!"', time: '14 min ago' },
                    { icon: '🎯', text: '<strong>UrbanKart</strong> generated 247 leads this week', time: '22 min ago' },
                    { icon: '🚀', text: '<strong>StartupX</strong> launched — 312% reach boost', time: '35 min ago' },
                    { icon: '📈', text: '<strong>EduSpark</strong> grew organic traffic by 189%', time: '51 min ago' },
                ].map(f => `<div class="chat-feed-item"><span>${f.icon}</span><div><div style="font-size:0.82rem">${f.text}</div><div style="font-size:0.73rem;color:var(--text-secondary)">${f.time}</div></div></div>`).join('');
                addBotMsg(`<i class="ph ph-star"></i> <strong>Social Proof Dashboard</strong>
                <div class="chat-widget" style="padding:12px;">
                    <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:12px;">
                        <div class="chat-stat-box"><span class="lbl">Clients</span><span class="val">247+</span></div>
                        <div class="chat-stat-box"><span class="lbl">Avg ROAS</span><span class="val">4.8x</span></div>
                        <div class="chat-stat-box"><span class="lbl">Leads</span><span class="val">1.2M+</span></div>
                        <div class="chat-stat-box"><span class="lbl">Reviews</span><span class="val">⭐ 4.9</span></div>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:8px;">${feedHtml}</div>
                    <button class="chat-widget-btn" onclick="startChatTool('booking')"><i class="ph ph-calendar"></i> Book a Strategy Call</button>
                </div>`);
            });
        },
        'booking': () => {
            addUserMsg('Book a Call');
            showTyping(() => {
                chatState.tool = 'booking';
                chatState.step = 1;
                addBotMsg(`<i class="ph ph-calendar"></i> <strong>Book a Free Strategy Call</strong><br><span style="color:var(--text-secondary);font-size:0.88rem;">30 minutes, no obligations. Pick a date that works:</span>
                <div class="chat-widget">
                    <div class="chat-calendar">${getChatCalDays()}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:10px;" id="cw-booking-step2" style="display:none;"></div>
                </div>`);
            });
        },
        'dashboard': () => {
            addUserMsg('Marketing Dashboard');
            showTyping(() => {
                const d = { roas: '5.1x', leads: '987', spend: '₹9.4L', growth: '+67%', sessions: '58K' };
                addBotMsg(`<i class="ph ph-trend-up"></i> <strong>Live Marketing Dashboard</strong> <span style="font-size:0.75rem;color:var(--primary);margin-left:6px;">Last 90 days</span>
                <div class="chat-widget">
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
                        <div class="chat-stat-box"><span class="lbl">Ad Spend</span><span class="val">${d.spend}</span></div>
                        <div class="chat-stat-box"><span class="lbl">Leads</span><span class="val">${d.leads}</span></div>
                        <div class="chat-stat-box"><span class="lbl">ROAS</span><span class="val">${d.roas}</span></div>
                        <div class="chat-stat-box"><span class="lbl">Growth</span><span class="val" style="color:#4ADE80;">${d.growth}</span></div>
                        <div class="chat-stat-box"><span class="lbl">Sessions</span><span class="val">${d.sessions}</span></div>
                        <div class="chat-stat-box"><span class="lbl">CTR</span><span class="val">3.8%</span></div>
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px;">Channel Performance</div>
                    ${[
                        { name: 'Meta Ads', pct: 40, roas: '5.2x' },
                        { name: 'Google Ads', pct: 35, roas: '4.8x' },
                        { name: 'YouTube', pct: 15, roas: '3.9x' },
                        { name: 'Email', pct: 10, roas: '7.1x' },
                    ].map(c => `<div style="margin-bottom:10px;">
                        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px;"><span>${c.name}</span><span style="color:var(--primary)">${c.roas} ROAS</span></div>
                        <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:5px;overflow:hidden;"><div style="background:var(--primary);width:${c.pct}%;height:100%;border-radius:4px;"></div></div>
                    </div>`).join('')}
                    <button class="chat-widget-btn" onclick="startChatTool('booking')"><i class="ph ph-calendar"></i> Get a Custom Dashboard for My Brand</button>
                </div>`);
            });
        },
        'pricing': () => {
            addUserMsg('Pricing Plans');
            showTyping(() => addBotMsg(`<i class="ph ph-tag"></i> <strong>Reka Growth Packages</strong>
            <div class="chat-widget">
                ${[
                    { name: 'Starter', price: '₹25K', period: '/month', features: ['2 Ad Campaigns', 'SEO Basics', 'Monthly Report', 'WhatsApp Support'], cta: 'starter' },
                    { name: 'Growth', price: '₹75K', period: '/month', features: ['5 Campaigns + Retargeting', 'SEO + Content (4 blogs)', 'Bi-weekly Reports', 'Dedicated Manager'], cta: 'growth', highlight: true },
                    { name: 'Scale', price: '₹1.5L', period: '/month', features: ['Unlimited Campaigns', 'Full-stack SEO + Content', 'AI Automation', 'Weekly Strategy Calls'], cta: 'scale' },
                ].map(p => `
                <div style="padding:12px;border-radius:10px;border:1px solid ${p.highlight ? 'rgba(140,246,101,0.4)' : 'rgba(255,255,255,0.06)'};background:${p.highlight ? 'rgba(140,246,101,0.06)' : 'rgba(255,255,255,0.02)'};margin-bottom:10px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <strong style="font-size:1rem;">${p.name}</strong>
                        ${p.highlight ? '<span style="font-size:0.7rem;background:var(--primary);color:#000;padding:2px 8px;border-radius:20px;font-weight:700;">Most Popular</span>' : ''}
                        <span style="color:var(--primary);font-weight:800;font-size:1.1rem;">${p.price}<span style="font-size:0.75rem;color:var(--text-secondary)">${p.period}</span></span>
                    </div>
                    <ul style="list-style:none;padding:0;margin-bottom:8px;">${p.features.map(f => `<li style="font-size:0.78rem;color:var(--text-secondary);padding:2px 0;"><span style="color:var(--primary);margin-right:6px;">✓</span>${f}</li>`).join('')}</ul>
                    <button class="chat-widget-btn" style="margin-top:0;" onclick="chatGetPackage('${p.cta}','${p.name}','${p.price}')"><i class="ph ph-whatsapp-logo"></i> Get ${p.name} Plan</button>
                </div>`).join('')}
            </div>`));
        },
    };

    if (toolStarters[tool]) toolStarters[tool]();
}

// =========================================
// CHAT TOOL ENGINES
// =========================================

function runChatAudit() {
    const url = document.getElementById('cw-audit-url') ? document.getElementById('cw-audit-url').value.trim() : '';
    const industry = document.getElementById('cw-audit-industry') ? document.getElementById('cw-audit-industry').value : 'ecommerce';
    if (!url) { alert('Please enter a URL'); return; }
    addUserMsg(`Audit: ${url} (${industry})`);
    showTyping(() => {
        const score = Math.floor(Math.random() * 30 + 55);
        const maxDash = 251;
        const strokeOffset = maxDash - (maxDash * score / 100);
        const checks = [
            { name: 'Page Speed', status: 'pass', detail: 'LCP 2.4s' },
            { name: 'Mobile UX', status: 'pass', detail: 'Responsive' },
            { name: 'SEO Tags', status: 'warn', detail: 'Missing OG tags' },
            { name: 'Core Vitals', status: 'warn', detail: 'CLS needs work' },
            { name: 'SSL / HTTPS', status: 'pass', detail: 'Secure' },
            { name: 'Broken Links', status: 'fail', detail: '3 found' },
        ];
        const statusColor = { pass: 'var(--primary)', warn: '#FFC832', fail: '#FF6B6B' };
        const statusIcon = { pass: '✓', warn: '⚠', fail: '✗' };
        addBotMsg(`<strong>Audit Complete</strong> — ${url}
        <div class="chat-widget">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
                <svg width="70" height="70" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(140,246,101,0.1)" stroke-width="8"/>
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#8CF665" stroke-width="8" stroke-linecap="round"
                        stroke-dasharray="${maxDash}" stroke-dashoffset="${strokeOffset}"
                        style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1.5s ease;"/>
                    <text x="40" y="46" text-anchor="middle" font-size="16" font-weight="900" fill="#8CF665">${score}</text>
                </svg>
                <div>
                    <div style="font-size:1.4rem;font-weight:800;color:var(--primary)">${score}/100</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">Overall Website Score</div>
                    <div style="font-size:0.75rem;color:${score >= 70 ? '#4ADE80' : score >= 55 ? '#FFC832' : '#FF6B6B'};font-weight:600;margin-top:4px;">${score >= 70 ? '🟢 Good — small wins ahead' : score >= 55 ? '🟡 Needs improvement' : '🔴 Urgent fixes needed'}</div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
                ${checks.map(c => `
                    <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.04);">
                        <span style="color:${statusColor[c.status]};font-weight:700;width:16px;text-align:center;">${statusIcon[c.status]}</span>
                        <div style="flex:1;font-size:0.8rem;"><strong>${c.name}</strong> — <span style="color:var(--text-secondary)">${c.detail}</span></div>
                    </div>`).join('')}
            </div>
            <button class="chat-widget-btn" onclick="chatAuditWA('${url}', ${score})"><i class="ph ph-whatsapp-logo"></i> Get Full Report on WhatsApp</button>
        </div>`);
    }, 2000);
}

function chatAuditWA(url, score) {
    const msg = `Hello Reka Creative Labs!\n\n🔍 I just ran a Website Audit.\n\nWebsite: ${url}\nAudit Score: ${score}/100\n\nPlease send me the full PDF report and suggest improvements for my website.\n\nThank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function runChatBudget() {
    const industry = document.getElementById('cw-bp-industry') ? document.getElementById('cw-bp-industry').value : 'ecommerce';
    const budget = parseFloat(document.getElementById('cw-bp-budget') ? document.getElementById('cw-bp-budget').value : 100000);
    const roas = parseFloat(document.getElementById('cw-bp-roas') ? document.getElementById('cw-bp-roas').value : 3);
    const platform = document.getElementById('cw-bp-platform') ? document.getElementById('cw-bp-platform').value : 'meta';

    const cpmMap = { ecommerce: 120, saas: 200, realestate: 280, healthcare: 250, education: 160 };
    const cpcMap = { meta: 8, google: 25, youtube: 6, mixed: 12 };
    const cpm = cpmMap[industry] || 150;
    const cpc = cpcMap[platform] || 10;
    const reach = Math.floor((budget / cpm) * 1000);
    const clicks = Math.floor(budget / cpc);
    const leads = Math.floor(clicks * 0.035);
    const revenue = Math.floor(budget * roas);
    const cpl = Math.floor(budget / (leads || 1));

    addUserMsg(`Budget: ₹${budget.toLocaleString('en-IN')} | ${platform.toUpperCase()} | ${roas}x ROAS`);
    showTyping(() => {
        addBotMsg(`<strong>Ad Forecast Results</strong>
        <div class="chat-widget">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
                <div class="chat-stat-box"><span class="lbl">Reach</span><span class="val">${reach.toLocaleString('en-IN')}</span></div>
                <div class="chat-stat-box"><span class="lbl">Clicks</span><span class="val">${clicks.toLocaleString('en-IN')}</span></div>
                <div class="chat-stat-box"><span class="lbl">Leads</span><span class="val">${leads}</span></div>
                <div class="chat-stat-box"><span class="lbl">Revenue</span><span class="val">₹${revenue.toLocaleString('en-IN')}</span></div>
                <div class="chat-stat-box"><span class="lbl">CPL</span><span class="val">₹${cpl.toLocaleString('en-IN')}</span></div>
                <div class="chat-stat-box"><span class="lbl">ROAS</span><span class="val" style="color:#4ADE80;">${roas}x</span></div>
            </div>
            <button class="chat-widget-btn" onclick="chatBudgetWA(${budget},${roas},'${platform}','${industry}')"><i class="ph ph-whatsapp-logo"></i> Get a Custom Ad Strategy</button>
        </div>`);
    });
}

function chatBudgetWA(budget, roas, platform, industry) {
    const msg = `Hello Reka Creative Labs!\n\n📊 I used your Ad Budget Planner.\n\nBudget: ₹${budget.toLocaleString('en-IN')}/month\nTarget ROAS: ${roas}x\nPlatform: ${platform}\nIndustry: ${industry}\n\nPlease help me build a custom paid ad strategy for my business!\n\nThank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function runChatLanding() {
    const url = document.getElementById('cw-lp-url') ? document.getElementById('cw-lp-url').value.trim() : '';
    const type = document.getElementById('cw-lp-type') ? document.getElementById('cw-lp-type').value : 'lead';
    if (!url) { alert('Please enter a URL'); return; }
    addUserMsg(`Landing page: ${url}`);
    showTyping(() => {
        const score = Math.floor(Math.random() * 25 + 55);
        const cats = [
            { name: 'CTA Clarity', score: Math.floor(Math.random() * 30 + 60) },
            { name: 'Trust Elements', score: Math.floor(Math.random() * 30 + 50) },
            { name: 'Copy Quality', score: Math.floor(Math.random() * 20 + 65) },
            { name: 'Mobile UX', score: Math.floor(Math.random() * 35 + 50) },
            { name: 'Page Speed', score: Math.floor(Math.random() * 40 + 40) },
        ];
        addBotMsg(`<strong>Landing Page Analysis</strong> — ${url}
        <div class="chat-widget">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <div style="font-size:2.2rem;font-weight:900;color:var(--primary);">${score}</div>
                <div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">CRO Score / 100</div>
                    <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:6px;width:140px;margin-top:4px;overflow:hidden;">
                        <div style="background:var(--primary);width:${score}%;height:100%;border-radius:4px;"></div>
                    </div>
                </div>
            </div>
            ${cats.map(c => `
            <div style="margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:3px;">
                    <span>${c.name}</span><span style="color:var(--primary)">${c.score}/100</span>
                </div>
                <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:4px;overflow:hidden;">
                    <div style="background:${c.score >= 70 ? 'var(--primary)' : c.score >= 55 ? '#FFC832' : '#FF6B6B'};width:${c.score}%;height:100%;border-radius:4px;"></div>
                </div>
            </div>`).join('')}
            <button class="chat-widget-btn" onclick="chatLandingWA('${url}',${score})"><i class="ph ph-whatsapp-logo"></i> Get Optimization Plan on WhatsApp</button>
        </div>`);
    }, 2000);
}

function chatLandingWA(url, score) {
    const msg = `Hello Reka Creative Labs!\n\n🎯 I analyzed my landing page.\n\nURL: ${url}\nCRO Score: ${score}/100\n\nPlease send me a detailed optimization plan to boost my conversion rate!\n\nThank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function runChatAI() {
    const size = document.getElementById('cw-ai-size') ? document.getElementById('cw-ai-size').value : 'small';
    const tech = document.getElementById('cw-ai-tech') ? document.getElementById('cw-ai-tech').value : 'crm';
    const data = document.getElementById('cw-ai-data') ? document.getElementById('cw-ai-data').value : 'fair';
    const techScore = { basic: 25, crm: 50, integrated: 70, advanced: 90 };
    const dataScore = { poor: 20, fair: 45, good: 70, excellent: 95 };
    const sizeBonus = { solo: 0, small: 5, mid: 10, large: 15, enterprise: 20 };
    const totalScore = Math.min(Math.round((techScore[tech] + dataScore[data]) / 2 + sizeBonus[size]), 100);
    addUserMsg('Check AI Readiness');
    showTyping(() => {
        const pillars = [
            { name: 'Data Quality', score: dataScore[data] },
            { name: 'Tech Stack', score: techScore[tech] },
            { name: 'Team Readiness', score: Math.min(Math.round(totalScore * 0.9), 100) },
            { name: 'Process Maturity', score: Math.min(Math.round(totalScore * 0.85), 100) },
            { name: 'AI Adoption', score: Math.min(Math.round(totalScore * 0.7), 100) },
        ];
        const grade = totalScore >= 80 ? '🏆 AI-Ready — Scale Now' : totalScore >= 60 ? '📈 Good Foundation' : totalScore >= 40 ? '⚠️ Needs Work' : '🌱 Early Stage';
        addBotMsg(`<strong>AI Readiness Score</strong>
        <div class="chat-widget">
            <div style="text-align:center;margin-bottom:12px;">
                <div style="font-size:2.5rem;font-weight:900;color:var(--primary)">${totalScore}</div>
                <div style="font-size:0.82rem;color:var(--text-secondary)">${grade}</div>
            </div>
            ${pillars.map(p => `
            <div style="margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:3px;">
                    <span>${p.name}</span><span style="color:var(--primary)">${p.score}/100</span>
                </div>
                <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:4px;overflow:hidden;">
                    <div style="background:var(--primary);width:${p.score}%;height:100%;border-radius:4px;transition:width 1s ease;"></div>
                </div>
            </div>`).join('')}
            <button class="chat-widget-btn" onclick="chatAIWA(${totalScore})"><i class="ph ph-whatsapp-logo"></i> Get AI Implementation Roadmap</button>
        </div>`);
    });
}

function chatAIWA(score) {
    const msg = `Hello Reka Creative Labs!\n\n🤖 I checked my AI Readiness.\n\nAI Readiness Score: ${score}/100\n\nPlease share an AI automation implementation roadmap for my business!\n\nThank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Chat quiz steps
const chatQuizQuestions = [
    { q: 'What best describes your business?', opts: [['Startup (<1 yr)', 'startup'], ['Growing Fast', 'growth'], ['Established Brand', 'established'], ['Enterprise', 'enterprise']] },
    { q: 'Primary marketing challenge?', opts: [['Not enough traffic', 'traffic'], ['Need quality leads', 'leads'], ['Low conversions', 'convert'], ['Retaining customers', 'retain']] },
    { q: 'Monthly marketing budget?', opts: [['Under ₹50K', 'small'], ['₹50K – ₹2L', 'mid'], ['₹2L – ₹10L', 'large'], ['₹10L+', 'xlarge']] },
    { q: 'Channels you\'ve tried?', opts: [['Nothing yet', 'none'], ['Organic Social', 'social'], ['Paid Ads', 'paid'], ['Multi-channel', 'all']] },
    { q: 'Top priority right now?', opts: [['Fast results (30 days)', 'speed'], ['Long-term scale', 'scale'], ['Brand authority', 'brand'], ['AI automation', 'automate']] },
];

function getChatQuizStep(step) {
    const q = chatQuizQuestions[step - 1];
    return `<strong>Question ${step} of ${chatQuizQuestions.length}</strong>
    <div style="margin:8px 0 4px;font-size:0.95rem;font-weight:600;">${q.q}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">
        ${q.opts.map(([label, val]) => `<button class="chat-quiz-opt" onclick="selectChatQuiz(${step},'${val}','${label}')">${label}</button>`).join('')}
    </div>`;
}

function selectChatQuiz(step, val, label) {
    chatState.data[`q${step}`] = val;
    addUserMsg(label);
    const nextStep = step + 1;
    if (nextStep <= chatQuizQuestions.length) {
        chatState.step = nextStep;
        showTyping(() => addBotMsg(getChatQuizStep(nextStep)));
    } else {
        showTyping(() => showChatQuizResult());
    }
}

function showChatQuizResult() {
    const d = chatState.data;
    const results = {
        startup: '🚀 Fast-Track Growth Package — Meta Ads + Landing Page combo for quick lead generation. Budget: ₹50K–1.5L/month.',
        growth: '🎯 Lead Generation Machine — Multi-channel paid ads with CRM automation to scale lead flow.',
        established: '💸 CRO + Retention Focus — Optimize conversions, retargeting & email sequences for max ROI.',
        enterprise: '🌐 Enterprise Growth Suite — Full-stack strategy, AI automation & dedicated account management.',
    };
    const recommendation = results[d.q1] || results.established;
    addBotMsg(`<strong>🎉 Your Growth Strategy</strong>
    <div class="chat-widget">
        <div style="padding:12px;background:rgba(140,246,101,0.06);border-radius:10px;border:1px solid rgba(140,246,101,0.2);margin-bottom:12px;">
            <div style="font-size:0.88rem;line-height:1.6;">${recommendation}</div>
        </div>
        <button class="chat-widget-btn" onclick="chatQuizWA()"><i class="ph ph-whatsapp-logo"></i> Get My Custom Strategy on WhatsApp</button>
        <button class="chat-widget-btn" style="background:transparent;border:1px solid var(--primary);color:var(--primary);margin-top:6px;" onclick="startChatTool('quiz')"><i class="ph ph-arrows-clockwise"></i> Retake Quiz</button>
    </div>`);
}

function chatQuizWA() {
    const d = chatState.data;
    const msg = `Hello Reka Creative Labs!\n\n📊 I just completed the Strategy Quiz.\n\nBusiness Stage: ${d.q1 || 'N/A'}\nChallenge: ${d.q2 || 'N/A'}\nBudget: ${d.q3 || 'N/A'}\nChannels: ${d.q4 || 'N/A'}\nPriority: ${d.q5 || 'N/A'}\n\nPlease share a personalized growth strategy for my business!\n\nThank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function getChatCalDays() {
    const today = new Date();
    const slots = [];
    for (let i = 1; i <= 9; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dow = d.getDay();
        if (dow === 0 || dow === 6) continue;
        const label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
        slots.push(`<div class="chat-cal-day" onclick="selectChatDate('${label}', this)">${label}</div>`);
        if (slots.length >= 6) break;
    }
    return slots.join('');
}

function selectChatDate(dateLabel, el) {
    document.querySelectorAll('.chat-cal-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    chatState.data.date = dateLabel;

    let step2 = el.closest('.chat-widget').querySelector('#cw-booking-step2');
    if (!step2) {
        step2 = document.createElement('div');
        step2.id = 'cw-booking-step2';
        el.closest('.chat-widget').appendChild(step2);
    }
    step2.innerHTML = `
        <div style="margin-top:12px;font-size:0.82rem;color:var(--text-secondary);margin-bottom:6px;">Pick a time for <strong>${dateLabel}</strong>:</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
            ${['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
                .map(t => `<button class="chat-chip" onclick="selectChatTime('${t}', this)">${t}</button>`).join('')}
        </div>`;
}

function selectChatTime(time, el) {
    document.querySelectorAll('#cw-booking-step2 .chat-chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    chatState.data.time = time;

    let step3 = document.getElementById('cw-booking-step3');
    if (!step3) {
        step3 = document.createElement('div');
        step3.id = 'cw-booking-step3';
        el.closest('.chat-widget').appendChild(step3);
    }
    step3.innerHTML = `
        <div class="chat-widget-field" style="margin-top:10px;"><label>Your Name</label><input id="cw-bk-name" class="chat-widget-input" placeholder="Arjun Sharma"/></div>
        <div class="chat-widget-field"><label>Phone / WhatsApp</label><input id="cw-bk-phone" class="chat-widget-input" placeholder="+91 98765 43210" type="tel"/></div>
        <div class="chat-widget-field"><label>What to discuss?</label>
        <select id="cw-bk-topic" class="chat-widget-input">
            <option>SEO & Content Strategy</option><option>Paid Ads (Meta / Google)</option><option>Full Digital Audit</option><option>AI Automation</option><option>Website Redesign</option>
        </select></div>
        <button class="chat-widget-btn" onclick="confirmChatBooking()"><i class="ph ph-whatsapp-logo"></i> Confirm on WhatsApp</button>`;
}

function confirmChatBooking() {
    const name = document.getElementById('cw-bk-name') ? document.getElementById('cw-bk-name').value.trim() : '';
    const phone = document.getElementById('cw-bk-phone') ? document.getElementById('cw-bk-phone').value.trim() : '';
    const topic = document.getElementById('cw-bk-topic') ? document.getElementById('cw-bk-topic').value : '';
    if (!name || !phone) { alert('Please enter your name and phone'); return; }
    const date = chatState.data.date || 'Date TBD';
    const time = chatState.data.time || 'Time TBD';
    const msg = `Hello Reka Creative Labs! 👋\n\n📅 I'd like to book a Free Strategy Call.\n\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nTime: ${time} IST\nTopic: ${topic}\n\nPlease confirm my slot. Thank you!`;
    addUserMsg(`Booking confirmed: ${date} at ${time}`);
    showTyping(() => addBotMsg(`<strong>🎉 Booking Sent!</strong><br><span style="color:var(--text-secondary);font-size:0.88rem;">Your call is scheduled for <strong style="color:var(--primary)">${date} at ${time} IST</strong>. We'll confirm via WhatsApp shortly!</span>
    <div style="margin-top:8px;">
        <button class="chat-widget-btn" onclick="window.open('https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}','_blank')"><i class="ph ph-whatsapp-logo"></i> Open WhatsApp Confirmation</button>
    </div>`));
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function chatGetPackage(cta, name, price) {
    const msg = `Hello Reka Creative Labs! 👋\n\n💼 I'm interested in the *${name} Plan* (${price}/month).\n\nPlease share more details and help me get started!\n\nThank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// =========================================
// SHARED CHAT HELPERS
// =========================================
function getBotReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('audit') || m.includes('website') || m.includes('seo')) return null; // handled via startChatTool
    if (m.includes('budget') || m.includes('ads') || m.includes('roas')) { startChatTool('adbudget'); return null; }
    if (m.includes('quiz') || m.includes('strategy')) { startChatTool('quiz'); return null; }
    if (m.includes('book') || m.includes('call') || m.includes('schedule')) { startChatTool('booking'); return null; }
    if (m.includes('landing') || m.includes('cro') || m.includes('conversion')) { startChatTool('landing'); return null; }
    if (m.includes('ai') || m.includes('readiness') || m.includes('automat')) { startChatTool('aicheck'); return null; }
    if (m.includes('price') || m.includes('cost') || m.includes('plan') || m.includes('package')) { startChatTool('pricing'); return null; }
    if (m.includes('dashboard') || m.includes('metric') || m.includes('report')) { startChatTool('dashboard'); return null; }
    if (m.includes('hi') || m.includes('hello') || m.includes('hey')) return `Hey! 👋 I'm Reka AI. I can run audits, quizzes, budget forecasts, and more — all right here in chat. What can I help you with?`;
    if (m.includes('service') || m.includes('offer')) { startChatTool('pricing'); return null; }
    return `Great question! I can help you with Website Audits, Ad Budgets, AI Readiness, Strategy Quiz, or Book a Call. Type what you need or pick from the quick actions. 👇`;
}

function showTyping(callback, delay = 1000) {
    const msgs = document.getElementById('chatMessages');
    if (!msgs) { callback(); return; }
    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.id = 'typing-indicator';
    typing.innerHTML = `<div class="msg-avatar"><i class="ph ph-robot"></i></div><div class="msg-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => {
        typing.remove();
        callback();
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, delay);
}

function addBotMsg(text) {
    const msgs = document.getElementById('chatMessages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = `<div class="msg-avatar"><i class="ph ph-robot"></i></div><div class="msg-bubble">${text}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function addUserMsg(text) {
    const msgs = document.getElementById('chatMessages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = 'msg user';
    div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-avatar"><i class="ph ph-user"></i></div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function sendChat() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    addUserMsg(text);
    input.value = '';
    const reply = getBotReply(text);
    if (reply !== null) {
        showTyping(() => addBotMsg(reply));
    }
}

function sendQuick(text) {
    addUserMsg(text);
    const reply = getBotReply(text);
    if (reply !== null) showTyping(() => addBotMsg(reply));
}

function handleChatKey(e) { if (e.key === 'Enter') sendChat(); }

// =========================================
// QUIZ (standalone panel)
// =========================================
let quizStep = 1;
let quizAnswers = {};
let selectedOpt = null;

function selectQ(step, val) {
    document.querySelectorAll(`#qs${step} .quiz-option`).forEach(o => o.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    quizAnswers[step] = val;
    selectedOpt = val;
    document.getElementById('quizNextBtn').style.display = 'inline-block';
}

function nextQuiz() {
    if (quizStep < 5) {
        document.getElementById('qs' + quizStep).classList.remove('active');
        quizStep++;
        document.getElementById('qs' + quizStep).classList.add('active');
        document.getElementById('quizStepLabel').textContent = `Question ${quizStep} of 5`;
        document.getElementById('quizProgressBar').style.width = ((quizStep - 1) / 5 * 100) + '%';
        document.getElementById('quizNextBtn').style.display = 'none';
        selectedOpt = null;
    } else {
        showQuizResult();
    }
}

const quizResults = {
    startup_speed: { icon: '<i class="ph ph-rocket"></i>', title: 'Fast-Track Growth Package', desc: 'You need quick wins. We recommend a Meta Ads + Landing Page combo to start generating leads within 2–3 weeks. Budget: ₹50K–1.5L/month.' },
    growth_leads: { icon: '<i class="ph ph-target"></i>', title: 'Lead Generation Machine', desc: 'You\'re ready to scale. A multi-channel paid ads strategy with a CRM automation layer will multiply your lead flow significantly.' },
    established_convert: { icon: '<i class="ph ph-money"></i>', title: 'CRO + Retention Focus', desc: 'You have traffic but need better conversions. Focus on landing page optimization, retargeting & email sequences.' },
    default: { icon: '<i class="ph ph-trend-up"></i>', title: 'Custom Growth Strategy', desc: 'Based on your profile, you need a tailored multi-channel approach. Book a free call to get a personalized 90-day growth plan.' }
};

function showQuizResult() {
    document.getElementById('qs5').classList.remove('active');
    document.getElementById('quizProgressBar').style.width = '100%';
    document.getElementById('quizStepLabel').textContent = 'Your Result';
    document.getElementById('quizNextBtn').style.display = 'none';

    const key = `${quizAnswers[1]}_${quizAnswers[2]}`;
    const result = quizResults[key] || quizResults.default;

    const msg = `Hello Reka Creative Labs! 👋\n\n📊 I just completed your Strategy Quiz.\n\nBusiness: ${quizAnswers[1] || 'N/A'}\nChallenge: ${quizAnswers[2] || 'N/A'}\nBudget: ${quizAnswers[3] || 'N/A'}\nChannels: ${quizAnswers[4] || 'N/A'}\nPriority: ${quizAnswers[5] || 'N/A'}\n\nRecommended: ${result.title}\n\nPlease help me get started!\n\nThank you!`;

    document.getElementById('quizResultContent').innerHTML = `
        <div class="quiz-result-icon">${result.icon}</div>
        <div class="quiz-result-title">${result.title}</div>
        <div class="quiz-result-desc">${result.desc}</div>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem;">
            <button class="btn btn-primary" onclick="window.open('https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}','_blank')"><i class="ph ph-whatsapp-logo"></i> Get Strategy on WhatsApp</button>
            <button class="btn btn-outline" onclick="resetQuiz()">Retake Quiz</button>
        </div>`;

    document.getElementById('qs-result').classList.add('active');
}

function resetQuiz() {
    quizStep = 1;
    quizAnswers = {};
    selectedOpt = null;
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    document.getElementById('qs1').classList.add('active');
    document.getElementById('quizStepLabel').textContent = 'Question 1 of 5';
    document.getElementById('quizProgressBar').style.width = '0%';
    document.getElementById('quizNextBtn').style.display = 'none';
}

// =========================================
// AD BUDGET PLANNER
// =========================================
function fmt(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

function updateBpBudget(v) {
    const el = document.getElementById('bp-budget-val');
    if (el) el.textContent = fmt(v);
}

function updateBpRoas(v) {
    const el = document.getElementById('bp-roas-val');
    if (el) el.textContent = v + 'x';
}

function calcBudget() {
    const budget = parseFloat(document.getElementById('bp-budget').value);
    const roas = parseFloat(document.getElementById('bp-roas').value);
    const platform = document.getElementById('bp-platform').value;
    const industry = document.getElementById('bp-industry').value;
    const aov = parseFloat(document.getElementById('bp-aov').value) || 5000;

    const cpmMap = { ecommerce: 120, saas: 200, realestate: 280, healthcare: 250, education: 160 };
    const cpcMap = { meta: 8, google: 25, youtube: 6, mixed: 12 };

    const cpm = cpmMap[industry] || 150;
    const cpc = cpcMap[platform] || 10;

    const reach = (budget / cpm) * 1000;
    const clicks = budget / cpc;
    const leads = clicks * 0.035;
    const conv = leads * 0.12;
    const revenue = budget * roas;
    const cpl = budget / (leads || 1);

    document.getElementById('bp-reach').textContent = Math.floor(reach).toLocaleString('en-IN');
    document.getElementById('bp-clicks').textContent = Math.floor(clicks).toLocaleString('en-IN');
    document.getElementById('bp-leads').textContent = Math.floor(leads);
    document.getElementById('bp-conv').textContent = Math.floor(conv);
    document.getElementById('bp-cpl').textContent = fmt(cpl);
    document.getElementById('bp-revenue').textContent = fmt(revenue);

    const splits = {
        meta: '70% Meta (FB+IG) · 20% Retargeting · 10% Creative Testing',
        google: '60% Search · 25% Display · 15% Performance Max',
        youtube: '65% YouTube In-stream · 25% Discovery · 10% Bumper',
        mixed: '40% Meta · 35% Google Search · 15% YouTube · 10% Buffer'
    };
    document.getElementById('bp-split').innerHTML = splits[platform] || splits.mixed;
}

// =========================================
// LANDING PAGE ANALYZER
// =========================================
function analyzeLanding() {
    const url = document.getElementById('lp-url').value.trim();
    if (!url) { alert('Please enter your landing page URL'); return; }

    document.getElementById('lp-placeholder').style.display = 'none';
    document.getElementById('lp-results').style.display = 'none';
    document.getElementById('lp-loading').style.display = 'block';

    const fill = document.getElementById('lp-loading-fill');
    let w = 0;
    const iv = setInterval(() => {
        w += Math.random() * 10;
        if (w >= 100) { w = 100; clearInterval(iv); showLandingResults(); }
        fill.style.width = w + '%';
    }, 90);
}

function showLandingResults() {
    document.getElementById('lp-loading').style.display = 'none';
    document.getElementById('lp-results').style.display = 'block';

    const score = Math.floor(Math.random() * 25 + 55);
    document.getElementById('lp-score').textContent = score;
    setTimeout(() => { document.getElementById('lp-score-bar').style.width = score + '%'; }, 100);

    const categories = [
        { name: '<i class="ph ph-target"></i> CTA Clarity', score: 72, issues: ['CTA button color could be more prominent', 'Add urgency text near CTA'] },
        { name: '<i class="ph ph-shield-check"></i> Trust Elements', score: 58, issues: ['Missing client logos', 'No visible testimonials above fold', 'Add security badges'] },
        { name: '<i class="ph ph-file-text"></i> Copy Quality', score: 81, issues: ['Headline is strong', 'Subtext slightly long for mobile'] },
        { name: '<i class="ph ph-device-mobile"></i> Mobile UX', score: 63, issues: ['Form fields too small on mobile', 'Tap targets need spacing'] },
        { name: '<i class="ph ph-lightning"></i> Page Speed', score: 48, issues: ['Slow LCP (3.8s)', 'Uncompressed hero image', 'Render-blocking JS'] },
        { name: '<i class="ph ph-arrows-clockwise"></i> Conversion Flow', score: 70, issues: ['Good form length', 'Add progress indicator to multi-step forms'] },
    ];

    document.getElementById('lp-categories-list').innerHTML = categories.map(cat => `
        <div class="lp-cat">
            <div class="lp-cat-header">
                <div class="lp-cat-name">${cat.name}</div>
                <div class="lp-cat-score">${cat.score}/100</div>
            </div>
            <div class="lp-progress"><div class="lp-fill" style="width:0%" data-w="${cat.score}%"></div></div>
            <div class="lp-issues">${cat.issues.map(i => `<div class="lp-issue"><span style="color:var(--primary)">›</span> ${i}</div>`).join('')}</div>
        </div>
    `).join('');

    setTimeout(() => {
        document.querySelectorAll('.lp-fill').forEach(el => {
            el.style.width = el.dataset.w;
        });
    }, 100);
}

// =========================================
// AI READINESS CHECKER
// =========================================
function checkAIReadiness() {
    const size = document.getElementById('ai-size').value;
    const tech = document.getElementById('ai-tech').value;
    const data = document.getElementById('ai-data').value;

    const techScore = { basic: 25, crm: 50, integrated: 70, advanced: 90 };
    const dataScore = { poor: 20, fair: 45, good: 70, excellent: 95 };
    const sizeBonus = { solo: 0, small: 5, mid: 10, large: 15, enterprise: 20 };

    const base = (techScore[tech] + dataScore[data]) / 2 + sizeBonus[size];
    const totalScore = Math.min(Math.round(base), 100);

    document.getElementById('ai-placeholder').style.display = 'none';
    document.getElementById('ai-results').style.display = 'block';
    document.getElementById('ai-total-score').textContent = totalScore;

    const grades = [
        [80, '<i class="ph ph-trophy"></i> AI-Ready — Time to Automate at Scale'],
        [60, '<i class="ph ph-trend-up"></i> Good Foundation — A Few Gaps to Close'],
        [40, '<i class="ph ph-warning-circle"></i> Moderate Readiness — Foundational Work Needed'],
        [0, '<i class="ph ph-plant"></i> Early Stage — Start with Basic Automation'],
    ];
    const grade = grades.find(g => totalScore >= g[0]);
    document.getElementById('ai-grade-label').innerHTML = grade[1];

    const pillars = [
        { icon: '<i class="ph ph-floppy-disk"></i>', name: 'Data Quality', score: dataScore[data] },
        { icon: '<i class="ph ph-wrench"></i>', name: 'Tech Stack', score: techScore[tech] },
        { icon: '<i class="ph ph-users"></i>', name: 'Team Readiness', score: Math.round(totalScore * 0.9 + Math.random() * 10) },
        { icon: '<i class="ph ph-arrows-clockwise"></i>', name: 'Process Maturity', score: Math.round(totalScore * 0.85 + Math.random() * 15) },
        { icon: '<i class="ph ph-lock"></i>', name: 'Security & Compliance', score: Math.round(totalScore * 0.95 + Math.random() * 5) },
        { icon: '<i class="ph ph-brain"></i>', name: 'AI Adoption', score: Math.round(totalScore * 0.7 + Math.random() * 20) },
    ];

    document.getElementById('ai-pillars').innerHTML = pillars.map(p => {
        const s = Math.min(p.score, 100);
        return `<div class="pillar-card">
            <div class="pillar-icon">${p.icon}</div>
            <div class="pillar-name">${p.name}</div>
            <div class="pillar-bar"><div class="pillar-fill" data-w="${s}%"></div></div>
            <div class="pillar-score">${s}/100</div>
        </div>`;
    }).join('');

    setTimeout(() => {
        document.querySelectorAll('.pillar-fill').forEach(el => {
            el.style.width = el.dataset.w;
        });
    }, 100);
}

// =========================================
// SOCIAL PROOF DASHBOARD
// =========================================
const feedItems = [
    { icon: '<i class="ph ph-tray-arrow-down"></i>', text: '<strong>Vikram R.</strong> from Delhi booked a strategy call', time: '2 min ago', type: 'booking' },
    { icon: '<i class="ph ph-trophy"></i>', text: '<strong>ZestMart</strong> achieved <strong>4.7x ROAS</strong> on Meta Ads', time: '8 min ago', type: 'win' },
    { icon: '<i class="ph ph-star"></i>', text: '<strong>Priya M.</strong> left a 5-star review — "Best agency in India!"', time: '14 min ago', type: 'review' },
    { icon: '<i class="ph ph-target"></i>', text: '<strong>UrbanKart</strong> generated 247 leads this week', time: '22 min ago', type: 'lead' },
    { icon: '<i class="ph ph-rocket"></i>', text: '<strong>StartupX</strong> launched their first campaign — 312% reach boost', time: '35 min ago', type: 'launch' },
    { icon: '<i class="ph ph-trend-up"></i>', text: '<strong>EduSpark</strong> grew organic traffic by 189% in 60 days', time: '51 min ago', type: 'seo' },
    { icon: '<i class="ph ph-money"></i>', text: '<strong>Nykaa Seller</strong> reduced CPL from ₹850 to ₹210', time: '1 hr ago', type: 'win' },
    { icon: '<i class="ph ph-tray-arrow-down"></i>', text: '<strong>Ananya T.</strong> from Bangalore booked a strategy call', time: '1.5 hr ago', type: 'booking' },
    { icon: '<i class="ph ph-trophy"></i>', text: '<strong>HealthFirst</strong> hit ₹12L in revenue from a single campaign', time: '2 hr ago', type: 'win' },
    { icon: '<i class="ph ph-star"></i>', text: '<strong>Rahul S.</strong> left a review — "ROI was incredible"', time: '2.5 hr ago', type: 'review' },
];

const reviews = [
    { name: 'Vikram Reddy', co: 'ZestMart · E-commerce', stars: 5, text: 'Our ROAS went from 1.8x to 4.7x in just 6 weeks. The team is exceptional.' },
    { name: 'Priya Malhotra', co: 'EduSpark · EdTech', stars: 5, text: 'Best investment we made — 189% traffic growth and real leads.' },
    { name: 'Arun Sharma', co: 'HealthFirst · Healthcare', stars: 5, text: 'They understood our niche perfectly. ₹12L in revenue from one campaign.' },
];

function initSocialFeed() {
    const feed = document.getElementById('social-feed');
    if (!feed || feed.children.length > 0) return;
    feedItems.forEach((item, i) => {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'audit-check-item pass';
            el.style.cssText = 'animation: toastSlide 0.3s ease; cursor:default;';
            el.innerHTML = `<span style="font-size:1.3rem">${item.icon}</span><div style="flex:1"><div style="font-size:0.88rem">${item.text}</div><div style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px;">${item.time}</div></div>`;
            feed.appendChild(el);
        }, i * 150);
    });

    const reviewList = document.getElementById('reviews-list');
    if (!reviewList) return;
    reviews.forEach(r => {
        const el = document.createElement('div');
        el.style.cssText = 'padding:1rem;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid var(--border-color);';
        el.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <div style="font-size:1.2rem">${'<i class="ph ph-star"></i>'.repeat(r.stars)}</div>
            </div>
            <div style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:8px;">"${r.text}"</div>
            <div style="font-size:0.82rem;font-weight:600;">${r.name} <span style="color:var(--text-secondary);font-weight:400;">· ${r.co}</span></div>
        `;
        reviewList.appendChild(el);
    });
}

// =========================================
// BOOKING CALENDAR
// =========================================
let calDate = new Date();
let selectedDate = null;
let selectedTime = null;

const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const bookedSlots = ['10:00 AM', '2:00 PM'];

function renderCalendar() {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const calLabel = document.getElementById('cal-month-label');
    if (calLabel) calLabel.textContent = monthNames[month] + ' ' + year;

    const grid = document.getElementById('cal-grid');
    if (!grid) return;
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let html = days.map(d => `<div class="cal-day-label">${d}</div>`).join('');
    for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isToday = date.toDateString() === today.toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        let cls = 'cal-day';
        if (isPast || isWeekend) cls += ' past';
        if (isToday) cls += ' today';
        if (isSelected) cls += ' selected';
        const clickable = !isPast && !isWeekend;
        html += `<div class="${cls}" ${clickable ? `onclick="selectCalDay(${d})"` : ''}>${d}</div>`;
    }
    grid.innerHTML = html;
    renderTimeSlots();
}

function selectCalDay(d) {
    selectedDate = new Date(calDate.getFullYear(), calDate.getMonth(), d);
    selectedTime = null;
    renderCalendar();
}

function renderTimeSlots() {
    const wrap = document.getElementById('time-slots');
    if (!wrap) return;
    if (!selectedDate) { wrap.innerHTML = '<p style="color:var(--text-secondary);font-size:0.85rem;grid-column:1/-1;">Select a date to see available times</p>'; return; }
    wrap.innerHTML = times.map(t => {
        const booked = bookedSlots.includes(t);
        const sel = selectedTime === t;
        return `<div class="time-slot ${booked ? 'booked' : ''} ${sel ? 'selected' : ''}" ${!booked ? `onclick="selectTime('${t}')"` : ''}>${t}</div>`;
    }).join('');
}

function selectTime(t) {
    selectedTime = t;
    renderTimeSlots();
}

function changeMonth(dir) {
    calDate.setMonth(calDate.getMonth() + dir);
    selectedDate = null; selectedTime = null;
    renderCalendar();
}

function confirmBooking() {
    const fname = document.getElementById('b-fname').value.trim();
    const lname = document.getElementById('b-lname') ? document.getElementById('b-lname').value.trim() : '';
    const email = document.getElementById('b-email').value.trim();
    const phone = document.getElementById('b-phone') ? document.getElementById('b-phone').value.trim() : '';
    const website = document.getElementById('b-website') ? document.getElementById('b-website').value.trim() : '';
    const topic = document.getElementById('b-topic') ? document.getElementById('b-topic').value : '';
    if (!fname) { alert('Please enter your name'); return; }
    if (!email) { alert('Please enter your email'); return; }
    if (!selectedDate) { alert('Please select a date'); return; }
    if (!selectedTime) { alert('Please select a time slot'); return; }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()} at ${selectedTime} IST`;

    const bookingEl = document.getElementById('booking-date-confirm');
    if (bookingEl) bookingEl.textContent = dateStr;

    const msg = `Hello Reka Creative Labs! 👋\n\n📅 New Strategy Call Booking\n\nName: ${fname} ${lname}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nWebsite: ${website || 'N/A'}\nDate: ${dateStr}\nTopic: ${topic}\n\nPlease confirm my booking. Thank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

    const formWrap = document.getElementById('booking-form-wrap');
    const success = document.getElementById('booking-success');
    if (formWrap) formWrap.style.display = 'none';
    if (success) success.style.display = 'block';
}

function resetBooking() {
    selectedDate = null; selectedTime = null;
    const formWrap = document.getElementById('booking-form-wrap');
    const success = document.getElementById('booking-success');
    if (formWrap) formWrap.style.display = 'block';
    if (success) success.style.display = 'none';
    renderCalendar();
}

// =========================================
// MARKETING DASHBOARD
// =========================================
let dashPeriod = 90;

const dashData = {
    7: { roas: '4.2x', leads: '84', spend: '₹82K', growth: '+18%', sessions: '4.2K' },
    30: { roas: '4.7x', leads: '312', spend: '₹3.1L', growth: '+34%', sessions: '18K' },
    90: { roas: '5.1x', leads: '987', spend: '₹9.4L', growth: '+67%', sessions: '58K' },
};

const barData = {
    7: { vals: [62, 71, 58, 80, 73, 88, 92], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    30: { vals: [45, 52, 60, 58, 70, 65, 78, 82, 76, 88, 92, 85, 90, 94, 88, 96, 100, 92, 98, 105, 112, 108, 115, 120, 118, 122, 130, 125, 128, 135], labels: ['W1', 'W2', 'W3', 'W4'] },
    90: { vals: [40, 55, 62, 70, 68, 78, 82, 80, 88, 92, 95, 100], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
};

function setDashPeriod(p, btn) {
    dashPeriod = p;
    document.querySelectorAll('#panel-dashboard .btn').forEach(b => {
        b.className = 'btn btn-outline'; b.style.cssText = 'padding:6px 16px;font-size:0.82rem;';
    });
    btn.className = 'btn btn-primary';
    btn.style.cssText = 'padding:6px 16px;font-size:0.82rem;';
    initDashboard();
}

function initDashboard() {
    initLiveDashboard();
}

// =========================================
// CINEMATIC LIVE CAMPAIGN DASHBOARD ENGINE
// =========================================
let liveDashInterval = null;
let liveDashRunning = false;

const conversionNames = [
    ['Priya M.','Mumbai'],['Rahul S.','Delhi'],['Ananya T.','Bangalore'],
    ['Vikram R.','Pune'],['Neha K.','Chennai'],['Arjun S.','Hyderabad'],
    ['Sonal P.','Kolkata'],['Kiran D.','Ahmedabad'],['Riya V.','Jaipur'],
    ['Amit B.','Noida'],['Sneha L.','Surat'],['Rohan M.','Lucknow'],
    ['Pooja G.','Bhopal'],['Nikhil J.','Indore'],['Meera R.','Nagpur'],
];
const conversionActions = [
    { action:'Purchased Growth Plan', value:'₹75,000', color:'#4ADE80' },
    { action:'Booked a Strategy Call', value:'Free', color:'var(--primary)' },
    { action:'Signed up for SEO Package', value:'₹1.2L', color:'#A082FF' },
    { action:'Started Free Audit', value:'Free', color:'#FFC832' },
    { action:'Upgraded to Scale Plan', value:'₹1.5L', color:'#4ADE80' },
    { action:'Requested Proposal', value:'Custom', color:'var(--primary)' },
    { action:'Purchased Meta Ads Service', value:'₹50K', color:'#A082FF' },
];
const avatarColors = ['#8CF665','#4ADE80','#A082FF','#FFC832','#FF6B6B','#00C8FF','#FF8C00'];

const socialMentions = [
    { user:'@priya_startup', platform:'𝕏', text:'Just booked a call with <strong>Reka Creative Labs</strong> — their tools are insane! 🔥', time:'now', color:'#A082FF' },
    { user:'@growthwithrahul', platform:'in', text:'The <strong>AI Growth Agent</strong> saved me 3 hours of research. Absolute game changer.', time:'1m ago', color:'#0077B5' },
    { user:'@sonal_ecom', platform:'📸', text:'Our ROAS jumped to <strong>6.2x</strong> after Reka optimized our Meta campaigns! 🚀', time:'2m ago', color:'#E1306C' },
    { user:'@vikram.digital', platform:'𝕏', text:'Best <strong>free marketing tools</strong> I\'ve found. No signup, instant results!', time:'4m ago', color:'#A082FF' },
    { user:'@tejasmarketer', platform:'in', text:'Ran the website audit — flagged issues I had no idea about. Fix is live now 🙌', time:'5m ago', color:'#0077B5' },
    { user:'@neha_brandstudio', platform:'📸', text:'<strong>Reka Creative Labs</strong> has completely transformed our digital presence 💚', time:'7m ago', color:'#E1306C' },
];

// World map cities with approximate % coordinates (lat/lon mapped to canvas x/y)
const worldCities = [
    { name:'Mumbai', x:0.635, y:0.52, color:'var(--primary)' },
    { name:'Delhi', x:0.625, y:0.42, color:'var(--primary)' },
    { name:'Bangalore', x:0.63, y:0.57, color:'var(--primary)' },
    { name:'London', x:0.44, y:0.25, color:'#4ADE80' },
    { name:'New York', x:0.21, y:0.32, color:'#4ADE80' },
    { name:'Dubai', x:0.6, y:0.46, color:'#FFC832' },
    { name:'Singapore', x:0.72, y:0.58, color:'#A082FF' },
    { name:'Tokyo', x:0.82, y:0.33, color:'#00C8FF' },
    { name:'Sydney', x:0.84, y:0.72, color:'#FF8C00' },
    { name:'Toronto', x:0.2, y:0.29, color:'#4ADE80' },
    { name:'Berlin', x:0.47, y:0.24, color:'#4ADE80' },
    { name:'Lagos', x:0.43, y:0.56, color:'#FFC832' },
    { name:'Nairobi', x:0.55, y:0.6, color:'#FF6B6B' },
    { name:'São Paulo', x:0.28, y:0.7, color:'#A082FF' },
    { name:'Paris', x:0.45, y:0.27, color:'#4ADE80' },
    { name:'Shanghai', x:0.78, y:0.38, color:'#00C8FF' },
    { name:'Pune', x:0.633, y:0.535, color:'var(--primary)' },
    { name:'Hyderabad', x:0.632, y:0.54, color:'var(--primary)' },
];

function initLiveDashboard() {
    if (liveDashRunning) return;
    liveDashRunning = true;

    // Draw world map dots on canvas
    drawWorldMap();

    // Set initial KPI values
    let impressions = 247000 + Math.floor(Math.random() * 10000);
    let conversions = 312 + Math.floor(Math.random() * 20);
    let spendVal = 94000 + Math.floor(Math.random() * 3000);

    document.getElementById('live-impressions').textContent = formatNum(impressions);
    document.getElementById('live-conversions').textContent = conversions.toLocaleString('en-IN');
    document.getElementById('live-spend').textContent = '₹' + formatNum(spendVal);

    // Init sparklines
    initSparklines();

    // Initial social mentions
    renderSocialMentions();

    // Initial conversion items
    for (let i = 0; i < 4; i++) addConversionItem();

    // Channel performance
    renderChannelPerformance();

    // Map pings
    spawnMapPing();

    // Live interval — update every 2.5 seconds
    liveDashInterval = setInterval(() => {
        impressions += Math.floor(Math.random() * 180 + 40);
        conversions += Math.floor(Math.random() * 3);
        spendVal += Math.floor(Math.random() * 500 + 100);

        animateCount('live-impressions', impressions, formatNum(impressions));
        animateCount('live-conversions', conversions, conversions.toLocaleString('en-IN'));
        document.getElementById('live-spend').textContent = '₹' + formatNum(spendVal);

        // Occasionally add conversion
        if (Math.random() < 0.55) addConversionItem();

        // Occasionally add mention
        if (Math.random() < 0.4) rotateMention();

        // Sparkline update
        updateSparklines();

        // Map ping
        if (Math.random() < 0.6) spawnMapPing();

    }, 2500);
}

function formatNum(n) {
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n/1000).toFixed(1) + 'K';
    return n.toLocaleString('en-IN');
}

function animateCount(id, target, formatted) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transform = 'scale(1.05)';
    el.textContent = formatted;
    setTimeout(() => { el.style.transform = 'scale(1)'; el.style.transition = 'transform 0.3s ease'; }, 150);
}

// --- Sparklines ---
const sparkData = { impressions: [], conversions: [], roas: [], spend: [] };
function initSparklines() {
    for (const key in sparkData) {
        sparkData[key] = Array.from({length:8}, () => Math.random() * 70 + 20);
        renderSparkline(key);
    }
}
function updateSparklines() {
    for (const key in sparkData) {
        sparkData[key].shift();
        sparkData[key].push(Math.random() * 70 + 20);
        renderSparkline(key);
    }
}
function renderSparkline(key) {
    const el = document.getElementById('spark-' + key);
    if (!el) return;
    const max = Math.max(...sparkData[key]);
    el.innerHTML = sparkData[key].map(v =>
        `<div class="spark-bar" style="height:${(v/max*32)+4}px"></div>`
    ).join('');
}

// --- World Map Canvas ---
function drawWorldMap() {
    const canvas = document.getElementById('worldMapCanvas');
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 500;
    canvas.height = (rect.width || 500) / 2;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, 'rgba(7,14,10,0.95)');
    bg.addColorStop(1, 'rgba(15,27,21,0.9)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Draw simplified continent dots grid
    ctx.fillStyle = 'rgba(140,246,101,0.08)';
    for (let x = 0; x < W; x += 7) {
        for (let y = 0; y < H; y += 7) {
            if (isLandPixel(x/W, y/H)) {
                ctx.fillRect(x, y, 3, 3);
            }
        }
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(140,246,101,0.04)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (H/4)*i);
        ctx.lineTo(W, (H/4)*i);
        ctx.stroke();
    }
    for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo((W/6)*i, 0);
        ctx.lineTo((W/6)*i, H);
        ctx.stroke();
    }
}

// Approximate land pixel detection (simplified world shape)
function isLandPixel(nx, ny) {
    // North America
    if (nx > 0.05 && nx < 0.32 && ny > 0.12 && ny < 0.55) {
        if (nx > 0.05 && ny > 0.35 && nx < 0.16) return false;
        return true;
    }
    // South America
    if (nx > 0.18 && nx < 0.35 && ny > 0.52 && ny < 0.9) return true;
    // Europe
    if (nx > 0.4 && nx < 0.58 && ny > 0.1 && ny < 0.38) return true;
    // Africa
    if (nx > 0.4 && nx < 0.6 && ny > 0.36 && ny < 0.78) return true;
    // Asia
    if (nx > 0.55 && nx < 0.9 && ny > 0.08 && ny < 0.55) {
        if (nx > 0.55 && nx < 0.62 && ny > 0.08 && ny < 0.22) return false;
        return true;
    }
    // Australia
    if (nx > 0.75 && nx < 0.92 && ny > 0.6 && ny < 0.82) return true;
    return false;
}

function spawnMapPing() {
    const container = document.getElementById('mapPings');
    const canvas = document.getElementById('worldMapCanvas');
    if (!container || !canvas) return;

    const city = worldCities[Math.floor(Math.random() * worldCities.length)];
    const ping = document.createElement('div');
    ping.className = 'map-ping';
    ping.style.left = (city.x * 100) + '%';
    ping.style.top = (city.y * 100) + '%';
    ping.style.setProperty('--ping-color', city.color === 'var(--primary)' ? '#8CF665' : city.color);
    container.appendChild(ping);
    setTimeout(() => ping.remove(), 2600);
}

// --- Conversion Ticker ---
let convMentionIdx = 0;
function addConversionItem() {
    const ticker = document.getElementById('conversionTicker');
    if (!ticker) return;

    const person = conversionNames[Math.floor(Math.random() * conversionNames.length)];
    const action = conversionActions[Math.floor(Math.random() * conversionActions.length)];
    const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const initials = person[0].split(' ').map(w => w[0]).join('');
    const secsAgo = Math.floor(Math.random() * 50 + 2);

    const item = document.createElement('div');
    item.className = 'conv-item';
    item.innerHTML = `
        <div class="conv-avatar" style="background:${color}22;border:1px solid ${color}55;color:${color};">${initials}</div>
        <div class="conv-info">
            <div class="conv-name">${person[0]} <span style="font-weight:400;font-size:0.72rem;color:var(--text-secondary);">· ${person[1]}</span></div>
            <div class="conv-action">${action.action}</div>
        </div>
        <div class="conv-value" style="color:${action.color};">${action.value}</div>
        <div class="conv-time">${secsAgo}s ago</div>
    `;

    ticker.insertBefore(item, ticker.firstChild);

    // Keep max 5 items
    while (ticker.children.length > 5) ticker.removeChild(ticker.lastChild);
}

// --- Social Mentions ---
let mentionIdx = 0;
function renderSocialMentions() {
    const feed = document.getElementById('socialMentionsFeed');
    if (!feed) return;
    feed.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const m = socialMentions[i % socialMentions.length];
        feed.appendChild(buildMentionEl(m));
    }
    mentionIdx = 3;
}
function rotateMention() {
    const feed = document.getElementById('socialMentionsFeed');
    if (!feed) return;
    const m = socialMentions[mentionIdx % socialMentions.length];
    mentionIdx++;
    const el = buildMentionEl(m);
    feed.insertBefore(el, feed.firstChild);
    while (feed.children.length > 4) feed.removeChild(feed.lastChild);
}
function buildMentionEl(m) {
    const div = document.createElement('div');
    div.className = 'mention-item';
    div.innerHTML = `
        <div class="mention-header">
            <div class="mention-avatar" style="background:${m.color}22;border:1px solid ${m.color}55;color:${m.color};">${m.user[1].toUpperCase()}</div>
            <span class="mention-user">${m.user}</span>
            <span class="mention-platform">${m.platform}</span>
            <span class="mention-time">${m.time}</span>
        </div>
        <div class="mention-text">${m.text}</div>
    `;
    return div;
}

// --- Channel Performance ---
function renderChannelPerformance() {
    const channels = [
        { name:'Meta Ads', icon:'📘', spend:40, roas:'5.2x', leads:148, color:'#4ADE80', barColor:'linear-gradient(90deg,#036A3A,#4ADE80)' },
        { name:'Google Ads', icon:'🔍', spend:35, roas:'4.8x', leads:112, color:'var(--primary)', barColor:'linear-gradient(90deg,#036A3A,#8CF665)' },
        { name:'YouTube Ads', icon:'▶️', spend:15, roas:'3.9x', leads:38, color:'#FF6B6B', barColor:'linear-gradient(90deg,#7f0000,#FF6B6B)' },
        { name:'Email', icon:'✉️', spend:10, roas:'7.1x', leads:64, color:'#A082FF', barColor:'linear-gradient(90deg,#3d1e8c,#A082FF)' },
    ];
    const el = document.getElementById('dash-channels');
    if (!el) return;
    el.innerHTML = channels.map(c => `
        <div class="channel-row">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.88rem;">
                <span style="display:flex;align-items:center;gap:8px;">${c.icon} <strong>${c.name}</strong></span>
                <span style="color:${c.color};font-weight:800;">${c.roas} ROAS</span>
            </div>
            <div class="channel-bar-track">
                <div class="channel-bar-fill" data-w="${c.spend}%" style="width:0%;background:${c.barColor};"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-secondary);margin-top:4px;">
                <span>${c.spend}% of budget</span>
                <span>${c.leads} leads</span>
            </div>
        </div>
    `).join('');
    setTimeout(() => {
        el.querySelectorAll('.channel-bar-fill').forEach(b => { b.style.width = b.dataset.w; });
    }, 100);
}



// =========================================
// LOGO DECODE / MATRIX ANIMATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>";
    const logos = document.querySelectorAll('.logo-text-brand');

    logos.forEach(logo => {
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

        setTimeout(scramble, 300);
        logo.addEventListener("mouseover", scramble);
    });
});

// =========================================
// INIT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    calcBudget();
    initDashboard();
    renderCalendar();

    // Hash-fragment routing: tools.html#chatbot opens chatbot panel
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('panel-' + hash)) {
        switchTool(hash);
    }

    // Also init chat if already on chatbot tab
    const chatPanel = document.getElementById('panel-chatbot');
    if (chatPanel && chatPanel.classList.contains('active') && !chatInitialized) {
        initChat();
    }

    // Re-animate hub cards when scrolled back into view
    const hubCards = document.querySelectorAll('.hub-card');
    if (hubCards.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'none';
                    entry.target.offsetHeight; // force reflow
                    entry.target.style.animation = '';
                }
            });
        }, { threshold: 0.15 });
        hubCards.forEach(card => observer.observe(card));
    }
});
