# We're using Node.js 14 as the base image
FROM node:18-alpine

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the Docker container
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the code to the Docker container
COPY . .

# Transpile the TypeScript to JavaScript
RUN npm run build

# The port that the container will expose
EXPOSE 8080

# Start the tRPC server
CMD ["npm", "run", "dev"]
