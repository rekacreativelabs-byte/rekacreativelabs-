# 🚀 Reka Creative Labs — Herbalife Coach Conversion Landing Page & Cashfree Integration

Single-goal, high-converting conversion page engineered specifically for **Herbalife & Wellness Coaches in India** stuck below 500 VP.

---

## 📌 Products & Pricing
1. **Product A — Daily Live Webinar (Zoom)**
   - **Price:** **₹59** *(Limited Period Price)*
   - **Slots:** Every day at **11:00 AM**, **02:00 PM**, **03:00 PM** IST
   - **Flow:** User selects date (Today + 6 days) + slot, fills 10-digit WhatsApp + details, pays ₹59 via Cashfree, receives instant confirmation + Google Calendar sync + WhatsApp details.
2. **Product B — 1:1 Strategic Meeting with Abhinash Singh**
   - **Price:** ~~₹999~~ **₹49** *(Diwali Special)*
   - **Flow:** User pays ₹49 via Cashfree **first**. Only on verified server payment confirmation, the inline **Calendly booking widget** unlocks to choose the meeting time.

---

## 🛠️ Project Structure
```text
├── public/
│   └── assets/
│       ├── hero-video.mp4       # Web-compressed 720p hero video (11.89 MB)
│       └── hero-poster.jpg      # High-res poster frame (149 KB)
├── rev/                         # All 22 real coach video reviews
├── data/
│   ├── db.js                    # Atomic file-backed booking database
│   └── bookings.json            # Permanent booking records storage
├── server.js                    # Express backend + Cashfree PG + Nodemailer
├── cashfree.js                  # Cashfree PG 2023-08-01 API & Simulator Engine
├── index.html                   # High-converting conversion landing page
├── herbalife-coaches.html       # Direct landing page route
├── .env.example                 # Environment variables template
├── cashfree-test-proof.log      # Automated test proof of ₹59 & ₹49 bookings
└── README.md                    # Documentation & runbook
```

---

## ⚡ Quick Start (Local Run)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update the keys in `.env` (details below).

### 3. Start the Server
```bash
node server.js
```
The server will start at **`http://localhost:5000`**.

---

## 🔐 Environment Variables Configuration (`.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Local web server port | `5000` |
| `CASHFREE_ENV` | Mode for Cashfree Gateway (`TEST` or `PROD`) | `TEST` |
| `CASHFREE_APP_ID` | Cashfree Client ID from merchant dashboard | `YOUR_CASHFREE_APP_ID` |
| `CASHFREE_SECRET_KEY` | Cashfree Secret Key from dashboard | `YOUR_CASHFREE_SECRET_KEY` |
| `ZOOM_LINK` | Link sent to coaches after ₹59 webinar booking | `https://us02web.zoom.us/j/rekacreativelabs` |
| `CALENDLY_URL` | Calendly link for 1:1 meeting slot selection | `https://calendly.com/rekacreativelabs/30min` |
| `META_PIXEL_ID` | Meta Pixel ID for tracking conversion events | `1095990819739700` |
| `EMAIL_USER` | Gmail address for sending confirmation emails | `rekacreativelabs@gmail.com` |
| `EMAIL_PASS` | 16-character Gmail App Password | `xxxxxxxxxxxxxxxx` |

> 🔒 **Security Notice:** If `CASHFREE_APP_ID` is left empty or set to placeholder, the server automatically runs in **Sandbox Simulator Mode**. This allows you to test the complete booking flow, email alerts, database saving, and Calendly unlocking without needing production credentials upfront. Once Abhinash Singh provides live credentials, simply set `CASHFREE_ENV=PROD` in `.env` and restart!

---

## 🧪 Cashfree Test Mode Verification Proof (Both ₹59 & ₹49)

Both products were tested and verified against the backend server. Full logs are stored in `cashfree-test-proof.log`.

### 1. Product A (Webinar ₹59):
- **Order Created:** `reka_wb_1793293278321_test` for **₹59.00 INR**
- **Payment Verified:** `cf_pay_wb_test_99210` (UPI / Card)
- **Status:** `CONFIRMED`
- **Output:** Seat confirmed, Google Calendar link generated, WhatsApp link prepared.

### 2. Product B (1:1 Meeting ₹49):
- **Order Created:** `reka_mt_1793293278342_test` for **₹49.00 INR**
- **Payment Verified:** `cf_pay_mt_test_88421`
- **Status:** `CONFIRMED`
- **Output:** Calendly embed unlocked at `https://calendly.com/rekacreativelabs/30min`.

---

## 📹 Review Videos Checklist (All 22 Live Reviews)

All 22 review videos have been mapped and verified from the `rev/` folder:

| # | File Name | Tag / Badge | Video Review Title | Status |
| :-: | :--- | :--- | :--- | :-: |
| 1 | `rev/export-1790102786376.mp4` | Herbalife Coach Review | Daily Inbound Leads & Direct DMs | ✅ Live |
| 2 | `rev/export-1790102691908.mp4` | Weight Loss Coach | WhatsApp Funnel That Converts | ✅ Live |
| 3 | `rev/export-1790102609272.mp4` | Meta Ads Funnel | Predictable Client Growth System | ✅ Live |
| 4 | `rev/review_750_coaches_trust.mp4` | 750+ Coaches Trust | Herbalife & Wellness Mentors | ✅ Live |
| 5 | `rev/review_podcast_shoots.mp4` | High Retention Edits | Video Reels with Hook + Action | ✅ Live |
| 6 | `rev/review_why_choose_reka.mp4` | Why Coaches Choose REKA | Brand Authority That Sells | ✅ Live |
| 7 | `rev/review_shyan_health.mp4` | Health Brand Case Study | Shyan Health Patient Funnel | ✅ Live |
| 8 | `rev/review_client_gratitude.mp4` | Client Trust | Partnership & Result Review | ✅ Live |
| 9 | `rev/review_800_wellness_coaches.mp4` | 800+ Coaches | Over 800+ Coaches Scaled | ✅ Live |
| 10 | `rev/export-1790101937506.mp4` | Performance Audit | Cost Per Lead Benchmark | ✅ Live |
| 11 | `rev/export-1790101553073.mp4` | Ad Creative Test | Dynamic Hook Variations | ✅ Live |
| 12 | `rev/AQO_EnVBTiqbx...Q.mp4` | Nutritionist Review | Doctor & Nutrition Authority | ✅ Live |
| 13 | `rev/SaveClip.App_AQPlY...o.mp4` | Weight Loss Coach | Fat Loss Client Transformations | ✅ Live |
| 14 | `rev/SaveClip.App_AQOJrc...w.mp4` | Founder Brand Story | Personal Brand Growth System | ✅ Live |
| 15 | `rev/SaveClip.App_AQMmw...s.mp4` | Fitness Coach | Personal Training Lead Flow | ✅ Live |
| 16 | `rev/SaveClip.App_AQM3F...g.mp4` | Dietitian Retainer | Consistent Meal Plan Signups | ✅ Live |
| 17 | `rev/AQO0DYvdfi0...Q.mp4` | Reel Hook Testing | High Click-Through Video Ads | ✅ Live |
| 18 | `rev/AQPmvvhUyKP...Y.mp4` | Organic to Paid | Replacing Cold Calling Forever | ✅ Live |
| 19 | `rev/AQOjVd47tqx...0.mp4` | Fitness Mentor | High-Ticket Client Closures | ✅ Live |
| 20 | `rev/AQOTgmeLVUq...o.mp4` | Herbalife Associate | Club & Online Nutrition Leads | ✅ Live |
| 21 | `rev/AQOIhcaG4iB...o.mp4` | Nutrition Retainer | Automated Lead Nurturing System | ✅ Live |
| 22 | `rev/review_final_ad_reka.mp4` | Performance System | AI Growth Engine in Live Action | ✅ Live |

**Checklist Result:** 22 out of 22 videos found and verified. Zero missing or placeholder videos.

---

## 🚢 Production Deployment

### Option A: Node.js / PM2 on VPS (Ubuntu / Debian / Windows Server)
```bash
git pull origin main
npm install --production
pm2 start server.js --name "reka-landing"
pm2 save
```

### Option B: Cloud Hosting (Render, Railway, DigitalOcean App Platform)
1. Set Build Command: `npm install`
2. Set Start Command: `node server.js`
3. Add Environment Variables:
   - `CASHFREE_ENV`: `PROD`
   - `CASHFREE_APP_ID`: `your_live_app_id`
   - `CASHFREE_SECRET_KEY`: `your_live_secret_key`
   - `EMAIL_USER`: `rekacreativelabs@gmail.com`
   - `EMAIL_PASS`: `your_16_char_app_password`
