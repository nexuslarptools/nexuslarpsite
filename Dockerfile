FROM node:20-alpine AS build
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_MINIO_CREDS_ACCESS_KEY
ARG REACT_APP_MINIO_CREDS_SECRET_KEY
ENV VITE_AUTH0_DOMAIN=${REACT_APP_AUTH0_DOMAIN}
ENV VITE_AUTH0_CLIENT_ID=${REACT_APP_AUTH0_CLIENT_ID}
ENV VITE_AUTH0_AUDIENCE=${REACT_APP_AUTH0_AUDIENCE}
ENV VITE_MINIO_CREDS_ACCESS_KEY=${REACT_APP_MINIO_CREDS_ACCESS_KEY}
ENV VITE_MINIO_CREDS_SECRET_KEY=${REACT_APP_MINIO_CREDS_SECRET_KEY}
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build


FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
