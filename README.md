# Apollonia Dental Practice - Employee Management System

## 📋 Project Overview

This is a complete CRUD (Create, Read, Update, Delete) application for managing employees and departments at Apollonia Dental Practice. The application demonstrates professional-grade web development using Node.js, MongoDB, Express.js, and Docker.

## 🏥 Business Context

Apollonia Dental Practice is a modern dental clinic that needs to manage its staff across multiple specialized departments:
- **General Dentistry**: General dental care and preventive services
- **Pediatric Dentistry**: Specialized care for children
- **Restorative Dentistry**: Dental restoration and rehabilitation
- **Surgery**: Oral and maxillofacial surgery
- **Orthodontics**: Correction of dental malpositions

## 🛠️ Technical Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling library
- **Express-validator**: Input validation middleware
- **dotenv**: Environment variables management
- **CORS**: Cross-origin resource sharing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with responsive design
- **JavaScript ES6+**: Interactive functionality
- **Fetch API**: RESTful API communication

### DevOps
- **Docker**: Containerization platform
- **Docker Compose**: Multi-container orchestration
- **MongoDB Atlas**: Cloud database option

## 🏗️ Project Structure

```
apollonia-employee-management/
├── app/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   ├── department.controller.js  # Department CRUD operations
│   │   └── employee.controller.js    # Employee CRUD operations
│   ├── middleware/
│   │   └── validation.js        # Input validation middleware
│   ├── models/
│   │   ├── department.model.js  # Department data model
│   │   └── employee.model.js    # Employee data model
│   └── routes/
│       ├── department.routes.js # Department API routes
│       └── employee.routes.js   # Employee API routes
├── public/
│   ├── css/
│   │   └── style.css           # Application styles
│   ├── js/
│   │   └── app.js              # Frontend JavaScript
│   └── index.html              # Main HTML page
├── docker-compose.yml          # Docker services configuration
├── Dockerfile                  # Docker image configuration
├── init-database.js           # Database initialization script
├── server.js                  # Main application server
├── start.js                   # Environment selector utility
├── package.json               # Project dependencies
├── .env                       # Environment variables
└── README.md                  # Project documentation
```

## 🚀 Features

### Core CRUD Operations
- **Create**: Add new employees and departments
- **Read**: View and search employees and departments
- **Update**: Edit existing employee and department information
- **Delete**: Remove employees and departments (with safety checks)

### Advanced Features
- **Data Validation**: Comprehensive input validation on both client and server
- **Responsive Design**: Modern, mobile-friendly interface
- **Multiple Environments**: Support for local, Docker, and cloud databases
- **Error Handling**: Robust error handling and user feedback
- **Security**: Input sanitization and validation
- **Relationships**: Proper database relationships between employees and departments

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Docker Desktop (for containerized deployment)

### Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd apollonia-employee-management
   npm install
   ```

2. **Choose your database environment**:
   ```bash
   # Interactive environment selector
   node start.js
   
   # Or use direct commands:
   npm run local    # Local MongoDB
   npm run docker   # Docker MongoDB
   npm run atlas    # MongoDB Atlas
   ```

3. **Initialize sample data**:
   ```bash
   npm run init-db
   ```

4. **Access the application**:
   - Web Interface: http://localhost:3000
   - API Documentation: http://localhost:3000/api/test

### Docker Deployment

1. **Start MongoDB container**:
   ```bash
   docker compose up -d mongodb
   ```

2. **Run the application**:
   ```bash
   npm run docker
   ```

3. **Full containerized deployment**:
   ```bash
   docker compose up -d
   ```

## 📊 Database Schema

### Department Model
```javascript
{
  name: String (required, enum: ['General Dentistry', 'Pediatric Dentistry', 'Restorative Dentistry', 'Surgery', 'Orthodontics']),
  description: String,
  createdAt: Date
}
```

### Employee Model
```javascript
{
  firstName: String (required, 2-50 chars),
  lastName: String (required, 2-50 chars),
  department: ObjectId (reference to Department),
  email: String (optional, validated),
  position: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 API Endpoints

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create new department
- `GET /api/departments/:id` - Get department by ID
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department
- `GET /api/departments/:id/employees` - Get employees by department

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/search?query=term` - Search employees
- `GET /api/employees/department/:departmentId` - Get employees by department

## 🎨 User Interface

### Features
- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Forms**: Modal-based forms for creating and editing
- **Real-time Feedback**: Success/error messages and loading states
- **Data Tables**: Organized display of employees and departments
- **Action Buttons**: Intuitive edit and delete functionality

## 🔒 Data Validation

### Server-side Validation
- Required field validation
- Data type validation
- String length limits
- Email format validation
- MongoDB ObjectId validation

### Client-side Validation
- Form validation before submission
- Real-time feedback
- Error message display
- Input sanitization

## 🌍 Environment Configuration

### Local Development
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/apollonia_db
PORT=3000
```

### Docker Environment
```env
NODE_ENV=docker
DOCKER_MONGODB_URI=mongodb://mongodb:27017/apollonia_db
PORT=3000
```

### Production (MongoDB Atlas)
```env
NODE_ENV=production
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/apollonia_db
PORT=3000
```

## 📈 Performance & Scalability

- **Database Indexing**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Error Recovery**: Automatic reconnection and retry mechanisms
- **Resource Management**: Proper cleanup and memory management

## 🧪 Testing

### Manual Testing
- CRUD operations for all entities
- Form validation testing
- Error handling verification
- Cross-browser compatibility

### API Testing
- Use the interactive environment selector
- Test all API endpoints
- Validate response formats
- Check error responses

## 📚 Documentation

### Code Documentation
- Comprehensive inline comments
- Clear function and variable naming
- Structured project organization
- README with setup instructions

### API Documentation
- RESTful endpoint descriptions
- Request/response examples
- Error code explanations
- Authentication requirements

## 🔄 Development Workflow

1. **Environment Setup**: Use `node start.js` to select environment
2. **Database Initialization**: Run `npm run init-db` for sample data
3. **Development**: Use `npm run dev` for auto-reloading
4. **Testing**: Test all CRUD operations through the web interface
5. **Deployment**: Use Docker for consistent deployment

## 🎯 Learning Objectives Achieved

### Technical Skills
- ✅ **Backend Development**: Node.js and Express.js
- ✅ **Database Management**: MongoDB and Mongoose
- ✅ **API Design**: RESTful API architecture
- ✅ **Frontend Development**: Responsive web interfaces
- ✅ **DevOps**: Docker containerization
- ✅ **Data Validation**: Input validation and sanitization

### Professional Skills
- ✅ **Project Structure**: Organized, scalable codebase
- ✅ **Documentation**: Comprehensive project documentation
- ✅ **Error Handling**: Robust error management
- ✅ **User Experience**: Intuitive interface design
- ✅ **Best Practices**: Industry-standard development practices

## 🎉 Conclusion

This project demonstrates a complete understanding of full-stack web development, from database design to user interface implementation. The application successfully addresses the business needs of Apollonia Dental Practice while showcasing modern web development technologies and best practices.

The project is production-ready and can be easily extended with additional features such as user authentication, reporting, scheduling, and more advanced employee management capabilities.

---

**Project Author**: [Your Name]
**Course**: [Course Name]
**Date**: July 2025
**Technologies**: Node.js, Express.js, MongoDB, Docker, HTML5, CSS3, JavaScript
