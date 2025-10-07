# Use the official nginx lightweight image
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy static site files
COPY . /usr/share/nginx/html

# Expose port 80 to the host (docker-compose will map to 8080)
EXPOSE 80

# Start nginx (default CMD)
CMD ["nginx", "-g", "daemon off;"]
