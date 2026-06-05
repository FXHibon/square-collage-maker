# Agent Guidelines (AGENTS.md)

Welcome, AI Agent! This document outlines guidelines, repository structure, and instructions to help you navigate, build, and maintain the **Square Collage Maker** application.

## 🚀 Project Overview

**Square Collage Maker** is a React + TypeScript web application built with Vite and styled with Tailwind CSS v4.
- **Node.js Version:** 24 (fixed in `package.json` engines)
- **Containerization:** Docker (configured to run on Node 24 Alpine)

---

## 🛠️ Stack & Technologies

1. **Frontend Framework:** React 19 (using functional components and standard hooks).
2. **Build Tooling:** Vite 6 with TypeScript.
3. **Styling:** Tailwind CSS v4.
4. **Animations:** `motion` (Framer Motion).
5. **APIs:** Integrates with `@google/genai` (Gemini API) for backend/server capabilities.
6. **i18n:** Built-in localization module in `src/i18n/index.ts` supporting browser language detection, English fallback, and manual toggle overrides.

---

## 📋 Coding Standards & Guidelines

### 1. Code Quality & Formatting
- Write clean, modular, and strongly-typed TypeScript code (`.ts` and `.tsx`).
- Retain existing comments, docstrings, and licensing headers.
- Keep components focused and reusable.

### 2. Styling Rules
- Use Tailwind CSS v4 utility classes.
- Ensure layouts are fully responsive, modern, and touch-friendly.
- Prioritize high-quality aesthetics: smooth transitions, consistent shadows, and polished color palettes.

### 3. Git Rules
- Ensure you do not commit environment secrets, node_modules, or build directories.
- Refer to the [.gitignore](file:///Users/hibonfrancoisxavier/fxhibon/square-collage-maker/.gitignore) for excluded file patterns.

---

## 🏃 Run & Build Instructions

### Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and add your `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Running with Docker
A [Dockerfile](file:///Users/hibonfrancoisxavier/fxhibon/square-collage-maker/Dockerfile) is configured to run the application on Node 24:
1. Build the Docker image:
   ```bash
   docker build -t square-collage-maker .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env.local square-collage-maker
   ```

---

## 🤖 CI/CD & GitHub Actions

A GitHub Actions workflow is configured in [.github/workflows/docker-publish.yml](file:///Users/hibonfrancoisxavier/fxhibon/square-collage-maker/.github/workflows/docker-publish.yml).

### Workflow Details
1. **Triggers:**
   - On pull requests targeting `master` or `main` (performs local Node build and lint validation).
   - On pushes to `master` or `main` (builds and publishes the Docker image).
   - On SemVer tags `v*.*.*` or pre-releases `v*.*.*-*` (builds and publishes tagged Docker image).
2. **Docker Registry:** Published to Docker Hub at `fxhibon/square-collage-maker`.
3. **Architectures:** Multi-platform builds configured for `linux/amd64` and `linux/arm64`.
4. **Security Recommendations:**
   - Pinning GitHub Actions to exact commit SHAs.
   - Restricting `GITHUB_TOKEN` permissions to minimum scope (`permissions: contents: read`).
   - Caching dependencies securely to prevent vulnerabilities.

### Required Secrets
Ensure the following secrets are configured in the GitHub repository (`Settings -> Secrets and variables -> Actions`):
- `DOCKERHUB_USERNAME`: The Docker Hub username (e.g., `fxhibon`).
- `DOCKERHUB_TOKEN`: A Docker Hub Personal Access Token (PAT).

