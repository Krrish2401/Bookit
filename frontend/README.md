# BookIt Frontend - Next.js TypeScript

This is the frontend application for the BookIt experience booking platform, built with Next.js 15 and TypeScript.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend server running on http://localhost:5000

### Installation

1. Install dependencies:
```powershell
npm install
```

2. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Start the development server:
```powershell
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/
│   ├── checkout/
│   │   └── page.tsx          # Checkout page with user info form
│   ├── confirmation/
│   │   └── page.tsx          # Booking confirmation page
│   ├── details/
│   │   └── [id]/
│   │       └── page.tsx      # Experience details page
│   ├── layout.tsx            # Root layout with header
│   ├── page.tsx              # Home page with experiences list
│   └── globals.css           # Global styles
├── components/
│   ├── ExperienceCard.tsx    # Experience card component
│   ├── FilterBar.tsx         # Category filter component
│   ├── Header.tsx            # Navigation header
│   ├── SearchBar.tsx         # Search input component
│   └── ToastProvider.tsx     # Toast notifications provider
├── lib/
│   ├── api.ts                # Axios instance configuration
│   ├── services.ts           # API service functions
│   └── utils.ts              # Utility functions (currency, dates, PDF)
└── types/
    └── index.ts              # TypeScript type definitions
```

## 🎯 Features

- **Home Page**: Browse all experiences with search and category filters
- **Details Page**: View experience details, select date/time, and quantity
- **Checkout Page**: Enter customer information and review booking
- **Confirmation Page**: View booking confirmation and download receipt
- **Responsive Design**: Works on all device sizes
- **Toast Notifications**: User feedback for actions
- **PDF Generation**: Download booking receipts

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS 4** - Utility-first CSS
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client
- **jsPDF** - PDF generation

## 📜 Available Scripts

```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎨 Design

The application follows the Highway Delite brand design with:
- Primary color: Green (#4CAF50)
- Secondary color: Yellow (#FFC107)
- Clean, modern UI
- Mobile-first responsive design

## 🔗 API Integration

The frontend connects to the backend API at `http://localhost:5000/api` by default.

### Endpoints Used:
- `GET /experiences` - Fetch all experiences
- `GET /experiences/:id` - Fetch single experience
- `POST /bookings` - Create new booking
- `GET /bookings/:referenceId` - Fetch booking by reference ID

## 📝 Notes

- No authentication required
- Booking data temporarily stored in sessionStorage during checkout flow
- Tax rate set to 6%
- PDF receipts generated client-side

## 🐛 Troubleshooting

**Module not found errors:**
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

**API connection issues:**
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local

**Build errors:**
```powershell
# Clear Next.js cache
rm -r .next
npm run build
```

## 📄 License

This project is for educational/demonstration purposes.
