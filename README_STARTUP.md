# 🚀 Quick Start Guide

## Option 1: Automatic Startup (Recommended)
Double-click `start.bat` file in the Real folder

## Option 2: Manual Startup

### Step 1: Start Backend
```bash
cd C:\Users\beast\OneDrive\Desktop\Real\backend
npm start
```

### Step 2: Start Frontend (in new terminal)
```bash
cd C:\Users\beast\OneDrive\Desktop\Real\frontend
npm start
```

## 🔧 If Nothing Runs:

### Fix Backend Issues:
```bash
cd backend
npm install
npm start
```

### Fix Frontend Issues:
```bash
cd frontend
npm install
npm start
```

### MongoDB Issues:
- Install MongoDB Community Server
- Or use online MongoDB Atlas
- Or run without database (limited features)

## 🌐 Access URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

## 🔑 Login:
- Admin: admin@disaster.com / admin123
- User: Create new account

## ⚠️ Common Issues:
1. **Port already in use**: Close other applications using ports 3000/5000
2. **MongoDB not running**: Install MongoDB or use Atlas
3. **Dependencies missing**: Run `npm install` in both folders
4. **Firewall blocking**: Allow Node.js through Windows Firewall