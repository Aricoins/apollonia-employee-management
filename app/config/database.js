const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Configurar opciones de conexión (sin opciones obsoletas)
    const options = {
      serverSelectionTimeoutMS: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    // Determinar URI según el entorno
    let mongoURI;
    if (process.env.NODE_ENV === 'production' && process.env.MONGODB_ATLAS_URI) {
      mongoURI = process.env.MONGODB_ATLAS_URI;
      console.log('🌐 Conectando a MongoDB Atlas (Cloud)...');
    } else if (process.env.NODE_ENV === 'docker' || process.env.DOCKER_MONGODB_URI) {
      mongoURI = process.env.DOCKER_MONGODB_URI || 'mongodb://localhost:27017/apollonia_db';
      console.log('🐳 Conectando a MongoDB en Docker...');
    } else {
      mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apollonia_db';
      console.log('🏠 Conectando a MongoDB local...');
    }

    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Eventos de conexión
    mongoose.connection.on('connected', () => {
      console.log('🔌 Mongoose conectado a MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose desconectado');
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    
    // En desarrollo, continuar sin base de datos para debuggear
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Continuando sin base de datos para desarrollo...');
      return false;
    }
    
    // Intentar reconectar en producción
    const maxRetries = parseInt(process.env.DB_RECONNECT_ATTEMPTS) || 3;
    for (let i = 1; i <= maxRetries; i++) {
      console.log(`🔄 Intento de reconexión ${i}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, 5000 * i));
      
      try {
        await mongoose.connect(mongoURI, options);
        console.log('✅ Reconexión exitosa');
        return true;
      } catch (retryError) {
        console.error(`❌ Fallo en intento ${i}:`, retryError.message);
      }
    }
    
    console.error('❌ Fallaron todos los intentos de conexión');
    return false;
  }
};

// Manejar cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando conexión a MongoDB...');
  await mongoose.connection.close();
  console.log('✅ Conexión cerrada');
  process.exit(0);
});

module.exports = connectDB;