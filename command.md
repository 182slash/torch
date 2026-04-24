<<<<<<< HEAD
# torch-engineer
Premium IT Services Website
=======
# Deploy Frontend-Backend
ssh -p 65002 u665544659@46.202.186.232

Whenever you make changes locally, the deploy process is:
powershell# 1. Build
npm run build

# 2. Zip the out folder
Compress-Archive -Path X:\Project\Torch\out\* -DestinationPath X:\Project\torch-static.zip -Force

# 3. Upload
scp -P 65002 X:\Project\torch-static.zip u665544659@46.202.186.232:~/domains/torchengineer.com/public_html/

# 4. On server: extract and fix permissions
bashcd ~/domains/torchengineer.com/public_html
unzip -o torch-static.zip
chmod -R 755 _next about chat 404





scp -P 65002 -r .next server.js package.json public/ u665544659@46.202.186.232:~/domains/torchengineer.com/torch-app/

# Deploy
Compress-Archive -Path X:\Project\Torch\out\* -DestinationPath X:\Project\torch-static.zip -Force

Compress-Archive -Path X:\Project\Torch\out\* -DestinationPath X:\Project\torch-static.zip -Force

scp -P 65002 X:\Project\torch-static.zip u665544659@46.202.186.232:~/domains/torchengineer.com/public_html/

scp -P 65002 X:\Project\torch-static.zip u665544659@46.202.186.232:~/domains/torchengineer.com/public_html/

cd ~/domains/torchengineer.com/public_html
unzip -o torch-static.zip



# torch. — IT Engineering Solutions Website

> Dark, cyberpunk-industrial · Next.js 14 · Socket.IO · Three.js

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local and set your values

# 3. Run dev server (custom Node.js + Socket.IO)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SOCKET_URL` | Base URL of the server (client-side) | `http://localhost:3000` |
| `ADMIN_PASSWORD` | Password for admin chat panel | `SecurePass123!` |
| `ADMIN_TOKEN` | Token used by Socket.IO admin namespace auth | `super-secret-token-xyz` |
| `PORT` | Port the Node.js server listens on | `3000` |

---

## Build for Production

```bash
npm run build
```

This runs:
1. `next build` — compiles the Next.js app into `.next/`
2. `tsc server.ts` — compiles the custom server to `server.js`

---

## Deploy to Hostinger Premium Hosting

### Prerequisites
- Hostinger Premium or Business plan with Node.js support
- SSH access enabled
- Domain pointed to your hosting

### Step 1: Build locally

```bash
npm run build
```

### Step 2: Upload via SCP

```bash
scp -r .next server.js package.json public/ \
    user@your-hostinger-ip:/home/user/torch-website/
```

Replace `user` and `your-hostinger-ip` with your Hostinger SSH credentials.

### Step 3: Install & start on server

```bash
ssh user@your-hostinger-ip

cd /home/user/torch-website

# Install production dependencies only
npm install --production

# Set environment variables
cp .env.local.example .env.local
nano .env.local   # fill in production values

# Start the server
node server.js
```

### Step 4: Configure domain proxy

In Hostinger's control panel:
1. Go to **Hosting → Node.js** section
2. Set application root to `/home/user/torch-website`
3. Set startup file to `server.js`
4. Set Node.js version to 18+
5. Enable the application

Or via `.htaccess` if using Apache proxy:

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### Step 5: Keep alive with PM2 (recommended)

```bash
npm install -g pm2
pm2 start server.js --name "torch-website"
pm2 save
pm2 startup
```

---

## Project Structure

```
torch-website/
├── server.ts                    ← Custom Node.js + Socket.IO server
├── next.config.ts               ← Next.js configuration
├── tailwind.config.ts           ← Tailwind CSS + design tokens
├── tsconfig.json                ← TypeScript config (app)
├── tsconfig.server.json         ← TypeScript config (server)
├── package.json
├── .env.local.example           ← Environment variable template
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   └── qr-code.svg
└── src/
    ├── app/
    │   ├── layout.tsx           ← Root layout, fonts, SEO metadata
    │   ├── page.tsx             ← Home page
    │   ├── about/page.tsx       ← About page
    │   ├── chat/page.tsx        ← Admin chat room (password-gated)
    │   └── globals.css          ← Design system + global styles
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx       ← Fixed navbar with scroll shrink
    │   │   └── Footer.tsx
    │   ├── three/
    │   │   └── NetworkScene.tsx ← Three.js fiber optic hero
    │   ├── sections/
    │   │   ├── HeroSection.tsx
    │   │   ├── LiveStatusBar.tsx
    │   │   ├── ServicesSection.tsx
    │   │   ├── AboutSection.tsx
    │   │   └── ContactSection.tsx
    │   ├── ui/
    │   │   ├── GlowCard.tsx
    │   │   ├── NeonButton.tsx
    │   │   ├── SectionTitle.tsx
    │   │   └── CornerBracket.tsx
    │   └── chat/
    │       ├── ChatWidget.tsx   ← Floating chat bubble (all pages)
    │       ├── ChatRoom.tsx     ← Admin dashboard (/chat)
    │       └── MessageBubble.tsx
    ├── hooks/
    │   ├── useSocket.ts         ← Visitor socket hook
    │   └── useScrollAnimation.ts
    ├── lib/
    │   ├── socket.ts            ← Socket.IO client factory
    │   └── constants.ts         ← Services data, nav links
    └── types/
        └── chat.ts              ← TypeScript interfaces
```

---

## Chat System

### How it works

1. **Visitor** opens the floating chat widget (bottom-right)
2. Socket.IO connects to `/visitor` namespace with a persistent UUID
3. **Admin** visits `/chat` and enters the admin token to authenticate
4. Admin socket connects to `/admin` namespace (token-gated)
5. Messages flow bi-directionally in real-time

### Admin access

Navigate to `https://your-domain.com/chat` and enter your `ADMIN_TOKEN` from `.env.local`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS + CSS custom properties |
| 3D Graphics | Three.js r162 + UnrealBloomPass |
| Real-time | Socket.IO 4 (custom Node.js server) |
| Icons | Lucide React |
| Fonts | Orbitron, Space Mono, Syne (Google Fonts) |

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero (Three.js), Services grid, Contact |
| `/about` | Brand story, founder signature |
| `/chat` | Admin support dashboard (token-gated) |

---

© 2024 TOR-CH — Engineering Solutions. Empowering Business.
>>>>>>> 2965a2f (Initial commit - Torch Engineer project)
