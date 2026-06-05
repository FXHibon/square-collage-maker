# Stage 1: Build the React application
FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies deterministically
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the project to generate the production assets (in /app/dist)
RUN npm run build

# Stage 2: Serve the application in a lightweight production web server
FROM nginx:alpine

# Copy the custom Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port configured in nginx.conf
EXPOSE 3000

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
