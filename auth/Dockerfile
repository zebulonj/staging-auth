FROM node:6.9-alpine

EXPOSE 3000

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app/package.json
RUN npm install

COPY . /usr/app
RUN npm run build

CMD ["npm", "start", "-s"]
