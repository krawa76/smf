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

COPY core/kmf-core-docker.js ./node_modules/kmf-core.js

ENV NODE_ENV=production
RUN npm run build-prod

##################################################################################################
FROM node:10.13.0-alpine as prod

ARG MODULE=demo
ENV MODULE=$MODULE

##################################################################################################
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY modules/${MODULE}/package.json ./modules/${MODULE}/package.json
COPY modules/${MODULE}/package-lock.json ./modules/${MODULE}/package-lock.json
COPY --from=build /app/build .

# ENV NODE_ENV=production NODE_PATH=/app PORT=80
ENV NODE_ENV=production NODE_PATH=/app
RUN npm install
RUN cd ./modules/${MODULE} && npm install

COPY core/kmf-core-docker.js ./node_modules/kmf-core.js

##################################################################################################
# (optional) copy module data
COPY docker-temp.txt ./modules/${MODULE}/data* /data/

##################################################################################################
# (optional) install module files
COPY docker-temp.txt ./modules/${MODULE}/install.sh* ./modules/${MODULE}/
# not sure why "-f..." doesn't work with "chmod" etc., use "if test..." instead
# RUN [ -f "./modules/${MODULE}/install.sh" ] && chmod +rx ./modules/${MODULE}/install.sh && ./modules/${MODULE}/install.sh
RUN if test -e "./modules/${MODULE}/install.sh"; then chmod +rx ./modules/${MODULE}/install.sh && ./modules/${MODULE}/install.sh ; fi

##################################################################################################
# copy sails web app, if exists
COPY docker-temp.txt ./modules/${MODULE}/web-sails* ./modules/${MODULE}/web-sails/
RUN [ -d "./modules/${MODULE}/web-sails" ] && cd ./modules/${MODULE}/web-sails && npm install
ENV SAILS_PATH=./web-sails
EXPOSE 1337

##################################################################################################
COPY kmf-stack.json .
ENV KMF_ROOT_PATH=../
CMD ["node", "./core/index.js"]
