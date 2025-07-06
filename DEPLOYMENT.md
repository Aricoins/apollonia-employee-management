# 🚀 Guía de Despliegue - GitHub & Vercel

## 📋 Preparación del Proyecto

### 1. Verificar archivos importantes
- ✅ `.gitignore` - Configurado para excluir archivos sensibles
- ✅ `vercel.json` - Configuración de despliegue en Vercel
- ✅ `.env.example` - Ejemplo de variables de entorno
- ✅ `package.json` - Dependencias y scripts configurados

## 🐙 Subir a GitHub

### Paso 1: Inicializar Git (si no está inicializado)
```bash
git init
```

### Paso 2: Agregar archivos al repositorio
```bash
git add .
git commit -m "Initial commit: Apollonia Employee Management System"
```

### Paso 3: Crear repositorio en GitHub
1. Ve a https://github.com
2. Haz clic en "New repository"
3. Nombre: `apollonia-employee-management`
4. Descripción: `Employee Management System for Apollonia Dental Practice`
5. Selecciona "Public" o "Private"
6. NO selecciones "Add a README file" (ya tienes uno)
7. Haz clic en "Create repository"

### Paso 4: Conectar repositorio local con GitHub
```bash
git remote add origin https://github.com/TU_USUARIO/apollonia-employee-management.git
git branch -M main
git push -u origin main
```

## ☁️ Desplegar en Vercel

### Método 1: Desde GitHub (Recomendado)

#### Paso 1: Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel para acceder a tu GitHub

#### Paso 2: Importar proyecto
1. En el dashboard de Vercel, haz clic en "New Project"
2. Selecciona tu repositorio `apollonia-employee-management`
3. Haz clic en "Import"

#### Paso 3: Configurar variables de entorno
1. En la sección "Environment Variables":
   ```
   NODE_ENV = production
   MONGODB_ATLAS_URI = tu_url_de_mongodb_atlas
   PORT = 3000
   APP_NAME = Apollonia Employee Management
   APP_VERSION = 1.0.0
   DB_CONNECTION_TIMEOUT = 30000
   DB_RECONNECT_ATTEMPTS = 3
   ```

#### Paso 4: Desplegar
1. Haz clic en "Deploy"
2. Espera a que se complete el despliegue
3. Tu aplicación estará disponible en una URL como: `https://apollonia-employee-management.vercel.app`

### Método 2: Desde la Terminal (Vercel CLI)

#### Paso 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

#### Paso 2: Login en Vercel
```bash
vercel login
```

#### Paso 3: Desplegar
```bash
vercel
```

## 🗄️ Configurar MongoDB Atlas

### Paso 1: Crear cuenta en MongoDB Atlas
1. Ve a https://mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster (M0 Sandbox - Gratis)

### Paso 2: Configurar acceso
1. **Database Access**: Crea un usuario con permisos de lectura/escritura
2. **Network Access**: Permite acceso desde cualquier IP (0.0.0.0/0)

### Paso 3: Obtener string de conexión
1. En tu cluster, haz clic en "Connect"
2. Selecciona "Connect your application"
3. Copia la URL de conexión
4. Reemplaza `<password>` con tu contraseña
5. Agrega el nombre de tu base de datos al final: `/apollonia_db`

### Paso 4: Configurar en Vercel
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega: `MONGODB_ATLAS_URI` con tu URL de conexión

## 🔄 Flujo de Trabajo de Desarrollo

### Para actualizar tu aplicación:
```bash
# 1. Hacer cambios en tu código
# 2. Agregar cambios a Git
git add .
git commit -m "Descripción de los cambios"

# 3. Subir a GitHub
git push origin main

# 4. Vercel automáticamente desplegará los cambios
```

## 🌐 URLs de tu Aplicación

### Desarrollo Local
- http://localhost:3000

### Producción (Vercel)
- https://tu-proyecto.vercel.app
- https://apollonia-employee-management.vercel.app (ejemplo)

## ⚙️ Variables de Entorno para Producción

```env
# Vercel Environment Variables
NODE_ENV=production
MONGODB_ATLAS_URI=mongodb+srv://usuario:password@cluster.mongodb.net/apollonia_db?retryWrites=true&w=majority
PORT=3000
APP_NAME=Apollonia Employee Management
APP_VERSION=1.0.0
DB_CONNECTION_TIMEOUT=30000
DB_RECONNECT_ATTEMPTS=3
```

## 🔧 Solución de Problemas

### Error: "Module not found"
- Asegúrate de que todas las dependencias están en `package.json`
- Ejecuta `npm install` localmente y haz commit de cualquier cambio

### Error de conexión a base de datos
- Verifica que `MONGODB_ATLAS_URI` esté configurado correctamente
- Asegúrate de que tu IP esté permitida en MongoDB Atlas
- Verifica usuario y contraseña de MongoDB

### Error 404 en rutas API
- Verifica que `vercel.json` esté configurado correctamente
- Asegúrate de que las rutas en tu código coincidan con la configuración

## 📊 Monitoreo

### Vercel Dashboard
- Ve métricas de rendimiento
- Revisa logs de errores
- Monitorea uso de recursos

### MongoDB Atlas
- Monitorea conexiones de base de datos
- Ve métricas de rendimiento
- Configura alertas

## 🎉 ¡Felicidades!

Tu aplicación ahora está:
- ✅ Versionada en GitHub
- ✅ Desplegada en Vercel
- ✅ Conectada a MongoDB Atlas
- ✅ Lista para usar en producción

## 📝 Comandos de Referencia Rápida

```bash
# Git
git add .
git commit -m "mensaje"
git push origin main

# Vercel CLI
vercel                    # Desplegar
vercel --prod            # Desplegar a producción
vercel logs              # Ver logs
vercel env ls            # Listar variables de entorno

# NPM
npm install              # Instalar dependencias
npm run dev              # Desarrollo local
npm run demo             # Mostrar información del proyecto
```
