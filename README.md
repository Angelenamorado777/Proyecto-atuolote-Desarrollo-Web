# Proyecto atuolote Desarrollo Web
# 🚗 Autolote — Sistema de Gestión para Concesionario

Sistema web fullstack para la gestión integral de un concesionario de vehículos. Permite administrar el inventario de vehículos, clientes, ventas y consultar tasas de cambio en tiempo real mediante una API externa.

> **Proyecto Final — Desarrollo de Aplicaciones Web I | T38**
> Equipo: Joseph Dubón · Ángel · Marlon · Devin

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Base de Datos](#-base-de-datos)
- [Variables de Entorno](#-variables-de-entorno)
- [Ejecutar el Proyecto](#-ejecutar-el-proyecto)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Módulos del Frontend](#-módulos-del-frontend)
- [API Externa](#-api-externa---tasas-de-cambio)
- [Control de Versiones](#-control-de-versiones--gitflow)

---

## 📌 Descripción General

Autolote es una API RESTful construida con **Node.js + Express.js** que expone endpoints para gestionar:

- 👤 **Usuarios** — Registro e inicio de sesión con autenticación JWT
- 🚘 **Vehículos** — CRUD completo del inventario
- 👥 **Clientes** — Registro de clientes e historial de consultas
- 💰 **Ventas** — Registro de ventas con cálculo de impuestos
- 💱 **Tasas de Cambio** — Conversión de precios a múltiples monedas en tiempo real

El frontend en **Angular** conecta dos módulos al backend: el login con autenticación JWT y el catálogo público de vehículos.

---

## 🛠 Tecnologías Utilizadas

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | >= 18.x | Entorno de ejecución |
| Express.js | ^4.x | Framework HTTP |
| MySQL2 | ^3.x | Conexión a base de datos |
| JSON Web Token (JWT) | ^9.x | Autenticación stateless |
| Bcrypt | ^5.x | Hash de contraseñas |
| Axios | ^1.x | Consumo de API externa |
| Dotenv | ^16.x | Variables de entorno |
| CORS | ^2.x | Manejo de políticas de origen |
| Nodemon | ^3.x | Recarga automática en desarrollo |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Angular | >= 17.x | Framework SPA |
| TypeScript | ^5.x | Lenguaje principal |
| HttpClient | — | Consumo de API REST |

### Base de Datos
| Tecnología | Uso |
|---|---|
| MySQL | Base de datos relacional |

### DevOps / Control de Versiones
| Herramienta | Uso |
|---|---|
| Git + Gitflow | Control de versiones con ramas por módulo |
| GitHub | Repositorio remoto y Pull Requests |

---

## 📁 Estructura del Proyecto

```
Proyecto-atuolote-Desarrollo-Web/
├── config/
│   └── db.js                  # Pool de conexiones MySQL
├── middleware/
│   └── authMiddleware.js      # Verificación de token JWT
├── routes/
│   ├── authRoute.js           # Login y registro de usuarios
│   ├── vehiculosRoute.js      # CRUD de vehículos + conversión de precios
│   ├── clientesRoute.js       # CRUD de clientes
│   ├── ventasRoute.js         # CRUD de ventas
│   └── exchangeRoute.js       # Consulta de tasas de cambio
├── SQL/
│   └── autolote_db.sql        # Script de creación de la base de datos
├── T38-frontend/              # Proyecto Angular
│   └── src/
│       └── app/
│           ├── component/
│           │   ├── login/     # Módulo de autenticación
│           │   └── vehiculos/ # Módulo de catálogo de vehículos
│           └── services/
│               └── vehiculo.service.ts
├── .env                       # Variables de entorno (NO subir a Git)
├── .gitignore
├── app.js                     # Punto de entrada del servidor
├── package.json
└── README.md
```

---

## ✅ Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de continuar:

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://www.mysql.com/) v8 o superior
- [Angular CLI](https://angular.io/cli) v17 o superior
- [Git](https://git-scm.com/)

Verificar instalaciones:
```bash
node -v
npm -v
mysql --version
ng version
```

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Angelenamorado777/Proyecto-atuolote-Desarrollo-Web.git
cd Proyecto-atuolote-Desarrollo-Web
```

### 2. Instalar dependencias del Backend

```bash
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd T38-frontend
npm install
cd ..
```

---

## 🗄️ Base de Datos

### Crear y configurar la base de datos

Conéctate a MySQL y ejecuta el siguiente script:

```sql
CREATE DATABASE autolote_db;
USE autolote_db;

-- Tabla de usuarios (vendedores / administradores)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor') DEFAULT 'vendedor',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vehículos
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    anio YEAR NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    disponible TINYINT(1) DEFAULT 1,
    imagen_url VARCHAR(500),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de consultas (historial de cada cliente)
CREATE TABLE consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('informacion', 'prueba_manejo') DEFAULT 'informacion',
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabla de ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_vehiculo INT NOT NULL,
    id_cliente INT NOT NULL,
    id_vendedor INT NOT NULL,
    precio_total DECIMAL(10, 2) NOT NULL,
    impuestos DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_vendedor) REFERENCES usuarios(id)
);
```

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Servidor
PORT=3000

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=autolote_db

# Autenticación JWT
JWT_SECRET=tu_clave_secreta_muy_segura

# API Externa
EXCHANGE_API_KEY=tu_api_key_de_exchangerate
```

> ⚠️ **Importante:** El archivo `.env` está en el `.gitignore` y nunca debe subirse al repositorio. Para obtener una API Key gratuita de ExchangeRate, regístrate en [https://www.exchangerate-api.com](https://www.exchangerate-api.com).

---

## ▶️ Ejecutar el Proyecto

### Backend

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
node app.js
```

El servidor estará disponible en: `http://localhost:3000`

### Frontend

```bash
cd T38-frontend
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

---

## 📡 Endpoints de la API

### 🔓 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión y obtener JWT | No |

**Ejemplo de body para login:**
```json
{
  "correo": "admin@autolote.com",
  "password": "tu_password"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🚘 Vehículos (`/api/vehiculos`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/vehiculos` | Listar todos los vehículos | No |
| GET | `/api/vehiculos/:id` | Obtener vehículo por ID | No |
| GET | `/api/vehiculos/:id/precios` | Ver precios en múltiples monedas | No |
| POST | `/api/vehiculos` | Crear vehículo | ✅ JWT |
| PUT | `/api/vehiculos/:id` | Actualizar vehículo | ✅ JWT |
| DELETE | `/api/vehiculos/:id` | Eliminar vehículo | ✅ JWT |

**Ejemplo de body para crear vehículo:**
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "anio": 2022,
  "precio": 18000,
  "disponible": 1
}
```

**Ejemplo de respuesta de `/api/vehiculos/1/precios`:**
```json
{
  "vehiculo": {
    "id": 1,
    "marca": "Toyota",
    "modelo": "Corolla",
    "anio": 2022
  },
  "precios": {
    "USD": 18000,
    "HNL": 474732.00,
    "EUR": 16560.00,
    "MXN": 308700.00,
    "GTQ": 139500.00
  }
}
```

---

### 👥 Clientes (`/api/clientes`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/clientes` | Listar todos los clientes | ✅ JWT |
| GET | `/api/clientes/:id` | Obtener cliente por ID | ✅ JWT |
| POST | `/api/clientes` | Registrar cliente | ✅ JWT |
| PUT | `/api/clientes/:id` | Actualizar cliente | ✅ JWT |
| DELETE | `/api/clientes/:id` | Eliminar cliente | ✅ JWT |

---

### 💰 Ventas (`/api/ventas`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/ventas` | Listar todas las ventas | ✅ JWT |
| GET | `/api/ventas/:id` | Obtener venta por ID | ✅ JWT |
| POST | `/api/ventas` | Registrar venta | ✅ JWT |
| PUT | `/api/ventas/:id` | Actualizar venta | ✅ JWT |
| DELETE | `/api/ventas/:id` | Eliminar venta | ✅ JWT |

---

### 💱 Tasas de Cambio (`/api/exchange`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/exchange/:moneda` | Obtener tasa USD → moneda | No |

**Ejemplo:** `GET /api/exchange/HNL`
```json
{
  "base": "USD",
  "moneda": "HNL",
  "tasa": 26.4296
}
```

> Códigos de moneda soportados: `HNL`, `EUR`, `MXN`, `GTQ`, `CRC` y más de 160 monedas disponibles.

---

## 🖥️ Módulos del Frontend

El frontend en Angular tiene conectados **dos módulos** al backend:

### Módulo 1 — Login (`/login`)
- Formulario de inicio de sesión
- Validación de credenciales contra el backend
- Almacenamiento del token JWT en el cliente
- Redirección al home tras autenticación exitosa
- Manejo de errores (401 Unauthorized)

### Módulo 2 — Catálogo de Vehículos (`/vehiculos`)
- Listado completo del inventario de vehículos
- Consume el endpoint público `GET /api/vehiculos`
- Muestra marca, modelo, año y precio
- No requiere autenticación — acceso público

> **Nota:** Los demás módulos del backend (clientes, ventas) están implementados y funcionales en la API, pero no están conectados al frontend en esta versión del proyecto.

---

## 💱 API Externa - Tasas de Cambio

Este proyecto integra [ExchangeRate-API](https://www.exchangerate-api.com/) para obtener tasas de cambio en tiempo real.

**Características:**
- Plan gratuito disponible sin tarjeta de crédito
- Base en USD con más de 160 monedas disponibles
- Actualización en tiempo real

**Cómo se usa en el proyecto:**
1. El endpoint `/api/exchange/:moneda` consulta la tasa de cualquier moneda frente al USD
2. El endpoint `/api/vehiculos/:id/precios` combina el precio del vehículo desde MySQL con las tasas de la API externa para devolver el precio en múltiples monedas simultáneamente

---

## 🌿 Control de Versiones — Gitflow

El proyecto sigue la metodología **Gitflow**:

| Rama | Propósito |
|---|---|
| `main` | Versión estable y productiva |
| `develop` | Integración de todas las features |
| `feature_joseph_registro_login` | Módulo de autenticación — Joseph |
| `feature_Angel_clientes` | Módulo de clientes — Ángel |
| `feature_Marlon_Ventas` | Módulo de ventas — Marlon |
| `feature_devin_Vehículos` | Módulo de vehículos — Devin |

Cada feature se integró a `develop` mediante **Pull Requests** revisados antes de hacer merge.

---

## 👨‍💻 Equipo de Desarrollo

| Integrante | Módulo |
|---|---|
| Joseph Dubón | Backend — Autenticación JWT + Login Frontend |
| Ángel | Backend — Módulo de Clientes |
| Marlon | Backend — Módulo de Ventas |
| Devin | Backend — Módulo de Vehículos + Frontend Catálogo |

---

*Desarrollo de Aplicaciones Web I — T38*