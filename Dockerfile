FROM node:latest

WORKDIR /education-network

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start-dev"]