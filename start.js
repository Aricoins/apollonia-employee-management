#!/usr/bin/env node

const readline = require('readline');
const { spawn } = require('child_process');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🦷 Apollonia Employee Management - Selector de Base de Datos\n');

const environments = {
  '1': {
    name: 'MongoDB Local',
    description: 'Usar MongoDB instalado localmente',
    env: {
      NODE_ENV: 'development',
      MONGODB_URI: 'mongodb://localhost:27017/apollonia_db'
    }
  },
  '2': {
    name: 'MongoDB Atlas (Cloud)',
    description: 'Usar MongoDB Atlas en la nube',
    env: {
      NODE_ENV: 'production'
    }
  },
  '3': {
    name: 'Docker MongoDB',
    description: 'Usar MongoDB en contenedor Docker',
    env: {
      NODE_ENV: 'docker',
      MONGODB_URI: 'mongodb://mongodb:27017/apollonia_db'
    }
  }
};

function showMenu() {
  console.log('Selecciona el entorno de base de datos:');
  console.log('');
  
  Object.entries(environments).forEach(([key, env]) => {
    console.log(`${key}. ${env.name}`);
    console.log(`   ${env.description}`);
    console.log('');
  });
  
  console.log('4. Inicializar datos de ejemplo');
  console.log('5. Salir');
  console.log('');
}

function runApp(envVars = {}) {
  const env = { ...process.env, ...envVars };
  
  console.log('\n🚀 Iniciando aplicación...');
  console.log(`📊 Entorno: ${env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${env.MONGODB_URI || 'Atlas/Docker'}`);
  console.log('');
  
  const child = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: env,
    cwd: process.cwd()
  });
  
  child.on('close', (code) => {
    console.log(`\n✅ Aplicación terminada con código: ${code}`);
    askAgain();
  });
}

function initializeData(envVars = {}) {
  const env = { ...process.env, ...envVars };
  
  console.log('\n🔄 Inicializando datos de ejemplo...');
  console.log(`📊 Entorno: ${env.NODE_ENV || 'development'}`);
  
  const child = spawn('node', ['init-database.js'], {
    stdio: 'inherit',
    env: env,
    cwd: process.cwd()
  });
  
  child.on('close', (code) => {
    console.log(`\n✅ Inicialización terminada con código: ${code}`);
    askAgain();
  });
}

function askAgain() {
  console.log('\n' + '='.repeat(50));
  rl.question('\n¿Qué deseas hacer? (Presiona Enter para ver el menú): ', (answer) => {
    if (answer.trim() === '') {
      showMenu();
      handleChoice();
    } else {
      handleUserChoice(answer.trim());
    }
  });
}

function handleChoice() {
  rl.question('Selecciona una opción (1-5): ', handleUserChoice);
}

function handleUserChoice(choice) {
  switch (choice) {
    case '1':
      console.log('\n🏠 Configurando MongoDB Local...');
      runApp(environments['1'].env);
      break;
      
    case '2':
      console.log('\n🌐 Configurando MongoDB Atlas...');
      console.log('⚠️  Asegúrate de tener configurado MONGODB_ATLAS_URI en tu .env');
      runApp(environments['2'].env);
      break;
      
    case '3':
      console.log('\n🐳 Configurando Docker MongoDB...');
      runApp(environments['3'].env);
      break;
      
    case '4':
      console.log('\n📊 ¿En qué entorno quieres inicializar los datos?');
      console.log('1. Local');
      console.log('2. Atlas (Cloud)');
      console.log('3. Docker');
      
      rl.question('Selecciona (1-3): ', (initChoice) => {
        if (environments[initChoice]) {
          initializeData(environments[initChoice].env);
        } else {
          console.log('❌ Opción inválida');
          askAgain();
        }
      });
      break;
      
    case '5':
      console.log('\n👋 ¡Hasta luego!');
      rl.close();
      break;
      
    default:
      console.log('❌ Opción inválida. Intenta de nuevo.');
      handleChoice();
  }
}

// Iniciar el programa
showMenu();
handleChoice();
