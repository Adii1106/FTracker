# FTracker 🚀
**A Minimalist Personal Finance Tracker**

FTracker is a clean, professional, and minimalist web application designed to help you master your money. Track every transaction, set smart monthly budgets, and get clear insights into your financial habits—all in one place.

## ✨ Features

- **Dashboard**: A high-level overview of your total balance, income, and expenses with real-time filters.
- **Transaction Tracking**: Easily record incomes and expenses with automated categorization.
- **Smart Budgets**: Set monthly spending limits per category and stay disciplined.
- **Instant Alerts**: Automated notifications when you're close to or have exceeded your budget limits.
- **Financial Reports**: Visual breakdown of your spending and income distribution.
- **Global Currency Support**: Seamlessly switch between USD, EUR, GBP, INR, and JPY.
- **AI Assistant (Upcoming)**: Get personalized financial advice and insights powered by AI.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, React Router.
- **Backend**: Node.js, Express, JWT Authentication.
- **Database**: PostgreSQL via Supabase, Prisma ORM.
- **Deployment**: Vercel.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Supabase/PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/Adii1106/FTracker.git
cd FTracker
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
PORT=5001
```
Run migrations and seed the demo user:
```bash
npx prisma db push
node seed.js
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
Run the development server:
```bash
npm run dev
```

## 🧪 Demo Access
Don't want to register? Use our demo account:
- **Email**: `demo@example.com`
- **Password**: `password123`

