![project_photo](https://github.com/user-attachments/assets/0e0442e8-f997-451d-a987-f9ccbf483ccd)

# 🏪 Inventory Management System


A modern inventory management system built with Next.js, SQLite, and Zustand. Features a responsive UI with Framer Motion animations and comprehensive test coverage.

## ✨ Features

- 🔐 **Authentication** with NextAuth.js
- 📦 **CRUD Operations** for inventory items
- 🎨 **Responsive Design** with Tailwind CSS
- ✨ **Smooth Animations** using Framer Motion
- 🔄 **State Management** with Zustand
- 🗄️ **SQLite Database** integration
- 🧪 **Comprehensive Testing** with Jest and RTL

## 🚀 Live Demo

[View Live Demo](https://inventory-system1.vercel.app/)

## 🚀 API Documentation Link

[View API Documentation](https://documenter.getpostman.com/view/31322920/2sAYQUrF6g)

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, SQLite
- **State Management**: Zustand, useReducer
- **Testing**: Jest, React Testing Library
- **Authentication**: NextAuth.js
- **Database**: SQLite with libSQL

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git

## 🏗️ Installation Guide

1. Clone the repository:
```bash
git clone https://github.com/hanif365/inventory-system.git
cd inventory-system
npm install
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:setup
```

4. Create a `.env.local` file:
```bash
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

# API Routes

## Inventory

### `GET /api/inventory`
Fetches all inventory items.

### `POST /api/inventory`
Creates a new inventory item.
- Body: `{ name, description, quantity, price, image_url }`

### `PATCH /api/inventory/[id]`
Updates an inventory item.
- Body: `{ description?, quantity?, price? }`
- Note: Name cannot be updated

### `DELETE /api/inventory/[id]`
Deletes an inventory item.

## Authentication

### `POST /api/auth/register`
Registers a new user.
- Body: `{ name, email, password }`

### `POST /api/auth/[...nextauth]`
NextAuth.js authentication endpoints:
- `/api/auth/signin` - Sign in
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get session
- Supports:
  - Credentials (email/password)
  - GitHub OAuth
  - Google OAuth

## 🧪 Testing

Run the test suite:
```bash
npm test   # Run tests
npm run test:watch   # Watch mode
npm run test:coverage   # Coverage report
```


Made with ❤️ by Hanif
