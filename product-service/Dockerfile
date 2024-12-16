FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 3002

CMD ["node", "app.js"]