# GridBuilder Pro — Square Collage Maker

GridBuilder Pro is a modern React + TypeScript web application designed to automatically arrange multiple photos into a perfect square collage grid. The application compiles high-resolution image cells using HTML5 Canvas, calculates optimal grid layouts, and allows exporting the result.

## ✨ Features

- **Perfect Square Layouts:** Auto-stitches uploaded images into an `NxN` grid using cover-crop layout math to fill space perfectly.
- **Drag & Drop:** Easy drag-and-drop interface for adding photos.
- **High Resolution Export:** Downloads the collage grid as a high-quality JPEG (`800px` cell size).
- **Internationalization (i18n):** Automatically detects browser language (supports French and English out-of-the-box), falls back to English, and offers a premium language switcher toggle.
- **Responsive Layout:** Sleek, modern responsive design styled with Tailwind CSS v4.
- **Ready for Agents:** Includes comprehensive `AGENTS.md` guidelines for AI Pair Programmers.
- **Dockerized & CI/CD Enabled:** Comes with Node 24 Alpine container support and a multi-architecture GitHub Actions workflow.

---

## 🛠️ Tech Stack

- **Framework:** React 19 (Functional hooks)
- **Language:** TypeScript (Strictly typed)
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS v4 & Lucide React icons
- **Animations:** Motion (Framer Motion)
- **Deployment:** Docker & GitHub Actions

---

## 🏃 Running the Application

### 1. Locally
Ensure you have Node.js installed on your system.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (if integrating Gemini features)
cp .env.example .env.local

# 3. Start the Vite development server
npm run dev
```

The app will start at `http://localhost:3000`.

### 2. Docker
To run in a containerized environment (Node 24 Alpine is targeted):

```bash
# 1. Build the Docker image
docker build -t square-collage-maker .

# 2. Run the container mapping the exposed port 3000
docker run -p 3000:3000 --env-file .env.local square-collage-maker
```

---

## 🤖 CI/CD & GitHub Actions

A GitHub Actions workflow is set up at `.github/workflows/docker-publish.yml` which automates building and deployment:

- **Linting & Validation:** Every push/PR runs a linting check (`npm run lint` / `tsc --noEmit`) and project build (`npm run build`).
- **Multi-Architecture Builds:** Buildx compile targets both `linux/amd64` and `linux/arm64`.
- **Publish to Registry:** Automatically publishes to Docker Hub under the tag rules (including Semantic Version tags `v*.*.*`) to `fxhibon/square-collage-maker`.
- **Security:** Permissions are restricted to minimum scope, and all action steps are locked to exact commit SHAs.

### Required Secrets
For the deployment to work, ensure these GitHub Secrets are configured:
- `DOCKERHUB_USERNAME` (e.g. `fxhibon`)
- `DOCKERHUB_TOKEN` (Docker Hub Personal Access Token)

---

## 📋 Coding Guidelines
For detailed instructions, repository structure, and guidelines for AI developers, please check the [AGENTS.md](AGENTS.md) file.
