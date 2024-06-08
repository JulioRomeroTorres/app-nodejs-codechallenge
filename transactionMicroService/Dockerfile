FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
