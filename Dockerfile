# Etapa de compilación
FROM node:20-alpine AS build

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de la aplicación
COPY . .

# Instalar las dependencias y construir la aplicación
RUN yarn install
RUN yarn build

# Etapa de producción
FROM node:20-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de la etapa de compilación
COPY --from=build /app ./

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 3004

# Comando para iniciar la aplicación
CMD ["yarn", "start"]
