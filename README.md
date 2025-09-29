# 🎯 Gamified Career Guidance Platform MVP

A comprehensive MERN stack application that provides gamified career guidance through interactive assessments, featuring student progress tracking, admin management, and downloadable PDF reports.

## ✨ Features

### 🎮 Student Experience
- **Gamified Interface**: Level progression, experience points, and achievements
- **Interactive Assessment**: 3-question career discovery assessment
- **Career Profiles**: Personalized results with dominant career types
- **Progress Tracking**: Visual progress bars and level indicators
- **PDF Reports**: Downloadable career guidance reports
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🛠️ Admin Dashboard
- **Student Management**: View all students and their progress
- **Progress Analytics**: Completion rates and statistics
- **Bulk Operations**: Download all reports as ZIP file
- **Individual Reports**: Download specific student reports
- **Student Administration**: Remove students if needed

### 🔐 Authentication System
- **JWT-based Authentication**: Secure login for students and admins
- **Role-based Access**: Separate interfaces for students and admins
- **Registration System**: Easy student account creation
- **Demo Accounts**: Quick login for testing

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context + TanStack Query
- **Authentication**: JWT tokens
- **PDF Generation**: PDFKit
- **File Management**: Archiver for bulk downloads
- **Routing**: React Router v6

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
setup.bat
```

**For macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Then start the application:**
```bash
npm run dev
```

### Option 2: Manual Setup

1. **Clone and Install Dependencies**:
   ```bash
   git clone <repository-url>
   cd gamified-career-guidance-platform
   npm run install-all
   ```

2. **Environment Configuration**:
   ```bash
   # Server environment
   cp server/env.example server/.env
   
   # Client environment  
   cp client/env.example client/.env
   ```

3. **Update Environment Variables** (server/.env):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/career-guidance
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB** (choose one):
   ```bash
   # Option A: Local MongoDB
   mongod
   
   # Option B: Docker
   docker-compose up -d mongodb
   
   # Option C: Use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env with your Atlas connection string
   ```

5. **Seed Admin User**:
   ```bash
   cd server
   npm run seed
   cd ..
   ```

6. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🐳 Docker Deployment

Run the entire application with Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000  
- MongoDB: localhost:27017

## 📁 Project Structure

```
gamified-career-guidance-platform/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React contexts (Auth, etc.)
│   │   ├── pages/            # Page components
│   │   │   ├── Auth/         # Login & Registration
│   │   │   ├── Student/      # Student dashboard, assessment, results
│   │   │   └── Admin/        # Admin dashboard & management
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions & API calls
│   │   └── styles/           # CSS and styling
│   ├── public/               # Static assets
│   └── package.json
├── server/                     # Express Backend
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── assessment.js    # Assessment endpoints  
│   │   └── admin.js         # Admin endpoints
│   ├── middleware/           # Express middleware
│   ├── utils/               # Utility functions
│   ├── scripts/             # Database scripts
│   └── package.json
├── docker-compose.yml          # Docker services configuration
├── setup.sh / setup.bat       # Automated setup scripts
└── README.md
```

## 🔑 Default Credentials

### Admin Account
- **Email**: admin@platform.com
- **Password**: admin123

### Demo Student Account  
- **Email**: demo@student.com
- **Password**: demo123

⚠️ **Important**: Change admin password after first login in production!

## 🌐 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # Student registration
POST /api/auth/login       # Login (student/admin)  
GET  /api/auth/profile     # Get user profile
GET  /api/auth/verify      # Verify JWT token
```

### Assessment Endpoints
```
GET  /api/assessment/questions           # Get assessment questions
POST /api/assessment/submit              # Submit assessment responses
GET  /api/assessment/result/:id          # Get specific result
GET  /api/assessment/my-result           # Get user's latest result
GET  /api/assessment/download-report/:id # Download PDF report
```

### Admin Endpoints
```
GET    /api/admin/dashboard              # Dashboard statistics
GET    /api/admin/students               # List all students
GET    /api/admin/students/:id           # Get student details
GET    /api/admin/students/:id/report    # Download student report
GET    /api/admin/reports/bulk           # Download all reports (ZIP)
DELETE /api/admin/students/:id           # Delete student
GET    /api/admin/analytics/assessments  # Assessment analytics
```

## 🎯 Career Assessment System

The MVP includes a 3-question assessment that categorizes students into career types:

### Career Types
- **Creative**: Artists, designers, writers
- **Analytical**: Data scientists, researchers, analysts  
- **Social**: Counselors, teachers, HR professionals
- **Practical**: Engineers, technicians, builders
- **Technical**: Developers, IT specialists, cybersecurity
- **Leadership**: Managers, consultants, project leaders

### Assessment Flow
1. Student takes 3 multiple-choice questions
2. Responses categorized by career type
3. Dominant type determined by frequency
4. Personalized report generated with:
   - Career type and strengths
   - Top 3 recommended careers
   - Suggested study areas
   - Downloadable PDF report

## 🏆 Gamification Features

### Experience & Levels
- Students earn XP for completing assessments
- Level progression (100 XP per level)
- Visual progress indicators
- Achievement badges

### Progress Tracking
- Real-time progress bars
- Level badges and XP display
- Assessment completion status
- Achievement unlocks

## 🔧 Development

### Available Scripts

**Root Level:**
```bash
npm run dev          # Start both frontend and backend
npm run install-all  # Install all dependencies
npm run build        # Build for production
npm run start        # Start production server
```

**Server (cd server):**
```bash
npm run dev          # Start with nodemon
npm run start        # Start production
npm run seed         # Create admin user
```

**Client (cd client):**
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Variables

**Server (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/career-guidance
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   mongod --version
   
   # Start MongoDB service
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port 3000/5000
   npx kill-port 3000
   npx kill-port 5000
   ```

3. **Dependencies Issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in server/.env
   - Verify token expiration

### Logs and Debugging

```bash
# View server logs
cd server && npm run dev

# View client logs  
cd client && npm run dev

# Docker logs
docker-compose logs backend
docker-compose logs frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- Full RIASEC test implementation
- Multiple Intelligence assessments  
- Career path recommendations
- Integration with job boards
- Social features and peer comparison
- Mobile app development
- Advanced analytics and reporting
- Multi-language support

---

Built with ❤️ using the MERN stack
