const mongoose = require('mongoose');
require('dotenv').config();

async function viewCollections() {
  try {
    // Conectar a MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apollonia_db';
    console.log('🔗 Conectando a:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');
    
    // Obtener la base de datos
    const db = mongoose.connection.db;
    console.log(`📊 Base de datos: ${db.databaseName}`);
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('📭 No hay colecciones en la base de datos');
    } else {
      console.log('\n📋 Colecciones encontradas:');
      console.log('================================');
      
      for (const collection of collections) {
        const collectionName = collection.name;
        const count = await db.collection(collectionName).countDocuments();
        
        console.log(`📁 ${collectionName} (${count} documentos)`);
        
        // Mostrar algunos documentos de ejemplo
        if (count > 0) {
          const samples = await db.collection(collectionName).find({}).limit(2).toArray();
          console.log('   Ejemplos:');
          samples.forEach((doc, index) => {
            console.log(`   ${index + 1}. ${JSON.stringify(doc, null, 2).substring(0, 200)}...`);
          });
        }
        console.log('');
      }
    }
    
    // Mostrar estadísticas de la base de datos
    const stats = await db.stats();
    console.log('📊 Estadísticas de la base de datos:');
    console.log(`   - Tamaño: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Colecciones: ${stats.collections}`);
    console.log(`   - Documentos: ${stats.objects}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Soluciones:');
      console.log('1. Iniciar MongoDB localmente: mongod');
      console.log('2. Usar Docker: docker-compose up -d');
      console.log('3. Usar MongoDB Atlas (cloud)');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

viewCollections();
