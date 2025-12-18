# Smart Notes App 📝✨

![License](https://img.shields.io/badge/License-MIT-blue.svg)

A powerful, all-in-one productivity workspace designed to help you organize your life. Smart Notes App combines intelligent note-taking, task management, habit tracking, and financial monitoring into a single, beautiful interface.

![Dashboard Preview](screenshots/dashboard.png)
*A glimpse of your detailed productivity dashboard.*

## 🚀 Features

### 🧠 Intelligent Note-Taking
- **Rich Text Editor**: Format notes with ease using a powerful editor powered by Tiptap.
- **AI-Powered Insights**: Generate summaries and get intelligent suggestions for your content.
- **Notebooks & Tags**: Organize your thoughts with nested notebooks and custom tags.
- **Sticky Notes**: Quick access to fleeting thoughts and reminders.

### ✅ Advanced Task Management
- **Kanban & List Views**: Manage tasks your way.
- **Priority Sorting**: Focus on what matters with Low, Medium, and High priority levels.
- **Calendar Integration**: Visualize your schedule and deadlines.

### 📊 Life Management Tools
- **Habit Tracker**: Build and maintain positive habits with streak tracking and analytics.
- **Expense Tracker**: Monitor your income and expenses with visual charts and budget goals.
- **Loan Manager**: Keep track of borrowed and lent money with due date reminders.

### 🎨 Personalization
- **Gallery**: Upload and manage personal images.
- **Custom Profile**: Set your profile picture and personalize your workspace.
- **Dark Mode**: Sleek dark theme for comfortable night-time usage.

---

## 🛠️ Tech Stack

This project is built using the **MERN Stack** with modern tooling:

- **Frontend**: 
  - [React](https://reactjs.org/) (Vite)
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [Recharts](https://recharts.org/) for analytics visuals
  - [Lucide React](https://lucide.dev/) for icons

- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
  - [MongoDB](https://mongodb.com/) (Mongoose)
  - [JWT](https://jwt.io/) for secure authentication
  - [Cloudinary](https://cloudinary.com/) for scalable image storage (with local fallback)

---

## 📸 Screenshots

| **Dashboard** | **Notes Editor** |
|:---:|:---:|
| ![Dashboard](screenshots/dashboard.png) | ![Notes](screenshots/notes.png) |
| **Task Board** | **Habit Tracker** |
| ![Tasks](screenshots/tasks.png) | ![Habits](screenshots/habits.png) |
| **Expenses** | **Profile** |
| ![Expenses](screenshots/expenses.png) | ![Profile](screenshots/profile.png) |
| **Notebooks** | **Sticky Notes** |
| ![Notebooks](screenshots/notebook.png) | ![Sticky Notes](screenshots/sticky.png) |
| **Templates** | **Calendar** |
| ![Templates](screenshots/templates.png) | ![Calendar](screenshots/calendar.png) |
| **Journal** |  |
| ![Journal](screenshots/journal.png) |  |

> *Please add your screenshots to the `screenshots` folder with the names above!*

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas connection string)
- NPM or Yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/akash9569/Smart-Notes.git
    cd smart-notes-app
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install --legacy-peer-deps
    ```

4.  **Environment Configuration**
    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=5001
    MONGODB_URI=mongodb://localhost:27017/smart-notes
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_refresh_secret

    # Optional: Cloudinary (Images will save locally if skipped)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

5.  **Run the App**
    You need to run both backend and frontend servers.

    *Terminal 1 (Backend):*
    ```bash
    cd backend
    npm run dev
    ```

    *Terminal 2 (Frontend):*
    ```bash
    cd frontend
    npm run dev
    ```

6.  **Open in Browser**
    Visit `http://localhost:5173` to see the app in action!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Designed & Developed by [Akash Singh](https://github.com/akash9569)**

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
