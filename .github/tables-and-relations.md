# Tablas y Relaciones del Sistema

## Tablas y Relaciones

### 1. `users`
- **Descripción**: Tabla para gestionar usuarios del sistema.
- **Campos**:
  - `id` (UUID): Identificador único del usuario.
  - `name` (string): Nombre del usuario.
  - `email` (string): Correo electrónico único.
  - `password_hash` (string): Hash de la contraseña (usando Argon2).
  - `role` (enum): Rol del usuario (`admin`, `user`).
  - `created_at` (timestamp): Fecha de creación.
  - `updated_at` (timestamp): Fecha de última actualización.
  - `deleted_at` (timestamp, nullable): Fecha de eliminación lógica.
- **Relaciones**:
  - Relación 1:N con `orders` (un usuario puede tener múltiples órdenes).
- **Funcionamiento**:
  - Gestiona autenticación y autorización.
  - Usa Redis para manejar sesiones y tokens.

---

### 2. `products`
- **Descripción**: Tabla para gestionar el catálogo de productos.
- **Campos**:
  - `id` (UUID): Identificador único del producto.
  - `name` (string): Nombre del producto.
  - `description` (string): Descripción del producto.
  - `price` (decimal): Precio del producto.
  - `stock` (integer): Cantidad disponible en inventario.
  - `created_at` (timestamp): Fecha de creación.
  - `updated_at` (timestamp): Fecha de última actualización.
  - `deleted_at` (timestamp, nullable): Fecha de eliminación lógica.
- **Relaciones**:
  - Relación N:M con `orders` a través de `order_items`.
- **Funcionamiento**:
  - Permite CRUD de productos.
  - Usa Redis para cachear productos populares (`product:ID`).

---

### 3. `orders`
- **Descripción**: Tabla principal para gestionar órdenes de compra.
- **Campos**:
  - `id` (UUID): Identificador único de la orden.
  - `user_id` (FK → `users.id`): Usuario que realizó la orden.
  - `status` (enum): Estado de la orden (`pending`, `paid`, `shipped`).
  - `total_amount` (decimal): Monto total de la orden.
  - `created_at` (timestamp): Fecha de creación.
  - `updated_at` (timestamp): Fecha de última actualización.
  - `deleted_at` (timestamp, nullable): Fecha de eliminación lógica.
- **Relaciones**:
  - Relación 1:N con `order_items` (una orden tiene múltiples productos).
  - Relación N:1 con `users` (una orden pertenece a un usuario).
- **Funcionamiento**:
  - Publica eventos a SQS cuando se crea o actualiza una orden.
  - Integra con el servicio de pagos para confirmar el estado.

---

### 4. `order_items`
- **Descripción**: Tabla intermedia para relacionar órdenes con productos.
- **Campos**:
  - `id` (UUID): Identificador único del registro.
  - `order_id` (FK → `orders.id`): Orden a la que pertenece el producto.
  - `product_id` (FK → `products.id`): Producto incluido en la orden.
  - `quantity` (integer): Cantidad del producto en la orden.
  - `price_unit` (decimal): Precio unitario del producto.
  - `subtotal` (decimal): Subtotal (`quantity * price_unit`).
  - `deleted_at` (timestamp, nullable): Fecha de eliminación lógica.
- **Relaciones**:
  - Relación N:1 con `orders`.
  - Relación N:1 con `products`.
- **Funcionamiento**:
  - Permite calcular el total de una orden.
  - Garantiza integridad referencial entre órdenes y productos.

---

### 5. `payments`
- **Descripción**: Tabla para gestionar pagos de órdenes.
- **Campos**:
  - `id` (UUID): Identificador único del pago.
  - `order_id` (FK → `orders.id`): Orden asociada al pago.
  - `status` (enum): Estado del pago (`initiated`, `confirmed`, `failed`).
  - `provider` (string): Proveedor del pago (e.g., `mock`, `stripe`).
  - `transaction_id` (string): Identificador de la transacción en el proveedor.
  - `created_at` (timestamp): Fecha de creación.
  - `deleted_at` (timestamp, nullable): Fecha de eliminación lógica.
- **Relaciones**:
  - Relación 1:1 con `orders` (una orden tiene un único pago).
- **Funcionamiento**:
  - Publica eventos a SQS cuando un pago es confirmado.
  - Implementa idempotencia para evitar duplicados.

---

### 6. `logs` (opcional)
- **Descripción**: Tabla o colección para almacenar logs estructurados.
- **Campos**:
  - `id` (UUID): Identificador único del log.
  - `service_name` (string): Nombre del servicio que generó el log.
  - `level` (enum): Nivel del log (`info`, `error`, `warn`).
  - `message` (string): Mensaje del log.
  - `metadata` (JSONB): Información adicional (e.g., `request_id`, `user_id`).
  - `timestamp` (timestamp): Fecha y hora del log.
  - `deleted_at` (timestamp, nullable): Fecha de eliminación lógica.
- **Relaciones**:
  - No tiene relaciones directas, pero puede incluir referencias a otros servicios.
- **Funcionamiento**:
  - Centraliza logs de todos los microservicios.
  - Permite auditoría y monitoreo.

---

## Cómo Funcionan las Relaciones

1. **Relación `users` → `orders`**:
   - Un usuario puede realizar múltiples órdenes.
   - Ejemplo: El usuario con `id=1` crea una orden con productos.

2. **Relación `orders` → `order_items` → `products`**:
   - Una orden puede incluir múltiples productos.
   - Ejemplo: La orden con `id=1` incluye 2 unidades del producto `id=10` y 1 unidad del producto `id=20`.

3. **Relación `orders` → `payments`**:
   - Cada orden tiene un único pago asociado.
   - Ejemplo: La orden con `id=1` tiene un pago confirmado con el proveedor `stripe`.

4. **Relación `logs`**:
   - Los logs pueden incluir referencias a `orders`, `users`, o cualquier entidad relevante.
   - Ejemplo: Un log registra un error al procesar el pago de la orden `id=1`.

---

## Ejemplo de Flujo Completo

1. **Creación de una Orden**:
   - El usuario `id=1` selecciona productos y crea una orden.
   - Se inserta un registro en `orders` y múltiples registros en `order_items`.

2. **Procesamiento del Pago**:
   - El servicio de pagos crea un registro en `payments` con estado `initiated`.
   - Cuando el pago es confirmado, se actualiza el estado a `confirmed` y se publica un evento a SQS.

3. **Notificaciones**:
   - El servicio de notificaciones consume el evento de SQS y envía un correo al usuario confirmando la orden.

4. **Logs**:
   - Cada paso genera logs estructurados con `request_id` para trazabilidad.