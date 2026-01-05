# Venturee Biz SaaS Platform

A full-stack, multi-tenant SaaS web platform that serves as an all-in-one business management system for cooperatives, schools, and SMEs.

## Features

- **Multi-tenant SaaS architecture** with strict data isolation
- **Role-based access control** (Admin, Company Admin, Staff, Viewer)
- **Premium dark-themed UI** with gold accents
- **Complete business modules**:
  - Point of Sale (POS) System
  - Inventory Management
  - Laundry Services
  - Services & Coupons Management
  - Reporting & Analytics
- **DuitNow payment integration**
- **Real-time data updates** without page reloads

## Architecture

The application consists of:
- **Frontend**: React application with premium dark theme
- **Backend**: Express.js server with PostgreSQL database
- **Authentication**: JWT-based with role-based access control

## Deployment Options

### Option 1: Deploy Frontend to Vercel (Recommended)

This approach separates the frontend and backend for optimal performance.

#### Step 1: Connect to GitHub

1. Initialize a git repository in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Venturee Biz SaaS Platform"
   ```

2. Create a new repository on GitHub (e.g., `venturee-biz-saas`)

3. Add the remote origin:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/venturee-biz-saas.git
   git branch -M main
   git push -u origin main
   ```

#### Step 2: Deploy Backend

Deploy the Express.js backend to a service that supports Node.js applications:

1. **Deploy to Render**:
   - Sign up at [render.com](https://render.com)
   - Create a new Web Service
   - Connect to your GitHub repository
   - Set the root directory to `/backend`
   - Set environment variables (DATABASE_URL, JWT_SECRET, etc.)
   - Deploy the service

2. **Or deploy to Railway**:
   - Sign up at [railway.app](https://railway.app)
   - Connect to your GitHub repository
   - Deploy the `/backend` directory
   - Add PostgreSQL addon and configure environment variables

Your backend will be accessible at a URL like `https://your-app.onrender.com` or `https://your-app.up.railway.app`.

#### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "New Project" and import your GitHub repository
3. Configure the project:
   - Framework: `Create React App`
   - Root Directory: `/frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variables:
   - `REACT_APP_API_URL`: Your deployed backend URL (from Step 2)
5. Deploy the project

### Option 2: Convert to Next.js for Single Deployment (Advanced)

For a true single-deployment solution, convert the application to Next.js:

#### Step 1: Create a Next.js Version

1. Create a new Next.js app:
   ```bash
   npx create-next-app@latest next-venturee-biz --js --use-npm
   ```

2. Migrate all React components to Next.js pages and components

3. Convert all Express.js routes to Next.js API routes in `/pages/api/`

4. Update database connections to work with serverless functions

#### Step 2: Deploy Next.js App to Vercel

1. Connect your GitHub repository to Vercel
2. Configure the project:
   - Framework: `Next.js`
   - Build Command: `npm run build`
3. Add environment variables for database connection and secrets
4. Deploy

## Environment Variables

### Backend (.env in /backend)
```
PORT=3001
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
DUITNOW_CLIENT_ID=your_duitnow_client_id
DUITNOW_CLIENT_SECRET=your_duitnow_client_secret
```

### Frontend (.env in /frontend)
```
REACT_APP_API_URL=your_backend_url
```

## Running Locally

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Start both servers:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## Project Structure

```
VB/
├── backend/              # Express.js server
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── config/           # Configuration files
│   └── server.js         # Server entry point
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin dashboard pages
│   │   │   ├── company/  # Company dashboard pages
│   │   │   └── viewer/   # Viewer dashboard pages
│   │   ├── contexts/     # React contexts
│   │   └── styles/       # CSS styles
│   └── package.json
├── package.json          # Root package.json
└── vercel.json           # Vercel configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.