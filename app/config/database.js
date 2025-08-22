const mongoose = require('mongoose');
require('dotenv').config();

// Opciones de conexión optimizadas para producción
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  maxPoolSize: 50,
  minPoolSize: 10,
  retryWrites: true,
  retryReads: true,
  family: 4
};

// Configurar eventos de conexión (una sola vez)
mongoose.connection.on('connecting', () => {
  console.log('📡 Intentando conectar a MongoDB...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose desconectado');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB conectado exitosamente');
});

// Función de conexión principal
async function connectDB() {
  try {
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

    if (!mongoURI) {
      throw new Error('No se ha definido la URI de conexión a MongoDB');
    }

    // Intentar la conexión
    const conn = await mongoose.connect(mongoURI, connectionOptions);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🖥️  Host: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    
    // En producción, intentar reconectar
    if (process.env.NODE_ENV === 'production') {
      const maxRetries = 5;
      const baseDelay = 5000;

      for (let i = 1; i <= maxRetries; i++) {
        console.log(`🔄 Intento de reconexión ${i}/${maxRetries}...`);
        const delay = baseDelay * i;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        try {
          const conn = await mongoose.connect(mongoURI, connectionOptions);
          console.log('✅ Reconexión exitosa');
          return conn;
        } catch (retryError) {
          console.error(`❌ Fallo en intento ${i}:`, retryError.message);
        }
      }
      
      throw new Error('No se pudo establecer conexión con la base de datos después de múltiples intentos');
    }

    // En desarrollo, continuar sin base de datos
    console.log('⚠️  Continuando sin base de datos para desarrollo...');
    return null;
  }
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('\n🔄 Cerrando conexión a MongoDB...');
      await mongoose.connection.close();
      console.log('✅ Conexión cerrada');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar la conexión:', error);
    process.exit(1);
  }
});

// Exportar la función de conexión
module.exports = { connectDB };