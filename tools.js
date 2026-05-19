
// =========================================
// CURSOR FOLLOWER
// =========================================
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// =========================================
// ANTIGRAVITY PARTICLE SYSTEM
// =========================================
const canvas = document.getElementById('particles-bg');
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
        this.speedY = -(Math.random() * 0.4 + 0.1); // upward = antigravity
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
        ctx.fillStyle = `rgba(140, 246, 101, ${this.opacity * (1 - this.life/this.maxLife)})`;
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

// =========================================
// TOOL SWITCHER
// =========================================
function switchTool(id) {
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.hub-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('panel-' + id).classList.add('active');
    document.querySelector(`[data-tool="${id}"]`).classList.add('active');

    // Init tool-specific logic
    if (id === 'chatbot' && !chatInitialized) initChat();
    if (id === 'dashboard') initDashboard();
    if (id === 'social') initSocialFeed();
    if (id === 'booking') renderCalendar();
    if (id === 'adbudget') calcBudget();
}

// =========================================
// SOCIAL PROOF NOTIFICATIONS
// =========================================
const proofData = [
    { icon: '📥', msg: '<strong>Vikram R.</strong> just booked a strategy call', time: '2 min ago' },
    { icon: '🏆', msg: '<strong>Priya M.</strong> got a <strong>4.7x ROAS</strong> this month', time: '8 min ago' },
    { icon: '⭐', msg: '<strong>Rahul S.</strong> left a 5-star review', time: '12 min ago' },
    { icon: '🎯', msg: '<strong>UrbanKart</strong> generated <strong>247 leads</strong> this week', time: '18 min ago' },
    { icon: '📥', msg: '<strong>Ananya T.</strong> just ran a site audit', time: '23 min ago' },
    { icon: '🚀', msg: '<strong>StartupX</strong> launched campaign — <strong>+312% reach</strong>', time: '31 min ago' },
    { icon: '💼', msg: '<strong>Neha K.</strong> from Mumbai booked a call', time: '45 min ago' },
    { icon: '📊', msg: '<strong>EduTech India</strong> scored <strong>89/100</strong> on audit', time: '1 hr ago' },
];

let proofIndex = 0;
const proofBar = document.getElementById('socialProofBar');

function showProofToast() {
    const item = proofData[proofIndex % proofData.length];
    proofIndex++;
    const toast = document.createElement('div');
    toast.className = 'proof-toast';
    toast.innerHTML = `<span class="proof-dot"></span><span class="toast-icon">${item.icon}</span><div><div>${item.msg}</div><div style="font-size:0.75rem;opacity:0.6;margin-top:2px;">${item.time}</div></div>`;
    proofBar.prepend(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 5000);
}

showProofToast();
setInterval(showProofToast, 7000);

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

    const icons = { pass: '✅', warn: '⚠️', fail: '❌' };
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
            <div class="s-icon">📧</div>
            <h3>Report Sent!</h3>
            <p>Check your inbox for the full PDF audit report.</p>
        </div>`;
}

// =========================================
// AI CHATBOT
// =========================================
let chatInitialized = false;

const botResponses = {
    'services': "We offer 6 core services: 🎯 Performance Marketing, 🔍 SEO & Content, 🎨 Brand Design, 🤖 AI Automation, 📱 Social Media, and 💻 Web Development. Which one interests you?",
    'pricing': "Our packages start from ₹25,000/month for Starter, ₹75,000/month for Growth, and ₹1,50,000/month for Scale. All include strategy, execution & weekly reports. Want details on a specific plan?",
    'book': "Amazing! Let's set up a call 📅 You can use our <a style='color:var(--primary)' href='javascript:switchTool(\"booking\")'>booking tool</a> to pick a slot, or just tell me your preferred time and I'll check availability.",
    'timeline': "Typical timelines: 🚀 Paid Ads — results in 2–4 weeks. 📈 SEO — 3–6 months for organic growth. 🎨 Web projects — 2–6 weeks depending on scope. Want to know about a specific service?",
    'hello': "Hey there! 👋 I'm Reka's AI assistant. I can help with pricing, services, timelines, or booking a free strategy call. What's on your mind?",
    'default': "Great question! Our team specializes in data-driven digital marketing for Indian businesses. Want me to connect you with a strategist? I can book you a free 30-min call — completely no-obligation."
};

function getBotReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('service') || m.includes('offer') || m.includes('do')) return botResponses.services;
    if (m.includes('price') || m.includes('cost') || m.includes('plan') || m.includes('budget')) return botResponses.pricing;
    if (m.includes('book') || m.includes('call') || m.includes('schedule') || m.includes('meeting')) return botResponses.book;
    if (m.includes('time') || m.includes('long') || m.includes('duration') || m.includes('result')) return botResponses.timeline;
    if (m.includes('hi') || m.includes('hello') || m.includes('hey')) return botResponses.hello;
    return botResponses.default;
}

function initChat() {
    chatInitialized = true;
    addBotMsg("Hey! 👋 I'm Reka AI. I can answer questions about our services, pricing & help you book a free strategy call. What can I help you with?");
}

function addBotMsg(text) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble">${text}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function addUserMsg(text) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg user';
    div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-avatar">👤</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function sendChat() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    addUserMsg(text);
    input.value = '';
    setTimeout(() => addBotMsg(getBotReply(text)), 600 + Math.random() * 600);
}

function sendQuick(text) {
    addUserMsg(text);
    setTimeout(() => addBotMsg(getBotReply(text)), 600);
}

function handleChatKey(e) { if (e.key === 'Enter') sendChat(); }

// =========================================
// QUIZ
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
    startup_speed: { icon: '🚀', title: 'Fast-Track Growth Package', desc: 'You need quick wins. We recommend a Meta Ads + Landing Page combo to start generating leads within 2–3 weeks. Budget: ₹50K–1.5L/month.' },
    growth_leads: { icon: '🎯', title: 'Lead Generation Machine', desc: 'You\'re ready to scale. A multi-channel paid ads strategy with a CRM automation layer will multiply your lead flow significantly.' },
    established_convert: { icon: '💸', title: 'CRO + Retention Focus', desc: 'You have traffic but need better conversions. Focus on landing page optimization, retargeting & email sequences.' },
    default: { icon: '📈', title: 'Custom Growth Strategy', desc: 'Based on your profile, you need a tailored multi-channel approach. Book a free call to get a personalized 90-day growth plan.' }
};

function showQuizResult() {
    document.getElementById('qs5').classList.remove('active');
    document.getElementById('quizProgressBar').style.width = '100%';
    document.getElementById('quizStepLabel').textContent = 'Your Result';
    document.getElementById('quizNextBtn').style.display = 'none';

    const key = `${quizAnswers[1]}_${quizAnswers[2]}`;
    const result = quizResults[key] || quizResults.default;

    document.getElementById('quizResultContent').innerHTML = `
        <div class="quiz-result-icon">${result.icon}</div>
        <div class="quiz-result-title">${result.title}</div>
        <div class="quiz-result-desc">${result.desc}</div>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem;">
            <button class="btn btn-primary" onclick="switchTool('booking')">📅 Book Free Strategy Call</button>
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
    document.getElementById('bp-budget-val').textContent = fmt(v);
}

function updateBpRoas(v) {
    document.getElementById('bp-roas-val').textContent = v + 'x';
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
        { name: '🎯 CTA Clarity', score: 72, issues: ['CTA button color could be more prominent', 'Add urgency text near CTA'] },
        { name: '🛡 Trust Elements', score: 58, issues: ['Missing client logos', 'No visible testimonials above fold', 'Add security badges'] },
        { name: '📝 Copy Quality', score: 81, issues: ['Headline is strong', 'Subtext slightly long for mobile'] },
        { name: '📱 Mobile UX', score: 63, issues: ['Form fields too small on mobile', 'Tap targets need spacing'] },
        { name: '⚡ Page Speed', score: 48, issues: ['Slow LCP (3.8s)', 'Uncompressed hero image', 'Render-blocking JS'] },
        { name: '🔄 Conversion Flow', score: 70, issues: ['Good form length', 'Add progress indicator to multi-step forms'] },
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
        [80, '🏆 AI-Ready — Time to Automate at Scale'],
        [60, '📈 Good Foundation — A Few Gaps to Close'],
        [40, '⚠️ Moderate Readiness — Foundational Work Needed'],
        [0,  '🌱 Early Stage — Start with Basic Automation'],
    ];
    const grade = grades.find(g => totalScore >= g[0]);
    document.getElementById('ai-grade-label').textContent = grade[1];

    const pillars = [
        { icon: '💾', name: 'Data Quality', score: dataScore[data] },
        { icon: '🔧', name: 'Tech Stack', score: techScore[tech] },
        { icon: '👥', name: 'Team Readiness', score: Math.round(totalScore * 0.9 + Math.random() * 10) },
        { icon: '🔄', name: 'Process Maturity', score: Math.round(totalScore * 0.85 + Math.random() * 15) },
        { icon: '🔒', name: 'Security & Compliance', score: Math.round(totalScore * 0.95 + Math.random() * 5) },
        { icon: '🧠', name: 'AI Adoption', score: Math.round(totalScore * 0.7 + Math.random() * 20) },
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
    { icon: '📥', text: '<strong>Vikram R.</strong> from Delhi booked a strategy call', time: '2 min ago', type: 'booking' },
    { icon: '🏆', text: '<strong>ZestMart</strong> achieved <strong>4.7x ROAS</strong> on Meta Ads', time: '8 min ago', type: 'win' },
    { icon: '⭐', text: '<strong>Priya M.</strong> left a 5-star review — "Best agency in India!"', time: '14 min ago', type: 'review' },
    { icon: '🎯', text: '<strong>UrbanKart</strong> generated 247 leads this week', time: '22 min ago', type: 'lead' },
    { icon: '🚀', text: '<strong>StartupX</strong> launched their first campaign — 312% reach boost', time: '35 min ago', type: 'launch' },
    { icon: '📈', text: '<strong>EduSpark</strong> grew organic traffic by 189% in 60 days', time: '51 min ago', type: 'seo' },
    { icon: '💸', text: '<strong>Nykaa Seller</strong> reduced CPL from ₹850 to ₹210', time: '1 hr ago', type: 'win' },
    { icon: '📥', text: '<strong>Ananya T.</strong> from Bangalore booked a strategy call', time: '1.5 hr ago', type: 'booking' },
    { icon: '🏆', text: '<strong>HealthFirst</strong> hit ₹12L in revenue from a single campaign', time: '2 hr ago', type: 'win' },
    { icon: '⭐', text: '<strong>Rahul S.</strong> left a review — "ROI was incredible"', time: '2.5 hr ago', type: 'review' },
];

const reviews = [
    { name: 'Vikram Reddy', co: 'ZestMart · E-commerce', stars: 5, text: 'Our ROAS went from 1.8x to 4.7x in just 6 weeks. The team is exceptional.' },
    { name: 'Priya Malhotra', co: 'EduSpark · EdTech', stars: 5, text: 'Best investment we made — 189% traffic growth and real leads.' },
    { name: 'Arun Sharma', co: 'HealthFirst · Healthcare', stars: 5, text: 'They understood our niche perfectly. ₹12L in revenue from one campaign.' },
];

function initSocialFeed() {
    const feed = document.getElementById('social-feed');
    if (feed.children.length > 0) return;
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
    reviews.forEach(r => {
        const el = document.createElement('div');
        el.style.cssText = 'padding:1rem;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid var(--border-color);';
        el.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <div style="font-size:1.2rem">${'⭐'.repeat(r.stars)}</div>
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
let calDate = new Date(2026, 4, 1); // May 2026
let selectedDate = null;
let selectedTime = null;

const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const bookedSlots = ['10:00 AM', '2:00 PM'];

function renderCalendar() {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('cal-month-label').textContent = monthNames[month] + ' ' + year;

    const grid = document.getElementById('cal-grid');
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
    const email = document.getElementById('b-email').value.trim();
    if (!fname) { alert('Please enter your name'); return; }
    if (!email) { alert('Please enter your email'); return; }
    if (!selectedDate) { alert('Please select a date'); return; }
    if (!selectedTime) { alert('Please select a time slot'); return; }

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()} at ${selectedTime} IST`;
    document.getElementById('booking-date-confirm').textContent = dateStr;
    document.getElementById('booking-form-wrap').style.display = 'none';
    document.getElementById('booking-success').style.display = 'block';
}

function resetBooking() {
    selectedDate = null; selectedTime = null;
    document.getElementById('booking-form-wrap').style.display = 'block';
    document.getElementById('booking-success').style.display = 'none';
    renderCalendar();
}

// =========================================
// MARKETING DASHBOARD
// =========================================
let dashPeriod = 90;

const dashData = {
    7:  { roas: '4.2x', leads: '84', spend: '₹82K', growth: '+18%', sessions: '4.2K' },
    30: { roas: '4.7x', leads: '312', spend: '₹3.1L', growth: '+34%', sessions: '18K' },
    90: { roas: '5.1x', leads: '987', spend: '₹9.4L', growth: '+67%', sessions: '58K' },
};

const barData = {
    7:  { vals: [62,71,58,80,73,88,92], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    30: { vals: [45,52,60,58,70,65,78,82,76,88,92,85,90,94,88,96,100,92,98,105,112,108,115,120,118,122,130,125,128,135], labels: ['W1','W2','W3','W4'] },
    90: { vals: [40,55,62,70,68,78,82,80,88,92,95,100], labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
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
    const d = dashData[dashPeriod] || dashData[90];
    const metrics = [
        { icon: '💰', label: 'Ad Spend', value: d.spend, delta: '+12%' },
        { icon: '🎯', label: 'Leads Generated', value: d.leads, delta: '+28%' },
        { icon: '📈', label: 'ROAS', value: d.roas, delta: '+0.4x' },
        { icon: '🚀', label: 'Revenue Growth', value: d.growth, delta: d.growth },
        { icon: '👁', label: 'Sessions', value: d.sessions, delta: '+41%' },
        { icon: '💎', label: 'CTR Avg', value: '3.8%', delta: '+0.6%' },
    ];

    document.getElementById('dash-metrics').innerHTML = metrics.map(m => `
        <div class="dash-metric">
            <div class="dash-metric-icon">${m.icon}</div>
            <div class="dash-metric-label">${m.label}</div>
            <div class="dash-metric-value">${m.value}</div>
            <div class="dash-metric-delta">${m.delta} vs prev. period</div>
        </div>
    `).join('');

    // Bar chart
    const bd = barData[dashPeriod] || barData[90];
    const maxV = Math.max(...bd.vals);
    const chartEl = document.getElementById('dash-bar-chart');
    chartEl.innerHTML = bd.vals.map(v => {
        const h = (v / maxV * 120);
        return `<div style="flex:1;background:rgba(140,246,101,0.15);border-radius:4px 4px 0 0;height:${h}px;transition:height 0.8s ease;position:relative;" title="${v}%"><div style="position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font-size:0.65rem;color:var(--primary);font-weight:700;white-space:nowrap;display:none" class="bar-tip">${v}</div></div>`;
    }).join('');

    document.getElementById('dash-bar-labels').innerHTML = (dashPeriod === 7 ? bd.labels : bd.labels).map(l => `<span>${l}</span>`).join('');

    // Channels
    const channels = [
        { name: '🎯 Meta Ads', spend: 40, roas: '5.2x', leads: 148 },
        { name: '🔍 Google Ads', spend: 35, roas: '4.8x', leads: 112 },
        { name: '▶️ YouTube', spend: 15, roas: '3.9x', leads: 38 },
        { name: '📧 Email', spend: 10, roas: '7.1x', leads: 64 },
    ];

    document.getElementById('dash-channels').innerHTML = channels.map(c => `
        <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.88rem;">
                <span>${c.name}</span>
                <span style="color:var(--primary);font-weight:700;">${c.roas} ROAS</span>
            </div>
            <div class="lp-progress"><div class="lp-fill" style="width:0%" data-w="${c.spend}%"></div></div>
            <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px;">${c.spend}% budget · ${c.leads} leads</div>
        </div>
    `).join('');

    setTimeout(() => {
        document.querySelectorAll('#dash-channels .lp-fill').forEach(el => { el.style.width = el.dataset.w; });
    }, 100);
}

// =========================================
// INIT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    calcBudget();
    initDashboard();
    renderCalendar();
});


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
