FROM node:18.20.3-slim

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 5000

CMD ["npm","run","build"]