# CogniPhish: Dunning-Kruger Phishing Simulator

**CogniPhish** is a lightweight security awareness tool inspired by the **Dunning-Kruger Effect**. It attempts to measure not just if you can spot a phishing email, but how **confident** you are in your judgment.

The goal is to highlight where users might be "overconfident" (high confidence, wrong answer) versus well-calibrated.

## 🚀 Key Features

*   **Dynamic Scenarios**: Uses a combinatorial engine to varying email scenarios (Sender, Subject, Body, Urgency).
*   **Confidence Scoring**: Users must rate their confidence (1-10) before submitting a decision.
*   **Analysis Dashboard**: Visualizes the gap between your "Perceived Ability" (Confidence) and "Actual Competence" (Accuracy).
*   **Familiar UI**: A clean interface designed to mimic standard email clients like Gmail.

## 🛠️ Tech Stack

*   **Backend**: Django, Python (REST Framework)
*   **Frontend**: React, TailwindCSS, Vite
*   **Visualization**: Recharts

## 📦 Run Locally

### Backend
```bash
cd backend
# Create/Activate venv
pip install -r requirements.txt
python manage.py migrate
python manage.py generate_scenarios --count 50
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🤝 Contributing & Ideas

**This is a small, experimental project.** 

We know it's not perfect, and we are actively looking for ideas to make it better! We'd love your help with:
*   **Better Scenarios**: Ideas for more realistic or tricky phishing templates.
*   **New Metrics**: Ways to better measure user behavior or hesitation.
*   **UI Tweaks**: Improving the authenticity of the email client.

Feel free to **open an issue** or **submit a Pull Request**. Any contribution, big or small, is welcome!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
