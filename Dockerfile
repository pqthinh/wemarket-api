FROM node:14

WORKDIR /wemarket-api
COPY package.json .
RUN npm install
COPY . .
CMD npm start
