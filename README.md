# BookIt - Experience Booking Platform

A full-stack web application for booking adventure experiences and activities across India. Built with modern technologies for a seamless booking experience with robust concurrency control.

##  Tech Stack

### Frontend
- **Framework:** Next.js 15 with TypeScript and App Router
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Custom components with Lucide React icons
- **Notifications:** React Hot Toast
- **PDF Generation:** jsPDF for booking receipts
- **HTTP Client:** Axios
- **State Management:** React Hooks

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (NeonDB)
- **ORM:** Prisma ORM
- **Concurrency Control:** Mutex-based locking system
- **CORS:** Configured for cross-origin requests

##  Features

### Advanced Features
-  **Concurrency Control** - Prevents double-booking with mutex locking
-  **Race Condition Protection** - Database-level booking locks
-  **Real-time Availability** - Live slot capacity checking
-  **Lock Metrics** - Performance monitoring and analytics
-  **Automatic Cleanup** - Expired lock removal
-  **Promo Code System** - Discount validation and application
-  **Fully Responsive** - Optimized for mobile, tablet, and desktop
-  **Modern UI/UX** - Smooth animations and transitions
-  **Smart Notifications** - Toast messages for user feedback

### User Experience
- Animated page transitions and loading states
- Hover effects and interactive elements
- Sticky header with search functionality
- Professional card-based layout
- Gradient overlays and visual effects
- Form validation and error handling
- Success/error feedback system

## Setup Instructions

### Prerequisites
- **Node.js** 18+ installed
- **PostgreSQL** database 
- **npm** or **yarn** package manager
- **Git** for version control

### Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Note:** Replace the `DATABASE_URL` with your actual NeonDB connection string.

4. **Generate Prisma Client:**
   ```powershell
   npm run prisma:generate
   ```

5. **Run database migrations:**
   ```powershell
   npx prisma migrate dev --name init
   ```
   
   This creates:
   - `experiences` table
   - `bookings` table
   - `promo_codes` table
   - `booking_locks` table (for concurrency control)

6. **Seed the database with sample data:**
   ```powershell
   npm run seed
   ```
   
   This populates:
   - 8 diverse adventure experiences (Kayaking, Scuba Diving, Paragliding, etc.)
   - 3 promo codes (SAVE10, WELCOME20, SUMMER15)

7. **Start the development server:**
   ```powershell
   npm run dev
   ```
   
   ✅ Backend running at: **http://localhost:5000**

### Frontend Setup

1. **Open a new terminal and navigate to frontend:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```powershell
   npm run dev
   ```
   Frontend running at: **http://localhost:3000**

### Verify Installation

1. Open **http://localhost:3000** in your browser
2. You should see 8 experience cards
3. Try searching for "Kayaking" or "Bangalore"
4. Click on any experience to view details
5. Test the booking flow end-to-end

## API Endpoints

### Experiences
- `GET /experiences` - Retrieve all experiences
- `GET /experiences/:id` - Get specific experience by ID
- `GET /experiences/:id/availability` - Check availability for date/time

### Bookings
- `POST /bookings` - Create new booking (with concurrency protection)
- `GET /bookings/:referenceId` - Retrieve booking by reference
- `GET /bookings/check-availability` - Check slot availability
  - Query params: `experienceId`, `bookingDate`, `bookingTime`

### Promo Codes
- `GET /promo-codes/validate/:code` - Validate promo code

### Health Check
- `GET /health` - API health status

##  Concurrency Control System

### Overview
Implements database-level mutex locking to prevent race conditions and double-booking scenarios.

### How It Works
1. **Lock Acquisition** - Before booking, system acquires exclusive lock
2. **Atomic Operations** - Only one request processes per slot at a time
3. **Automatic Retry** - Concurrent requests wait and retry intelligently
4. **Lock Expiration** - Locks auto-expire after 30 seconds
5. **Cleanup Process** - Background job removes stale locks

### Performance Metrics
- Lock acquisition time
- Lock wait time
- Retry attempts
- Success/failure rates
- Available via lock metrics utility

## Development Commands

### Backend
```powershell
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production build
npm run seed             # Seed database with sample data
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
```

### Frontend
```powershell
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm start                # Run production build
npm run lint             # Run ESLint checks
```

## 🏗️ Building for Production

### Backend Build
```powershell
cd backend
npm run build
npm start
```

### Frontend Build
```powershell
cd frontend
npm run build
npm start
```

##  Deployment

### Environment Variables for Production

**Backend:**
```env
DATABASE_URL=your-production-database-url
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

##  Sample Data

### Experiences (8 Total)
1. **Kayaking Adventure** - Udupi, Karnataka (₹999)
2. **Nandi Hills Sunrise Trek** - Bangalore (₹899)
3. **Coffee Plantation Tour** - Coorg (₹1,299)
4. **Sunderbans Mangrove Safari** - West Bengal (₹999)
5. **Bungee Jumping** - Rishikesh (₹999)
6. **Scuba Diving Experience** - Andaman Islands (₹1,299)
7. **Paragliding Adventure** - Bir Billing (₹999)
8. **Desert Safari & Camping** - Jaisalmer (₹1,299)

### Promo Codes
- **SAVE10** - 10% discount
- **WELCOME20** - 20% discount
- **SUMMER15** - 15% discount

##  Troubleshooting

### Common Issues

**Database Connection Error:**
```powershell
# Verify connection string in .env
# Check if database is accessible
# Run: npx prisma db push
```

**Port Already in Use:**
```powershell
# Kill process using port 5000 or 3000
# Windows: netstat -ano | findstr :5000
# Then: taskkill /PID <PID> /F
```

**Prisma Client Error:**
```powershell
# Regenerate Prisma Client
npx prisma generate
```

**Module Not Found:**
```powershell
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Build Errors:**
```powershell
# Clear cache and rebuild
npm run clean  # If script exists
npm run build
```

##  Notes

- No authentication implemented (per requirements)
- User info stored with each booking
- Tax rate: 6% (configurable in utils)
- Images from Pexels (free stock photos)
- Promo codes have expiration dates
- Booking slots have max capacity (default: 20)
- Lock expiration: 30 seconds
- Reference IDs are 8-character alphanumeric

##  Contributing

This is an educational project. Feel free to fork and modify for learning purposes.
