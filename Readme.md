# 🚨 Pipeline Leak Detection System

A modern web-based system for detecting pipeline leaks using real-time sensor data, AI models, and an interactive dashboard.

## 🔧 Features

- Real-time leak detection using physics-based and AI models (CFD, RTTM)
- Interactive and responsive UI built with React
- Simulate leaks with manual or auto-generated input
- Hardware integration check with visual sensor status
- Dynamic graph plotting, data logs, and email alerts

## 🚀 Tech Stack

- **Frontend**: React, HTML & CSS   
- **Backend**: FastAPI (Python)
- **AI/ML**: Custom ML logic for prediction
- **Tools**: Git, Node.js, Python, VS Code

# 📦 Installation & Setup

- ### Clone the Repository
git clone https://github.com/HMlakshmi24/pipeline-leak-detection.git

cd pipeline-leak-detection

- ### Create virtual environment
python -m venv venv

- ### To Activate virtual environment for (Windows)
venv\Scripts\activate

- ### To Activate virtual environment for (Linux/Mac)
source venv/bin/activate

- ### Install all the dependencies in virtual environment
pip install -r requirements.txt

- ### Run Backend
cd Backend
uvicorn main:app --reload

- ### Run Frontend
cd Frontend/pipeline-ui
npm install
npm run start
