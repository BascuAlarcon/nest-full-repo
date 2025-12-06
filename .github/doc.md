1. Clean Architecture / Hexagonal / DDD (light)
En el sistema:
•	/domain: entidades Users, Products, Orders, OrderItems, Payments
•	Value objects: Price, Stock, Status
•	Interfaces de repositorios
•	Reglas de negocio
•	/application
o	CreateOrderUseCase
o	ProcessPaymentUseCase
o	ManageInventoryUseCase
•	/infrastructure
o	Prisma repository
o	Event publisher a SQS
o	Redis cache adapter
o	Logger adapter
Demuestra: seniority, diseño modular, escalabilidad.

2. Testing enterprise
Incluye 3 niveles:
Unit tests
•	Validar entidades
•	Reglas de negocio
•	Servicios internos
Integration tests
•	UseCases + repositorios con PostgreSQL en Docker
E2E tests
•	API completa usando supertest
•	Mock de Redis y SQS
Demuestra: calidad, experiencia real.

3. Redis (cache, rate limit, pub/sub)
Usarás Redis para:
•	caching de productos populares
•	invalidación por eventos
•	rate limiter para endpoints sensibles
•	pub/sub para sincronización entre microservicios
Ejemplo:
Cuando un producto se actualiza → se limpia el cache del producto.

4. Seguridad profesional
Autenticación:
•	Login + refresh tokens
•	ROTACIÓN de refresh tokens (nivel senior)
•	Revocación de sesiones
•	Argon2 para hashing
Protección:
•	Rate limit global
•	Helmet
•	HMAC en webhooks
•	Tokens firmados con RSA
•	RBAC (roles)

5. APIs robustas
OpenAPI con Swagger
Versionado:
/v1/*
/v2/* (para funciones nuevas)
Idempotencia:
Por ejemplo:
POST /v1/orders con header Idempotency-Key
Webhooks:
•	Cuando una orden cambia de estado → enviar webhook firmado
(como GitHub, Stripe)

6. Base de datos nivel enterprise
Usa PostgreSQL con:
•	índices
•	relaciones
•	transacciones
•	locks optimistas
•	soft deletes
•	migrations automáticas

7. Microservicios
Orders service (NestJS) → core
Notifications service (Python/FastAPI):
•	Recibe eventos desde SQS
•	Envía emails
•	Procesa recordatorios
•	Publica métricas
Demuestras que manejas más de un lenguaje.

8. Mensajería (SQS/Rabbit)
Cuando una orden cambia de estado:
orders-service -> SQS -> notifications-service
El servicio de Python consume colas y envía correos o notificaciones.

9. Logging + Monitoring
•	Usa Pino para logs estructurados
•	Correlación por request-id
•	Exportación a CloudWatch

10. CI/CD profesional (GitHub Actions)
Pipelines:
•	Lint
•	Test (3 niveles)
•	Build
•	Deploy a AWS (Terraform + GitHub Actions)

11. Deployment a AWS
•	Backend en ECS Fargate o Lambda
•	SQS
•	S3 para archivos adjuntos
•	CloudWatch
•	Parameter Store para secretos

### Estructura del proyecto

Dado que el proyecto incluirá microservicios, la estructura será modular y cada microservicio tendrá su propio directorio con su configuración independiente. Aquí está la estructura sugerida:

```
root/
├── apps/
│   ├── orders-service/       # Microservicio principal (gestión de órdenes)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── ...
│   ├── notifications-service/ # Microservicio de notificaciones (Python/FastAPI)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── ...
│   └── ...
├── libs/                    # Librerías compartidas entre microservicios
│   ├── domain/              # Entidades y objetos de valor
│   ├── application/         # Casos de uso compartidos
│   └── ...
├── docker-compose.yml       # Orquestación de servicios en desarrollo
├── k8s/                     # Configuración para Kubernetes
│   ├── orders-service.yaml
│   ├── notifications-service.yaml
│   └── ...
└── ...
```

### Detalles adicionales

1. **Microservicios**:
   - Cada microservicio tendrá su propio directorio bajo `apps/`.
   - Usaremos Docker para contenerizar cada servicio.
   - Las configuraciones específicas de cada servicio (como `Dockerfile`, dependencias, etc.) estarán en su directorio correspondiente.

2. **Librerías compartidas**:
   - El directorio `libs/` contendrá módulos reutilizables como entidades, casos de uso y adaptadores.
   - Esto asegura que el código común no se duplique entre microservicios.

3. **Orquestación con Docker Compose**:
   - Durante el desarrollo, usaremos `docker-compose.yml` para levantar todos los servicios y dependencias (como Redis, PostgreSQL, etc.).

4. **Despliegue con Kubernetes**:
   - La carpeta `k8s/` contendrá los manifiestos necesarios para desplegar los microservicios en un clúster de Kubernetes.
   - Esto incluirá configuraciones como `Deployments`, `Services`, `Ingress`, etc.

### Actualización de la documentación

Se ha añadido información sobre la estructura del proyecto, la contenedorización con Docker y el despliegue con Kubernetes.

Tablas:
1. users
Para autenticación, autorización y sesiones.
Campos sugeridos:
• id (uuid)
• name
• email
• password_hash
• role (admin/user)
• created_at
• updated_at
👉 Te permitirá practicar:
• JWT/OAuth
• Sessions redis
• Protección de rutas con Nest Guards
________________________________________
2. products
Catálogo para CRUD básico y para relacionarlo con órdenes.
Campos:
• id (uuid)
• name
• description
• price
• stock
• created_at
• updated_at
👉 Punto de entrada para:
• Cache Redis (“product:ID”)
• APIs REST y GraphQL
• Testing unitario E2E
________________________________________
3. orders
Core del negocio: orden de compra.
Campos:
• id (uuid)
• user_id (FK → users)
• status (pending, paid, shipped)
• total_amount
• created_at
• updated_at
👉 Con esto practicas:
• Microservicio de orders
• Eventos a SQS en cambio de estado (“order.created”)
• Logging estructurado por request
• Integración entre servicios
________________________________________
4. order_items
Relación entre orders y products.
Campos:
• id
• order_id (FK)
• product_id (FK)
• quantity
• price_unit
• subtotal
👉 Permite:
• Transacciones reales
• Testing de integridad
• ORM avanzado / batch updates
________________________________________
5. payments
Para simular un microservicio separado.
Campos:
• id
• order_id
• status (initiated, confirmed, failed)
• provider (mock, stripe-like)
• transaction_id
• created_at
👉 Usarás:
• SQS cuando el pago cambia de “confirmed”
• Idempotencia
• Compensación (patrón sagas)
________________________________________
6. logs (opcional pero recomendado)
No es una tabla SQL per se, pero puedes tenerla como colección en MongoDB o una tabla mínima.
Campos:
• id
• service_name
• level (info/error/warn)
• message
• metadata (JSONB si es Postgres)
• timestamp
👉 Te permite:
• Implementar logging empresarial
• Correlation IDs
• Auditoría de microservicios

