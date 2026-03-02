🚀 Despliegue y Configuración
Para asegurar el correcto funcionamiento de la aplicación, sigue las instrucciones detalladas a continuación dependiendo del entorno que prefieras utilizar.

📋 Requisitos Previos
XAMPP: Para el correcto funcionamiento del despliegue local, debe asegurarse de ejecutar el módulo Apache desde el panel de control de XAMPP.

📁 Estructura de Archivos del Servidor
Si necesitas realizar ajustes manuales o entender la procedencia de los archivos de configuración:

Configuración: El archivo de configuración principal se encuentra en Servidor/Configuracion_web/default.conf.

Contenido Estático: Los archivos dentro de Servidor/HTML corresponden al contenido que debe alojarse en la carpeta dist (incluyendo la subcarpeta HTML y los assets).

🐳 Despliegue con Docker (NGINX)
Si prefieres un entorno contenedorizado, puedes utilizar NGINX. A continuación, se detallan los comandos necesarios para gestionar el contenedor.

Generar e iniciar el contenedor
Ejecuta el siguiente comando en tu terminal (PowerShell/Bash) desde la raíz del proyecto para mapear los archivos locales y la configuración personalizada:

Bash
docker run --name mi-servidor-nginx `
  -v "${PWD}/dist:/usr/share/nginx/html" `
  -v "${PWD}/Servidor/Configuracion_web/default.conf:/etc/nginx/conf.d/default.conf" `
  -p 8080:80 -d nginx

  
Gestión del contenedor
En caso de que necesites detener y eliminar el contenedor por completo para reiniciar el proceso:

Bash
docker rm -f mi-servidor-nginx

---

## 🤝 Contribución

Sigue estos pasos:

1. Haz un **Fork** del proyecto.
2. Crea una rama para tu función (`git checkout -b feature/NuevaMejora`).
3. Realiza tus cambios y haz un **Commit** (`git commit -m 'Añadir NuevaMejora'`).
4. Haz **Push** a la rama (`git push origin feature/NuevaMejora`).
5. Abre un **Pull Request**.

---

## 📄 Licencia

Distribuido bajo la **Licencia MIT**. 

> **Nota:** Esta licencia permite el uso comercial, la modificación y la distribución gratuita, siempre que se mantenga la atribución al autor original.
