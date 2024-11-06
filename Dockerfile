FROM node:20.18.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]