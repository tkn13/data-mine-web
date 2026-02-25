FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite's default port
EXPOSE 5173

# Host 0.0.0.0 is required for Docker mapping
CMD ["npm", "run", "dev", "--", "--host"]