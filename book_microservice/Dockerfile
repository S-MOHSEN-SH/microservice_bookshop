FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5002

CMD [ "npm", "run", "start:dev" ]