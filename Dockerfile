FROM node:16 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:16 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:alpine as prod
EXPOSE 80
COPY --from=builder /app/dist/asesores-app /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD [ "nginx", "-g", "daemon off;"]