FROM nginx:1.24.0-alpine
COPY ./build /usr/share/nginx/html
EXPOSE 8080
# start nginx
CMD ["nginx", "-g", "daemon off;"]
