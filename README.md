# Artisan Home Decor - Frontend

A modern e-commerce frontend for home decor products, built with React, Redux Toolkit, and Vite.

## Tech Stack

- **Framework:** React 18.3
- **Build Tool:** Vite 5.3
- **State Management:** Redux Toolkit with RTK Query
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Lucide React icons
- **Forms:** React Hook Form with Zod validation
- **Animations:** Framer Motion
- **Charts:** Recharts

## Prerequisites

- **Node.js:** v18.x or higher
- **npm:** v10.x or higher
- **Backend:** The Django backend must be running on port 5000 (see [API.md](./API.md) for API contract)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd home-decor-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different host/port (default: `http://localhost:8000`).

## Running the Application

### Development Server

Start the development server:

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Running with the Backend

To run the full stack locally:

1. **Start the backend** (in a separate terminal):
   ```bash
   cd path/to/backend
   python manage.py runserver 5000
   ```

2. **Start the frontend** (in this directory):
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

The frontend will automatically proxy API requests to the backend at `http://localhost:5000/api`.

> **Note:** See [API.md](./API.md) for the complete API contract that the backend must implement.

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

**Note:** Environment variables must be prefixed with `VITE_` to be accessible in the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |

## Project Structure

```
src/
├── api/                    # API configuration and RTK Query slices
│   ├── apiSlice.js        # RTK Query base API slice
│   └── baseQuery.js       # Axios base query with auth
├── components/            # React components
│   ├── cart/             # Cart-related components
│   ├── checkout/         # Checkout flow components
│   ├── guards/           # Route protection components
│   ├── layout/           # Layout components (Navbar, Footer, etc.)
│   ├── products/         # Product display components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── pages/                # Page components
│   ├── admin/           # Admin dashboard pages
│   └── ...              # Customer-facing pages
├── store/               # Redux store configuration
│   ├── slices/          # Redux slices
│   └── index.js         # Store setup
├── utils/               # Utility functions
├── App.jsx              # Main App component with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind directives
```

## Features

- **User Features:**
  - Product browsing with filters and search
  - Shopping cart and wishlist
  - User authentication (login, register, Google OAuth)
  - Checkout with multiple payment options
  - Order history and tracking
  - Product reviews and ratings

- **Admin Features:**
  - Dashboard with analytics
  - Product management (CRUD)
  - Order management
  - Customer management
  - Coupon management
  - Review moderation

## API Integration

The frontend communicates with the Django backend through a proxy configured in `vite.config.js`. All requests to `/api/*` are automatically proxied to the backend server (default: `http://localhost:5000`).

API endpoints are managed using RTK Query for efficient data fetching and caching.

**📋 Complete API documentation:** See [API.md](./API.md) for the full API contract including all endpoints, request/response schemas, and data models that the backend must implement.

## Troubleshooting

### Dev server won't start
- Ensure Node.js v18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

### API requests fail
- Verify the backend is running on the configured port (default: 5000)
- Check the `VITE_API_URL` in your `.env` file
- Check browser console for CORS errors
- Ensure the backend implements the API contract in [API.md](./API.md)

### Build errors
- Clear Vite cache: `rm -rf node_modules/.vite`
- Update dependencies: `npm update`

## License

[Add your license information here]
