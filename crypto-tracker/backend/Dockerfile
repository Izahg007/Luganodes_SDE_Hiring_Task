# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:lts
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["node", "api.js"]
