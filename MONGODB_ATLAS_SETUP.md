# MongoDB Atlas Setup Guide

## 1. Crear cuenta en MongoDB Atlas

1. Ve a: https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita
3. Verifica tu email

## 2. Crear un Cluster

1. Selecciona "Build a Database"
2. Elige "M0 Sandbox" (Gratis)
3. Selecciona una región cercana (por ejemplo, us-east-1)
4. Nombre del cluster: "apollonia-cluster"
5. Haz clic en "Create Cluster"

## 3. Configurar acceso a la base de datos

### Crear usuario de base de datos:
1. Ve a "Database Access" en el menú lateral
2. Haz clic en "Add New Database User"
3. Método de autenticación: "Password"
4. Username: `apollonia-admin`
5. Password: (genera una contraseña segura)
6. Database User Privileges: "Atlas admin"
7. Haz clic en "Add User"

### Configurar acceso de red:
1. Ve a "Network Access" en el menú lateral
2. Haz clic en "Add IP Address"
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
4. Haz clic en "Confirm"

## 4. Obtener la cadena de conexión

1. Ve a "Database" en el menú lateral
2. Haz clic en "Connect" en tu cluster
3. Selecciona "Drivers"
4. Selecciona "Node.js" y versión "4.1 or later"
5. Copia la cadena de conexión

La cadena se verá así:
```
mongodb+srv://apollonia-admin:<password>@apollonia-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 5. Configurar en tu aplicación

1. Abre tu archivo `.env`
2. Descomenta y actualiza la línea MONGODB_ATLAS_URI:
```
MONGODB_ATLAS_URI=mongodb+srv://apollonia-admin:TU_PASSWORD@apollonia-cluster.xxxxx.mongodb.net/apollonia_db?retryWrites=true&w=majority
```

## 6. Cambiar a producción

Para usar MongoDB Atlas, cambia en tu `.env`:
```
NODE_ENV=production
```

## 7. Comandos útiles

```bash
# Usar MongoDB local
npm run dev

# Usar MongoDB Atlas (producción)
NODE_ENV=production npm run dev

# Inicializar datos en Atlas
NODE_ENV=production npm run init-db
```

## 8. Monitorear la base de datos

En MongoDB Atlas puedes:
- Ver métricas de rendimiento
- Monitorear queries
- Hacer backups automáticos
- Escalar cuando sea necesario
