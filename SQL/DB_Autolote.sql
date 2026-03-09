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

-- Crear el usuario
CREATE USER 'autolote_user'@'localhost' IDENTIFIED BY 'autolote1234';
-- Darle permisos solo sobre la base de datos del proyecto
GRANT SELECT, INSERT, UPDATE, DELETE ON autolote_db.* TO 'autolote_user'@'localhost';

FLUSH PRIVILEGES;

