# TaskFlow Frontend

A modern, responsive task management application built with Next.js 14 and React.

## Features

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Live task updates without page refresh
- **Advanced Filtering**: Search, filter, and sort tasks efficiently
- **Dual View Modes**: Switch between grid and list views
- **Smart Forms**: Intuitive task creation and editing
- **Authentication Flow**: Complete auth system with password recovery

# Features Overview

# 🔐 Authentication

User registration with validation
Secure login system
Password reset functionality
Auto-logout on token expiry

# 📋 Task Management

Create tasks with rich details (title, description, priority, category, tags, due date)
Update task status with one click
Edit tasks inline
Delete tasks with confirmation
Mark tasks as complete/pending

# 🔍 Advanced Filtering

Real-time search across title, description, category, and tags
Filter by status (All, Pending, Done)
Filter by priority (Low, Medium, High, Urgent)
Sort by date, title, priority, or due date
Combined filters work together seamlessly

# 📱 User Experience

Responsive design for all devices
Grid and list view modes
Smooth animations and transitions
Loading states and error handling
Toast notifications for user feedback
Optimistic updates for instant feedback

# 📊 Dashboard Analytics

Task completion statistics
Visual progress indicators
Real-time stats updates

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Quick Start

### Prerequisites

- Node.js 18+
- Backend API running (see backend README)

### Installation

1. **Clone and install dependencies**

```bash
git clone < https://github.com/Abishek0612/task-management-app-frontend.git >

Vercel liv deployment URL -  https://task-management-app-frontend-avvm-9pbbcrdw8.vercel.app/
cd frontend
npm install (install node modules)



# Environment Setup Create .env.local file:

NEXT_PUBLIC_API_URL=https://task-management-app-backend-1u70.onrender.com/api
```

# Start Development Server

npm run dev
