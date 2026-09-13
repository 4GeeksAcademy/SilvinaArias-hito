# Propuesta de Arquitectura Backend para HealthCore

## 1. Selección y Justificación del Patrón Arquitectónico

### Arquitectura en Capas Guiada por Dominio

Para la plataforma backend de **HealthCore**, proponemos una **arquitectura en capas orientada a dominios de negocio**. En lugar de organizar el código de forma genérica, separamos el sistema en áreas con responsabilidades muy bien delimitadas:
- **Capa de Entrada (API):** Encargada únicamente de recibir y responder peticiones web.
- **Capa de Negocio (Servicios):** Donde residen las reglas reales de la aplicación.
- **Capa de Datos (Repositorios):** Encargada de conectarse y consultar la base de datos.
- **Capa Transversal (Seguridad y Cumplimiento):** El motor central que protege la información y vigila el cumplimiento normativo.

### ¿Por qué esta arquitectura?
HealthCore no es una aplicación común de CRUD (crear, leer, actualizar y borrar datos). Es un ecosistema de salud con necesidades muy concretas:
1. **Reglas operativas complejas:** Necesitamos gestionar la agenda médica para evitar ausencias (*no-shows*), validar la cobertura de los seguros y procesar la facturación de forma precisa.
2. **Normativas sanitarias estrictas:** El manejo de información médica requiere cumplir con estándares internacionales como HIPAA y GDPR, además de respetar las leyes de residencia de datos según el país donde opere la clínica.
3. **Auditoría obligatoria:** Cada consulta o modificación sobre la historia clínica de un paciente debe quedar registrada de forma transparente e inalterable.

---

## 2. Estructura de Carpetas Propuesta

Diseñamos una organización modular donde cada componente del sistema tiene un lugar claro y predecible:

```text
backend/
├── app/
│   ├── main.py                    # Punto de arranque de FastAPI y middlewares (CORS, Auditoría)
│   ├── config.py                  # Variables de entorno y ajustes generales
│   ├── database.py                # Conexión a la base de datos
│   ├── deps.py                    # Funciones compartidas (autenticación, sesiones de BD)
│   ├── logging.py                 # Registro de actividad del sistema
│   │
│   ├── api/                       # Punto de entrada HTTP (Rutas públicas)
│   │   └── v1/
│   │       ├── router.py          # Conector principal de todas las rutas
│   │       └── endpoints/
│   │           ├── auth.py        # Control de acceso y logins
│   │           ├── patients.py    # Gestión de pacientes e historias clínicas
│   │           ├── appointments.py# Manejo de citas y agendas
│   │           ├── billing.py     # Facturación y cobros
│   │           ├── compliance.py  # Consultas de cumplimiento y auditoría
│   │           └── reports.py     # Generación de reportes para gerencia
│   │
│   ├── core/                      # El "núcleo" del sistema
│   │   ├── security.py            # Encriptación de contraseñas y claves JWT
│   │   ├── auth.py                # Permisos según el rol del usuario (médico, admin, etc.)
│   │   ├── audit.py               # Rastreo de quién vio o cambió qué información
│   │   └── compliance.py         # Validación de políticas regulatorias (HIPAA / GDPR)
│   │
│   ├── domain/                    # La lógica real de HealthCore (separada por áreas)
│   │   ├── patient/               # Reglas y datos de Pacientes
│   │   ├── appointment/           # Reglas y datos de Citas
│   │   ├── billing/               # Reglas y datos de Facturación
│   │   └── compliance/            # Auditorías internas de datos
│   │
│   ├── schemas/                   # Estructura de los datos que entran y salen de la API (Pydantic)
│   │   ├── auth.py
│   │   ├── patient.py
│   │   ├── appointment.py
│   │   ├── billing.py
│   │   └── report.py
│   │
│   └── services/                  # Tareas secundarias y de soporte
│       ├── reminder_service.py    # Envío de recordatorios
│       ├── claims_service.py      # Conexión con aseguradoras
│       ├── reporting_service.py   # Métricas de negocio
│       └── notification_service.py# Envíos de correos y alertas
│
├── tests/                         # Pruebas para garantizar que nada se rompa
├── .env.example
├── requirements.txt
└── README.md
```

## 3. Cómo Organizar las Rutas (Endpoints) de la API

Para mantener el orden a medida que el sistema crezca, agrupamos las rutas del backend por áreas funcionales utilizando la herramienta `APIRouter` de FastAPI:

- **Autenticación (`/api/v1/auth`):** Inicio de sesión seguro y control de acceso para el personal autorizado.

- **Pacientes (`/api/v1/patients`):** Registro de expedientes, revisión de historias clínicas y datos demográficos.

- **Citas Médicas (`/api/v1/appointments`):** Reserva, cancelación y reagendamiento de consultas para optimizar la atención.

- **Facturación (`/api/v1/billing`):** Cobros, emisión de comprobantes y coordinación de reclamos a seguros.

- **Cumplimiento y Auditoría (`/api/v1/compliance`):** Consultas de control para verificar quién ha accedido a la información confidencial de la historia clinica.

- **Reportes (`/api/v1/reports`):** Métricas operativas e indicadores para la toma de decisiones.

## 4. Convenciones de FastAPI e Investigación

Esta propuesta no improvisa una estructura; adopta los estándares recomendados por la industria y los propios creadores del framework:

- **Basado en la Guía Oficial:** Nos inspiramos en la sección _"Bigger Applications - Multiple Files"_ de la documentación oficial de FastAPI y en la plantilla de desarrollo en producción.

- **Rutas Modulares:** Usar `APIRouter` evita tener un archivo gigante con miles de líneas de código. Cada módulo de la API vive en su propio archivo y se conecta limpiamente en el punto central (`main.py`).

- **Protección de Datos:** Separamos claramente cómo guardamos los datos en la base de datos (`models`) de cómo los mostramos hacia afuera (`schemas`). Así garantizamos que nunca se exponga por error la contraseña o datos sensibles en una respuesta de la API.

## 5. Trabajo en Equipo: Frontend y Backend Separados

El frontend (la interfaz de pantalla que usará el usuario) y el backend (el motor del sistema) funcionarán como dos proyectos independientes que se conectan entre si.

### ¿Cómo interactuan?

1. **Idioma común (API REST en JSON):** Toda la comunicación se realiza mediante peticiones web asíncronas intercambiando datos estructurados en JSON.

2. **Permisos de Conexión (CORS):** Como el frontend y el backend estarán guardados en direcciones distintas, configuramos un filtro de seguridad (`CORSMiddleware`) en el backend para permitir únicamente peticiones desde las aplicaciones frontend autorizadas.

3. **Manejo de Secretos (Variables de Entorno):**

   - El **Backend** guarda bajo llave en un archivo privado (`.env`) las contraseñas de la base de datos y las claves del sistema.

   - El **Frontend** solo conoce la dirección web pública donde debe ir a consultar la información.

## 6. Riesgos

1. **Infracciones Sanitarias Legales:** Si un desarrollador realiza consultas a la base de datos directamente desde una ruta web sin pasar por el módulo de auditoría (`core/audit.py`), perderemos el registro de quién leyó los datos del paciente. Esto viola directamente las leyes HIPAA/GDPR.

2. **Código Difícil de Mantener y Probar:** Mezclar la lógica clínica o los cálculos de facturación dentro de los controladores HTTP genera código desordenado. Si algo falla, será difícil encontrar el error y a su vez dificulta escribir pruebas automáticas.

3. **Fallas de Seguridad en Producción:** Desactivar los filtros de CORS por comodidad durante la etapa de pruebas puede hacer que el sistema quede expuesto en internet a ataquescorriendo el riesgo de que intenten consultar datos clínicos de nuestros usuarios.

