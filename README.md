# 🌲 Filoxenia Camp Management

A modern, full-stack web application designed to streamline the operations of summer camps. Built with a sleek, nature-inspired UI, Filoxenia handles everything from parent registrations to advanced administrative tracking.

## 🚀 Features

### For Parents
* **Parent Portal**: A beautifully designed, frictionless registration flow for enrolling campers into specific sessions and age groups.

### For Administrators (Dashboard)
* **Campers & Groups**: Manage all registered campers, organize them into cabins/activity groups, and assign staff leaders.
* **Rapid Check-In**: A streamlined check-in/out system for chaotic drop-off days.
* **Medical Records**: Track camper allergies, medications, and log medical incidents for compliance.
* **Food & HACCP**: Maintain kitchen compliance with digital temperature logs and safety checklists.
* **Payments & Invoicing (APY)**: Track pending balances, log manual payments, and issue official invoices.
* **Staff Management**: Maintain a directory of camp counselors, tracking background checks and certifications.

## 💻 Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS
* Lucide Icons
* React Hot Toast (Notifications)
* React Router

**Backend:**
* Node.js (Express)
* Prisma ORM
* SQLite Database
* JSON Web Tokens (JWT Auth)
* Bcrypt (Password Hashing)

## 🛠️ Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/filoxenia-camp.git
   cd filoxenia-camp
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   
   # Generate Prisma Client and create database
   npx prisma generate
   npx prisma db push
   
   # Start the Express server (runs on port 5000)
   npm run dev
   ```

3. **Start the Frontend:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   
   # Start the Vite development server (runs on port 5173)
   npm run dev
   ```

## 🌐 Deployment
This platform is configured for modern serverless hosting:
* **Frontend**: Optimized for Vercel. Ensure `VITE_API_URL` is set in the Vercel environment variables.
* **Backend**: Optimized for Render (Web Service). Set the Root Directory to `backend` and use `npm install && npx prisma generate` as the build command. Ensure `PORT` and `JWT_SECRET` are configured.

*(Note: If deploying to a free tier on Render, SQLite databases are ephemeral and will reset on server sleep. For production persistence, upgrade to a Render Disk or migrate the Prisma schema to PostgreSQL).*
