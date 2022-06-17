# https://mherman.org/blog/dockerizing-a-react-app/

# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./app/package.json /app/package.json
COPY ./app/package-lock.json /app/package-lock.json
RUN npm install
RUN npm install react-scripts@5.0.1 -g --silent
COPY app /app
ARG REACT_APP_API_URL
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]