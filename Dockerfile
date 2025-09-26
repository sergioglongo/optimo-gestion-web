
# Etapa 1: Construcción de la aplicación React
# Usamos una imagen de Node.js (slim) que incluye herramientas de compilación para mayor compatibilidad.
FROM node:18-slim AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Esta variable de entorno soluciona problemas de compatibilidad de OpenSSL en Node.js v17+
# Es necesaria para que 'npm install' y 'npm run build' funcionen correctamente con ciertas dependencias.
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copiamos package.json y yarn.lock para instalar las dependencias
# Esto permite que Docker cachee esta capa si las dependencias no cambian
COPY package.json yarn.lock ./

# Instalamos las dependencias con Yarn. --frozen-lockfile asegura que se use el lockfile existente.
RUN yarn install --frozen-lockfile

# Copiamos el resto del código de la aplicación
COPY . .

# Construimos la aplicación React. Esto generará los archivos estáticos en la carpeta 'build'.
RUN yarn build

# Etapa 2: Servir la aplicación con Nginx
# Usamos una imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:stable-alpine

# Copiamos los archivos de construcción de la etapa 'builder' al directorio de Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
# Esto es crucial para aplicaciones de una sola página (SPA) como React,
# para manejar el enrutamiento del lado del cliente.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80, que es el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]