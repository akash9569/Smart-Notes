![Smart Notes Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Smart%20Notes&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=32&desc=Your%20All-in-One%20Productivity%20Workspace&descAlignY=52&descSize=18)

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-author">Author</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License"/>
</p>

---

## 🎬 Demo

<p align="center">
  <img src="screenshots/landing.png" alt="Dashboard Preview" width="700"/>
</p>


> **Smart Notes** is a powerful MERN stack productivity app that combines note-taking, task management, habit tracking, expense monitoring, and journaling — all in one beautiful dark-themed interface.

---

## ⚡ Key Features

```
📝 NOTES & NOTEBOOKS          ✅ TASK MANAGEMENT           📊 LIFE TRACKING
├─ Rich Text Editor           ├─ Kanban Board              ├─ Habit Tracker
├─ AI Summaries               ├─ Priority Levels           ├─ Expense Manager
├─ Nested Notebooks           ├─ Calendar View             ├─ Loan Tracker
├─ Custom Tags                ├─ Due Reminders             ├─ Budget Goals
└─ Templates                  └─ List View                 └─ Analytics

🗒️ QUICK CAPTURE              📔 JOURNALING                🎨 PERSONALIZATION
├─ Sticky Notes               ├─ Daily Entries             ├─ Dark Mode
├─ Fleeting Thoughts          ├─ Mood Tracking             ├─ Custom Profile
└─ Quick Access               └─ Reflections               └─ Image Gallery
```

---

## 📸 Screenshots

| Dashboard | Notes Editor |
|:---------:|:------------:|
| ![Dashboard](screenshots/dashboard.png) | ![Notes](screenshots/notes.png) |

| Contact us | Detaile of Project |
|:---------:|:------------:|
| ![Contact](screenshots/contact.png) | ![Details](screenshots/data.png) |

| About our Project | Registration Page |
|:---------:|:------------:|
| ![About](screenshots/data1.png) | ![Registration](screenshots/registration.png) |

| Login Page | Reset Password |
|:---------:|:------------:|
| ![Login](screenshots/login.png) | ![Reset](screenshots/reset.png) |

| Task Board | Habit Tracker |
|:----------:|:-------------:|
| ![Tasks](screenshots/tasks.png) | ![Habits](screenshots/habits.png) |

| Expense Tracker | Calendar |
|:---------------:|:--------:|
| ![Expenses](screenshots/expenses.png) | ![Calendar](screenshots/calendar.png) |

| Notebooks | Sticky Notes |
|:---------:|:------------:|
| ![Notebooks](screenshots/notebook.png) | ![Sticky](screenshots/sticky.png) |

| Journal | Templates |
|:-------:|:---------:|
| ![Journal](screenshots/journal.png) | ![Templates](screenshots/templates.png) |

<p align="center">
  <img src="screenshots/profile.png" alt="Profile" width="500"/>
  <br/>
  <em>User Profile</em>
</p>

---

## 🛠️ Tech Stack

<table align="center">
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
      <br>Vite
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
      <br>Node.js
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" />
      <br>Express
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=mongodb" width="48" height="48" alt="MongoDB" />
      <br>MongoDB
    </td>
  </tr>
</table>

**Frontend:** React 18 • Vite • Tailwind CSS • Tiptap Editor • Recharts • Lucide Icons

**Backend:** Node.js • Express • MongoDB • Mongoose • JWT Auth • Cloudinary • OpenAI

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Quick Start

```bash
# Clone the repo
git clone https://github.com/akash9569/Smart-Notes.git
cd Smart-Notes

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install --legacy-peer-deps
```

### Environment Setup

Create `backend/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/smart-notes
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret

# Optional
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run the App

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

🌐 Open **http://localhost:5173**

---

## 📂 Project Structure

```
Smart-Notes/
│
├── 🎨 frontend/
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── pages/         # App Pages
│   │   ├── hooks/         # Custom Hooks
│   │   └── utils/         # Utilities
│   └── package.json
│
├── ⚙️ backend/
│   ├── src/
│   │   ├── controllers/   # Route Handlers
│   │   ├── models/        # Database Models
│   │   ├── routes/        # API Routes
│   │   └── middleware/    # Auth & Validation
│   └── package.json
│
└── 📷 screenshots/        # App Screenshots
```

---

## 🤝 Contributing

1. Fork the project
2. Create your branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 👤 Author

<p align="center">
  <img src="https://github.com/akash9569.png" width="100" style="border-radius: 50%"/>
  <br/>
  <strong>Akash Singh</strong>
  <br/><br/>
  <a href="https://github.com/akash9569">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <a href="https://www.linkedin.com/in/akash-singh-a69213242/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
</p>

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer)
