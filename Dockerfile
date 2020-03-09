FROM node:10.13.0 as build

WORKDIR /app

ARG SERVICE=demo

COPY core ./core
# COPY services ./services -- copy all services if needed
COPY services/${SERVICE} ./services/${SERVICE}
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install -g typescript@3.5.3
RUN npm install
RUN cd ./services/${SERVICE} && npm install

COPY core/smf-core-docker.js ./node_modules/smf-core.js

ENV NODE_ENV=production
RUN npm run build-prod

##################################################################################################
FROM node:10.13.0-alpine as prod

ARG SERVICE=demo
ENV SERVICE=$SERVICE

##################################################################################################
WORKDIR /app
COPY package.json .
COPY package-lock.json .
# copy package.json & package-lock.json (if the latter exists)
COPY services/${SERVICE}/package*.json ./services/${SERVICE}/
COPY --from=build /app/build .

# ENV NODE_ENV=production NODE_PATH=/app PORT=80
ENV NODE_ENV=production NODE_PATH=/app
RUN npm install
RUN cd ./services/${SERVICE} && npm install

COPY core/smf-core-docker.js ./node_modules/smf-core.js

##################################################################################################
# (optional) copy service data
COPY docker-temp.txt ./services/${SERVICE}/data* /data/

# (optional) copy service libs
COPY docker-temp.txt ./services/${SERVICE}/library* /library/

##################################################################################################
# todo: move AI env vars to a service Dockerfile include, when implemented

ENV CONDA_DIR=/opt/conda
ENV PATH=$CONDA_DIR/bin:$PATH

##################################################################################################
# (optional) install service files
COPY docker-temp.txt ./services/${SERVICE}/install.sh* ./services/${SERVICE}/
# not sure why "-f..." doesn't work with "chmod" etc., use "if test..." instead
# RUN [ -f "./services/${SERVICE}/install.sh" ] && chmod +rx ./services/${SERVICE}/install.sh && ./services/${SERVICE}/install.sh
RUN if test -e "./services/${SERVICE}/install.sh"; then chmod +rx ./services/${SERVICE}/install.sh && ./services/${SERVICE}/install.sh ; fi

##################################################################################################
# copy sails web app, if exists
COPY docker-temp.txt ./services/${SERVICE}/web-sails* ./services/${SERVICE}/web-sails/
RUN [ -d "./services/${SERVICE}/web-sails" ] && cd ./services/${SERVICE}/web-sails && npm install
ENV SAILS_PATH=./web-sails
# EXPOSE 1337

##################################################################################################
COPY smf-stack.json .
ENV SMF_ROOT_PATH=../
CMD ["node", "./core/index.js"]
