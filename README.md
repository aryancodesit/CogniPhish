# CogniPhish: AI-Powered Dunning-Kruger Phishing Simulator 🎣🧠

> **"It's not what you don't know that gets you into trouble. It's what you know for sure that just ain't so."** — Mark Twain

**CogniPhish** is a next-generation security awareness tool designed to combat the **Dunning-Kruger Effect** in cybersecurity. Unlike traditional training that just tracks clicks, CogniPhish measures **User Confidence** vs. **Actual Competence** to identify high-risk employees who are "wrong and strong."

## 🚀 Key Features

*   **🤖 AI "The Forge"**: A combinatorial AI engine (Agent A) that generates millions of unique, context-aware phishing and safe email scenarios. No two runs are the same.
*   **📉 Dunning-Kruger Analysis**: Tracks user confidence (0-10) against risk impact. A dedicated dashboard visualizes the "Peak of Mount Stupid" and helps calibrate user judgment.
*   **📧 Hyper-Realistic Gmail UI**: A pixel-perfect clone of the Gmail interface to test users in a familiar environment, increasing immersion and validity.
*   **🔄 Auto-Scaling Difficulty**: The system adapts triggers (Urgency, Authority, Fear) based on simulated "Analyst" (Agent B) difficulty ratings.
*   **📊 Insight Dashboard**: Interactive graphs (using Recharts) showing "Perceived Ability" (Red Line) vs "Actual Knowledge" (Green Line) to visualize the calibration gap.

## 🛠️ Tech Stack

### Backend (The Core)
*   **Django & Django REST Framework**: Robust API for scenario generation and user tracking.
*   **Python**: Core logic for the combinatorial "Mad Libs" generator.

### Frontend (The Face)
*   **React + Vite**: Blazing fast modern frontend.
*   **TailwindCSS**: For the pixel-perfect Gmail styling.
*   **Recharts**: For the Dunning-Kruger visualization graphs.
*   **Lucide React**: For scalable, clean icons.

## 📦 Installation & Setup

### Prerequisites
*   Python 3.8+
*   Node.js 16+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py generate_scenarios --count 100 # Seed the DB
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to start the simulation!

## 🧪 How It Works

1.  **Simulation Phase**: The user enters an inbox. They must decide if an email is **Safe** or **Phishing**.
2.  **Confidence Check**: Before submitting, the user sets a confidence slider (1-10).
3.  **Risk Calculation**: `Risk Score = (Confidence × Impact) / Difficulty`. High confidence on a wrong answer results in a maximal risk score.
4.  **Loop**: Every 10 emails, the user is sent to the **Analysis Dashboard** to review their "Perception vs Reality" graph.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ by Aryan.*
