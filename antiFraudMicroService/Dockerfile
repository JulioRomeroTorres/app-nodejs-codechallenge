FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 7000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
