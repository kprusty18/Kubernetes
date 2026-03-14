FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy project files
COPY . .

# Install frontend dependencies and build
RUN cd frontend && npm install && npm run build

# Install backend dependencies
RUN cd backend && npm install

# Copy frontend build into backend public folder
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# Set working directory to backend
WORKDIR /app/backend

# App runs on port 3000
EXPOSE 3000

# Start backend server
CMD ["npm", "start"]
