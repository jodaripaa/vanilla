# ToDo App - Static Vanilla JS

Aplicación ToDo simple (HTML + CSS + Vanilla JS) preparada para ser servida como sitio estático y dockerizada con nginx.

Contenido del repositorio:

- `index.html` — Página principal que carga `styles.css` y `app.js`.
- `styles.css` — Estilos.
- `app.js` — Lógica del frontend y llamadas al API remoto.
- `Dockerfile` — Imagen basada en `nginx:alpine` para servir los archivos estáticos.
- `.dockerignore` — Archivos excluidos al construir la imagen.
- `docker-compose.yml` — Compose para ejecutar el contenedor usando un puerto configurable vía `.env`.
- `.env` — Variables de entorno para docker-compose (por defecto `PORT=5000`).

Requisitos

- Docker instalado
- (Opcional) docker-compose

Construir y ejecutar con Docker (ejemplos para Windows cmd.exe)

1) Construir imagen:

```cmd
cd "c:\Users\Pc\Desktop\galindo hijueputa\html-boostrap"
docker build -t todo-app .
```

2) Ejecutar contenedor (sin docker-compose):

```cmd
docker run --rm -p 5000:80 --name todo-app todo-app
```

3) Usar docker-compose (usa `.env` para el puerto):

```cmd
cd "c:\Users\Pc\Desktop\galindo hijueputa\html-boostrap"
docker-compose up --build
```

Por defecto la app estará disponible en: http://localhost:5000

Cambiar el puerto

- Edita el archivo `.env` y cambia `PORT=5000` al puerto que prefieras (por ejemplo `PORT=3000`) y luego ejecuta `docker-compose up --build`.
- O sobrescribe la variable al ejecutar (cmd.exe):

```cmd
set PORT=3000 && docker-compose up --build
```

Notas

- La app hace llamadas a una API externa (`https://todoapitest.juansegaliz.com/todos`). Asegúrate de que la API esté accesible desde el contenedor (red/CORS).
- Para desarrollo rápido sin Docker, puedes abrir `index.html` directamente en el navegador o usar un servidor estático.

Si quieres, puedo agregar un pequeño script `run.cmd` para automatizar build+run en Windows.
