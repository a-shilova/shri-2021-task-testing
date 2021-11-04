FROM node:14.18

WORKDIR /app

COPY ../.. .

RUN npm ci

RUN npm run build

CMD npm start
