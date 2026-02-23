<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Manas360 Therapist Onboarding & Training Portal

Building the future of mental health support through AI-driven therapist training and onboarding.

---

## 🚀 Overview
The Manas360 Therapist Onboarding & Training Portal is a comprehensive platform designed to streamline the journey of mental health professionals. From initial registration and lead management to advanced clinical training using AI-driven simulations, this portal serves as the central hub for therapist development.

## ✨ Key Features

### 🎓 Advanced Training Modules
*   **Cognitive Behavioral Therapy (CBT)**: Interactive training engine with session simulators, mood trackers, and performance analytics.
*   **Neuro-Linguistic Programming (NLP)**: Multi-step certification path with integrated course overviews and assessments.
*   **5 Whys + Empathy Training**: Specialized AI-powered training portal for developing deep empathetic listening and root-cause analysis skills.

### 💼 Professional Management
*   **Lead Pipeline**: Interactive "My Leads" system for tracking and selecting potential client sessions.
*   **Subscription Management**: Tiered professional plans for therapists to manage their clinical practice features.
*   **Certificate Tracking**: Automated generation and storage of training certificates.

### 🤖 AI-Driven Experience
*   **AI Mentorship**: Powered by Google Gemini to provide real-time feedback during training sessions.
*   **Interactive Simulations**: Dynamic session-building tools that respond to therapist inputs in real-time.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Google Gemini Pro (@google/genai)](https://ai.google.dev/)
- **Styling**: Vanilla CSS with modern flex/grid layouts
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
├── components/           # Core UI components and layout systems
│   ├── cbt/             # Specialized Cognitive Behavioral Therapy module
│   ├── NLPContent.tsx   # Neuro-Linguistic Programming module logic
│   └── TrainingGuide.tsx # Main training navigation and logic
├── manas360-therapist-training-portal.../ # Specialized 5-Whys training portal
├── Session-Templates-Library-main/      # Comprehensive library of clinical templates
├── App.tsx               # Main application entry and routing logic
├── trainingTypes.ts      # Global type definitions for training modules
└── trainingConstants.ts  # Shared configuration and static content
```

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (Latest LTS)
*   NPM or Yarn
*   Google Gemini API Key

### Installation

1.  **Clone the Repository**
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Environment Setup**
    Create or update your `.env.local` file:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

### Development

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📦 Deployment

To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist/` directory.

---
<div align="center">
  <p>Developed for the Manas360 Therapist Ecosystem</p>
</div>
