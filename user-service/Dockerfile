FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]