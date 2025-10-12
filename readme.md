# API de Gestión de Proyectos y Tareas

Una API RESTful básica construida con **Node.js** y **Express** para la gestión detallada de tareas dentro de un proyecto. Permite realizar operaciones CRUD completas sobre tareas que incluyen títulos, estados, estimaciones, dependencias y checklists.

---

## 🚀 URL de la API en Producción

Puedes interactuar con la API en vivo a través de la siguiente URL base desplegada en Railway:

**URL Base:** `https://task-production-f8bc.up.railway.app/`

---

## ✨ Características Principales

-   **Gestión de Proyectos**: La API opera sobre un único objeto de proyecto que contiene una lista de tareas.
-   **CRUD de Tareas**: Funcionalidad completa para Crear, Leer, Actualizar y Eliminar tareas.
-   **Modelo de Datos Detallado**: Las tareas pueden incluir estimaciones de horas, fechas de entrega, dependencias y checklists de subtareas.
-   **Validación de Datos**: Middleware para asegurar la integridad de los datos de entrada.
-   **Persistencia Local**: Los datos se almacenan y leen desde un archivo `task.json`, simulando una base de datos.
-   **IDs Únicos**: Generación automática de identificadores únicos para cada nueva tarea.

---

## 💻 Tecnologías Utilizadas

-   **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
-   **Express.js**: Framework minimalista para la construcción de la API REST.
-   **uuid**: Librería para la generación de identificadores únicos universales (UUID v4).

---

## 🔧 Estructura del Proyecto y Datos

El proyecto sigue una estructura simple y los datos persisten en un archivo JSON local.

### Estructura de Carpetas

    .
    ├── dev-data/
    │   └── task.json        # Archivo que funciona como base de datos
    ├── node_modules/
    ├── .gitignore
    ├── index.js             # Lógica principal del servidor y endpoints
    ├── package.json
    └── package-lock.json

### Modelo de Datos (`task.json`)

El archivo JSON principal contiene los detalles del proyecto y un array de objetos de tarea.

    {
      "project_id": "PRJ-001",
      "name": "Proyecto Pequeño",
      "owner": "Hernán",
      "created_at": "2025-10-08",
      "timezone": "America/Santiago",
      "tasks": [
        {
          "id": "T-1",
          "title": "Kickoff y alcance",
          "status": "todo",
          "estimate_hours": 2,
          "due_date": "2025-10-10"
        },
        {
          "id": "T-2",
          "title": "Setup repo y entorno",
          "status": "todo",
          "estimate_hours": 2,
          "due_date": "2025-10-11",
          "dependencies": ["T-1"],
          "checklist": [
            { "item": "Crear repo/ramas", "done": false },
            { "item": "README + .env.example", "done": false }
          ]
        }
      ]
    }

---

## 📖 Documentación de Endpoints

A continuación se detallan los endpoints disponibles en la API.

### 1. Obtener el Proyecto Completo (con todas las tareas)

-   **Método:** `GET`
-   **Endpoint:** `/` o `/task`
-   **Descripción:** Devuelve el objeto completo del proyecto, incluyendo la lista de todas las tareas.
-   **Ejemplo con `curl`:**

        curl -X GET [https://task-production-f8bc.up.railway.app/](https://task-production-f8bc.up.railway.app/)

-   **Respuesta Exitosa (200 OK):** Muestra el contenido completo de `task.json`.

### 2. Obtener una Tarea Específica por ID

-   **Método:** `GET`
-   **Endpoint:** `/task?id=<TASK_ID>`
-   **Descripción:** Busca y devuelve el objeto de una única tarea que coincida con el `id` proporcionado.
-   **Parámetros de Consulta:**
    -   `id` (string, requerido): El ID de la tarea a buscar.
-   **Ejemplo con `curl`:**

        curl -X GET "[https://task-production-f8bc.up.railway.app/task?id=T-2](https://task-production-f8bc.up.railway.app/task?id=T-2)"

-   **Respuesta Exitosa (200 OK):**

        {
          "id": "T-2",
          "title": "Setup repo y entorno",
          "status": "todo",
          "estimate_hours": 2,
          "due_date": "2025-10-11",
          "dependencies": ["T-1"],
          "checklist": [
            { "item": "Crear repo/ramas", "done": false },
            { "item": "README + .env.example", "done": false }
          ]
        }

-   **Respuesta de Error (404 Not Found):** Si no se encuentra la tarea.

        { "Error": "Task dont found" }

### 3. Crear una Nueva Tarea

-   **Método:** `POST`
-   **Endpoint:** `/task`
-   **Descripción:** Agrega una nueva tarea a la lista.
-   **Cuerpo de la Solicitud (Body - raw JSON):**

        {
          "task": "Mi nueva tarea desde el cliente"
        }

-   **Ejemplo con `curl`:**

        curl -X POST -H "Content-Type: application/json" -d '{"task": "Desplegar en producción"}' [https://task-production-f8bc.up.railway.app/task](https://task-production-f8bc.up.railway.app/task)

-   **Respuesta Exitosa (201 Created):**

        {
          "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
          "task": {
            "task": "Desplegar en producción"
          }
        }

-   **Respuestas de Error:**
    -   **400 Bad Request:** Si `task` no es un string válido.
    -   **413 Payload Too Large:** Si `task` excede los 150 caracteres.

### 4. Actualizar el Estado de una Tarea

-   **Método:** `PUT`
-   **Endpoint:** `/task?id=<TASK_ID>`
-   **Descripción:** Actualiza el campo `status` de una tarea existente.
-   **Parámetros de Consulta:**
    -   `id` (string, requerido): El ID de la tarea a actualizar.
-   **Cuerpo de la Solicitud (Body - raw JSON):**

        {
          "status": "in-progress"
        }

-   **Ejemplo con `curl`:**

        curl -X PUT -H "Content-Type: application/json" -d '{"status": "completed"}' "[https://task-production-f8bc.up.railway.app/task?id=T-2](https://task-production-f8bc.up.railway.app/task?id=T-2)"

-   **Respuesta Exitosa (201 Created):** Devuelve el objeto del proyecto con la tarea actualizada.
-   **Respuestas de Error:**
    -   **400 Bad Request:** Si `status` no es un string válido.
    -   **413 Payload Too Large:** Si `status` excede los 10 caracteres.

### 5. Eliminar una Tarea

-   **Método:** `DELETE`
-   **Endpoint:** `/task?id=<TASK_ID>`
-   **Descripción:** Elimina una tarea de la lista usando su ID.
-   **Parámetros de Consulta:**
    -   `id` (string, requerido): El ID de la tarea a eliminar.
-   **Ejemplo con `curl`:**

        curl -X DELETE "[https://task-production-f8bc.up.railway.app/task?id=T-2](https://task-production-f8bc.up.railway.app/task?id=T-2)"

-   **Respuesta Exitosa (201 Created):** Devuelve el objeto del proyecto con la lista de tareas actualizada.

---

## 🚀 Despliegue

Este proyecto está desplegado en **Railway** y se actualiza automáticamente con cada `push` a la rama principal del repositorio de GitHub.