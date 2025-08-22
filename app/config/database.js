const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
  // Configurar opciones de conexión optimizadas para producción
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Aumentado para dar más tiempo en producción
    socketTimeoutMS: 45000,
    keepAlive: true,
    keepAliveInitialDelay: 300000, // 5 minutos
    maxPoolSize: 50,
    minPoolSize: 10,
    retryWrites: true,
    retryReads: true,
    family: 4
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

    // Configurar eventos de conexión
    mongoose.connection.on('connecting', () => {
      console.log('📡 Intentando conectar a MongoDB...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose desconectado');
    });

    // Intentar la conexión
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`� Host: ${conn.connection.host}`);
    
    return conn;
    
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    
    // En producción, intentar reconectar
    if (process.env.NODE_ENV === 'production') {
      const maxRetries = 5;
      const baseDelay = 5000; // 5 segundos

      for (let i = 1; i <= maxRetries; i++) {
        console.log(`🔄 Intento de reconexión ${i}/${maxRetries}...`);
        const delay = baseDelay * i; // Backoff exponencial
        await new Promise(resolve => setTimeout(resolve, delay));
        
        try {
          const conn = await mongoose.connect(mongoURI, options);
          console.log('✅ Reconexión exitosa');
          return conn;
        } catch (retryError) {
          console.error(`❌ Fallo en intento ${i}:`, retryError.message);
        }
      }
      
      console.error('❌ Fallaron todos los intentos de conexión');
      throw new Error('No se pudo establecer conexión con la base de datos después de múltiples intentos');
    }

    // En desarrollo, continuar sin base de datos para debuggear
    console.log('⚠️  Continuando sin base de datos para desarrollo...');
    return false;
  }
};

// Manejar cierre graceful
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

    // Intentar la conexión
    const conn = await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    throw error; // Re-throw para manejar en el servidor
  }
};

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
module.exports = { connectDB: connect };
});

module.exports = connectDB;