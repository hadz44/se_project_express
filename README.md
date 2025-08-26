# WTWR (What to Wear?) - Backend API

## 📋 Project Description

WTWR (What to Wear?) is a comprehensive backend API service that provides clothing recommendation functionality based on weather conditions. The application allows users to manage their clothing items, create personalized wardrobes, and receive weather-appropriate clothing suggestions.

### 🎯 Core Functionality

- **User Management**: User registration, authentication, and profile management
- **Authentication System**: JWT-based login/signup with secure password hashing
- **Authorization**: Protected routes with user-specific access control
- **Clothing Inventory**: Add, update, and delete clothing items with weather categorization
- **Smart Recommendations**: Weather-based clothing suggestions (hot, warm, cold)
- **Social Features**: Like/unlike clothing items, user interactions
- **RESTful API**: Complete CRUD operations for all resources
- **Security**: Password protection, CORS enabled, and ownership validation

## 🚀 Technologies & Techniques Used

### **Backend Framework**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js

### **Authentication & Security**
- **JWT (JSON Web Tokens)** - Secure user authentication and session management
- **bcrypt** - Password hashing and security
- **CORS** - Cross-origin resource sharing for frontend integration

### **Development Tools**
- **ESLint** - Code quality and consistency enforcement
- **Prettier** - Code formatting and style consistency
- **Nodemon** - Development server with hot reload
- **Git** - Version control and collaboration

### **API Design**
- **RESTful Architecture** - Standard HTTP methods and status codes
- **Middleware Pattern** - Modular request processing with custom auth middleware
- **Error Handling** - Comprehensive error management and validation
- **Route Organization** - Clean, modular routing structure with public/protected endpoints
- **JWT Authentication** - Token-based route protection and user context

### **Database Design**
- **MongoDB Schema Design** - Optimized data models
- **Data Validation** - Input sanitization and type checking
- **Relationship Management** - User-item associations and references

## 🏗️ Project Structure

```
se_project_express-main/
├── app.js                 # Main application entry point
├── controllers/          # Business logic and request handlers
│   ├── clothingItems.js  # Clothing item operations
│   └── users.js         # User management operations
├── middlewares/          # Custom middleware functions
│   └── auth.js          # JWT authorization middleware
├── models/              # Database schemas and models
│   ├── clothingItem.js  # Clothing item data model
│   └── user.js         # User data model with password security
├── routes/             # API endpoint definitions
│   ├── index.js        # Main router with signin/signup endpoints
│   ├── clothingItems.js # Clothing item routes (protected)
│   └── users.js        # User profile routes (protected)
├── utils/              # Utility functions and constants
│   ├── constants.js    # HTTP status codes and error messages
│   └── config.js       # JWT secret configuration
├── .eslintrc.js        # ESLint configuration
├── .editorconfig       # Editor configuration
├── .gitignore          # Git ignore rules
└── package.json        # Project dependencies and scripts
```

## 🔌 API Endpoints

### **Authentication (Public)**
- `POST /signup` - User registration with email and password
- `POST /signin` - User login with JWT token response

### **User Management (Protected)**
- `PATCH /users/me` - Update current user profile (name, avatar)

### **Clothing Items**
- `GET /items` - Retrieve all clothing items (Public)
- `POST /items` - Add new clothing item (Protected - requires authentication)
- `DELETE /items/:id` - Remove clothing item (Protected - owner only)
- `PUT /items/:id/likes` - Like a clothing item (Protected)
- `DELETE /items/:id/likes` - Unlike a clothing item (Protected)

> **Note**: Protected routes require a valid JWT token in the `Authorization: Bearer <token>` header

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### **Installation**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd se_project_express-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file with your MongoDB connection string
   MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
   PORT=3001
   ```

4. Start the development server:
   ```bash
   npm run dev    # Development mode with hot reload
   npm start      # Production mode
   ```

### **Database Setup**
The application will automatically connect to MongoDB and create the necessary collections on first run.

### **Authentication Setup**
1. **JWT Secret**: The application uses a JWT secret for token signing (configured in `utils/config.js`)
2. **Password Security**: Passwords are hashed using bcrypt with 10 salt rounds
3. **Token Expiration**: JWT tokens expire after 7 days
4. **Protected Routes**: Most routes require valid authentication tokens

### **Security Features**
- **Password Hashing**: All passwords are securely hashed before storage
- **JWT Authentication**: Secure token-based authentication system
- **Route Protection**: Middleware-based authorization for sensitive endpoints
- **Ownership Validation**: Users can only delete their own clothing items
- **CORS Enabled**: Frontend integration ready with cross-origin support

## 🔐 Authentication Workflow

### **User Registration**
1. Send `POST /signup` with `name`, `email`, `password`, and `avatar`
2. Password is hashed and stored securely
3. User account is created in the database
4. Response includes user data (password excluded)

### **User Login**
1. Send `POST /signin` with `email` and `password`
2. Credentials are validated against stored hash
3. JWT token is generated with user's `_id`
4. Token expires after 7 days

### **Protected Route Access**
1. Include `Authorization: Bearer <token>` header
2. Middleware validates JWT token
3. User context is added to `req.user`
4. Route handler executes with user authentication

### **Security Measures**
- **Password Protection**: Never stored or transmitted in plain text
- **Token Validation**: All protected routes verify JWT authenticity
- **Ownership Checks**: Users can only modify their own resources
- **Input Validation**: All user inputs are validated and sanitized

## 🧪 Testing & Quality Assurance

### **Code Quality**
- **ESLint**: Automated code quality checks
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit validation

### **API Testing**
Test the API endpoints using tools like:
- **Postman** - API testing and documentation
- **Insomnia** - REST client for API development
- **cURL** - Command-line HTTP requests

## 📸 Project Features & Screenshots

> **Note**: This section will contain screenshots, GIFs, or videos demonstrating the project features. Please add your media content here to showcase:
> - API endpoint testing results
> - Database schema examples
> - Application workflow demonstrations
> - User interface interactions (if applicable)

### **Recommended Media Content:**
1. **API Documentation Screenshots** - Show Postman/Insomnia testing
2. **Database Schema Visualizations** - MongoDB Compass screenshots
3. **Workflow GIFs** - Demonstrate CRUD operations
4. **Video Demo** - Complete project walkthrough

## 🎥 Video Demo

> **Note**: Include a video demonstration of your project here. The video should cover:
> - Project overview and setup
> - API endpoint demonstrations
> - Database operations
> - Error handling examples
> - Complete user workflow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Hadi Frifer** - *Initial work* - [GitHub Profile]

---

## 🔄 Sprint Progress

**Current Sprint**: 13

**Sprint 13 Features Implemented**:
- ✅ JWT-based authentication system
- ✅ User registration and login endpoints
- ✅ Protected routes with authorization middleware
- ✅ User profile management (PATCH /users/me)
- ✅ Ownership validation for clothing items
- ✅ Password security and hashing
- ✅ CORS configuration for frontend integration
- ✅ Comprehensive error handling with proper HTTP status codes

Before committing your code, make sure to update the `sprint.txt` file in the root folder with your current sprint number.

---

*Built with ❤️ using Node.js, Express, and MongoDB*
