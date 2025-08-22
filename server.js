const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB
let dbConnected = false;
let dbConnection = null;

const { connectDB } = require('./app/config/database');

const initDatabase = async () => {
  try {
    dbConnection = await connectDB();
    if (dbConnection) {
      dbConnected = true;
      console.log('✅ Base de datos conectada y lista');
    } else {
      throw new Error('No se pudo establecer la conexión');
    }
  } catch (error) {
    console.log('⚠️  Error al conectar a la base de datos:', error.message);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    } else {
      console.log('⚠️  Ejecutando en modo fallback');
    }
  }
};

// Inicializar la base de datos
initDatabase();

// Rutas de la API (solo si los controladores existen)
try {
  const departmentRoutes = require('./app/routes/department.routes');
  const employeeRoutes = require('./app/routes/employee.routes');
  
  app.use('/api/departments', departmentRoutes);
  app.use('/api/employees', employeeRoutes);
  console.log('✅ Rutas de API cargadas');
} catch (error) {
  console.log('⚠️  Usando rutas de fallback');
  
  // Rutas de fallback básicas
  app.get('/api/departments', (req, res) => {
    res.json({
      success: true,
      message: 'Endpoint de departamentos (modo fallback)',
      data: [
        { id: 1, name: 'General Dentistry', description: 'Atención dental general y preventiva' },
        { id: 2, name: 'Pediatric Dentistry', description: 'Especialización en odontología infantil' },
        { id: 3, name: 'Restorative Dentistry', description: 'Restauración y rehabilitación dental' },
        { id: 4, name: 'Surgery', description: 'Cirugía oral y maxilofacial' },
        { id: 5, name: 'Orthodontics', description: 'Corrección de malposiciones dentales' }
      ]
    });
  });

  app.get('/api/employees', (req, res) => {
    res.json({
      success: true,
      message: 'Endpoint de empleados (modo fallback)',
      data: [
        { id: 1, firstName: 'Lisa', lastName: 'Harris', department: 'Restorative Dentistry', position: 'Restorative Dentist' },
        { id: 2, firstName: 'Alfred', lastName: 'Christensen', department: 'General Dentistry', position: 'Dentist' },
        { id: 3, firstName: 'John', lastName: 'Dudley', department: 'General Dentistry', position: 'Dentist' },
        { id: 4, firstName: 'Danny', lastName: 'Perez', department: 'Restorative Dentistry', position: 'Dental Technician' },
        { id: 5, firstName: 'Sarah', lastName: 'Alvarez', department: 'Pediatric Dentistry', position: 'Dental Hygienist' }
      ]
    });
  });
}

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    project: 'Apollonia Dental Practice Employee Management',
    version: '1.0.0',
    database: dbConnected ? 'Conectada' : 'Desconectada'
  });
});

// Endpoint de prueba de conexión a MongoDB Atlas
app.get('/api/ping', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const state = mongoose.connection.readyState;
    let status = 'desconocido';
    if (state === 0) status = 'desconectado';
    if (state === 1) status = 'conectado';
    if (state === 2) status = 'conectando';
    if (state === 3) status = 'desconectando';
    res.json({
      success: true,
      message: 'Ping exitoso',
      mongoState: status,
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
      uri: process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.stack
    });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Aplicación disponible en http://localhost:${PORT}`);
  console.log(`🔧 API Test: http://localhost:${PORT}/api/test`);
  console.log(`📊 Departamentos: http://localhost:${PORT}/api/departments`);
  console.log(`👥 Empleados: http://localhost:${PORT}/api/employees`);
  console.log(`💾 Base de datos: ${dbConnected ? 'MongoDB' : 'Modo fallback'}`);
});