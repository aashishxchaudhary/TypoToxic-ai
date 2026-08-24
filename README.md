<div align="center">

# ⚡TypoToxic AI

### **We don't measure typing speed. We forge monsters.**

A next-generation **AI-powered adaptive typing trainer** featuring real-time analytics, intelligent coaching, cyberpunk-inspired UI, personalized learning, and full-stack architecture.

<p>

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Framework-Express-black?style=for-the-badge&logo=express)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Adaptive-blueviolet?style=for-the-badge)

</p>

---

### 🚀 Forge Speed. Build Accuracy. Train Intelligence.

</div>

---

<!-- safepush-images:start -->
## Preview

<p align="center">
  <img src="docs/assets/img1-6.png" alt="Img1" width="100%" />
</p>

<p align="center">
  <img src="docs/assets/img2-6.png" alt="Img2" width="100%" />
</p>

<p align="center">
  <img src="docs/assets/img3-6.png" alt="Img3" width="100%" />
</p>

<p align="center">
  <img src="docs/assets/img4-6.png" alt="Img4" width="100%" />
</p>

<p align="center">
  <img src="docs/assets/img5-4.png" alt="Img5" width="100%" />
</p>

<!-- safepush-images:end -->




# ✨ Features

## 🎯 Adaptive Typing Engine

- Dynamic difficulty adjustment
- AI-powered session recommendations
- Personalized typing paths
- Progressive learning system

---

## 🤖 AI Coach

The integrated AI Coach analyzes:

- Typing rhythm
- Hesitation patterns
- Weak words
- Weak keys
- Capitalization mistakes
- Punctuation mistakes
- Burst speed
- Fatigue level
- Accuracy trend
- WPM trend

If no AI provider is configured, TypoToxic automatically switches to an intelligent local fallback.

---

## 📊 Performance Analytics

Track everything that matters.

✔ Words Per Minute

✔ Accuracy

✔ Streak

✔ XP

✔ Skill Score

✔ Fatigue Risk

✔ Plateau Risk

✔ Session History

✔ Weak Characters

✔ Weak Words

✔ Progress Charts

---

## 🎮 Game Modes

- 🟢 Everyday
- 📖 Story
- ⚔ Challenge
- 💻 Code

---

## 🧠 Adaptive Intelligence

Each user receives a persistent learning profile including:

- Skill Score
- Learning Progress
- Difficulty Recommendation
- Target WPM
- Target Accuracy
- Daily Missions
- Weak Areas
- Achievements

---

# 🏗 Tech Stack

| Frontend | Backend | Database | AI |
|-----------|----------|----------|----|
| React | Node.js | MongoDB | Adaptive AI |
| Vite | Express | Mongoose | OpenAI Compatible |
| JWT | REST API | Memory DB | Local AI Fallback |

---

# 📂 Project Structure

```text
TypoToxic -AI/

backend/
frontend/
docs/
assets/
README.md
```

---

# ⚙ Installation

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open

```
http://localhost:5173
```

---

# 🔐 Environment Variables

## Backend

```env
PORT=5000

MONGO_URI=<YOUR_MONGODB_URI>

JWT_SECRET=<YOUR_JWT_SECRET>

CLIENT_URL=http://localhost:5173

USE_MEMORY_DB=true

AI_PROVIDER=<optional>

AI_API_KEY=<YOUR_AI_API_KEY>

AI_BASE_URL=<YOUR_AI_PROVIDER_ENDPOINT>

AI_MODEL=<YOUR_MODEL_NAME>
```

## Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠ Never commit your `.env` file or real API keys to GitHub.

---

# 🌐 REST API

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

---

## Results

```
POST /api/results

GET /api/results/me

GET /api/results/stats
```

---

## Challenges

```
POST /api/challenges

GET /api/challenges/me
```

---

## AI

```
GET /api/ai/profile

GET /api/ai/session

POST /api/ai/coach
```

---

# 🛡 Security

- JWT Authentication
- Protected Routes
- Password Hashing
- Secure Environment Variables
- API Key Isolation
- CORS Protection
- Input Validation

---

# 🚀 Roadmap

- AI Challenge Generator
- Keyboard Heatmap
- Leaderboards
- Achievements
- ML-Based Prediction Model

---

# ❤️ Contributing

Contributions are always welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---


<div align="center">

### ⭐ If you like this project, consider giving it a star!

Made with ❤️ by **TypoToxic AI**

</div>
