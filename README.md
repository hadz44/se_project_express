# WTWR (What to Wear?) - Backend API

## 📋 Project Description

WTWR (What to Wear?) is a comprehensive backend API service that provides clothing recommendation functionality based on weather conditions. The application allows users to manage their clothing items, create personalized wardrobes, and receive weather-appropriate clothing suggestions.

### 🎯 Core Functionality

- **User Management**: User registration, authentication, and profile management
- **Clothing Inventory**: Add, update, and delete clothing items with weather categorization
- **Smart Recommendations**: Weather-based clothing suggestions (hot, warm, cold)
- **Social Features**: Like/unlike clothing items, user interactions
- **RESTful API**: Complete CRUD operations for all resources

## 🚀 Technologies & Techniques Used

### **Backend Framework**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js

### **Development Tools**
- **ESLint** - Code quality and consistency enforcement
- **Prettier** - Code formatting and style consistency
- **Nodemon** - Development server with hot reload
- **Git** - Version control and collaboration

### **API Design**
- **RESTful Architecture** - Standard HTTP methods and status codes
- **Middleware Pattern** - Modular request processing
- **Error Handling** - Comprehensive error management and validation
- **Route Organization** - Clean, modular routing structure

### **Database Design**
- **MongoDB Schema Design** - Optimized data models
- **Data Validation** - Input sanitization and type checking
- **Relationship Management** - User-item associations and references

## 🏗️ Project Structure

```
se_project_express/
├── app.js                 # Main application entry point
├── controllers/          # Business logic and request handlers
│   ├── clothingItems.js  # Clothing item operations
│   └── users.js         # User management operations
├── models/              # Database schemas and models
│   ├── clothingItem.js  # Clothing item data model
│   └── user.js         # User data model
├── routes/             # API endpoint definitions
│   ├── index.js        # Main router and error handling
│   ├── clothingItems.js # Clothing item routes
│   └── users.js        # User management routes
└── utils/              # Utility functions and constants
    └── constants.js    # HTTP status codes and error messages
```

## 🔌 API Endpoints

### **User Management**
- `GET /users` - Retrieve all users
- `GET /users/:userId` - Get specific user by ID
- `POST /users` - Create new user account

### **Clothing Items**
- `GET /items` - Retrieve all clothing items
- `POST /items` - Add new clothing item
- `DELETE /items/:id` - Remove clothing item
- `PUT /items/:id/likes` - Like a clothing item
- `DELETE /items/:id/likes` - Unlike a clothing item

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

**Current Sprint**: 12

Before committing your code, make sure to update the `sprint.txt` file in the root folder with your current sprint number.

---

*Built with ❤️ using Node.js, Express, and MongoDB*
