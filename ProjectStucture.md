PS X:\Project\Torch> tree /F
Folder PATH listing for volume 182
Volume serial number is 000001BC 30B6:2486
X:.
│   .env
│   .gitignore
│   next-env.d.ts
│   next.config.mjs
│   package.json
│   postcss.config.js
│   README.md
│   server.ts
│   tailwind.config.ts
│   tsconfig.json
│   tsconfig.server.json
│
├───public
│       favicon.ico
│       favicon.svg
│       og-image.jpg
│       og-image.svg
│       qr-code.svg
│
└───src
    ├───app
    │   │   globals.css
    │   │   layout.tsx
    │   │   loading.tsx
    │   │   not-found.tsx
    │   │   page.tsx
    │   │
    │   ├───about
    │   │       page.tsx
    │   │
    │   └───chat
    │           page.tsx
    │
    ├───components
    │   ├───chat
    │   │       ChatRoom.tsx
    │   │       ChatWidget.tsx
    │   │       MessageBubble.tsx
    │   │
    │   ├───layout
    │   │       Footer.tsx
    │   │       Navbar.tsx
    │   │
    │   ├───sections
    │   │       AboutSection.tsx
    │   │       ContactSection.tsx
    │   │       HeroSection.tsx
    │   │       LiveStatusBar.tsx
    │   │       ServicesSection.tsx
    │   │
    │   ├───three
    │   │       NetworkScene.tsx
    │   │
    │   └───ui
    │           CornerBracket.tsx
    │           GlowCard.tsx
    │           NeonButton.tsx
    │           SectionTitle.tsx
    │
    ├───hooks
    │       useScrollAnimation.ts
    │       useSocket.ts
    │
    ├───lib
    │       constants.ts
    │       socket.ts
    │
    ├───types
    │       chat.ts
    │
    └───{app
        └───{about,chat},components
            └───{layout,three,sections,ui,chat},hooks,lib,types}
PS X:\Project\Torch> 