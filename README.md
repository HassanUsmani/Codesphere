<div align="center">

# Tech Guide

**Everyday phone skills and scam defense for all generations.**

*Judge the message, not the panic.*

Built in 8 hours at **Codesphere 3.0** · NED University of Engineering & Technology

</div>

---

## Overview

Tech Guide is an interactive web app that helps parents, grandparents and digital beginners **learn** their phones instead of handing them to someone else. Users practise WhatsApp, banking, ride-hailing and food delivery on a safe pretend phone, learn to spot scams, and get help in Urdu and English.

**Philosophy: empowerment over automation.** We do not take the phone away. We teach the habits to handle it safely, alone.

![Tech Guide home](docs/screenshots/home.png)

## The problem

Most students grew up with technology, so it feels automatic. Our parents and elders did not. They:

- get stuck on small things like logging out of banking apps, video calls and utility forms;
- fall for scams that look authentic, such as fake parcel alerts, prize messages and "Hi, I changed my number";
- fear breaking the phone, looking foolish, or always having to ask family.

This is a language and accessibility gap, not an intelligence gap.

## Who it is for

Parents and grandparents who use WhatsApp and banking daily but fear one wrong tap.

| | |
|---|---|
| **Fears** | Breaking the phone, looking foolish, losing money to a message that looked like family |
| **Language** | Urdu first, short plain words, no jargon |
| **Habits** | WhatsApp all day; hand the phone to the kids when something pops up |

> Evidence: [N] family interviews / observed scenarios. *(Replace with your real research notes.)*

## Features

| Feature | What it does |
|---|---|
| **Everyday app modules** | Jargon-free guides for WhatsApp, Banking, Ride Hailing and Food Delivery, with common red flags |
| **Pretend-phone simulator** | Guided missions (3 min each, XP rewards) on a safe phone. Nothing is real |
| **Scam simulator** | Inspect the sender, wording and links, then decide: Safe, Check First or Scam |
| **Offline safety plan** | Describe a suspicious message in your own words and get a 4-step plan: **Stop, Check, Verify, Act** |
| **Bilingual AI assistant** | Ask in Urdu or English. It explains red flags and opens the right practice |
| **Fraud reporting** | One-tap access to helpline **1799** and the NCCIA portal (complaint.nccia.gov.pk) |
| **XP and missions** | Progress tracked on the device, no account needed |
| **Accessibility toolbar** | Larger text, high contrast, reduce motion, senior mode, light and dark themes |
| **Video guides** | Curated Urdu video walkthroughs (e.g. driving licence via DLS and Dastak) |

| | |
|---|---|
| ![WhatsApp module](docs/screenshots/whatsapp-module.png) | ![Guided mission](docs/screenshots/guided-mission.png) |
| ![Video guides](docs/screenshots/video-guides.png) | ![Assistant](docs/screenshots/assistant.png) |

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vue.js (single-page app) |
| Styling | Tailwind CSS and custom CSS (accessible dark-teal theme) |
| Backend | FastAPI |
| AI | Groq AI (powers the assistant) |
| Storage | Browser local storage (XP, completed missions, saved safety plans) |

## Privacy and safety

- **Pretend phone:** no real app or account is ever connected.
- **Local progress:** XP, missions and safety plans stay on the user's device. No login.
- **AI assistant:** the only online part. It is routed through our FastAPI backend to Groq. Users are told not to share personal or banking details. *(Document here exactly what is sent and whether chats are stored.)*
- **Calm tone:** risks are explained in plain words as a routine, not as a threat.

## Getting started

> Commands below are typical defaults. Adjust them to match your repository.

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Groq API key

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Backend

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # add your GROQ_API_KEY
uvicorn main:app --reload
```

### Environment variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key for the assistant. Never commit it |

## Project structure

```
Tech-Guide/
├── Frontend/          # Vue app: modules, simulator, missions, accessibility toolbar
├── Backend/           # FastAPI service for the AI assistant
├── docs/screenshots/  # README images
├── .gitignore
└── README.md
```

## Hackathon context

- **Event:** Codesphere 3.0, NED University of Engineering & Technology
- **Build window:** 8 hours, with regular GitHub commits
- **AI disclosure:** AI tools assisted with coding and documentation, and the assistant feature runs on Groq AI

## Roadmap

- Full Urdu and regional-language interface
- Voice input and read-aloud for low-literacy users
- More modules (government portals, utility bills, e-commerce)
- Family dashboard so relatives can follow progress with consent

## Team

- [Name], [Role] · [GitHub]
- [Name], [Role] · [GitHub]

## License

[Add your license, e.g. MIT]

---

<div align="center">

*Technology should be a tool for every generation.*

</div>
