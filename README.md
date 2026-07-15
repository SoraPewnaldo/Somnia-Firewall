# Project Somnia — Spatial Operating System & Dreamscape

Project Somnia is a premium, futuristic spatial web experience and mixed-reality monitoring interface inspired by Apple Vision Pro, Linear, and cutting-edge Awwwards designs.

It serves as the synchronization dashboard for the **Somnia Dreamscape**, visualizing network stability, incident feeds, system logs, and security firewalls.

---

## 🌌 Features

- **Spatial OS UI Layer**: Floating glassmorphism panels designed to resemble a next-gen headset operating system. 
- **Volumetric 3D Environment**: Powered by **React Three Fiber (R3F)** and **Three.js**, displaying a central 3D mesh model (`apple_vision_pro_3_d_portfolio_concept.glb`) floating inside a dark atmospheric dreamscape with volumetric fog, ambient night lighting, and soft contact shadows.
- **Dynamic WebGL Strands**: A background WebGL ribbon simulation rendered with **OGL** that animates fluidly behind the 3D canvas.
- **Symmetric Specular Borders**: Adapted OGL shader highlights (`SpecularCard` & `SpecularButton`) that cast real-time responsive light sweeps tracing the edges of all UI cards and buttons as your mouse approaches.
- **3D Mouse Parallax**: The entire interface operates in a virtual 3D space (`preserve-3d`). Mouse movement dynamically rotates and shifts UI panels on multiple axes, creating a sense of physical depth.
- **Cinematic Transitions**: Seamless state transitions using **Framer Motion** that animate the 3D camera coordinates to zoom into the network core when the workspace initializes.

---

## 🛠️ Technology Stack

- **Core Framework**: [Next.js](https://nextjs.org/) (App Router) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D & Shaders**:
  - [Three.js](https://threejs.org/)
  - [React Three Fiber](https://r3f.docs.pmnd.rs/) (Three.js React wrapper)
  - [Drei](https://github.com/pmndrs/drei) (R3F helper library)
  - [OGL](https://github.com/oogl/ogl) (Lightweight WebGL library for Strands and Specular shaders)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SoraPewnaldo/Somnia-Firewall.git
   cd Somnia-Firewall
   ```

2. **Install Dependencies**
   ```bash
   npm install --force
   ```
   *(Note: `--force` or `--legacy-peer-deps` may be required to resolve strict peer dependency versions between React Three Fiber and legacy component frameworks).*

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **View the Application**
   Open your browser and navigate to `http://localhost:3000`.

---

## 📁 Key File Structure

```text
├── public/
│   └── scene.glb                      # The 3D model loaded into the environment
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout configuration (fonts, global tags)
│   │   ├── page.tsx                   # Main orchestrator (handles layout tilt, Strands BG & page state)
│   │   └── globals.css                # Global CSS imports and Tailwind customization
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── DreamscapeEnvironment  # R3F Canvas containing fog, lighting, and GLB loading
│   │   │   └── Strands                # WebGL animated ribbons background
│   │   ├── hero/
│   │   │   └── Hero                   # Launch experience with dynamic start trigger
│   │   ├── layout/
│   │   │   └── Navbar                 # Glassmorphic top navigation bar
│   │   ├── ui/
│   │   │   ├── SpecularButton         # Custom shader-based interactive buttons
│   │   │   └── SpecularCard           # Border specular sweep wrappers for panels
│   │   └── workspace/
│   │       └── Workspace              # System monitoring panels layout (Terminal, Node Feed, AI chat)
│   └── lib/
│       └── utils.ts                   # Utility functions
```

---

## 🎨 Creative License

- **3D Asset**: Loaded from `public/scene.glb` (Apple Vision Pro Portfolio Concept).
- **Shaders & Logic**: Interactive shaders adapted from open-source concepts on [React Bits](https://reactbits.dev/).
