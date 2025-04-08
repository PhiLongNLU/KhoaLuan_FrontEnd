FROM node:22.14.0 AS builder
WORKDIR /app
COPY package*.json ./qa_ui/
WORKDIR /app/qa_ui
RUN npm install
COPY ./qa_ui .
RUN npm run build
FROM nginx:1.25.2
COPY --from=builder /app/qa_ui/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# This Dockerfile is for building a Docker image for a Vue.js application.
# To build and run the Docker container, use the following commands:
# docker build -t qa_ui .
# docker run -d -p 8080:80 --name qa_ui qa_ui