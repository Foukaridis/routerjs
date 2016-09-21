FROM node
RUN npm install -g supervisor
ADD ./package.json /app/package.json

WORKDIR /app
RUN npm install

ADD ./index.js /app/index.js
ADD ./service /app/service
ADD ./public /app/public

EXPOSE 3000
ENTRYPOINT supervisor index.js
