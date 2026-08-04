# 📚 AI eBook Platform

A modern full-stack eBook publishing platform built with **Next.js**, **MongoDB**, and **TypeScript**, allowing users to create, publish, and explore digital books. The platform includes AI-powered writing assistance, a rich text editor, authentication, image uploads, and social features for an engaging reading experience.

---

## 🚀 Live Demo

🔗 https://your-vercel-link.vercel.app

> Replace the above URL with your deployed Vercel link.

---

## ✨ Features

### 🔐 Authentication
- User Registration & Login
- Secure Authentication using NextAuth
- Protected Routes
- User Sessions

### 📖 Book Management
- Create New Books
- Edit Existing Books
- Draft & Publish Workflow
- Public / Private Books
- Upload Cover Images
- Chapter Management

### ✍️ Rich Text Editor
- Tiptap Editor
- Modern Writing Experience
- AI Assisted Content Generation

### ❤️ Community Features
- Like Books
- Comment System
- Bookmark Books
- View Count

### 🔍 Search & Filters
- Search by Book Title
- Search by Author
- Filter by Category
- Sort by:
  - Latest
  - Most Viewed
  - Most Liked

### 👤 User Profile
- View User Information
- Display Created Books
- Manage Personal Content

---

# 🛠 Tech Stack

## Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Axios

## Backend
- Next.js API Routes
- NextAuth
- MongoDB
- Mongoose

## AI Integration
- Groq API

## Image Storage
- ImageKit

---

# 📂 Folder Structure

```
app/
├── api/
├── dashboard/
├── login/
├── register/
├── profile/
├── books/
└── ...

components/
db/
lib/
model/
public/
```

---

# ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/your-repository.git
```

### Go to Project Folder

```bash
cd your-repository
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

GROQ_API_KEY=
```

### Run Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# 📦 Build for Production

```bash
npm run build
npm start
```

---

# 📸 Screenshots

Add screenshots here after deployment.

- Home Page
- Login Page
- Dashboard
- Create Book
- Book Details
- User Profile

Example:

```
screenshots/
    home.png
    dashboard.png
    create-book.png
```

---

# 🚀 Deployment

This project is deployed on **Vercel**.

To deploy your own copy:

1. Fork or Clone the repository.
2. Import the project into Vercel.
3. Add the required Environment Variables.
4. Deploy.

---

# 🔒 Environment Variables

The following variables are required:

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB Connection String |
| NEXTAUTH_SECRET | NextAuth Secret |
| NEXTAUTH_URL | Base URL |
| IMAGEKIT_PUBLIC_KEY | ImageKit Public Key |
| IMAGEKIT_PRIVATE_KEY | ImageKit Private Key |
| IMAGEKIT_URL_ENDPOINT | ImageKit URL Endpoint |
| GROQ_API_KEY | Groq API Key |

> **Important:** Never commit your `.env` file to GitHub.

---

# 📌 Future Improvements

- Reading Progress
- Follow Authors
- Notifications
- Book Ratings
- PDF Export
- Admin Dashboard
- Dark Mode
- Reading History

---

# 👨‍💻 Author

**Rounik Sarkar**

B.Tech Computer Science Engineering

Full Stack Web Developer

GitHub: https://github.com/your-github

LinkedIn: https://linkedin.com/in/your-profile

---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.