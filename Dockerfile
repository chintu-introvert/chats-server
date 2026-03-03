# Use Node.js 20 base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the server runs on
EXPOSE 1000

# Start the application
CMD ["npm", "start"]
