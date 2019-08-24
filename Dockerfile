FROM node:10.13.0 as build

WORKDIR /app

ARG MODULE=demo

COPY core ./core
# COPY modules ./modules -- copy all modules if needed
COPY modules/${MODULE} ./modules/${MODULE}
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install -g typescript@3.5.3
RUN npm install
RUN cd ./modules/${MODULE} && npm install

ENV NODE_ENV=production
RUN npm run build-prod

##################################################################################################
FROM node:10.13.0-alpine as prod

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY --from=build /app/build .

# ENV NODE_ENV=production NODE_PATH=/app PORT=80
ENV NODE_ENV=production NODE_PATH=/app
RUN npm install

##################################################################################################
ARG MODULE=demo
ENV MODULE=$MODULE

##################################################################################################
# copy sails web app, if exists
COPY docker-temp.txt ./modules/${MODULE}/web-sails* ./modules/${MODULE}/web-sails/
RUN [ -d "./modules/${MODULE}/web-sails" ] && cd ./modules/${MODULE}/web-sails && npm install
ENV SAILS_PATH=./web-sails
EXPOSE 1337

##################################################################################################
CMD ["node", "./core/index.js"]
