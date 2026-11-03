# API REST - Ventas y Productos (TypeORM & Express)

API REST desarrollada con **Node.js**, **Express**, **TypeScript**, **TypeORM** y **MySQL** para la gestión de productos y ventas.

---

## 📋 Endpoints Implementados

La API cuenta con los 5 métodos CRUD requeridos (`GETBYID`, `GETALL`, `POST`, `PUT`, `DELETE`) para las entidades **Productos** y **Ventas**:

### 📦 Productos (`/api/productos`)

| Método | Endpoint | Descripción | Body (JSON) |
|---|---|---|---|
| **GET** | `/api/productos` | Obtiene la lista completa de productos (GETALL) | - |
| **GET** | `/api/productos/:id` | Obtiene un producto por su ID (GETBYID) | - |
| **POST** | `/api/productos` | Registra un nuevo producto (POST) | `{"nombre": "Teclado Mecánico", "precio": 1200.00, "stock": 15, "categoriaId": 2}` |
| **PUT** | `/api/productos/:id` | Actualiza un producto existente (PUT) | `{"nombre": "Teclado RGB", "precio": 1350.00, "stock": 20}` |
| **DELETE** | `/api/productos/:id` | Elimina un producto por su ID (DELETE) | - |

---

### 💳 Ventas (`/api/ventas`)

| Método | Endpoint | Descripción | Body (JSON) |
|---|---|---|---|
| **GET** | `/api/ventas` | Obtiene la lista completa de ventas con detalles (GETALL) | - |
| **GET** | `/api/ventas/:id` | Obtiene una venta por su ID con productos (GETBYID) | - |
| **POST** | `/api/ventas` | Registra una nueva venta con sus artículos (POST) | Ver ejemplo abajo |
| **PUT** | `/api/ventas/:id` | Actualiza información de la venta (PUT) | `{"cliente": "Juan Perez Actualizado", "total": 1500.00}` |
| **DELETE** | `/api/ventas/:id` | Elimina una venta por su ID (DELETE) | - |

#### Ejemplo de Body para `POST /api/ventas`:
```json
{
  "cliente": "Dylan Mollinedo",
  "detalles": [
    {
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 12500.00
    }
  ]
}
```

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** & **Express**
- **TypeScript**
- **TypeORM** (Data Mapper / Repository Pattern)
- **MySQL** / MariaDB
- **tsx** (ejecución y recarga en desarrollo)

---

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/godofcode22/MollinedoSanchez-dbadmin-api.git
   cd MollinedoSanchez-dbadmin-api
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea o edita el archivo `.env` basándote en `.env.example`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3307
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=ventas_db
   ```

4. **Base de Datos:**
   Ejecuta el script `init.sql` en tu servidor MySQL/MariaDB para crear las tablas y datos iniciales.

5. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

6. **Compilar para producción:**
   ```bash
   npm run build
   npm start
   ```
