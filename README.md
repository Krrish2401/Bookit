# BookIt - Experience Booking Platform

A full-stack web application for booking adventure experiences built with Next.js, Express, PostgreSQL, and Prisma.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16 with TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Lucide React (icons)
- **Notifications:** React Hot Toast
- **PDF Generation:** jsPDF
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express with TypeScript
- **Database:** PostgreSQL (NeonDB)
- **ORM:** Prisma
- **CORS:** Enabled for frontend communication

## 📋 Features

- ✅ Browse and search experiences by title/location
- ✅ Filter experiences by categories
- ✅ View detailed experience information
- ✅ Select date, time, and quantity for bookings
- ✅ Real-time price calculation with taxes
- ✅ User-friendly checkout process
- ✅ Booking confirmation with unique reference ID
- ✅ Download booking receipt as PDF
- ✅ Toast notifications for user feedback
- ✅ Fully responsive design (mobile & desktop)
- ✅ Professional folder structure
- ✅ **Concurrency control to prevent double-booking** 🆕
- ✅ **Race condition protection with mutex locking** 🆕

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (NeonDB account)
- Git

### Quick Setup with Concurrency Control

**📌 New Feature:** This project now includes race condition prevention!

**Quick Start:** Follow [`QUICK_START.md`](./QUICK_START.md) for the fastest setup.

**Detailed Setup:** See below or check [`SETUP_CONCURRENCY.md`](./SETUP_CONCURRENCY.md) for comprehensive instructions.

### Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file:**
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   DATABASE_URL="your-neondb-connection-string-here"
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Replace `your-neondb-connection-string-here` with your actual NeonDB connection string.**

4. **Generate Prisma Client:**
   ```powershell
   npm run prisma:generate
   ```

5. **Run database migrations:**
   ```powershell
   npm run prisma:migrate
   ```
   When prompted, name your migration (e.g., "init")

6. **Seed the database:**
   ```powershell
   npm run seed
   ```

7. **Start the backend server:**
   ```powershell
   npm run dev
   ```
   
   Backend should now be running on http://localhost:5000

   **Note:** Migration includes the new `booking_locks` table for concurrency control.

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env.local` file:**
   Create a `.env.local` file in the `frontend` directory with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```powershell
   npm run dev
   ```
   
   Frontend should now be running on http://localhost:3000

## 📁 Project Structure

```
Bookit/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── booking.controller.ts
│   │   │   └── experience.controller.ts
│   │   ├── routes/
│   │   │   ├── booking.routes.ts
│   │   │   └── experience.routes.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── .env (create this)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── checkout/
    │   │   │   └── page.tsx
    │   │   ├── confirmation/
    │   │   │   └── page.tsx
    │   │   ├── details/
    │   │   │   └── [id]/
    │   │   │       └── page.tsx
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── ExperienceCard.tsx
    │   │   ├── FilterBar.tsx
    │   │   ├── Header.tsx
    │   │   ├── SearchBar.tsx
    │   │   └── ToastProvider.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   ├── services.ts
    │   │   └── utils.ts
    │   └── types/
    │       └── index.ts
    ├── .env.local (create this)
    ├── package.json
    └── tsconfig.json
```

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="your-neondb-connection-string"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎯 API Endpoints

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience by ID

### Bookings
- `POST /api/bookings` - Create a new booking (with concurrency control)
- `GET /api/bookings/:referenceId` - Get booking by reference ID
- `GET /api/bookings/check-availability` - Check slot availability

## 🔐 Concurrency Control

This application implements mutex-style locking to prevent race conditions and double-booking.

### How It Works:
1. When a user attempts to book, the system acquires an exclusive lock for that slot
2. Only one booking can be processed at a time per slot
3. Other concurrent requests wait or retry automatically
4. Locks expire after 30 seconds to prevent deadlocks

### Documentation:
- 📘 **Quick Start:** [`QUICK_START.md`](./QUICK_START.md) - Get up and running in 5 minutes
- 📗 **Setup Guide:** [`SETUP_CONCURRENCY.md`](./SETUP_CONCURRENCY.md) - Detailed setup instructions
- 📕 **Technical Docs:** [`CONCURRENCY_CONTROL.md`](./CONCURRENCY_CONTROL.md) - Deep dive into the implementation
- 📙 **Summary:** [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) - Complete overview
- 📊 **Visual Guide:** [`VISUAL_GUIDE.md`](./VISUAL_GUIDE.md) - Diagrams and visual explanations

### Testing Concurrency:
```powershell
# Run automated concurrency tests
cd backend
npm run test:concurrency

# Or test manually:
# 1. Open two browser tabs
# 2. Navigate to the same experience details page
# 3. Select the same date/time slot
# 4. Click "Book now" simultaneously
# 5. Only one should succeed ✓
```

## 📱 Features Overview

### Home Page
- Grid display of all experiences
- Search bar for filtering by title/location
- Category filter buttons
- Responsive card layout

### Details Page
- Experience image and description
- Date and time slot selection
- Quantity selector
- Real-time price calculation
- Booking summary sidebar

### Checkout Page
- User information form (name, email)
- Promo code input (UI only)
- Terms and conditions checkbox
- Booking summary
- Payment confirmation

### Confirmation Page
- Booking success message
- Unique reference ID
- Complete booking summary
- Download receipt button (PDF)
- Back to home button

## 🎨 Design

The application follows the provided Figma design with:
- Highway Delite branding
- Green (#4CAF50) and Yellow (#FFC107) color scheme
- Clean, modern UI
- Mobile-responsive layouts
- Professional typography

## 🔧 Development Commands

### Backend
```powershell
npm run dev           # Start development server
npm run build         # Build for production
npm start             # Start production server
npm run seed          # Seed database with sample data
npm run prisma:studio # Open Prisma Studio
npm run cleanup:locks # Manually cleanup expired locks
npm run test:concurrency # Test race condition protection
```

### Frontend
```powershell
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 📝 Notes

- No authentication is implemented (as per requirements)
- User information is stored with each booking
- Tax rate is set to 6% (configurable in `frontend/src/lib/utils.ts`)
- Sample data includes 8 different experiences
- All images are from Unsplash for demonstration
- **Concurrency control prevents simultaneous bookings of the same slot**
- **Database locks ensure booking integrity and prevent race conditions**

## 🐛 Troubleshooting

If you encounter any issues:

1. **Database connection error:**
   - Verify your NeonDB connection string in `.env`
   - Check if the database is accessible

2. **Port already in use:**
   - Change PORT in backend `.env` file
   - Update NEXT_PUBLIC_API_URL in frontend `.env.local`

3. **Prisma errors:**
   - Run `npm run prisma:generate` again
   - Delete `node_modules` and reinstall

## 🚀 Deployment

### Backend
Can be deployed to platforms like:
- Railway
- Render
- Heroku
- Vercel (serverless)

### Frontend
Best deployed on:
- Vercel (recommended for Next.js)
- Netlify
- Railway

Remember to set environment variables on your deployment platform!

## 📄 License

This project is for educational/demonstration purposes.
