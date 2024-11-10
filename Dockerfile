FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript ts-node-dev ts-node

COPY wait-for-it.sh /app/wait-for-it.sh

RUN chmod +x /app/wait-for-it.sh

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "./wait-for-it.sh db:3306 -t 60 -- npm run migration:run && npm run dev"]
