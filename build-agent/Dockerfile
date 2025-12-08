FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
VOLUME [ "/artifacts" ]
CMD ["node", "src/worker.js"]
