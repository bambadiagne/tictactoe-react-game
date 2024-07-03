FROM node:18.20.3-slim

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm","run","start"]