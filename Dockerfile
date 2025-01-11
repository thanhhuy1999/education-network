FROM node:latest

WORKDIR /teacher-student

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start-dev"]